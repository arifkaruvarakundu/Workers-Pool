# Generated by Django 4.2.6 on 2023-11-28 06:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0018_appointment_is_active'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appointment',
            name='is_active',
        ),
    ]