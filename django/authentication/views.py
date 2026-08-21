import os
import random
import requests
from django.core.cache import cache
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Appointment

# Set to False to dispatch real SMS messages via Fast2SMS
USE_DEFAULT_STATIC_OTP = False


def send_fast2sms_otp(phone_number, otp_code):
    """
    Utility function to send real SMS via Fast2SMS API.
    Reads key dynamically from Render Environment Variables.
    """
    api_key = os.environ.get("FAST2SMS_API_KEY")
    if not api_key:
        print("CRITICAL: FAST2SMS_API_KEY environment variable is not set on Render.")
        return False

    url = "https://www.fast2sms.com/dev/bulkV2"
    payload = {
        "variables_values": str(otp_code),
        "route": "otp",
        "numbers": str(phone_number)[-10:]
    }
    headers = {
        "authorization": api_key,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(url, data=payload, headers=headers, timeout=5)
        res_data = response.json()
        if res_data.get("return"):
            return True
        print(f"Fast2SMS API Response Error: {res_data.get('message')}")
        return False
    except Exception as e:
        print(f"Fast2SMS Connection Exception: {str(e)}")
        return False


class SendOTPView(APIView):
    def post(self, request):
        raw_phone = request.data.get("phone")
        if not raw_phone:
            return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Standardize number to last 10 digits
        clean_phone = str(raw_phone).strip()[-10:]

        if USE_DEFAULT_STATIC_OTP:
            otp = "123456"
            sms_sent = True
        else:
            otp = str(random.randint(100000, 999999))
            sms_sent = send_fast2sms_otp(clean_phone, otp)

        if not sms_success if USE_DEFAULT_STATIC_OTP else not sms_sent:
            return Response(
                {"error": "Failed to dispatch SMS via Fast2SMS. Please verify API key or account balance."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Store in Django Cache for 5 minutes (300 seconds)
        cache.set(f"otp_{clean_phone}", otp, timeout=300)

        print("\n" + "=" * 40)
        print(f" DEV LOG: OTP FOR {clean_phone} IS {otp}")
        print("=" * 40 + "\n")

        return Response({
            "message": "OTP generated and dispatched successfully via SMS.",
            "testing_otp": otp if USE_DEFAULT_STATIC_OTP else None
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    def post(self, request):
        raw_phone = request.data.get("phone")
        user_otp = request.data.get("otp")

        if not raw_phone or not user_otp:
            return Response({"error": "Phone number and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        clean_phone = str(raw_phone).strip()[-10:]
        stored_otp = cache.get(f"otp_{clean_phone}")

        if stored_otp and str(stored_otp) == str(user_otp).strip():
            # Invalidate used OTP
            cache.delete(f"otp_{clean_phone}")

            # Fetch or register user
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
    # Enforce JWT Authentication for saving appointments
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        
        # Mandatory validation checks
        required_fields = ["patient_name", "phone", "doctor", "appointment_date", "time_slot"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"'{field}' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
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
            return Response({"error": f"Database error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)