from django.urls import path
from rest_framework.routers import DefaultRouter

from .dashboard import DashboardView

from .views import (
    CargoViewSet,
    EquipamentoViewSet,
    FuncionarioViewSet,
    PropriedadeViewSet,
    RegistroViewSet,
    SetorViewSet,
    StatusViewSet,
    TipoViewSet,
)


router = DefaultRouter()

router.register("cargos", CargoViewSet, basename="cargo")
router.register("tipos", TipoViewSet, basename="tipo")
router.register(
    "propriedades",
    PropriedadeViewSet,
    basename="propriedade",
)
router.register("status", StatusViewSet, basename="status")
router.register(
    "equipamentos",
    EquipamentoViewSet,
    basename="equipamento",
)
router.register(
    "funcionarios",
    FuncionarioViewSet,
    basename="funcionario",
)
router.register("setores", SetorViewSet, basename="setor")
router.register("auditoria", RegistroViewSet, basename="auditoria")


urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
] + router.urls