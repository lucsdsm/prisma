from rest_framework import viewsets

from .models import Equipamento, Funcionario, Setor
from .serializers import (
    EquipamentoSerializer,
    FuncionarioSerializer,
    SetorSerializer,
)


class SetorViewSet(viewsets.ModelViewSet):
    queryset = Setor.objects.all()
    serializer_class = SetorSerializer


class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.select_related("setor").all()
    serializer_class = FuncionarioSerializer


class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = (
        Equipamento.objects.select_related(
            "responsavel_atual",
            "responsavel_atual__setor",
        )
        .all()
    )
    serializer_class = EquipamentoSerializer