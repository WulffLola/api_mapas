# Generated by Django 3.2.12 on 2023-09-21 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_alter_hojaderuta_fecha'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hojaderuta',
            name='fecha',
            field=models.DateField(default='0000-00-00'),
        ),
        migrations.AlterField(
            model_name='hojaderuta',
            name='listadoAInspeccionar',
            field=models.TextField(default='-1'),
        ),
        migrations.AlterField(
            model_name='hojaderuta',
            name='listadoInspectores',
            field=models.TextField(default='-1'),
        ),
    ]