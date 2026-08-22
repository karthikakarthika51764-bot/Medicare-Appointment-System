import random
from django.core.cache import cache
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Appointment

USE_DEFAULT_STATIC_OTP = True

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

# --- Patient Views ---

class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw_phone = request.data.get("phone", "")
        clean_phone = str(raw_phone)[-10:]
        
        if len(clean_phone) < 10:
            return Response({"error": "Valid 10-digit phone number required"}, status=status.HTTP_400_BAD_REQUEST)

        otp = "123456" if USE_DEFAULT_STATIC_OTP else str(random.randint(100000, 999999))
        cache.set(f"otp_{clean_phone}", otp, timeout=300)

        print(f"\n========================================\n DEV OTP FOR {clean_phone}: {otp}\n========================================\n")

        return Response({"message": "OTP generated and sent successfully."}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw_phone = request.data.get("phone", "")
        user_otp = request.data.get("otp")

        clean_phone = str(raw_phone)[-10:]
        stored_otp = cache.get(f"otp_{clean_phone}")

        if stored_otp and stored_otp == user_otp:
            cache.delete(f"otp_{clean_phone}")
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