from django.db import models
from django.conf import settings

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Cargo(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    ativo = models.BooleanField(default=True)
    ordem = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("ordem", "nome")
        verbose_name = "Cargo"
        verbose_name_plural = "Cargos"

    def __str__(self):
        return self.nome

class Tipo(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    ativo = models.BooleanField(default=True)
    ordem = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("ordem", "nome")
        verbose_name = "Tipo de equipamento"
        verbose_name_plural = "Tipos de equipamento"

    def __str__(self):
        return self.nome

class Propriedade(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    ativo = models.BooleanField(default=True)
    ordem = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("ordem", "nome")
        verbose_name = "Propriedade"
        verbose_name_plural = "Propriedades"

    def __str__(self):
        return self.nome

class Status(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    ativo = models.BooleanField(default=True)
    ordem = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("ordem", "nome")
        verbose_name = "Status de equipamento"
        verbose_name_plural = "Status de equipamentos"

    def __str__(self):
        return self.nome

class Setor(models.Model):
    nome = models.CharField(max_length=150, unique=True)
    ativo = models.BooleanField(default=True)
    ordem = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["nome"]
        verbose_name = "Setor"
        verbose_name_plural = "Setores"

    def __str__(self):
        return self.nome

class Funcionario(models.Model):
    nome = models.CharField(max_length=200)
    setor = models.ForeignKey(
        Setor,
        on_delete=models.PROTECT,
        related_name="funcionarios",
    )
    cargo = models.ForeignKey(
        Cargo,
        on_delete=models.PROTECT,
        related_name="funcionarios",
    )
    ativo = models.BooleanField(default=True)

    class Meta:
        ordering = ["nome"]
        verbose_name = "Funcionário"
        verbose_name_plural = "Funcionários"

    def __str__(self):
        return self.nome

class Equipamento(models.Model):
    tipo = models.ForeignKey(
        Tipo,
        on_delete=models.PROTECT,
        related_name="equipamentos",
    )
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=150, blank=True)

    propriedade = models.ForeignKey(
        Propriedade,
        on_delete=models.PROTECT,
        related_name="equipamentos",
    )

    tombo = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Número patrimonial.",
    )

    responsavel_atual = models.ForeignKey(
        Funcionario,
        on_delete=models.SET_NULL,
        related_name="equipamentos_atuais",
        null=True,
        blank=True,
    )

    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
        related_name="equipamentos",
        null=True,
        blank=True,
    )

    data_fornecimento = models.DateField(
        null=True,
        blank=True,
        help_text="Data em que o equipamento entrou no patrimônio/contrato.",
    )
    data_entrega_atual = models.DateField(
        null=True,
        blank=True,
        help_text="Data da entrega ao responsável atual.",
    )

    descricao = models.TextField(blank=True)
    observacoes = models.TextField(blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["tipo", "marca", "modelo"]
        indexes = [
            models.Index(fields=["tombo"]),
            models.Index(fields=["status"]),
        ]
        verbose_name = "Equipamento"
        verbose_name_plural = "Equipamentos"

    def __str__(self):
        identificador = self.tombo or str(self.pk)
        return f"{self.tipo} — {identificador}"

    @property
    def setor_atual(self):
        return self.responsavel_atual.setor if self.responsavel_atual else None

class Acao(models.TextChoices):
    CRIACAO = "CRIACAO", "Criação"
    ALTERACAO = "ALTERACAO", "Alteração"
    EXCLUSAO = "EXCLUSAO", "Exclusão"

class Registro(models.Model):
    acao = models.CharField(
        max_length=15,
        choices=Acao.choices,
    )

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.PROTECT,
    )
    object_id = models.PositiveBigIntegerField()
    objeto = GenericForeignKey("content_type", "object_id")

    representacao_objeto = models.CharField(
        max_length=255,
        help_text="Representação do objeto no momento do evento.",
    )

    dados_anteriores = models.JSONField(
        null=True,
        blank=True,
    )
    dados_novos = models.JSONField(
        null=True,
        blank=True,
    )

    criado_em = models.DateTimeField(auto_now_add=True)

    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="registros_auditoria",
    )

    class Meta:
        ordering = ["-criado_em"]
        verbose_name = "Registro de auditoria"
        verbose_name_plural = "Registros de auditoria"
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
            models.Index(fields=["acao"]),
            models.Index(fields=["-criado_em"]),
        ]

    def __str__(self):
        return (
            f"{self.get_acao_display()} — "
            f"{self.representacao_objeto} — "
            f"{self.criado_em:%d/%m/%Y %H:%M}"
        )