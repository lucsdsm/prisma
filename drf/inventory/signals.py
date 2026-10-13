import json

from django.contrib.contenttypes.models import ContentType
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver
from django.forms.models import model_to_dict

from .context import get_usuario_atual

from .models import (Acao, Cargo, Propriedade, Status, Tipo, Equipamento, Setor, Funcionario, Registro)

modelos = (Cargo, Propriedade, Status, Tipo, Equipamento, Setor, Funcionario)

def serializar_dados(instance):
    dados = model_to_dict(instance)
    dados["id"] = instance.pk

    return json.loads(
        json.dumps(
            dados,
            cls=DjangoJSONEncoder,
        )
    )


@receiver(pre_save)
def capturar_estado_anterior(sender, instance, **kwargs):
    if sender not in modelos:
        return

    if not instance.pk:
        instance._dados_anteriores_auditoria = None
        return

    try:
        anterior = sender.objects.get(pk=instance.pk)
        instance._dados_anteriores_auditoria = serializar_dados(anterior)
    except sender.DoesNotExist:
        instance._dados_anteriores_auditoria = None


@receiver(post_save)
def registrar_criacao_ou_alteracao(sender, instance, created, raw, **kwargs):
    if sender is Registro or sender not in modelos or raw:
        return

    dados_novos = serializar_dados(instance)
    dados_anteriores = getattr(
        instance,
        "_dados_anteriores_auditoria",
        None,
    )

    referencia = {
        "content_type": ContentType.objects.get_for_model(instance),
        "object_id": instance.pk,
        "representacao_objeto": str(instance),
        "autor": get_usuario_atual(),
    }

    if created:
        Registro.objects.create(
            acao=Acao.CRIACAO,
            dados_novos=dados_novos,
            **referencia,
        )
        return

    if dados_anteriores == dados_novos:
        return

    Registro.objects.create(
        acao=Acao.ALTERACAO,
        dados_anteriores=dados_anteriores,
        dados_novos=dados_novos,
        **referencia,
    )


@receiver(post_delete)
def registrar_exclusao(sender, instance, **kwargs):
    if sender is Registro or sender not in modelos:
        return

    Registro.objects.create(
        acao=Acao.EXCLUSAO,
        content_type=ContentType.objects.get_for_model(instance),
        object_id=instance.pk,
        representacao_objeto=str(instance),
        dados_anteriores=serializar_dados(instance),
        autor=get_usuario_atual(),
    )