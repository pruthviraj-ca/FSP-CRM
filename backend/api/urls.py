from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HelloWorldView, LoginView, LeadViewSet, PropertyViewSet, FlatViewSet

router = DefaultRouter()
router.register(r'leads', LeadViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'flats', FlatViewSet)

urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
]
