from django.db import models
from authentication.models import User


class Services(models.Model):
    Title = models.CharField(max_length=100)
    description = models.TextField()
    service_img = models.ImageField(upload_to='service_img', blank=True, null=True)
    
    class Meta:
        ordering = ['Title'] 


    def __str__(self) :
        return self.Title
    




class Appointment(models.Model):
    service = models.ForeignKey(Services, on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='Booking_user')
    worker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='Booked_worker', null=True)
    short_description = models.TextField(default='')
    date1 = models.DateField(null=True)
    is_paid=models.BooleanField(default=False)
    is_active=models.BooleanField(default=False)

    STATUS_CHOICES = (
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Cancelled", "Cancelled"),
    )

    status = models.CharField(
        max_length=20,
        null=True,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    def __str__(self):
        customer_username = self.customer.username if self.customer else "No Customer"
        service_title = self.service.Title if self.service else "No Service"
        return f"{customer_username} {service_title}"

    @classmethod
    def get_status_choices(cls):
        return cls.STATUS_CHOICES
    
class Payment(models.Model):
    appointment=models.ForeignKey(Appointment,on_delete=models.CASCADE,null=True)
    amount=models.CharField(null=True)
    date_time=models.DateTimeField(null=True)
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    worker=models.CharField(null=True)
    payment_status=models.CharField(null=True)
    payment_id=models.CharField(null=True)

    def __str__(self):
        return self.worker

