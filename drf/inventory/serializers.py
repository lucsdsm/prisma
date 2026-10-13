from rest_framework import serializers

from .models import Equipamento, Funcionario, Setor


class SetorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setor
        fields = ("id", "nome")


class FuncionarioSerializer(serializers.ModelSerializer):
    setor_nome = serializers.CharField(source="setor.nome", read_only=True)
    cargo_display = serializers.CharField(
        source="get_cargo_display",
        read_only=True,
    )

    class Meta:
        model = Funcionario
        fields = (
            "id",
            "nome",
            "setor",
            "setor_nome",
            "cargo",
            "cargo_display",
            "ativo",
        )

class EquipamentoSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(
        source="get_tipo_display",
        read_only=True,
    )
    propriedade_display = serializers.CharField(
        source="get_propriedade_display",
        read_only=True,
    )
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    responsavel_nome = serializers.CharField(
        source="responsavel_atual.nome",
        read_only=True,
    )
    setor_atual = serializers.CharField(
        source="responsavel_atual.setor.nome",
        read_only=True,
    )

    class Meta:
        model = Equipamento
        fields = (
            "id",
            "tipo",
            "tipo_display",
            "marca",
            "modelo",
            "propriedade",
            "propriedade_display",
            "tombo",
            "responsavel_atual",
            "responsavel_nome",
            "setor_atual",
            "status",
            "status_display",
            "data_fornecimento",
            "data_entrega_atual",
            "descricao",
            "observacoes",
            "criado_em",
            "atualizado_em",
        )
        read_only_fields = ("criado_em", "atualizado_em")