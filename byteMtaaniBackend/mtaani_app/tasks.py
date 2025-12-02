from celery import shared_task


@shared_task
def add(x, y):
    """Simple test task to verify Celery is working."""
    return x + y


@shared_task
def send_payment_confirmation_email(user_email: str, subject: str, message: str):
    """Send a payment confirmation email asynchronously.

    This task uses Django's email backend configured in settings. The project
    should configure SMTP/email settings in production.
    """
    from django.core.mail import send_mail
    from django.conf import settings

    send_mail(
        subject,
        message,
        getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@example.com"),
        [user_email],
        fail_silently=False,
    )


@shared_task
def send_booking_confirmation_email(order_id: str):
    """Send booking/order confirmation email asynchronously.

    The task loads the Order and sends a confirmation email to the user's email
    using Django's configured email backend.
    """
    from django.core.mail import send_mail
    from django.conf import settings
    from .models import Order

    try:
        order = Order.objects.select_related('user').get(pk=order_id)
    except Order.DoesNotExist:
        return False

    user_email = order.user.email if order.user and getattr(order.user, 'email', None) else None
    if not user_email:
        return False

    subject = f"Booking confirmation — Order {order.id}"
    message = f"Hello {order.user},\n\nYour booking (order id {order.id}) for KES {order.total_amount} has been received.\n\nThanks." 

    send_mail(
        subject,
        message,
        getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@example.com"),
        [user_email],
        fail_silently=False,
    )

    return True
