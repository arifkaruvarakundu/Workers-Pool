# Generated by Django 4.2.6 on 2023-11-01 10:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0003_alter_services_service_img'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='services',
            options={'ordering': ['Title']},
        ),
    ]
