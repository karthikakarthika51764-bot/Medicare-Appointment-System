import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function saveTokens(data) {
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("token", data.access);
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [step, setStep] = useState("details");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [developmentOtp, setDevelopmentOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submitDetails = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start registration");
      setDevelopmentOtp(data.development_otp || "");
      setMessage("A verification code was sent to your email.");
      setStep("verify");
    } catch (requestError) {
      setError(requestError.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-registration/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid or expired code");
      saveTokens(data);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
      <div className="card p-4 shadow-sm border-0" style={{ width: "380px", borderRadius: "12px" }}>
        <h4 className="text-center mb-1 fw-bold">Create your account</h4>
        <p className="text-center text-muted small mb-4">Book and manage your Medicare appointments.</p>
        {step === "details" ? (
          <form onSubmit={submitDetails}>
            <label className="form-label small">Full name</label>
            <input className="form-control mb-3" name="name" value={form.name} onChange={update} required />
            <label className="form-label small">Email address</label>
            <input className="form-control mb-3" type="email" name="email" value={form.email} onChange={update} required />
            <label className="form-label small">Password</label>
            <input className="form-control mb-3" type="password" name="password" minLength={8} value={form.password} onChange={update} required />
            <button className="btn btn-success w-100 fw-semibold" disabled={loading}>{loading ? "Sending code..." : "Register"}</button>
          </form>
        ) : (
          <form onSubmit={verify}>
            {message && <div className="alert alert-info py-2 small">{message}</div>}
            {developmentOtp && <div className="alert alert-warning py-2 small">Development code: <strong>{developmentOtp}</strong></div>}
            <label className="form-label small">Email verification code</label>
            <input className="form-control text-center mb-3" inputMode="numeric" maxLength={6} name="otp" value={form.otp} onChange={update} required />
            <button className="btn btn-success w-100 fw-semibold" disabled={loading}>{loading ? "Verifying..." : "Verify and create account"}</button>
          </form>
        )}
        {error && <div className="alert alert-danger py-2 mt-3 small">{error}</div>}
        <div className="text-center small mt-3">Already registered? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
