# authentication/urls.py

from django.urls import path
from .views import (
    SendOTPView,
    VerifyOTPView,
    AppointmentCreateView,
    UserAppointmentListView,
    HospitalAppointmentListView,
    HospitalUpdateStatusView,
)

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('book-appointment/', AppointmentCreateView.as_view(), name='book-appointment'),
    path('my-appointments/', UserAppointmentListView.as_view(), name='my-appointments'),
    path('hospital/appointments/', HospitalAppointmentListView.as_view(), name='hospital-appointments'),
    path('hospital/update-status/', HospitalUpdateStatusView.as_view(), name='hospital-update-status'),
]