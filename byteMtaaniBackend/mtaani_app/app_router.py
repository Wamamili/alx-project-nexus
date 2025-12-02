from rest_framework.routers import DefaultRouter, APIRootView
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.response import Response


class MyRootView(APIRootView):
    # Support both HTML (for the template) and JSON (API clients/browsable API)
    renderer_classes = [TemplateHTMLRenderer, JSONRenderer]
    template_name = "api_root.html"

    def get(self, request, *args, **kwargs):
        # Delegate to the parent implementation to build the default response
        parent_response = super().get(request, *args, **kwargs)
        data = getattr(parent_response, 'data', {}) or {}

        # If the client requested HTML, render our template with the namespaces
        if getattr(request, 'accepted_renderer', None) and getattr(request.accepted_renderer, 'format', None) == 'html':
            return Response({"namespaces": data}, template_name=self.template_name)

        # Otherwise return the normal JSON response produced by APIRootView
        return parent_response


class MyRouter(DefaultRouter):
    APIRootView = MyRootView
