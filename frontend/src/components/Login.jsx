import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid email or password");
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("token", data.access);
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
        <h4 className="text-center mb-1 fw-bold">Welcome back</h4>
        <p className="text-center text-muted small mb-4">Sign in to manage your Medicare appointments.</p>
        {location.state?.message && <div className="alert alert-success py-2 small">{location.state.message}</div>}
        <form onSubmit={submit}>
          <label className="form-label small">Email address</label>
          <input className="form-control mb-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label className="form-label small">Password</label>
          <input className="form-control mb-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <div className="text-end mb-3"><Link className="small" to="/forgot-password">Forgot password?</Link></div>
          <button className="btn btn-success w-100 fw-semibold" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        {error && <div className="alert alert-danger py-2 mt-3 small">{error}</div>}
        <div className="text-center small mt-3">New to Medicare? <Link to="/register">Create an account</Link></div>
      </div>
    </div>
  );
}
