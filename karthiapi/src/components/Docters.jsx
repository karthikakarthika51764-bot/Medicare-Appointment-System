import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Doctor() {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Full dataset for all 5 Orthopedic Specialists
  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      spec: "Knee & Joint Replacement Specialist",
      qualification: "MS (Orthopedics), M.Ch (UK), FRCS",
      experience: "18+ Years",
      surgeries: "5,000+ Joint Replacements",
      awards: [
        "Best Joint Replacement Surgeon (2023)",
        "Excellence in Orthopedics Award (2021)",
        "National Pioneer in Robotic Surgery",
      ],
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
      info: "Pioneer in robotic-assisted joint replacement with over 5,000+ successful surgeries performed across Asia. Specializes in total and partial knee/hip replacements.",
      availability: "Mon - Sat (10:00 AM - 02:00 PM)",
    },
    {
      id: 2,
      name: "Dr. Priya Nair",
      spec: "Spine & Back Pain Specialist",
      qualification: "MD, DNB (Orthopedics), Fellowship in Spine Surgery (Germany)",
      experience: "14+ Years",
      surgeries: "3,200+ Spine Procedures",
      awards: [
        "National Spine Research Award (2022)",
        "Top Woman In Healthcare Award",
        "Spine Innovation Gold Medal",
      ],
      image: "https://images.unsplash.com/photo-1594824813566-88855ce78341?w=500&auto=format&fit=crop&q=80",
      info: "Specializes in non-surgical back care, endoscopic spine surgery, keyhole disc repair, and complex spinal reconstruction with minimal recovery time.",
      availability: "Mon - Fri (11:30 AM - 04:00 PM)",
    },
    {
      id: 3,
      name: "Dr. Amit Verma",
      spec: "Sports Injury & Arthroscopy Expert",
      qualification: "MS (Orthopedics), Diploma in Sports Medicine (IOC)",
      experience: "12+ Years",
      surgeries: "2,800+ Arthroscopic Surgeries",
      awards: [
        "Sports Medicine Innovator of the Year",
        "Gold Medalist in Arthroscopy & Ligament Care",
      ],
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80",
      info: "Official consultant for national sports teams, focusing on keyhole ligament reconstruction (ACL/PCL), rotator cuff repair, and rapid athletic rehabilitation.",
      availability: "Tue - Sat (02:00 PM - 06:00 PM)",
    },
    {
      id: 4,
      name: "Dr. Sneha Kulkarni",
      spec: "Pediatric Orthopedics & Fractures",
      qualification: "MS (Orthopedics), Fellowship in Pediatric Ortho (USA)",
      experience: "15+ Years",
      surgeries: "4,100+ Pediatric Cases",
      awards: [
        "Child Healthcare Excellence Medal",
        "International Orthopedic Fellow Award",
      ],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80",
      info: "Expert in pediatric bone deformity corrections, complex childhood fractures, congenital hip dysplasia, and clubfoot management.",
      availability: "Mon - Fri (09:00 AM - 01:00 PM)",
    },
    {
      id: 5,
      name: "Dr. Vikramaditya Rao",
      spec: "Trauma, Fracture & Bone Reconstruction",
      qualification: "MS (Orthopedics), Fellow in Trauma Surgery (AO Trauma, Switzerland)",
      experience: "16+ Years",
      surgeries: "6,000+ Trauma Trauma Interventions",
      awards: [
        "Emergency Care Lifetime Achievement Award",
        "Excellence in Complex Fracture Management",
      ],
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80",
      info: "Specializes in emergency polytrauma care, non-union bone fracture repairs, pelvic reconstruction, and complex revision surgeries.",
      availability: "Mon - Sat (12:00 PM - 05:00 PM)",
    },
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success mb-2">Our Orthopedic Specialists</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
          Meet our world-class team of orthopedic surgeons and specialists dedicated to restoring your mobility and health.
        </p>
      </div>

      {/* Doctor Cards Grid */}
      <div className="row g-4">
        {doctors.map((doc) => (
          <div key={doc.id} className="col-lg-6">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all rounded-3 overflow-hidden">
              <div className="row g-0 h-100">
                {/* Doctor Image */}
                <div className="col-sm-5 position-relative">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-100 h-100 object-fit-cover"
                    style={{ minHeight: "240px" }}
                  />
                  <span className="position-absolute top-0 start-0 m-2 badge bg-success shadow-sm">
                    {doc.experience} Exp.
                  </span>
                </div>

                {/* Doctor Body */}
                <div className="col-sm-7 d-flex flex-column justify-content-between p-3">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">{doc.name}</h5>
                    <p className="text-success fw-semibold small mb-1">{doc.spec}</p>
                    <p className="text-muted extra-small mb-2">{doc.qualification}</p>

                    <p className="small text-secondary mb-2" style={{ fontSize: "0.85rem" }}>
                      {doc.info}
                    </p>

                    {/* Awards List */}
                    <div className="mb-3">
                      <strong className="small text-dark d-block mb-1">🏆 Awards & Recognition:</strong>
                      <ul className="list-unstyled mb-0 extra-small text-muted">
                        {doc.awards.map((award, idx) => (
                          <li key={idx} className="mb-1">
                            <i className="bi bi-award-fill text-warning me-1"></i>
                            {award}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        <i className="bi bi-clock me-1"></i>
                        {doc.availability}
                      </small>
                    </div>
                    <button
                      className="btn btn-sm btn-success px-3 rounded-pill"
                      onClick={() => navigate("/appointments", { state: { selectedDoctor: `${doc.name} (${doc.spec})` } })}
                    >
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
  );
}