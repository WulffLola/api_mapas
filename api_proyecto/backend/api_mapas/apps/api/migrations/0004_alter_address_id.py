# Generated by Django 3.2.12 on 2023-08-07 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20230804_1616'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
