import React from "react";
import './Page.css';

function WhyUs() {
    return (
        <div className="whyus-page">
            <div className="container text-center">
                <h1 className="whyus-title text-primary fw-bold mb-4">
                    Why Choose MediConnect?
                </h1>
                <p className="whyus-subtitle mb-5">
                    MediConnect is a smart platform that helps you find and book top doctors 
                    and hospitals — anytime, anywhere.
                </p>
                <div className="row g-4 justify-content-center">
                    <div className="col-md-4">
                        <div className="whyus-card shadow-sm">
                            <img src="https://cdn-icons-png.flaticon.com/512/2920/2920235.png" alt="Professional Doctors"/>
                            <h5>Professional Doctors</h5>
                            <p>
                                Our doctors are highly qualified specialists with years of
                                experience, always dedicated to providing excellent care.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="whyus-card shadow-sm">
                            <img src="https://cdn-icons-png.flaticon.com/512/4320/4320368.png" alt="Smart Booking"/>
                            <h5>Smart Booking System</h5>
                            <p>
                                Easily schedule, manage, or cancel your appointments online with
                                just a few clicks — anytime, anywhere.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="whyus-card shadow-sm">
                            <img src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png" alt="Trusted Hospitals"/>
                            <h5>Trusted Hospitals</h5>
                            <p>
                                We collaborate only with reputable hospitals and clinics to
                                ensure safety, transparency, and top service quality.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="whyus-bottom mt-5">
                    <h4>Your health, our mission</h4>
                    <p>
                        At MediConnect, we believe that technology can bridge the gap between
                        patients and healthcare providers — making care faster, safer, and
                        more accessible for everyone.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WhyUs;
