import React from 'react';
import './Component.css';
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <FooterSection title="MediConnect">
                    <p>Your trusted partner in advanced medical care.</p>
                </FooterSection>
                <FooterSection title="About MediConnect">
                    <ul className="footer-links">
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/why-us">Why Choose Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </FooterSection>
                <FooterSection title="Customer Support">
                    <ul className="footer-links">
                        <li><Link to="/articles">About health</Link></li>
                        <li><Link to="/doctorintro">About our medical team</Link></li>
                        <li><Link to="/advicepage">You need advice</Link></li>
                    </ul>
                </FooterSection>
                <FooterSection title="Contact Info">
                    <p>📧 info@MediConnect.health</p>
                    <p>📱 +1 (555) 123-4567</p>
                    <p>📍 000 Nguyen Van Linh Street, District 7, Ho Chi Minh City, Viet Nam</p>
                </FooterSection>
            </div>
            <div className="copyright">
                <p> &copy;2025 Copyright of MediConnect - Do not copy in any form</p>
            </div>
        </footer>
    );
};

// Component con: FooterSection
const FooterSection = ({ title, children }) => (
  <div className="footer-section">
    <h3>{title}</h3>
    {children}
  </div>
);

export default Footer;
