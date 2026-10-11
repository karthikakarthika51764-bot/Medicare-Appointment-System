import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [developmentOtp, setDevelopmentOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const requestReset = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to request password reset");
      setDevelopmentOtp(data.development_otp || "");
      setMessage(data.message);
      setStep("reset");
    } catch (requestError) {
      setError(requestError.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to reset password");
      navigate("/login", { replace: true, state: { message: "Password reset successful. Please sign in." } });
    } catch (requestError) {
      setError(requestError.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
      <div className="card p-4 shadow-sm border-0" style={{ width: "380px", borderRadius: "12px" }}>
        <h4 className="text-center mb-1 fw-bold">Reset password</h4>
        <p className="text-center text-muted small mb-4">We will email you a one-time verification code.</p>
        {step === "email" ? (
          <form onSubmit={requestReset}>
            <label className="form-label small">Email address</label>
            <input className="form-control mb-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <button className="btn btn-success w-100 fw-semibold" disabled={loading}>{loading ? "Sending code..." : "Send reset code"}</button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            {message && <div className="alert alert-info py-2 small">{message}</div>}
            {developmentOtp && <div className="alert alert-warning py-2 small">Development code: <strong>{developmentOtp}</strong></div>}
            <label className="form-label small">Verification code</label>
            <input className="form-control mb-3" inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value)} required />
            <label className="form-label small">New password</label>
            <input className="form-control mb-3" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="btn btn-success w-100 fw-semibold" disabled={loading}>{loading ? "Updating..." : "Reset password"}</button>
          </form>
        )}
        {error && <div className="alert alert-danger py-2 mt-3 small">{error}</div>}
        <div className="text-center small mt-3"><Link to="/login">Back to sign in</Link></div>
      </div>
    </div>
  );
}
