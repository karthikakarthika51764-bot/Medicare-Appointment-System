from django.urls import path
from .views import SendOTPView, VerifyOTPView, AppointmentCreateView  # Fix class name here

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('appointments/', AppointmentCreateView.as_view(), name='appointments'),
]