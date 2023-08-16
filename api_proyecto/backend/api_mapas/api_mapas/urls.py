from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.api import views
from django.contrib import admin
from apps.api.views import filterbyParams, getErrorAddress,getIncompletesAddress


router = DefaultRouter()
router.register(r'addresses', views.AdressesViewSet)
router.register(r'getAddress',views.AdressesViewSet, basename='getAddress')
router.register(r'filterbyParams',views.filterbyParams, basename='filterbyParams')
router.register(r'getErrorAddress',views.getErrorAddress, basename='getErrorAddress')
router.register(r'getIncompletesAddress',views.getIncompletesAddress, basename='getIncompletesAddress')


urlpatterns = [ 
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('filterbyParams/<str:codigo_postal>/<str:calle>/<str:altura>',
        filterbyParams.as_view({'get': 'list'}), name='filterbyParams'),
    path('getErrorAddress/',
        getErrorAddress.as_view({'get': 'list'}), name='getErrorAddress'),
    path('getIncompletesAddress/',
        getIncompletesAddress.as_view({'get': 'list'}), name='getIncompletesAddress'),
]