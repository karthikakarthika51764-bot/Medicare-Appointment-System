
# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments", null=True, blank=True)
    patient_name = models.CharField(max_length=150)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    phone = models.CharField(max_length=15)
    department = models.CharField(max_length=100, default="Orthopedics")
    doctor = models.CharField(max_length=200)
    appointment_date = models.DateField()
    time_slot = models.CharField(max_length=50)
    concern = models.CharField(max_length=150)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} - {self.doctor} ({self.appointment_date})"