import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { API_BASE_URL } from "../config";

const PhoneInput = ReactPhoneInput.default || ReactPhoneInput;

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = OTP Input
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [developmentOtp, setDevelopmentOtp] = useState("");

  // Step 1: Request OTP from Django Backend
  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.ok) {
        setDevelopmentOtp(data.development_otp || "");
        setStep(2);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Save JWT Tokens
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        // Store access and refresh tokens uniformly across components
        if (data.access) {
          localStorage.setItem("access", data.access);
          localStorage.setItem("token", data.access); // Fallback key
        }
        if (data.refresh) {
          localStorage.setItem("refresh", data.refresh);
        }

        navigate("/Home");
      } else {
        setError(data.error || "Invalid or expired OTP");
      }
    } catch (err) {
      setError("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: "360px", borderRadius: "12px" }}>
        <h4 className="text-center mb-3 fw-bold">Sign In</h4>

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
            <button 
              className="btn btn-success w-100 mt-3 fw-semibold" 
              onClick={handleSendOTP} 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <label className="form-label text-muted small">Enter Verification Code</label>
            {developmentOtp && (
              <div className="alert alert-warning py-2 text-center small">
                Development OTP: <strong>{developmentOtp}</strong>
              </div>
            )}
            <input
              type="text"
              className="form-control text-center mb-3 fs-5 tracking-widest"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button 
              className="btn btn-success w-100 fw-semibold" 
              onClick={handleVerifyOTP} 
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              className="btn btn-link w-100 mt-2 text-decoration-none small text-secondary"
              onClick={() => {
                setStep(1);
                setError("");
              }}
              disabled={loading}
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