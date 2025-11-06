import React from "react";
import "./Page.css";

function Contacts() {
    return (
        <div className="contacts-page">
            <div className="container text-center">
                <h1 className="contacts-title text-primary fw-bold mb-4">Contact MediConnect</h1>
                <p className="contacts-subtitle mb-5">
                    We're here to support you! Reach out to us for inquiries, appointments,
                    or feedback.
                </p>
                <div className="row justify-content-center g-4">
                    <div className="col-md-4">
                        <div className="contact-card shadow-sm">
                            <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email"/>
                            <h5>Email Us</h5>
                            <p>
                                <strong>info@MediConnect.health</strong> <br />We'll reply within 24 hours.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="contact-card shadow-sm">
                            <img src="https://cdn-icons-png.flaticon.com/512/597/597177.png" alt="Phone"/>
                            <h5>Call Us</h5>
                            <p>
                                +1 (555) 123-4567 <br />
                                Mon - Sun: 7:30 AM - 5:00 PM
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="contact-card shadow-sm">
                            <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" alt="Address"/>
                            <h5>Visit Us</h5>
                            <p>
                                000 Nguyen Van Linh Street, <br />
                                District 7, Ho Chi Minh City, Viet Nam
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    <h4>Follow Us</h4>
                    <div className="social-icons mt-3">
                        <a href="#" className="social-link">
                        🌐 Facebook
                        </a>
                        <a href="#" className="social-link">
                        🕊️ Twitter
                        </a>
                        <a href="#" className="social-link">
                        📸 Instagram
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contacts;
