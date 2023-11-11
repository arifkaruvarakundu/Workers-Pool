from django.db import models
from services.models import Services
from authentication.models import User

class UserDetails(models.Model):
    user_id=models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15)
    street_name = models.CharField(max_length=255)
    house_number = models.CharField(max_length=10)
    ward = models.CharField(max_length=50)
    panchayath_municipality_corporation = models.CharField(max_length=100)
    taluk = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    services = models.ManyToManyField(Services)
    years_of_experience = models.IntegerField(null=True)
    license_certificate = models.FileField(upload_to='licenses/', null=True)
    min_charge = models.DecimalField(max_digits=10, decimal_places=2,default=0.0)
    charge_after_one_hour = models.DecimalField(max_digits=10, decimal_places=2,default=0.0)

    def __str__(self):
        return self.first_name
