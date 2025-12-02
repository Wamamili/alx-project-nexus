from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import permissions
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions

from .serializers import (
	ProductSerializer, CategorySerializer, OrderSerializer, UserSerializer, PaymentSerializer
)
from .utils import get_all_properties, get_redis_cache_metrics
from .mpesa import initiate_stk_push, query_stk_status
from .tasks import send_payment_confirmation_email, send_booking_confirmation_email

from .models import Category, Product, Order, OrderItem, Payment

User = get_user_model()


class ProductViewSet(viewsets.ModelViewSet):
	queryset = Product.objects.all()
	serializer_class = ProductSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
	queryset = Category.objects.all()
	serializer_class = CategorySerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CustomerViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@cache_page(60 * 15)
def production_list(request):
	"""Return all productions (products), cached at view level for 15 minutes.

	Uses `get_all_properties()` for low-level caching of the queryset in Redis.
	"""
	qs = get_all_properties()
	serializer = ProductSerializer(qs, many=True)
	return Response(serializer.data)


@api_view(['GET'])
def cache_metrics(request):
	"""Return Redis cache keyspace metrics (hits/misses/hit_ratio)."""
	metrics = get_redis_cache_metrics()
	return Response(metrics)


class OrderViewSet(viewsets.ModelViewSet):
	queryset = Order.objects.prefetch_related('items').all()
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		items_data = serializer.validated_data.get('items', [])

		# prefer authenticated user
		if request.user and request.user.is_authenticated:
			user = request.user
		else:
			user_id = serializer.validated_data.get('user_id')
			try:
				user = User.objects.get(pk=user_id)
			except Exception:
				return Response({'detail': 'Invalid user id'}, status=status.HTTP_400_BAD_REQUEST)

		total = 0
		created_items = []
		with transaction.atomic():
			# lock and check stock
			for item in items_data:
				pid = item.get('product_id')
				qty = item.get('quantity', 1)
				product = get_object_or_404(Product.objects.select_for_update(), pk=pid)
				if product.stock < qty:
					return Response({'detail': f'Product {product.id} out of stock or insufficient quantity'}, status=status.HTTP_400_BAD_REQUEST)
				product.stock = max(0, product.stock - qty)
				product.in_stock = product.stock > 0
				product.save()
				total += float(product.price) * qty
				created_items.append((product, qty))

			order = Order.objects.create(user=user, total_amount=total)
			for product, qty in created_items:
				OrderItem.objects.create(order=order, product=product, quantity=qty, price=product.price)


		# schedule booking confirmation email asynchronously
		try:
			send_booking_confirmation_email.delay(str(order.id))
		except Exception:
			# don't fail the response if task scheduling fails
			pass

		out_serializer = self.get_serializer(order)
		return Response(out_serializer.data, status=status.HTTP_201_CREATED)


class PaymentViewSet(viewsets.ModelViewSet):
	queryset = Payment.objects.all()
	serializer_class = PaymentSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

	@action(detail=False, methods=["post"], url_path="initiate", permission_classes=[permissions.IsAuthenticated])
	def initiate(self, request):
		"""Create a Payment record and initiate STK push via Mpesa.

		Expected JSON: {"order_id": "<uuid>", "phone": "2547XXXXXXXX"}
		"""
		order_id = request.data.get("order_id")
		phone = request.data.get("phone")

		if not order_id or not phone:
			return Response({"detail": "order_id and phone are required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			order = Order.objects.get(pk=order_id)
		except Order.DoesNotExist:
			return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

		# create payment record with pending status
		payment = Payment.objects.create(
			user=request.user,
			order=order,
			amount=order.total_amount,
			method="mpesa",
			status="pending",
			transaction_id="",
		)

		try:
			resp = initiate_stk_push(amount=float(payment.amount), phone_number=phone, account_reference=str(order.id), transaction_desc=f"Order {order.id}")
		except Exception as exc:
			payment.status = "failed"
			payment.save()
			return Response({"detail": "Failed to initiate Mpesa payment", "error": str(exc)}, status=status.HTTP_502_BAD_GATEWAY)

		# Safaricom returns CheckoutRequestID on success
		checkout_id = resp.get("CheckoutRequestID") or resp.get("ResponseDescription")
		payment.transaction_id = checkout_id or ""
		payment.save()

		return Response({"payment_id": str(payment.id), "checkout_request_id": checkout_id, "raw": resp})

	@action(detail=True, methods=["post"], url_path="verify", permission_classes=[permissions.IsAuthenticated])
	def verify(self, request, pk=None):
		"""Verify payment status by querying Mpesa and update the Payment record.

		POST /api/payments/{pk}/verify/
		Uses the Payment.transaction_id as the `CheckoutRequestID` when present.
		If not present, you can pass `checkout_request_id` in the POST body.
		"""
		payment = self.get_object()
		checkout_id = request.data.get("checkout_request_id") or payment.transaction_id

		if not checkout_id:
			return Response({"detail": "No checkout_request_id available for verification"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			resp = query_stk_status(checkout_id)
		except Exception as exc:
			return Response({"detail": "Failed to query Mpesa", "error": str(exc)}, status=status.HTTP_502_BAD_GATEWAY)

		# Attempt to find a numeric result code in the response
		result_code = None
		# common shapes
		if isinstance(resp, dict):
			result_code = resp.get("ResultCode") or resp.get("ResponseCode")
			# nested patterns
			if not result_code:
				for k in ("result", "Result", "Response", "response"):
					sub = resp.get(k)
					if isinstance(sub, dict):
						result_code = sub.get("ResultCode") or sub.get("ResponseCode")
						if result_code is not None:
							break

		# Normalize result_code to int when possible
		try:
			result_code_int = int(result_code) if result_code is not None else None
		except Exception:
			result_code_int = None

		if result_code_int == 0:
			# success
			payment.status = "successful"
			from django.utils import timezone
			payment.paid_at = timezone.now()

			# try to extract Mpesa receipt number if present
			mpesa_receipt = None
			if isinstance(resp, dict):
				# look for common keys in callback metadata if present
				meta = resp.get("CallbackMetadata") or resp.get("callbackMetadata") or resp.get("Result") or {}
				items = []
				if isinstance(meta, dict):
					items = meta.get("Item") or meta.get("Items") or []
				if isinstance(items, list):
					for it in items:
						if it.get("Name") in ("MpesaReceiptNumber", "ReceiptNumber"):
							mpesa_receipt = it.get("Value")

			if mpesa_receipt:
				payment.transaction_id = mpesa_receipt

			payment.save()

			# schedule confirmation email
			try:
				send_payment_confirmation_email.delay(payment.user.email, f"Payment received for order {payment.order.id}", f"Your payment for order {payment.order.id} was successful.")
			except Exception:
				pass

			return Response({"detail": "Payment marked successful", "raw": resp})
		else:
			payment.status = "failed"
			payment.save()
			return Response({"detail": "Payment marked failed", "raw": resp})


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def mpesa_callback(request):
	"""Endpoint to receive Mpesa STK push callback notifications.

	Safaricom posts a JSON body that includes `Body` -> `stkCallback`.
	We parse the common fields and update the matching Payment by CheckoutRequestID.
	"""
	data = request.data
	# defensive parsing for common Safaricom payload shape
	try:
		body = data.get("Body") or data.get("body") or data
		stk = body.get("stkCallback") if isinstance(body, dict) else None
		if stk:
			checkout_id = stk.get("CheckoutRequestID")
			result_code = stk.get("ResultCode")
			callback_metadata = stk.get("CallbackMetadata") or {}

			# find Payment by transaction_id matching CheckoutRequestID
			payment = None
			if checkout_id:
				try:
					payment = Payment.objects.filter(transaction_id__iexact=checkout_id).first()
				except Exception:
					payment = None

			if not payment:
				return Response({"detail": "Payment not found for callback"}, status=status.HTTP_404_NOT_FOUND)

			if int(result_code) == 0:
				# success - attempt to extract MpesaReceiptNumber and set paid_at
				mpesa_receipt = None
				if callback_metadata and isinstance(callback_metadata, dict):
					items = callback_metadata.get("Item", []) or callback_metadata.get("Items", [])
				else:
					items = []

				for it in items:
					if it.get("Name") in ("MpesaReceiptNumber", "ReceiptNumber"):
						mpesa_receipt = it.get("Value")

				payment.status = "successful"
				if mpesa_receipt:
					payment.transaction_id = mpesa_receipt
				from django.utils import timezone

				payment.paid_at = timezone.now()
				payment.save()

				# send confirmation email in background
				try:
					send_payment_confirmation_email.delay(payment.user.email, f"Payment received for order {payment.order.id}", f"Your payment for order {payment.order.id} was successful.")
				except Exception:
					# don't fail callback if email scheduling fails
					pass

				return Response({"detail": "Payment updated to successful"})
			else:
				payment.status = "failed"
				payment.save()
				return Response({"detail": "Payment marked failed"})
	except Exception as exc:
		return Response({"detail": "Invalid callback payload", "error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
