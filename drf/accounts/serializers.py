from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from .models import Usuario


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["email"] = user.email
        token["nome"] = user.nome
        token["is_staff"] = user.is_staff

        return token


class UsuarioSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(
        source="password",
        write_only=True,
        required=False,
        min_length=8,
    )

    class Meta:
        model = Usuario
        fields = ("id", "nome", "email", "senha", "is_active", "is_staff")
        read_only_fields = ("id", "is_staff")

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        usuario = Usuario(**validated_data)
        if password:
            usuario.set_password(password)
        else:
            usuario.set_unusable_password()
        usuario.save()
        return usuario

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        usuario = super().update(instance, validated_data)
        if password:
            usuario.set_password(password)
            usuario.save(update_fields=("password",))
        return usuario