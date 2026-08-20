import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInput = ReactPhoneInput.default || ReactPhoneInput;

export default function Login() {
  const navigate = useNavigate(); // Initialize Router Navigation

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = OTP Input
  const [error, setError] = useState("");

  // Step 1: Request OTP from Django Backend
  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setError("");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Server connection error");
    }
  };

  // Step 2: Verify OTP & Navigate to Home
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        // 1. Save authentication token to browser storage
        localStorage.setItem("token", data.access);

        // 2. Redirect user to Home page immediately
        navigate("/Home");
      } else {
        setError(data.error || "Invalid or expired OTP");
      }
    } catch (err) {
      setError("Server connection error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: "360px", borderRadius: "12px" }}>
        <h4 className="text-center mb-3">Sign In</h4>

        {step === 1 ? (
          <>
            <label className="form-label text-muted small">Enter Phone Number</label>
            <PhoneInput
              country="in"
              value={phone}
              onChange={(val) => {
                setPhone(val);
                setError("");
              }}
              inputStyle={{ width: "100%", height: "40px" }}
            />
            <button className="btn btn-success w-100 mt-3" onClick={handleSendOTP}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <label className="form-label text-muted small">Enter Verification Code</label>
            <input
              type="text"
              className="form-control text-center mb-3"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="btn btn-success w-100" onClick={handleVerifyOTP}>
              Verify 
            </button>
            <button
              className="btn btn-link w-100 mt-2 text-decoration-none small"
              onClick={() => {
                setStep(1);
                setError("");
              }}
            >
              Change Phone Number
            </button>
          </>
        )}

        {error && <div className="alert alert-danger py-2 mt-3 small text-center">{error}</div>}
      </div>
    </div>
  );
}