# Generated by Django 4.2.6 on 2023-12-08 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0013_remove_user_otp_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='otp_created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
