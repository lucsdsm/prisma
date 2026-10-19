from django.db.models import CharField, Q
from django.db.models.functions import Cast
from rest_framework import viewsets
from rest_framework.filters import BaseFilterBackend, OrderingFilter
from rest_framework.permissions import IsAuthenticated

from .context import usuario_atual
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

class GlobalSearchFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        term = request.query_params.get("search", "").strip()
        fields = getattr(view, "search_fields", ())

        if not term or not fields:
            return queryset

        search_query = Q()
        for index, field in enumerate(fields):
            alias = f"_global_search_{index}"
            queryset = queryset.annotate(
                **{alias: Cast(field, output_field=CharField())},
            )
            search_query |= Q(**{f"{alias}__icontains": term})

        return queryset.filter(search_query)


class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    filter_backends = (GlobalSearchFilter, OrderingFilter)

    def perform_create(self, serializer):
        token = usuario_atual.set(self.request.user)
        try:
            serializer.save()
        finally:
            usuario_atual.reset(token)

    def perform_update(self, serializer):
        token = usuario_atual.set(self.request.user)
        try:
            serializer.save()
        finally:
            usuario_atual.reset(token)

    def perform_destroy(self, instance):
        token = usuario_atual.set(self.request.user)
        try:
            instance.delete()
        finally:
            usuario_atual.reset(token)


class CargoViewSet(BaseViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer
    search_fields = ("nome", "ordem", "ativo")
    ordering_fields = ("nome", "ordem", "ativo")


class TipoViewSet(BaseViewSet):
    queryset = Tipo.objects.all()
    serializer_class = TipoSerializer
    search_fields = ("nome", "ordem", "ativo")
    ordering_fields = ("nome", "ordem", "ativo")


class PropriedadeViewSet(BaseViewSet):
    queryset = Propriedade.objects.all()
    serializer_class = PropriedadeSerializer
    search_fields = ("nome", "ordem", "ativo")
    ordering_fields = ("nome", "ordem", "ativo")


class StatusViewSet(BaseViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    search_fields = ("nome", "ordem", "ativo")
    ordering_fields = ("nome", "ordem", "ativo")


class SetorViewSet(BaseViewSet):
    queryset = Setor.objects.all()
    serializer_class = SetorSerializer
    search_fields = ("nome", "ordem", "ativo")
    ordering_fields = ("nome", "ordem", "ativo")


class FuncionarioViewSet(BaseViewSet):
    queryset = Funcionario.objects.select_related("setor", "cargo").all()
    serializer_class = FuncionarioSerializer
    search_fields = (
        "nome",
        "setor__nome",
        "cargo__nome",
        "setor",
        "cargo",
        "ativo",
    )
    ordering_fields = ("nome", "setor__nome", "cargo__nome", "ativo")


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
    search_fields = (
        "tombo",
        "tipo__nome",
        "marca",
        "modelo",
        "propriedade__nome",
        "responsavel_atual__nome",
        "responsavel_atual__setor__nome",
        "status__nome",
        "descricao",
        "observacoes",
        "id",
        "data_fornecimento",
        "data_entrega_atual",
        "criado_em",
        "atualizado_em",
    )
    ordering_fields = (
        "tombo",
        "tipo__nome",
        "marca",
        "modelo",
        "propriedade__nome",
        "responsavel_atual__nome",
        "responsavel_atual__setor__nome",
        "status__nome",
    )


class RegistroViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Registro.objects.select_related("autor", "content_type").all()
    serializer_class = RegistroSerializer