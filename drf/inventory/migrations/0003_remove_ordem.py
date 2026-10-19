from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0002_alter_equipamento_tombo"),
    ]

    operations = [
        migrations.RemoveField(model_name="cargo", name="ordem"),
        migrations.RemoveField(model_name="tipo", name="ordem"),
        migrations.RemoveField(model_name="propriedade", name="ordem"),
        migrations.RemoveField(model_name="status", name="ordem"),
        migrations.RemoveField(model_name="setor", name="ordem"),
    ]
