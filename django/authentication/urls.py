# authentication/urls.py

from django.urls import path
from .views import SendOTPView, VerifyOTPView  # Remove AppointmentCreateView if it's not defined in views.py

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
]