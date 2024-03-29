# Generated by Django 4.2.6 on 2023-11-17 14:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('services', '0011_alter_appointment_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='worker',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Booked_worker', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='customer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Booking_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
