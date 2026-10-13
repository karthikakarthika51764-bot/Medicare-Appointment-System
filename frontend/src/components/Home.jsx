import React, { useState } from "react";
import "./Home.css";
import { API_BASE_URL } from "../config";

// Assets
import ortho from "../assets/ortho.jpg";
import ortho2 from "../assets/ortho2.jpg";
import ortho3 from "../assets/ortho3.jpg";
import ortho4 from "../assets/ortho4.jpg";
import ortho5 from "../assets/ortho5.jpg";

export default function Home() {
  const HOSPITAL_WHATSAPP_NUMBER = "919876543210";

  // 5 Doctors Dataset
  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      spec: "Knee & Joint Replacement Specialist",
      qualification: "MS (Orthopedics), M.Ch (UK), FRCS",
      experience: "18+ Years",
      awards: [
        "Best Joint Replacement Surgeon",
        "Excellence in Orthopedics Award",
        "Pioneer in Robotic Surgery",
      ],
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
      info: "Pioneer in robotic-assisted joint replacement with over 5,000+ successful knee & hip surgeries.",
      availability: "Mon - Sat (10:00 AM - 02:00 PM)",
    },
    {
      id: 2,
      name: "Dr. Priya Nair",
      spec: "Spine & Back Pain Specialist",
      qualification: "MD, DNB (Orthopedics), Fellowship in Spine (Germany)",
      experience: "14+ Years",
      awards: [
        "National Spine Research Award",
        "Top Woman In Healthcare",
        "Spine Innovation Gold Medal",
      ],
      image: "https://images.unsplash.com/photo-1594824813566-88855ce78341?w=500&auto=format&fit=crop&q=80",
      info: "Specializes in keyhole endoscopic spine surgery, slipped disc care, and non-surgical back pain therapy.",
      availability: "Mon - Fri (11:30 AM - 04:00 PM)",
    },
    {
      id: 3,
      name: "Dr. Amit Verma",
      spec: "Sports Injury & Arthroscopy Expert",
      qualification: "MS (Orthopedics), Diploma in Sports Medicine (IOC)",
      experience: "12+ Years",
      awards: [
        "Sports Medicine Innovator Award",
        "Gold Medalist in Arthroscopy Care",
      ],
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80",
      info: "Consultant for national athletes specializing in ACL/PCL ligament reconstruction and shoulder repairs.",
      availability: "Tue - Sat (02:00 PM - 06:00 PM)",
    },
    {
      id: 4,
      name: "Dr. Sneha Kulkarni",
      spec: "Pediatric Orthopedics & Fractures",
      qualification: "MS (Orthopedics), Fellowship in Pediatric Ortho (USA)",
      experience: "15+ Years",
      awards: [
        "Child Healthcare Excellence Medal",
        "International Orthopedic Fellow",
      ],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80",
      info: "Dedicated specialist for childhood bone deformities, clubfoot management, and pediatric growth fractures.",
      availability: "Mon - Fri (09:00 AM - 01:00 PM)",
    },
    {
      id: 5,
      name: "Dr. Vikramaditya Rao",
      spec: "Trauma, Fracture & Bone Reconstruction",
      qualification: "MS (Orthopedics), AO Trauma Fellow (Switzerland)",
      experience: "16+ Years",
      awards: [
        "Emergency Care Achievement Award",
        "Complex Fracture Care Specialist",
      ],
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80",
      info: "Emergency polytrauma surgeon specializing in complex non-union fractures, pelvic care, and limb alignment.",
      availability: "Mon - Sat (12:00 PM - 05:00 PM)",
    },
  ];

  // Services Dataset
  const services = [
    { img: ortho, title: "Joint & Orthopedic Care", desc: "Advanced joint restoration and arthritis treatment." },
    { img: ortho2, title: "Trauma & Fracture Care", desc: "Emergency fracture management and casting." },
    { img: ortho3, title: "Sports Medicine", desc: "Arthroscopic keyhole surgery & athletic rehab." },
    { img: ortho4, title: "Knee Surgery", desc: "Robotic knee replacement & ligament repair." },
    { img: ortho5, title: "Spine & Back Care", desc: "Endoscopic disc repair & non-surgical therapy." },
  ];

  // Form State
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    gender: "Male",
    phone: "",
    doctor: `${doctors[0].name}`,
    appointment_date: "",
    time_slot: "10:00 AM - 11:00 AM",
    concern: "Knee Pain / Joint Issue",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleDoctorSelect = (doc) => {
    setFormData({ ...formData, doctor: doc.name });
    const element = document.getElementById("appointment-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // 1. Send data to Django Backend Database
      const res = await fetch(`${API_BASE_URL}/api/book-appointment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          department: "Orthopedics", // Default department
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const bookingId = data.appointment?.id || data.id;
        setSuccessMsg(
          `🎉 Thank you! Your booking was successful.${bookingId ? ` Booking ID: #${bookingId}.` : ""}`
        );

        // 2. Format WhatsApp Message and redirect
        const message = `👋 Hello MediCare Team,

Appointment Booking Request:
• *Patient Name:* ${formData.patient_name} (${formData.age} yrs, ${formData.gender})
• *Phone:* ${formData.phone}
• *Doctor:* ${formData.doctor}
• *Date/Time:* ${formData.appointment_date} @ ${formData.time_slot}
• *Concern:* ${formData.concern}`;

        window.open(`https://wa.me/${HOSPITAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");

        // Reset Form
        setFormData({
          patient_name: "",
          age: "",
          gender: "Male",
          phone: "",
          doctor: doctors[0].name,
          appointment_date: "",
          time_slot: "10:00 AM - 11:00 AM",
          concern: "Knee Pain / Joint Issue",
        });
      } else {
        setErrorMsg(data.error || "Failed to book appointment. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Server connection error. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single-page-wrapper bg-light">
      {/* HERO SECTION */}
      <section className="min-vh-100 d-flex align-items-center py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 animate-fade-in">
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-bold mb-3">
                <i className="bi bi-activity me-2 heartbeat-icon d-inline-block"></i>
                MediCare Orthopedic Center
              </span>
              <h1 className="display-4 fw-bold text-dark mb-3">
                Expert Orthopedic Care, <span className="text-success">5 Top Doctors.</span>
              </h1>
              <p className="lead text-secondary mb-4">
                Consult with leading orthopedic surgeons for joint replacement, spine surgery, sports injury, and 24/7 trauma care.
              </p>
              <div className="d-flex gap-3">
                <a href="#appointment-section" className="btn btn-success btn-lg btn-glow rounded-pill px-4 fw-bold">
                  Book Appointment
                </a>
                <a href="#doctors-section" className="btn btn-outline-success btn-lg rounded-pill px-4 fw-bold">
                  View All 5 Doctors
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="floating-hero">
                <i className="bi bi-heart-pulse text-success opacity-75" style={{ fontSize: "170px" }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services-section" className="py-5 bg-white border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h6 className="text-success fw-bold text-uppercase">Specialties</h6>
            <h2 className="fw-bold text-dark">Comprehensive Joint & Bone Care</h2>
          </div>
          <div className="row g-4">
            {services.map((srv, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm card-animated rounded-4 img-zoom-container">
                  <img src={srv.img} className="card-img-top" alt={srv.title} style={{ height: "190px", objectFit: "cover" }} />
                  <div className="card-body p-4">
                    <h5 className="fw-bold text-dark">{srv.title}</h5>
                    <p className="text-muted small mb-0">{srv.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 DOCTORS SECTION */}
      <section id="doctors-section" className="py-5 bg-light border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-success text-white px-3 py-2 rounded-pill fw-bold mb-2">5 Specialists Available</span>
            <h2 className="fw-bold text-dark">Our Orthopedic Doctors</h2>
            <p className="text-muted">Select your doctor to schedule an instant consultation.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {doctors.map((doc) => (
              <div key={doc.id} className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm card-animated rounded-4 overflow-hidden">
                  <div className="row g-0 h-100">
                    <div className="col-sm-5 img-zoom-container position-relative">
                      <img src={doc.image} className="w-100 h-100 object-fit-cover" alt={doc.name} style={{ minHeight: "240px" }} />
                      <span className="position-absolute top-0 start-0 m-2 badge bg-success shadow-sm">{doc.experience}</span>
                    </div>
                    <div className="col-sm-7 p-3 d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="fw-bold text-dark mb-1">{doc.name}</h5>
                        <p className="text-success fw-bold small mb-1">{doc.spec}</p>
                        <p className="text-muted extra-small mb-2" style={{ fontSize: "0.8rem" }}>{doc.qualification}</p>
                        <p className="text-secondary small mb-2" style={{ fontSize: "0.85rem" }}>{doc.info}</p>
                        <strong className="small text-dark d-block mb-1">Awards & Honors:</strong>
                        <ul className="list-unstyled mb-0 text-muted" style={{ fontSize: "0.78rem" }}>
                          {doc.awards.map((award, i) => (
                            <li key={i}><i className="bi bi-trophy-fill text-warning me-1"></i>{award}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-top d-flex align-items-center justify-content-between mt-3">
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          <i className="bi bi-clock me-1"></i>{doc.availability}
                        </small>
                        <button className="btn btn-sm btn-success rounded-pill px-3 btn-glow fw-bold" onClick={() => handleDoctorSelect(doc)}>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPOINTMENT FORM SECTION */}
      <section id="appointment-section" className="py-5 bg-white border-top">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden card-animated">
                <div className="card-header bg-success text-white p-4">
                  <h4 className="fw-bold mb-1"><i className="bi bi-calendar-check me-2"></i>Book Doctor Appointment</h4>
                  <p className="mb-0 small opacity-75">Select any of the 5 specialists above or choose below.</p>
                </div>
                <div className="card-body p-4">
                  {successMsg && <div className="alert alert-success shadow-sm">{successMsg}</div>}
                  {errorMsg && <div className="alert alert-danger shadow-sm">{errorMsg}</div>}

                  <form onSubmit={handleBookingSubmit}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Patient Name *</label>
                        <input
                          type="text"
                          name="patient_name"
                          className="form-control"
                          placeholder="Full Name"
                          value={formData.patient_name}
                          required
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Age *</label>
                        <input
                          type="number"
                          name="age"
                          className="form-control"
                          placeholder="Age"
                          value={formData.age}
                          required
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Gender</label>
                        <select name="gender" className="form-select" value={formData.gender} onChange={handleFormChange}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="Mobile Number"
                          value={formData.phone}
                          required
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Select Doctor (5 Available) *</label>
                        <select name="doctor" className="form-select" value={formData.doctor} onChange={handleFormChange}>
                          {doctors.map((doc) => (
                            <option key={doc.id} value={doc.name}>
                              {doc.name} - {doc.spec}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Appointment Date *</label>
                        <input
                          type="date"
                          name="appointment_date"
                          className="form-control"
                          value={formData.appointment_date}
                          required
                          onChange={handleFormChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Time Slot *</label>
                        <select name="time_slot" className="form-select" value={formData.time_slot} onChange={handleFormChange}>
                          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                          <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                          <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                          <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold">Primary Concern / Issue *</label>
                      <input
                        type="text"
                        name="concern"
                        className="form-control"
                        placeholder="e.g. Knee pain, Back discomfort, Fracture..."
                        value={formData.concern}
                        required
                        onChange={handleFormChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success btn-lg w-100 btn-glow fw-bold rounded-pill"
                      disabled={loading}
                    >
                      {loading ? "Submitting Booking..." : "Confirm Appointment & Connect via WhatsApp"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-light pt-5 pb-4 border-top border-secondary">
        <div className="container">
          <div className="row g-4 mb-4">
            {/* Column 1: Hospital Overview */}
            <div className="col-lg-4 col-md-6">
              <h5 className="text-success fw-bold mb-3 d-flex align-items-center">
                <i className="bi bi-hospital fs-4 me-2"></i>MediCare Orthopedics
              </h5>
              <p className="text-secondary small mb-3 leading-relaxed">
                MediCare Orthopedic & Trauma Center is dedicated to restoring mobility and enhancing quality of life through advanced robotic joint replacements, keyhole spine care, and round-the-clock emergency trauma response.
              </p>
              <div className="d-flex gap-3 fs-5">
                <a href="#hero" className="text-light hover-lift" title="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="#hero" className="text-light hover-lift" title="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="#hero" className="text-light hover-lift" title="LinkedIn"><i className="bi bi-linkedin"></i></a>
                <a href="#hero" className="text-light hover-lift" title="YouTube"><i className="bi bi-youtube"></i></a>
                <a href={`https://wa.me/${HOSPITAL_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-success hover-lift" title="WhatsApp"><i className="bi bi-whatsapp"></i></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h6 className="text-white fw-bold mb-3 border-bottom border-success pb-2 d-inline-block">
                Quick Links
              </h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="#" className="animated-footer-link">Home Overview</a></li>
                <li className="mb-2"><a href="#services-section" className="animated-footer-link">Medical Services</a></li>
                <li className="mb-2"><a href="#doctors-section" className="animated-footer-link">Meet 5 Doctors</a></li>
                <li className="mb-2"><a href="#appointment-section" className="animated-footer-link">Book Appointment</a></li>
              </ul>
            </div>

            {/* Column 3: Medical Specialties */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-white fw-bold mb-3 border-bottom border-success pb-2 d-inline-block">
                Key Specialties
              </h6>
              <ul className="list-unstyled small text-secondary">
                <li className="mb-2"><i className="bi bi-chevron-right text-success me-1"></i>Robotic Joint Replacement</li>
                <li className="mb-2"><i className="bi bi-chevron-right text-success me-1"></i>Spine & Disc Restoration</li>
                <li className="mb-2"><i className="bi bi-chevron-right text-success me-1"></i>Sports Ligaments & ACL Repair</li>
                <li className="mb-2"><i className="bi bi-chevron-right text-success me-1"></i>Pediatric Deformity Correction</li>
                <li className="mb-2"><i className="bi bi-chevron-right text-success me-1"></i>Complex Fracture & Trauma</li>
              </ul>
            </div>

            {/* Column 4: Contact & Working Hours */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-white fw-bold mb-3 border-bottom border-success pb-2 d-inline-block">
                Hospital Contact
              </h6>
              <p className="small text-secondary mb-2 d-flex align-items-start">
                <i className="bi bi-geo-alt-fill text-success me-2 mt-1"></i>
                <span>123 Health Care Avenue, Medical District, City Center</span>
              </p>
              <p className="small text-secondary mb-2">
                <i className="bi bi-telephone-fill text-success me-2"></i>+91 98765 43210
              </p>
              <p className="small text-secondary mb-3">
                <i className="bi bi-clock-fill text-success me-2"></i>OPD: Mon - Sat (09:00 AM - 08:00 PM)
              </p>

              {/* Emergency Hotline Box */}
              <div className="p-3 rounded-3 bg-danger bg-opacity-10 border border-danger text-danger small">
                <div className="fw-bold d-flex align-items-center mb-1">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>24/7 Trauma Emergency
                </div>
                <div>Call Direct: <strong>+91 98765 00000</strong></div>
              </div>
            </div>
          </div>

          <hr className="my-4 border-secondary opacity-25" />

          {/* Bottom Bar */}
          <div className="row align-items-center small text-secondary">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              © {new Date().getFullYear()} MediCare Orthopedic Center. All rights reserved.
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#" className="text-secondary text-decoration-none me-3 hover-text-white">Privacy Policy</a>
              <a href="#" className="text-secondary text-decoration-none me-3 hover-text-white">Terms of Service</a>
              <a href="#" className="text-secondary text-decoration-none hover-text-white">Emergency Guidelines</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}