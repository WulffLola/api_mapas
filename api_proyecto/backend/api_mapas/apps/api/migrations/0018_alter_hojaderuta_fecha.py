# Generated by Django 3.2.12 on 2023-09-19 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_auto_20230919_1752'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hojaderuta',
            name='fecha',
            field=models.DateField(),
        ),
    ]
