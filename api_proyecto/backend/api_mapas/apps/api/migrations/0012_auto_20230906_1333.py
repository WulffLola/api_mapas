# Generated by Django 3.2.12 on 2023-09-06 13:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_oficios'),
    ]

    operations = [
        migrations.AddField(
            model_name='oficios',
            name='id_hoja_ruta',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='oficios',
            name='fecha',
            field=models.DateField(),
        ),
    ]
