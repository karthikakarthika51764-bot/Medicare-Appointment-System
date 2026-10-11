import random
from datetime import datetime, timedelta
from smtplib import SMTPException
from django.core.cache import cache
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import Appointment

# --- Serializers ---

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            "id", "user", "patient_name", "age", "gender", "phone",
            "department", "doctor", "appointment_date", "time_slot",
            "concern", "notes", "status", "created_at",
        ]
        read_only_fields = ["id", "user", "status", "created_at"]

# --- Patient authentication ---

def normalized_email(value):
    email = str(value or "").strip().lower()
    validate_email(email)
    return email


def utc_now():
    return datetime.utcnow()


def issue_tokens(email, name=""):
    user = User.objects.get(username=email)
    updates = []
    if user.email != email:
        user.email = email
        updates.append("email")
    if name and user.first_name != name:
        user.first_name = name
        updates.append("first_name")
    if updates:
        user.save(update_fields=updates)

    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def send_code(email, purpose, subject, extra=None):
    otp = settings.DEFAULT_OTP if settings.USE_DEFAULT_STATIC_OTP else str(random.randint(100000, 999999))
    verification = {
        "email": email,
        "purpose": purpose,
        "otp": otp,
        "expires_at": utc_now() + timedelta(minutes=5),
    }
    if extra:
        verification.update(extra)
    cache.set(f"verification:{purpose}:{email}", verification, timeout=300)
    send_mail(
        subject=subject,
        message=f"Your Medicare verification code is {otp}. It expires in 5 minutes.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )
    return otp


def validate_code(email, purpose, otp):
    code = str(otp or "").strip()
    if len(code) != 6 or not code.isdigit():
        return None
    cache_key = f"verification:{purpose}:{email}"
    record = cache.get(cache_key)
    if not record or record["expires_at"] < utc_now() or record["otp"] != code:
        return None
    cache.delete(cache_key)
    return record


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = normalized_email(request.data.get("email"))
        except ValidationError:
            return Response({"error": "Valid email address required"}, status=status.HTTP_400_BAD_REQUEST)

        name = str(request.data.get("name", "")).strip()
        password = str(request.data.get("password", ""))
        if not name or len(name) < 2:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({"error": "An account with this email already exists"}, status=status.HTTP_409_CONFLICT)

        try:
            User.objects.create_user(
                username=email,
                email=email,
                first_name=name,
                password=password,
                is_active=False,
            )
            otp = send_code(
                email,
                "register",
                "Verify your Medicare account",
            )
        except (OSError, SMTPException, RuntimeError):
            return Response({"error": "Registration service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        response = {"message": "Verification code sent to your email"}
        if settings.DEBUG and settings.EMAIL_BACKEND.endswith("console.EmailBackend"):
            response["development_otp"] = otp
        return Response(response, status=status.HTTP_200_OK)


class VerifyRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = normalized_email(request.data.get("email"))
        except ValidationError:
            return Response({"error": "Valid email address required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            record = validate_code(email, "register", request.data.get("otp"))
        except RuntimeError:
            return Response({"error": "Registration service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if not record:
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=email, is_active=False)
        except User.DoesNotExist:
            if User.objects.filter(username=email).exists():
                return Response({"error": "This account is already verified"}, status=status.HTTP_409_CONFLICT)
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

        user.is_active = True
        user.save(update_fields=["is_active"])
        return Response({"message": "Account created", **issue_tokens(email, user.first_name)}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = normalized_email(request.data.get("email"))
        except ValidationError:
            return Response({"error": "Valid email address required"}, status=status.HTTP_400_BAD_REQUEST)
        password = str(request.data.get("password", ""))
        try:
            user = User.objects.get(username=email, is_active=True)
        except User.DoesNotExist:
            user = None
        if not user or not check_password(password, user.password):
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"message": "Login successful", **issue_tokens(email, user.first_name)})


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = normalized_email(request.data.get("email"))
        except ValidationError:
            return Response({"error": "Valid email address required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.filter(username=email, is_active=True).first()
            if user:
                otp = send_code(email, "reset", "Reset your Medicare password")
            else:
                otp = None
        except (OSError, SMTPException, RuntimeError):
            return Response({"error": "Password reset service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        response = {"message": "If an account exists, a reset code has been sent"}
        if otp and settings.DEBUG and settings.EMAIL_BACKEND.endswith("console.EmailBackend"):
            response["development_otp"] = otp
        return Response(response)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = normalized_email(request.data.get("email"))
        except ValidationError:
            return Response({"error": "Valid email address required"}, status=status.HTTP_400_BAD_REQUEST)
        password = str(request.data.get("password", ""))
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            code_record = validate_code(email, "reset", request.data.get("otp"))
        except RuntimeError:
            return Response({"error": "Password reset service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if not code_record:
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(username=email, is_active=True).first()
        if not user:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)
        user.set_password(password)
        user.save(update_fields=["password"])
        return Response({"message": "Password reset successful"})


class AppointmentCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save(user=request.user)
            return Response(
                {
                    "message": "Thank you! Your booking was successful.",
                    "appointment": AppointmentSerializer(appointment).data,
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAppointmentListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        appointments = Appointment.objects.filter(user=request.user).order_by('-id')
        return Response(AppointmentSerializer(appointments, many=True).data, status=status.HTTP_200_OK)


# --- Hospital Views ---

class HospitalAppointmentListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        appointments = Appointment.objects.all().order_by('-id')
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HospitalUpdateStatusView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        appointment_id = request.data.get("id")
        new_status = request.data.get("status")

        if not appointment_id or not new_status:
            return Response({"error": "Both 'id' and 'status' are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            appointment = Appointment.objects.get(id=appointment_id)
            
            appointment.status = new_status

            if "appointment_date" in request.data and hasattr(appointment, 'appointment_date'):
                appointment.appointment_date = request.data.get("appointment_date")
            
            if "time_slot" in request.data and hasattr(appointment, 'time_slot'):
                appointment.time_slot = request.data.get("time_slot")
                
            if "doctor" in request.data and hasattr(appointment, 'doctor'):
                appointment.doctor = request.data.get("doctor")

            appointment.save()

            return Response({
                "message": f"Appointment #{appointment.id} updated successfully",
                "id": appointment.id,
                "status": new_status
            }, status=status.HTTP_200_OK)

        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)