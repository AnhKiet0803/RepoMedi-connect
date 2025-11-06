import React from "react";
import './Page.css';

function AboutUs() {
    return (
        <div className="aboutus-page">
            <div className="container text-center">
                <h1 className="aboutus-title text-primary fw-bold mb-4">About MediConnect</h1>
                <p className="aboutus-intro mb-5">
                    MediConnect is a digital healthcare platform designed to make
                    connecting with trusted doctors and hospitals easier, faster, and more
                    convenient than ever before.
                </p>
                <div className="row g-4 justify-content-center">
                    <div className="col-md-4">
                        <div className="aboutus-card shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/3176/3176363.png" alt="Our Mission"/>
                        <h5>Our Mission</h5>
                        <p>
                            To connect patients with top-tier healthcare providers and
                            simplify every step of the medical journey.
                        </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="aboutus-card shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/9018/9018183.png" alt="Our Vision"/>
                        <h5>Our Vision</h5>
                        <p>
                            To build a smarter, more accessible healthcare system powered by
                            technology and compassion.
                        </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="aboutus-card shadow-sm">
                            <img src="https://cdn-icons-png.flaticon.com/512/4149/4149678.png" alt="Our Values"/>
                            <h5>Our Values</h5>
                            <p>
                                Integrity, care, and innovation — the foundation of every
                                connection we make between patients and providers.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="aboutus-bottom mt-5">
                    <h4>Empowering healthcare through connection</h4>
                    <p>
                        At MediConnect, we believe access to quality care should be simple,
                        transparent, and human-centered — because your health deserves the
                        best.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
