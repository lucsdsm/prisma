from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import EmailTokenObtainPairView, UsuarioViewSet

router = DefaultRouter()
router.register("usuarios", UsuarioViewSet, basename="usuario")

app_name = "accounts"

urlpatterns = [
    path("login/", EmailTokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
] + router.urls