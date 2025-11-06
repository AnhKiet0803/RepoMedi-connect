import { useState, useContext } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../Context/Context";
import { useLocation } from "react-router-dom";
import mockData from "../data/mockData.json";
import "./Page.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // === ADMIN LOGIN ===
    if (role === "admin") {
      const foundAdmin = mockData.users.find(
        (doc) =>
          doc.role === "admin" &&
          doc.email.toLowerCase() === email.trim().toLowerCase() &&
          doc.password === password
      );

      if (foundAdmin) {
        login(foundAdmin, "admin");
        navigate("/admin");
      } else {
        setError("Incorrect admin credentials.");
      }
      return;
    }


    // === DOCTOR LOGIN ===
    if (role === "doctor") {
      const foundDoctor = mockData.users.find(
        (doc) =>
          doc.email.toLowerCase() === email.trim().toLowerCase() &&
          doc.password === password
      );

      if (!foundDoctor) {
        setError("Incorrect doctor email or password.");
        return;
      }

      const doctorData = {
        id: foundDoctor.id,
        doctorId: foundDoctor.id,
        fullName: foundDoctor.name,
        email: foundDoctor.email,
        specialty: foundDoctor.specialty,
        hospital: foundDoctor.hospital,
        degree: foundDoctor.degree,
        gender: foundDoctor.gender,
        image: foundDoctor.image,
        role: "doctor",
      };

      login(doctorData, "doctor");
      navigate("/doctor/dashboard");
      return;
    }

    // === PATIENT LOGIN ===
    if (role === "patient") {
      const foundPatient = mockData.patients.find(
        (p) =>
          p.email.toLowerCase() === email.trim().toLowerCase() &&
          p.password === password
      );

      if (!foundPatient) {
        setError("Incorrect patient email or password.");
        return;
      }

      const patientData = {
        id: foundPatient.id,
        firstName: foundPatient.firstName,
        lastName: foundPatient.lastName,
        fullName: foundPatient.fullName || `${foundPatient.firstName} ${foundPatient.lastName}`,
        email: foundPatient.email,
        phone: foundPatient.phone,
        gender: foundPatient.gender,
        dob: foundPatient.dob,
        role: "patient",
      };

      login(patientData, "patient");
      navigate(redirectPath);
      return;
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "450px" }}>
      <Card className="p-4 shadow text-start login-card">
        <h3 className="text-center mb-4 text-primary fade-in">Login</h3>

        <Form onSubmit={handleSubmit}>
          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Role Select */}
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </Form.Select>
          </Form.Group>

          {/* Error Message */}
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          {/* Buttons */}
          <div className="d-grid gap-2">
            <Button type="submit" variant="primary">
              Login
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </Form>

        {/* Register Link */}
        <div className="text-center mt-3">
          <small>
            Don&apos;t have an account yet?{" "}
            <Link to="/register" className="text-primary">
              Register now
            </Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}
