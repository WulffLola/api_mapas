# Generated by Django 3.2.12 on 2023-08-10 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_rename_errorrs_error'),
    ]

    operations = [
        migrations.AddField(
            model_name='error',
            name='altura',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='error',
            name='calle',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='error',
            name='codigo_postal',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
