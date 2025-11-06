import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Page.css";

export default function PatientProfile() {
    const initialProfile = {
        fullName: "",
        birthDate: "",
        phone: "",
        address: "",
        avatar: null,
    };
    const navigate = useNavigate();
    const [profile, setProfile] = useState(initialProfile);
    const [preview, setPreview] = useState(null);
    const [fadeClass, setFadeClass] = useState("fade-in");

    // Cập nhật khi người dùng nhập text
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };
    // Cập nhật khi chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setProfile({ ...profile, avatar: file });
        setPreview(URL.createObjectURL(file));
        }
    };
    // Khi bấm "Lưu thay đổi"
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User information:", profile);
        alert("The profile has been saved!");
    };
    const handleCancel = () => {
        setProfile(initialProfile);
        setPreview(null);
        navigate("/")
    };
    return (
        <div className={`patient-profile-page ${fadeClass}`}>
            <div className="container mt-4">
                <Card className="p-4 shadow-sm">
                    <h3 className="text-center mb-4">Patient profile</h3>
                    <Form onSubmit={handleSubmit} className="text-start">
                        <div className="text-center mb-4">
                            <img src={preview || "https://via.placeholder.com/120?text=Avatar"} alt="Avatar" className="rounded-circle mb-3" width="120" height="120" style={{ objectFit: "cover" }}/>
                            <Form.Group controlId="formFile" className="mb-4 text-start">
                                <Form.Label>Download profile picture</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="text-start" style={{ cursor: "pointer" }}/>
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Full name</Form.Label>
                            <Form.Control type="text" name="fullName" placeholder="Enter first and last name" value={profile.fullName} onChange={handleChange} required/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of birth</Form.Label>
                            <Form.Control type="date" name="birthDate" value={profile.birthDate} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control type="text" name="phone" placeholder="Enter phone number" value={profile.phone} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="address" placeholder="Enter the address" value={profile.address} onChange={handleChange}/>
                        </Form.Group>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <Button variant="primary" type="submit">Save changes</Button>
                            <Button variant="secondary" type="button" onClick={handleCancel}>Cancel</Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
