from rest_framework.routers import DefaultRouter

from .views import (
    EquipamentoViewSet,
    FuncionarioViewSet,
    SetorViewSet,
)

router = DefaultRouter()

router.register("equipamentos", EquipamentoViewSet, basename="equipamento")
router.register("funcionarios", FuncionarioViewSet, basename="funcionario")
router.register("setores", SetorViewSet, basename="setor")

urlpatterns = router.urls