# Generated by Django 4.2.6 on 2023-11-10 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0006_alter_appointment_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='short_description',
            field=models.TextField(default=''),
        ),
    ]