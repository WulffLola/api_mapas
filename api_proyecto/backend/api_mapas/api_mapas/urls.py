from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.api import views
from django.contrib import admin
from apps.api.views import filterbyParams


router = DefaultRouter()
router.register(r'addresses', views.AdressesViewSet)
router.register(r'syncAPI',views.AdressesViewSet)
router.register(r'filterbyParams',views.filterbyParams, basename='filterbyParams')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('filterbyParams/<str:codigo_postal>/<str:calle>/<str:altura>',
         filterbyParams.as_view({'get': 'list'}), name='filterbyParams'),

]