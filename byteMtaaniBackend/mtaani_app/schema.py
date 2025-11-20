import graphene
from graphene_django import DjangoObjectType
from .models import Product, Category, Order
from .resolvers import resolve_all_products


class ProductType(DjangoObjectType):
    class Meta:
        model = Product


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category


class Query(graphene.ObjectType):
    all_products = graphene.List(ProductType)
    my_orders = graphene.List(lambda: OrderType)

    def resolve_all_products(self, info):
        return resolve_all_products(self, info)


    class OrderType(DjangoObjectType):
        class Meta:
            model = Order


class CreateProduct(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        price = graphene.Float(required=True)
        category_id = graphene.ID(required=True)

    product = graphene.Field(ProductType)

    def mutate(self, info, name, price, category_id):
        category = Category.objects.get(pk=category_id)
        product = Product(name=name, price=price, category=category)
        product.save()
        return CreateProduct(product=product)


import graphql_jwt
from graphql_jwt.decorators import login_required


class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


@login_required
def resolve_my_orders(root, info):
    return Order.objects.filter(user=info.context.user)


schema = graphene.Schema(query=Query, mutation=Mutation)




