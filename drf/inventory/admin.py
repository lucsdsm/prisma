from django.contrib import admin

from .models import Cargo, Propriedade, Status, Tipo, Equipamento, Setor, Funcionario, Registro

@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome")
    search_fields = ("nome",)
    ordering = ("nome",)

@admin.register(Propriedade)
class PropriedadeAdmin(admin.ModelAdmin):
    list_display = ("id", "nome")
    search_fields = ("nome",)
    ordering = ("nome",)

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ("id", "nome")
    search_fields = ("nome",)
    ordering = ("nome",)

@admin.register(Tipo)
class TipoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome")
    search_fields = ("nome",)
    ordering = ("nome",)

@admin.register(Setor)
class SetorAdmin(admin.ModelAdmin):
    list_display = ("id", "nome")
    search_fields = ("nome",)
    ordering = ("nome",)


@admin.register(Funcionario)
class FuncionarioAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "setor", "cargo", "ativo")
    list_filter = ("cargo", "setor", "ativo")
    search_fields = ("nome",)
    list_select_related = ("setor",)
    ordering = ("nome",)


@admin.register(Equipamento)
class EquipamentoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "tombo",
        "tipo",
        "marca",
        "modelo",
        "propriedade",
        "responsavel_atual",
        "setor_atual",
        "status",
    )
    list_filter = (
        "tipo",
        "propriedade",
        "status",
        "responsavel_atual__setor",
    )
    search_fields = (
        "tombo",
        "marca",
        "modelo",
        "descricao",
        "responsavel_atual__nome",
    )
    list_select_related = ("responsavel_atual", "responsavel_atual__setor")
    readonly_fields = ("criado_em", "atualizado_em")
    ordering = ("tipo", "marca", "modelo")

    fieldsets = (
        (
            "Identificação",
            {
                "fields": (
                    "tipo",
                    "marca",
                    "modelo",
                    "tombo",
                    "propriedade",
                    "status",
                )
            },
        ),
        (
            "Responsabilidade",
            {
                "fields": (
                    "responsavel_atual",
                    "data_entrega_atual",
                )
            },
        ),
        (
            "Patrimônio e observações",
            {
                "fields": (
                    "data_fornecimento",
                    "descricao",
                    "observacoes",
                )
            },
        ),
        (
            "Auditoria",
            {
                "fields": ("criado_em", "atualizado_em"),
                "classes": ("collapse",),
            },
        ),
    )

@admin.register(Registro)
class RegistroAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "criado_em",
        "autor",
        "acao",
        "content_type",
        "object_id",
        "representacao_objeto",
    )
    list_filter = (
        "acao",
        "content_type",
    )
    search_fields = (
        "representacao_objeto",
        "object_id",
    )
    readonly_fields = (
        "acao",
        "content_type",
        "object_id",
        "representacao_objeto",
        "dados_anteriores",
        "dados_novos",
        "criado_em",
        "autor",
    )
    ordering = ("-criado_em",)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False