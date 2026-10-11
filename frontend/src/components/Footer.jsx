import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4">
          
          {/* Column 1: Hospital Overview */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-success fw-bold mb-3">
              <i className="bi bi-hospital me-2"></i>MediCare Orthopedics
            </h5>
            <p className="text-secondary small mb-3">
              Leading orthopedic care center specializing in advanced robotic joint replacements, complex spine care, arthroscopy, and 24/7 emergency trauma care.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light fs-5 hover-success">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light fs-5 hover-success">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light fs-5 hover-success">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-light fs-5 hover-success">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://chat.whatsapp.com/ILxI4c9OSf34BKy7YX1GYC" target="_blank" rel="noreferrer" className="text-success fs-5">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/home" className="text-secondary text-decoration-none hover-white">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/doctors" className="text-secondary text-decoration-none hover-white">Our Doctors</Link>
              </li>
              <li className="mb-2">
                <Link to="/appointments" className="text-secondary text-decoration-none hover-white">Book Appointment</Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-secondary text-decoration-none hover-white">Specialties</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-secondary text-decoration-none hover-white">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Orthopedic Specialties */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Specialties</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2">Robotic Joint Replacement</li>
              <li className="mb-2">Spine & Endoscopic Surgery</li>
              <li className="mb-2">Sports Injury & Arthroscopy</li>
              <li className="mb-2">Pediatric Orthopedics</li>
              <li className="mb-2">24/7 Trauma & Fracture Care</li>
            </ul>
          </div>

          {/* Column 4: Contact & Emergency */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Hospital Contact</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2 d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt-fill text-success"></i>
                <span>123 Health Avenue, Medical Zone, City Center</span>
              </li>
              <li className="mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-telephone-fill text-success"></i>
                <span>+91 98765 43210</span>
              </li>
              <li className="mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-envelope-fill text-success"></i>
                <span>reception@medicareortho.com</span>
              </li>
              <li className="mt-3">
                <div className="p-2 rounded bg-danger bg-opacity-10 border border-danger border-opacity-25 text-danger small">
                  <strong>🚨 24/7 Emergency:</strong> Call +91 98765 00000
                </div>
              </li>
            </ul>
          </div>

        </div>

        <hr className="my-4 border-secondary opacity-25" />

        {/* Bottom Bar */}
        <div className="row align-items-center small text-secondary">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            © {currentYear} MediCare Orthopedic Center. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="me-3">Privacy Policy</span>
            <span className="me-3">Terms of Service</span>
            <span>Patient Care Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}