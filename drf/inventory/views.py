from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import (
    Cargo,
    Equipamento,
    Funcionario,
    Propriedade,
    Registro,
    Setor,
    Status,
    Tipo,
)
from .serializers import (
    CargoSerializer,
    EquipamentoSerializer,
    FuncionarioSerializer,
    PropriedadeSerializer,
    RegistroSerializer,
    SetorSerializer,
    StatusSerializer,
    TipoSerializer,
)

class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)


class CargoViewSet(BaseViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer


class TipoViewSet(BaseViewSet):
    queryset = Tipo.objects.all()
    serializer_class = TipoSerializer


class PropriedadeViewSet(BaseViewSet):
    queryset = Propriedade.objects.all()
    serializer_class = PropriedadeSerializer


class StatusViewSet(BaseViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer


class SetorViewSet(BaseViewSet):
    queryset = Setor.objects.all()
    serializer_class = SetorSerializer


class FuncionarioViewSet(BaseViewSet):
    queryset = Funcionario.objects.select_related("setor", "cargo").all()
    serializer_class = FuncionarioSerializer


class EquipamentoViewSet(BaseViewSet):
    queryset = (
        Equipamento.objects.select_related(
            "tipo",
            "propriedade",
            "status",
            "responsavel_atual",
            "responsavel_atual__setor",
        )
        .all()
    )
    serializer_class = EquipamentoSerializer


class RegistroViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Registro.objects.select_related("autor", "content_type").all()
    serializer_class = RegistroSerializer