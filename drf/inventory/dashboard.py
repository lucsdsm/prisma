from django.db.models import Count
from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Equipamento


def agrupar_equipamentos(queryset, campo_id, campo_nome, sem_nome):
    grupos = (
        queryset
        .order_by()
        .values(campo_id, campo_nome)
        .annotate(quantidade=Count("id"))
        .order_by("-quantidade", campo_nome)
    )

    return [
        {
            "id": grupo[campo_id],
            "nome": grupo[campo_nome] or sem_nome,
            "quantidade": grupo["quantidade"],
        }
        for grupo in grupos
    ]


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        equipamentos = Equipamento.objects.all()

        total = equipamentos.count()

        sem_responsavel = equipamentos.filter(
            responsavel_atual__isnull=True,
        ).count()

        por_tipo = agrupar_equipamentos(
            equipamentos,
            "tipo_id",
            "tipo__nome",
            "Tipo não informado",
        )

        por_propriedade = agrupar_equipamentos(
            equipamentos,
            "propriedade_id",
            "propriedade__nome",
            "Propriedade não informada",
        )

        por_status = agrupar_equipamentos(
            equipamentos,
            "status_id",
            "status__nome",
            "Status não informado",
        )

        por_setor = agrupar_equipamentos(
            equipamentos,
            "responsavel_atual__setor_id",
            "responsavel_atual__setor__nome",
            "Sem responsável / setor não definido",
        )

        marcas = (
            equipamentos
            .order_by()
            .values("marca")
            .annotate(quantidade=Count("id"))
            .order_by("-quantidade", "marca")
        )

        por_marca = [
            {
                "id": grupo["marca"],
                "nome": grupo["marca"] or "Marca não informada",
                "quantidade": grupo["quantidade"],
            }
            for grupo in marcas
        ]

        por_responsabilidade = [
            {
                "id": "com_responsavel",
                "nome": "Com responsável",
                "quantidade": total - sem_responsavel,
            },
            {
                "id": "sem_responsavel",
                "nome": "Sem responsável",
                "quantidade": sem_responsavel,
            },
        ]

        return Response(
            {
                "total_equipamentos": total,
                "gerado_em": timezone.now().isoformat(),
                "por_tipo": por_tipo,
                "por_propriedade": por_propriedade,
                "por_status": por_status,
                "por_setor": por_setor,
                "por_marca": por_marca,
                "por_responsabilidade": por_responsabilidade,
            }
        )