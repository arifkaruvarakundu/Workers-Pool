# Generated by Django 4.2.6 on 2023-12-08 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0014_user_otp_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='otp_created_at',
            field=models.TimeField(blank=True, null=True),
        ),
    ]