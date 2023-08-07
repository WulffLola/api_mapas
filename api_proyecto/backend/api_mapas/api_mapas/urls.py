from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.api import views
from django.contrib import admin
from apps.api.models import Address

router = DefaultRouter()
router.register(r'addresses', views.AdressesViewSet)
router.register(r'syncAPI',views.AdressesViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls)
]