from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer
from .models import Usuario
from .serializers import UsuarioSerializer


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by("nome")
    serializer_class = UsuarioSerializer
    permission_classes = (IsAuthenticated,)