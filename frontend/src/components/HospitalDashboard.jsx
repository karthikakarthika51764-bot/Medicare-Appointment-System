import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const [editingApp, setEditingApp] = useState(null);
  const [editForm, setEditForm] = useState({
    appointment_date: "",
    time_slot: "",
    doctor: "",
  });

  const getAuthHeader = () => {
    const rawToken = localStorage.getItem("access") || localStorage.getItem("token");
    if (!rawToken) return {};
    const cleanToken = rawToken.replace(/^"|"$/g, "").trim();
    return { Authorization: `Bearer ${cleanToken}` };
  };

  useEffect(() => {
    if (alertMsg || error) {
      const timer = setTimeout(() => {
        setAlertMsg("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg, error]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/appointments/`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
        setError("");
      } else if (res.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        setError(data.detail || "Failed to fetch appointment data.");
      }
    } catch (err) {
      setError("Server connection error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const formatPhone = (phoneNum) => {
    if (!phoneNum) return "";
    let clean = phoneNum.toString().replace(/\D/g, "");
    if (clean.length === 10) clean = "91" + clean;
    return clean;
  };

  const handleApprove = async (app) => {
    setAlertMsg("");
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/update-status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ id: app.id, status: "Approved" }),
      });

      if (res.ok) {
        setAlertMsg(`✅ Approved! Opening WhatsApp message for ${app.patient_name}...`);

        const deptText = app.department ? ` (${app.department})` : "";
        const message = `Dear ${app.patient_name},\n\nYour appointment with ${app.doctor}${deptText} at Medicare Hospital has been CONFIRMED.\n\n📅 Date: ${app.appointment_date}\n⏰ Time Slot: ${app.time_slot}\n\nPlease arrive 10 minutes prior to your scheduled time slot.\n\nThank you,\nMedicare Hospital Team`;

        const whatsappUrl = `https://wa.me/${formatPhone(app.phone)}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        fetchAppointments();
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to approve appointment.");
      }
    } catch (err) {
      setError("Failed to approve appointment.");
    }
  };

  const handleReject = async (app) => {
    setAlertMsg("");
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/update-status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ id: app.id, status: "Rejected" }),
      });

      if (res.ok) {
        setAlertMsg(`Appointment #${app.id} has been rejected. Opening WhatsApp message...`);
        const message = `Dear ${app.patient_name},\n\nWe are sorry, but your appointment request at Medicare Hospital for ${app.appointment_date} (${app.time_slot}) could not be approved at this time.\n\nPlease contact the hospital to choose another available date and time.\n\nThank you,\nMedicare Hospital Team`;
        window.open(`https://wa.me/${formatPhone(app.phone)}?text=${encodeURIComponent(message)}`, "_blank");
        fetchAppointments();
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to reject appointment.");
      }
    } catch (err) {
      setError("Failed to reject appointment.");
    }
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setEditForm({
      appointment_date: app.appointment_date || "",
      time_slot: app.time_slot || "",
      doctor: app.doctor || "",
    });
  };

  const handleSaveAndNotify = async () => {
    if (!editingApp) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/update-status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          id: editingApp.id,
          status: "Approved",
          appointment_date: editForm.appointment_date,
          time_slot: editForm.time_slot,
          doctor: editForm.doctor,
        }),
      });

      if (res.ok) {
        setAlertMsg(`✅ Schedule updated & notification dispatched for ${editingApp.patient_name}!`);

        const message = `Dear ${editingApp.patient_name},\n\nRegarding your appointment request at Medicare Hospital:\n\nDue to doctor availability, your appointment with ${editForm.doctor} has been rescheduled to the updated slot below:\n\n📅 New Date: ${editForm.appointment_date}\n⏰ New Time Slot: ${editForm.time_slot}\n\nPlease reply to confirm if this new time works for you.\n\nThank you,\nMedicare Hospital Team`;

        const whatsappUrl = `https://wa.me/${formatPhone(editingApp.phone)}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");

        setEditingApp(null);
        fetchAppointments();
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to update record.");
      }
    } catch (err) {
      setError("Failed to update and send message.");
    }
  };

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-0">🏥 Hospital Staff Portal</h2>
          <small className="text-muted">Confirm, reschedule, and send professional WhatsApp notices</small>
        </div>
        <button className="btn btn-outline-primary btn-sm fw-bold" onClick={fetchAppointments}>
          🔄 Refresh List
        </button>
      </div>

      {alertMsg && <div className="alert alert-success shadow-sm">{alertMsg}</div>}
      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 text-secondary fw-bold">Patient Appointment Requests</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center text-muted">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-4 text-center text-muted">No appointments found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th># ID</th>
                    <th>Patient Name</th>
                    <th>Phone</th>
                    <th>Department & Doctor</th>
                    <th>Date & Slot</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app.id}>
                      <td className="fw-bold">#{app.id}</td>
                      <td className="fw-bold text-primary">{app.patient_name}</td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1 fs-6">
                          📞 {app.phone}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold">{app.department || "General"}</div>
                        <small className="text-muted">{app.doctor}</small>
                      </td>
                      <td>
                        <div>{app.appointment_date}</div>
                        <small className="text-muted">{app.time_slot}</small>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            app.status === "Approved"
                              ? "bg-success"
                              : app.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {app.status || "Pending"}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-success btn-sm fw-semibold"
                            onClick={() => handleApprove(app)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-warning btn-sm fw-semibold text-dark"
                            onClick={() => openEditModal(app)}
                          >
                            Edit & Send
                          </button>
                          <button
                            className="btn btn-danger btn-sm fw-semibold"
                            onClick={() => handleReject(app)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingApp && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  Edit & Reschedule for {editingApp.patient_name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditingApp(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted small mb-3">
                  Adjust doctor availability, date, or time slot before notifying the patient on WhatsApp.
                </p>

                <div className="mb-3">
                  <label className="form-label fw-bold small">Doctor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.doctor}
                    onChange={(e) => setEditForm({ ...editForm, doctor: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small">Appointment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editForm.appointment_date}
                    onChange={(e) => setEditForm({ ...editForm, appointment_date: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small">Time Slot</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.time_slot}
                    onChange={(e) => setEditForm({ ...editForm, time_slot: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingApp(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm fw-bold"
                  onClick={handleSaveAndNotify}
                >
                  Save & Notify via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}