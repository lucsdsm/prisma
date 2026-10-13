from django.apps import AppConfig


class inventoryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "inventory"
    verbose_name = "Inventário de TI"

    def ready(self):
        import inventory.signals # noqa: F401