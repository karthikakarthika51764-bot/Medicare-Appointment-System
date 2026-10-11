# authentication/urls.py

from django.urls import path
from .views import (
    RegisterView,
    VerifyRegistrationView,
    LoginView,
    ForgotPasswordView,
    ResetPasswordView,
    AppointmentCreateView,
    UserAppointmentListView,
    HospitalAppointmentListView,
    HospitalUpdateStatusView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-registration/', VerifyRegistrationView.as_view(), name='verify-registration'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('book-appointment/', AppointmentCreateView.as_view(), name='book-appointment'),
    path('my-appointments/', UserAppointmentListView.as_view(), name='my-appointments'),
    path('hospital/appointments/', HospitalAppointmentListView.as_view(), name='hospital-appointments'),
    path('hospital/update-status/', HospitalUpdateStatusView.as_view(), name='hospital-update-status'),
]