# Generated by Django 3.2.12 on 2023-08-10 14:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20230810_1335'),
    ]

    operations = [
        migrations.RenameField(
            model_name='error',
            old_name='altura',
            new_name='altura_conf',
        ),
        migrations.RenameField(
            model_name='error',
            old_name='calle',
            new_name='calle_conf',
        ),
        migrations.RenameField(
            model_name='error',
            old_name='codigo_postal',
            new_name='codigo_postal_conf',
        ),
    ]
