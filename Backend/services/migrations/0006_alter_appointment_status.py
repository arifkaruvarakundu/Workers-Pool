# Generated by Django 4.2.6 on 2023-11-08 04:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0005_booking_paid_appointment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='status',
            field=models.CharField(choices=[('Waiting for payment', 'Waiting for payment'), ('Pending', 'Pending'), ('Accept', 'Accept')], max_length=20, null=True),
        ),
    ]
