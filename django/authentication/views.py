import random
from django.core.cache import cache
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Appointment

# Set to True during development to force OTP to '123456'
USE_DEFAULT_STATIC_OTP = True

class SendOTPView(APIView):
    def post(self, request):
        raw_phone = request.data.get("phone")
        if not raw_phone:
            return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Standardize number to last 10 digits
        clean_phone = raw_phone[-10:]

        # Determine OTP (Default or Random)
        if USE_DEFAULT_STATIC_OTP:
            otp = "123456"
        else:
            otp = str(random.randint(100000, 999999))

        # Store OTP in cache for 5 minutes (300 seconds)
        cache.set(f"otp_{clean_phone}", otp, timeout=300)

        # Print OTP to Django terminal for easy testing
        print("\n" + "=" * 40)
        print(f"   DEV OTP FOR {clean_phone}: {otp}")
        print("=" * 40 + "\n")

        return Response({
            "message": f"OTP generated successfully. (Testing OTP: {otp})"
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    def post(self, request):
        raw_phone = request.data.get("phone")
        user_otp = request.data.get("otp")

        if not raw_phone or not user_otp:
            return Response({"error": "Phone number and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        clean_phone = raw_phone[-10:]
        stored_otp = cache.get(f"otp_{clean_phone}")

        # Verify against stored OTP
        if stored_otp and stored_otp == user_otp:
            # Clear used OTP
            cache.delete(f"otp_{clean_phone}")

            # Retrieve or create user with 10-digit phone number as username
            user, created = User.objects.get_or_create(username=clean_phone)
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful",
                "is_new_user": created,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)


class AppointmentCreateView(APIView):
    def post(self, request):
        try:
            data = request.data
            appointment = Appointment.objects.create(
                patient_name=data.get("patient_name"),
                age=data.get("age"),
                gender=data.get("gender"),
                phone=data.get("phone"),
                department=data.get("department", "Orthopedics"),
                doctor=data.get("doctor"),
                appointment_date=data.get("appointment_date"),
                time_slot=data.get("time_slot"),
                concern=data.get("concern"),
                notes=data.get("notes", ""),
            )
            return Response(
                {"message": "Appointment booked successfully!", "id": appointment.id},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)