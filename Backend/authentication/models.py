from django.db import models
from django.contrib.auth.models import AbstractUser,Permission,Group
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    profile_img = models.ImageField(upload_to='profile', blank=True, null=True)
    email = models.EmailField(unique=True)
    phone = models.BigIntegerField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    license_id = models.CharField(max_length=20, blank=True, null=True)
    kyc_verified = models.BooleanField(default=False)
    pcc_verified = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    otp = models.IntegerField (blank=True, null=True)
    otp_created_at=models.DateTimeField(blank=True ,null=True)

    # Add a 'role' field to define the user's role
    ROLE_CHOICES = (
        ('worker', 'Worker'),
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    
    # REQUIRED_FIELDS should not include 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
