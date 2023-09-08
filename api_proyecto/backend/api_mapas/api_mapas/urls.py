from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.api import views
from django.contrib import admin
from apps.api.views import filterbyParams, getErrorAddress, getIncompletesAddress,syncAPIViewSet, OficiosViewSet


router = DefaultRouter()
router.register(r'sync', views.syncAPIViewSet, basename='sync_addresses')
router.register(r'getAddress',views.AdressesViewSet, basename='getAddress')
router.register(r'filterbyParams',views.filterbyParams, basename='filterbyParams')
router.register(r'getErrorAddress',views.getErrorAddress, basename='getErrorAddress')
router.register(r'getIncompletesAddress',views.getIncompletesAddress, basename='getIncompletesAddress')
router.register(r'oficios', views.OficiosViewSet, basename='getOficios')
router.register(r'listUniqueAddressNames', views.filterbyParams, basename='listUniqueAddressNames')
router.register(r'^registerOficio/$', views.OficiosViewSet, basename='registerOficio')


urlpatterns = [ 
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('sync/',syncAPIViewSet.as_view({'get': 'sync_addresses'}), name='sync_addresses'),
    path('filterbyParams/<str:codigo_postal>/<str:calle>/<str:altura>',
        filterbyParams.as_view({'get': 'search'}), name='filterbyParams'),
    path('getErrorAddress/',
        getErrorAddress.as_view({'get': 'list'}), name='getErrorAddress'),
    path('getIncompletesAddress/',
        getIncompletesAddress.as_view({'get': 'list'}), name='getIncompletesAddress'),
    path('oficios/',
        OficiosViewSet.as_view({'get': 'list'}), name='getOficios'),
    path('listUniqueAddressNames/',
        filterbyParams.as_view({'get': 'listUniqueAddressNames'}), name='listUniqueAddressNames'),
    path('registerOficio/',
        OficiosViewSet.as_view({'post': 'registerOficio'}), name='registerOficio'),
]