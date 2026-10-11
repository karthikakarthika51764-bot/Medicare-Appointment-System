
import React from "react";

import ortho from "../assets/ortho.jpg";

import ortho2 from "../assets/ortho2.jpg";
import ortho3 from "../assets/ortho3.jpg";
import ortho4 from "../assets/ortho4.jpg";
import ortho5 from "../assets/ortho5.jpg";



function Services() {
  return (
    
<div className="container py-5">

  {/* Section Heading */}
  <h2 className="text-center text-success fw-bold mb-5">
    Our Medical Services
  </h2>

  {/* Cards */}
  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">

    {/* Card 1 */}
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img
          src={ortho}
          className="card-img-top"
          alt="Orthopedic and Joint Care"
        />

        <div className="card-body">
          <h5 className="card-title fw-bold">
            Orthopedic & Joint Care
          </h5>

          <p className="card-text text-muted">
            Comprehensive diagnosis and treatment for
            bone, joint, and musculoskeletal conditions.
          </p>
        </div>
      </div>
    </div>

    {/* Card 2 */}
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img
          src={ortho2}
          className="card-img-top"
          alt="Fracture and Trauma Care"
        />

        <div className="card-body">
          <h5 className="card-title fw-bold">
            Fracture & Trauma Care
          </h5>

          <p className="card-text text-muted">
            Professional evaluation and treatment for
            fractures, dislocations, and orthopedic injuries.
          </p>
        </div>
      </div>
    </div>

    {/* Card 3 */}
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img
          src={ortho3}
          className="card-img-top"
          alt="Sports Injury Management"
        />

        <div className="card-body">
          <h5 className="card-title fw-bold">
            Sports Injury Management
          </h5>

          <p className="card-text text-muted">
            Specialized treatment and rehabilitation for
            sports-related injuries.
          </p>
        </div>
      </div>
    </div>

    {/* Card 4 */}
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img
          src={ortho4}
          className="card-img-top"
          alt="Knee Care and Treatment"
        />

        <div className="card-body">
          <h5 className="card-title fw-bold">
            Knee Care & Treatment
          </h5>

          <p className="card-text text-muted">
            Comprehensive care for knee pain, arthritis,
            ligament injuries, and related disorders.
          </p>
        </div>
      </div>
    </div>

    {/* Card 5 */}
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img
          src={ortho5}
          className="card-img-top"
          alt="Spine and Back Care"
        />

        <div className="card-body">
          <h5 className="card-title fw-bold">
            Spine & Back Care
          </h5>

          <p className="card-text text-muted">
            Specialized management of back pain,
            spinal disorders, and related conditions.
          </p>
        </div>
      </div>
    </div>

  </div>
</div>


  )
}

export default Services