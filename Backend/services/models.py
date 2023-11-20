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
    
class Booking_Paid(models.Model):
    paid = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.paid


class Appointment(models.Model):
    service = models.ForeignKey(Services, on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='Booking_user')
    worker = models.ForeignKey(User, on_delete=models.CASCADE,related_name='Booked_worker',null=True)
    status = models.CharField(max_length=20, null=True,choices=(("Pending", "Pending"),("Accepted", "Accepted"),("Rejected", "Rejected"),("Cancelled", "Cancelled")),default='Pending')
    short_description = models.TextField(default='')
    date1 = models.DateField(null=True)
    

    def __str__(self):
        customer_username = self.customer.username if self.customer else "No Customer"
        service_title = self.service.Title if self.service else "No Service"
        return f"{customer_username} {service_title}"
