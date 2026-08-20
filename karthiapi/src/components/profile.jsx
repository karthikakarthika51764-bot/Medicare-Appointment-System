import React, { useState } from "react";
import "./home.css"; // Uses existing animations and hover styles

export default function Profile() {
  const HOSPITAL_WHATSAPP = "919876543210";

  // --- Empty Profile Initial State ---
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
  });

  // Temporary buffer state while editing
  const [tempData, setTempData] = useState({ ...profileData });

  // --- Help Modal State ---
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  // Enter edit mode and seed temp buffer
  const handleStartEdit = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  // Handle Edit Profile Input
  const handleInputChange = (e) => {
    setTempData({ ...tempData, [e.target.name]: e.target.value });
  };

  // Save Edit Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  // Cancel Edit Profile
  const handleCancelEdit = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  // Send Support Query via WhatsApp
  const handleSendHelpQuery = (e) => {
    e.preventDefault();
    const msg = `🚨 Help & Support Request from Patient Profile:\n\n• *Name:* ${profileData.fullName || "Not Provided"}\n• *Phone:* ${profileData.phone || "Not Provided"}\n• *Issue/Query:* ${supportMessage}`;
    window.open(`https://wa.me/${HOSPITAL_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    setSupportMessage("");
    setShowHelpModal(false);
  };

  // Check if profile is empty
  const isProfileEmpty = !profileData.fullName && !profileData.phone && !profileData.email;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* HEADER BAR */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">User Profile</h2>
            <p className="text-secondary small mb-0">Manage your medical info and get immediate support</p>
          </div>
          <button
            className="btn btn-outline-danger rounded-pill px-4 btn-glow fw-bold"
            onClick={() => setShowHelpModal(true)}
          >
            <i className="bi bi-question-circle me-2"></i>Help & Support
          </button>
        </div>

        <div className="row g-4">
          {/* PROFILE SUMMARY CARD (LEFT SIDE) */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 text-center p-4 card-animated bg-white">
              <div className="position-relative d-inline-block mx-auto mb-3">
                <div
                  className="rounded-circle shadow-sm border border-3 border-success d-flex align-items-center justify-content-center bg-light text-secondary mx-auto"
                  style={{ width: "120px", height: "120px", fontSize: "3rem" }}
                >
                  <i className="bi bi-person"></i>
                </div>
                <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-2" title="Active Account"></span>
              </div>
              <h4 className="fw-bold text-dark mb-1">{profileData.fullName || "User Name"}</h4>
              <p className="text-muted small mb-2">{profileData.email || "No email address added"}</p>
              <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-2 fw-bold mb-3">
                Blood Group: {profileData.bloodGroup || "Not Set"}
              </span>

              <hr className="my-3 opacity-25" />

              <div className="text-start small">
                <p className="mb-2"><i className="bi bi-telephone text-success me-2"></i><strong>Phone:</strong> {profileData.phone || "Not set"}</p>
                <p className="mb-2"><i className="bi bi-geo-alt text-success me-2"></i><strong>Location:</strong> {profileData.address || "Not set"}</p>
                <p className="mb-0"><i className="bi bi-shield-exclamation text-danger me-2"></i><strong>Emergency:</strong> {profileData.emergencyContact || "Not set"}</p>
              </div>
            </div>
          </div>

          {/* EDITABLE PROFILE FORM / DETAILS (RIGHT SIDE) */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white card-animated">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h5 className="fw-bold text-dark mb-0">
                  <i className="bi bi-person-vcard text-success me-2"></i>
                  {isEditing ? "Edit Personal Details" : "Personal & Medical Overview"}
                </h5>
                {!isEditing && (
                  <button
                    className="btn btn-success btn-sm rounded-pill px-3 btn-glow"
                    onClick={handleStartEdit}
                  >
                    <i className="bi bi-pencil-square me-1"></i> {isProfileEmpty ? "Add Details" : "Edit Profile"}
                  </button>
                )}
              </div>

              {isEditing ? (
                /* EDIT MODE FORM */
                <form onSubmit={handleSaveProfile}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        placeholder="e.g. Jane Doe"
                        value={tempData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="e.g. name@example.com"
                        value={tempData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="+91 00000 00000"
                        value={tempData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Age</label>
                      <input
                        type="number"
                        name="age"
                        className="form-control"
                        placeholder="Age"
                        value={tempData.age}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Gender</label>
                      <select
                        name="gender"
                        className="form-select"
                        value={tempData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Blood Group</label>
                      <select
                        name="bloodGroup"
                        className="form-select"
                        value={tempData.bloodGroup}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-danger">Emergency Contact Number</label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        className="form-control border-danger"
                        placeholder="+91 00000 00000"
                        value={tempData.emergencyContact}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="Enter street, city, state"
                      value={tempData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Medical History / Allergies</label>
                    <textarea
                      name="medicalHistory"
                      rows="3"
                      className="form-control"
                      placeholder="List any past surgeries, chronic conditions, or drug allergies..."
                      value={tempData.medicalHistory}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success rounded-pill px-4 btn-glow">
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                /* VIEW MODE DISPLAY */
                <div className="row g-4">
                  {isProfileEmpty ? (
                    <div className="col-12 text-center py-4">
                      <i className="bi bi-person-exclamation text-warning fs-1 d-block mb-2"></i>
                      <p className="text-muted mb-3">No profile details added yet. Click below to enter your medical and personal details.</p>
                      <button className="btn btn-success rounded-pill px-4" onClick={handleStartEdit}>
                        Fill Profile Details
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="col-md-6">
                        <small className="text-muted d-block fw-bold">Age & Gender</small>
                        <p className="fs-6 text-dark fw-semibold">
                          {profileData.age ? `${profileData.age} Years` : "N/A"}, {profileData.gender || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block fw-bold">Primary Contact</small>
                        <p className="fs-6 text-dark fw-semibold">{profileData.phone || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block fw-bold">Residential Address</small>
                        <p className="fs-6 text-dark fw-semibold">{profileData.address || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <small className="text-danger d-block fw-bold">Emergency Contact</small>
                        <p className="fs-6 text-danger fw-semibold">{profileData.emergencyContact || "N/A"}</p>
                      </div>
                      <div className="col-12">
                        <small className="text-muted d-block fw-bold">Medical Background & Records</small>
                        <div className="p-3 bg-light rounded-3 border mt-1">
                          <p className="mb-0 text-secondary small">
                            {profileData.medicalHistory || "No medical history recorded."}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HELP & SUPPORT ACCORDION SECTION */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mt-5">
          <h5 className="fw-bold text-dark mb-3">
            <i className="bi bi-info-circle text-success me-2"></i>Frequently Asked Help Questions
          </h5>
          <div className="accordion accordion-flush" id="helpAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#help1">
                  How do I reschedule an existing appointment?
                </button>
              </h2>
              <div id="help1" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                <div className="accordion-body text-muted small">
                  Navigate to the appointments tab or reach out to hospital support directly via WhatsApp with your booking details.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#help2">
                  Where can I upload my X-ray or MRI reports?
                </button>
              </h2>
              <div id="help2" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                <div className="accordion-body text-muted small">
                  You can attach PDF or Image reports directly while sending your appointment request via WhatsApp or show them during OPD entry.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HELP & SUPPORT MODAL */}
      {showHelpModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-danger text-white rounded-top-4">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-headset me-2"></i>Help & Support Desk
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowHelpModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="small text-secondary mb-3">
                  Need assistance with booking, profile updates, or urgent medical inquiries? Send your issue directly to our support desk.
                </p>
                <form onSubmit={handleSendHelpQuery}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Describe your issue or question *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Type your issue here..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-success fw-bold rounded-pill btn-glow">
                      <i className="bi bi-whatsapp me-2"></i>Send Support Request via WhatsApp
                    </button>
                    <a href={`tel:+919876500000`} className="btn btn-outline-danger fw-bold rounded-pill">
                      <i className="bi bi-telephone-fill me-2"></i>Call 24/7 Emergency Line
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}