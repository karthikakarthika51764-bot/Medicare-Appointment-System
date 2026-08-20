import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Appointments() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    gender: "Male",
    phone: "",
    doctor: "Dr. Rajesh Sharma (Knee & Joint Specialist)",
    appointment_date: "",
    time_slot: "10:00 AM - 11:00 AM",
    concern: "Knee Pain",
    notes: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    // Open blank tab synchronously on click event to bypass browser pop-up blockers
    const whatsappWindow = window.open("", "_blank");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/appointments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ ...formData, department: "Orthopedics" }),
      });

      const data = await res.json();

      if (res.ok) {
        // Prepare WhatsApp payload before clearing form state
        const patientPhone = `91${formData.phone.slice(-10)}`;
        const communityLink = "https://chat.whatsapp.com/ILxI4c9OSf34BKy7YX1GYC";

        const message = `👋 Hello *${formData.patient_name}*,

Thank you for choosing *MediCare Healthcare*! Your orthopedic appointment has been successfully scheduled.

📋 *Appointment Details:*
• *Doctor:* ${formData.doctor}
• *Date:* ${formData.appointment_date}
• *Time:* ${formData.time_slot}
• *Concern:* ${formData.concern}

📌 *Instructions:* Please arrive 15 minutes early and bring any relevant X-rays or medical records.

💬 *Join Our Orthopedic Support Community:*
Get joint care tips, doctor updates, and direct support:
🔗 ${communityLink}

*Wishing you great health,*
*MediCare Healthcare Team*`;

        const encodedUrl = `https://wa.me/${patientPhone}?text=${encodeURIComponent(message)}`;

        // Redirect the pre-opened browser tab to WhatsApp
        if (whatsappWindow) {
          whatsappWindow.location.href = encodedUrl;
        }

        setStatus({
          type: "success",
          message: "Orthopedic appointment booked! Opening WhatsApp confirmation...",
        });

        // Reset form inputs
        setFormData({
          patient_name: "",
          age: "",
          gender: "Male",
          phone: "",
          doctor: orthopedicDoctors[0].name,
          appointment_date: "",
          time_slot: "10:00 AM - 11:00 AM",
          concern: "Knee Pain",
          notes: "",
        });
      } else {
        if (whatsappWindow) whatsappWindow.close();
        setStatus({
          type: "danger",
          message: data.error || "Failed to book appointment. Try again.",
        });
      }
    } catch (err) {
      if (whatsappWindow) whatsappWindow.close();
      setStatus({ type: "danger", message: "Server error connecting to backend." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
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
              {status.message && (
                <div className={`alert alert-${status.type} text-center`} role="alert">
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Patient Information */}
                <h6 className="fw-bold text-success mb-3">1. Patient Details</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="patient_name"
                      className="form-control"
                      placeholder="e.g., John Doe"
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
                      placeholder="Age"
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
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Doctor & Schedule Selection */}
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

                {/* Orthopedic Symptoms & Notes */}
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
                      placeholder="e.g., Pain duration, previous x-ray details"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
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
      </div>
    </div>
  );
}