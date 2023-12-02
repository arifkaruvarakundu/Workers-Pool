from django.db import models
from authentication.models import User

class AdminWallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(null=True)
    credit = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    debit = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.user.username}'s Admin Wallet"

class AdminTransaction(models.Model):
    wallet = models.ForeignKey(AdminWallet, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
