# Generated by Django 4.2.6 on 2023-11-05 04:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_remove_userdetails_role_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetails',
            name='user_id',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
