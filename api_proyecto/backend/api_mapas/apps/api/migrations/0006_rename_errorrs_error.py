# Generated by Django 3.2.12 on 2023-08-07 13:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_errorrs'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Errorrs',
            new_name='Error',
        ),
    ]
