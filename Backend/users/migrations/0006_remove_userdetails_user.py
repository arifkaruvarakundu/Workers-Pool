# Generated by Django 4.2.6 on 2023-11-04 14:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_remove_userdetails_charge_after_one_hour_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userdetails',
            name='user',
        ),
    ]
