import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Appointments() {
  const navigate = useNavigate();

  const orthopedicDoctors = [
    { id: 1, name: "Dr. Rajesh Sharma", spec: "Knee & Joint Replacement Specialist" },
    { id: 2, name: "Dr. Priya Nair", spec: "Spine & Back Pain Specialist" },
    { id: 3, name: "Dr. Amit Verma", spec: "Sports Injury & Arthroscopy Expert" },
    { id: 4, name: "Dr. Sneha Kulkarni", spec: "Pediatric Orthopedics & Fractures" },
  ];

  const commonConcerns = [
    "Knee Pain / Arthritis",
    "Back or Neck Pain",
    "Bone Fracture / Trauma",
    "Joint Stiffness / Ligament Tear",
    "Shoulder Pain",
    "Post-Surgery Follow-up",
  ];

  const initialFormState = {
    patient_name: "",
    age: "",
    gender: "Male",
    phone: "",
    doctor: `${orthopedicDoctors[0].name} (${orthopedicDoctors[0].spec})`,
    appointment_date: "",
    time_slot: "10:00 AM - 11:00 AM",
    concern: commonConcerns[0],
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState("");

  useEffect(() => {
    const savedPhone = localStorage.getItem("user_phone") || "";
    const savedName = localStorage.getItem("user_name") || "";
    if (savedPhone || savedName) {
      setFormData((prev) => ({
        ...prev,
        phone: savedPhone || prev.phone,
        patient_name: savedName || prev.patient_name,
      }));
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    const token = localStorage.getItem("access") || localStorage.getItem("token");
    if (!token) {
      setAppointmentsError("Please log in to view your appointments.");
      setIsLoadingAppointments(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/my-appointments/`, {
        headers: { Authorization: `Bearer ${token.replace(/^"|"$/g, "").trim()}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
        setAppointmentsError("");
      } else if (res.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        setAppointmentsError(data.detail || "Unable to load appointments.");
      }
    } catch {
      setAppointmentsError("Unable to connect to the appointment server.");
    } finally {
      setIsLoadingAppointments(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("access") || localStorage.getItem("token");
      if (!token) {
        setStatus({ type: "danger", message: "Please log in before confirming your booking." });
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/book-appointment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.replace(/^"|"$/g, "").trim()}`,
        },
        body: JSON.stringify({ ...formData, department: "Orthopedics" }),
      });

      const data = await res.json();

      if (res.ok) {
        const appointment = data.appointment || data;
        const bookingId = appointment.id ? ` Booking ID: #${appointment.id}.` : "";

        setStatus({
          type: "success",
          message: `🎉 Thank you! Your booking was successful.${bookingId}`,
        });

        setFormData(initialFormState);
        await fetchAppointments();
      } else {
        let errorMessage = "Failed to book appointment. Try again.";
        if (data.detail) errorMessage = data.detail;
        else if (data.error) errorMessage = data.error;
        else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (firstKey) errorMessage = `${firstKey}: ${Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey]}`;
        }
        setStatus({ type: "danger", message: errorMessage });
      }
    } catch {
      setStatus({ type: "danger", message: "Server error connecting to backend." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow border-0 rounded-3">
            <div className="card-header bg-success text-white p-4">
              <h3 className="mb-1 fw-bold">
                <i className="bi bi-bone me-2"></i>Orthopedic Appointment
              </h3>
              <p className="mb-0 small opacity-75">
                Book a consultation with our Joint, Spine, and Bone specialists.
              </p>
            </div>

            <div className="card-body p-4">
              {status.message && status.type === "success" ? (
                <div className="alert alert-success text-center py-4" role="status">
                  <h1 className="h3 fw-bold mb-2">Thank you! Booking successful</h1>
                  <p className="mb-0">{status.message}</p>
                  <small className="d-block mt-2 text-muted">
                    Your booking is now available in the hospital dashboard for approval.
                  </small>
                </div>
              ) : status.message ? (
                <div className={`alert alert-${status.type} text-center`} role="alert">
                  {status.message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <h6 className="fw-bold text-success mb-3">1. Patient Details</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="patient_name"
                      className="form-control"
                      value={formData.patient_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Age *</label>
                    <input
                      type="number"
                      name="age"
                      className="form-control"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Gender *</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <h6 className="fw-bold text-success mb-3">2. Doctor & Date Selection</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-12">
                    <label className="form-label small fw-semibold">Select Orthopedic Specialist *</label>
                    <select
                      name="doctor"
                      className="form-select"
                      value={formData.doctor}
                      onChange={handleChange}
                      required
                    >
                      {orthopedicDoctors.map((doc) => (
                        <option key={doc.id} value={`${doc.name} (${doc.spec})`}>
                          {doc.name} — {doc.spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Preferred Date *</label>
                    <input
                      type="date"
                      name="appointment_date"
                      className="form-control"
                      value={formData.appointment_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Preferred Time Slot *</label>
                    <select
                      name="time_slot"
                      className="form-select"
                      value={formData.time_slot}
                      onChange={handleChange}
                    >
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM</option>
                    </select>
                  </div>
                </div>

                <h6 className="fw-bold text-success mb-3">3. Primary Orthopedic Concern</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Main Symptom / Issue *</label>
                    <select
                      name="concern"
                      className="form-select"
                      value={formData.concern}
                      onChange={handleChange}
                    >
                      {commonConcerns.map((issue, idx) => (
                        <option key={idx} value={issue}>
                          {issue}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Additional Details (Optional)</label>
                    <input
                      type="text"
                      name="notes"
                      className="form-control"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg flex-grow-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Booking Appointment..." : "Confirm Booking"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => navigate("/home")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-5 mt-4 mt-lg-0">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-dark text-white p-4">
              <h3 className="mb-1 fw-bold">My Appointments</h3>
              <p className="mb-0 small opacity-75">Your latest booking records</p>
            </div>
            <div className="card-body p-0">
              {isLoadingAppointments ? (
                <div className="p-4 text-center text-muted">Loading appointments...</div>
              ) : appointmentsError ? (
                <div className="alert alert-danger m-3">{appointmentsError}</div>
              ) : appointments.length === 0 ? (
                <div className="p-4 text-center text-muted">No appointments booked yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            <div className="fw-semibold">{appointment.doctor}</div>
                            <small className="text-muted">#{appointment.id}</small>
                          </td>
                          <td>
                            <div>{appointment.appointment_date}</div>
                            <small className="text-muted">{appointment.time_slot}</small>
                          </td>
                          <td>
                            <span className={`badge ${
                              appointment.status === "Approved"
                                ? "bg-success"
                                : appointment.status === "Rejected"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}>
                              {appointment.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}