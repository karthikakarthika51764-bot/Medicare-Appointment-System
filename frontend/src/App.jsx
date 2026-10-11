import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./index.css";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <>
      {/* Container-fluid allows content to push right up to the edges */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm px-3">
        <div className="container-fluid pe-lg-2">
          <Link className="navbar-brand fw-bold fs-4 text-white" to="/">
            <i className="bi bi-heart-pulse-fill me-2"></i>MediCare
          </Link>

          {/* Mobile Menu Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* ms-auto pushes items to the far right edge */}
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/services">
                  Services
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/doctors">
                  Doctors
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/appointments">
                  Appointments
                </Link>
              </li>

              
              {/* Dynamic Auth Button */}
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0 me-lg-2">
                {token ? (
                  <button className="btn btn-outline-light w-100" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <Link className="btn btn-light text-success fw-semibold w-100" to="/login">
                    Login
                  </Link>
                )}
              </li>

              {/* Profile link positioned right at the far right edge */}
              <li className="nav-item">
                <Link className="nav-link text-white fw-bold pe-0" to="/profile">
                  <i className="bi bi-person-circle me-1 fs-3 align-middle"></i>
                  
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main page content */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;