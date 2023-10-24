from django.db import models

class Services(models.Model):
    Title = models.CharField(max_length=100)
    description = models.TextField()
    service_img = models.ImageField(upload_to='service_img', blank=True, null=True)

    def __str__(self) :
        return self.Title