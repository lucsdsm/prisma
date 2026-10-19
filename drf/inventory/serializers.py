from rest_framework import serializers

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


class NomeAtivoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("id", "nome", "ativo")


class CargoSerializer(NomeAtivoSerializer):
    class Meta(NomeAtivoSerializer.Meta):
        model = Cargo


class TipoSerializer(NomeAtivoSerializer):
    class Meta(NomeAtivoSerializer.Meta):
        model = Tipo


class PropriedadeSerializer(NomeAtivoSerializer):
    class Meta(NomeAtivoSerializer.Meta):
        model = Propriedade


class StatusSerializer(NomeAtivoSerializer):
    class Meta(NomeAtivoSerializer.Meta):
        model = Status


class SetorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setor
        fields = ("id", "nome", "ativo")


class FuncionarioSerializer(serializers.ModelSerializer):
    setor_nome = serializers.CharField(source="setor.nome", read_only=True)
    cargo_nome = serializers.CharField(source="cargo.nome", read_only=True)

    class Meta:
        model = Funcionario
        fields = (
            "id",
            "nome",
            "setor",
            "setor_nome",
            "cargo",
            "cargo_nome",
            "ativo",
        )

class EquipamentoSerializer(serializers.ModelSerializer):
    tipo_nome = serializers.CharField(source="tipo.nome", read_only=True)
    propriedade_nome = serializers.CharField(
        source="propriedade.nome",
        read_only=True,
    )
    status_nome = serializers.CharField(source="status.nome", read_only=True)

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
            "tipo_nome",
            "marca",
            "modelo",
            "propriedade",
            "propriedade_nome",
            "tombo",
            "responsavel_atual",
            "responsavel_nome",
            "setor_atual",
            "status",
            "status_nome",
            "data_fornecimento",
            "data_entrega_atual",
            "descricao",
            "observacoes",
            "criado_em",
            "atualizado_em",
        )
        read_only_fields = ("criado_em", "atualizado_em")


class RegistroSerializer(serializers.ModelSerializer):
    autor_nome = serializers.CharField(source="autor.nome", read_only=True)
    content_type_nome = serializers.CharField(
        source="content_type.model",
        read_only=True,
    )

    class Meta:
        model = Registro
        fields = (
            "id",
            "acao",
            "content_type",
            "content_type_nome",
            "object_id",
            "representacao_objeto",
            "dados_anteriores",
            "dados_novos",
            "criado_em",
            "autor",
            "autor_nome",
        )
        read_only_fields = fields