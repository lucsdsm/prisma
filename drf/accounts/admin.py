from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario

    list_display = (
        "email",
        "nome",
        "is_staff",
        "is_active",
        "is_superuser",
    )
    list_filter = (
        "is_staff",
        "is_active",
        "is_superuser",
        "groups",
    )
    search_fields = (
        "email",
        "nome",
    )
    ordering = ("email",)

    fieldsets = (
        (
            "Credenciais",
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),
        (
            "Informações pessoais",
            {
                "fields": ("nome",)
            },
        ),
        (
            "Permissões",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Datas importantes",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            "Criar usuário",
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "nome",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )