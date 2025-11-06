import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown, Modal, Form, Alert} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../Context/Context";
import mockData from "../data/mockData.json";
import "../Styles/Header.css";

export default function Header() {
  const { user, role, logout, login, register } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "patient",
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const doctorsData = mockData.doctors;
  const patients = mockData.patients;
  
  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { email, password, role } = loginForm;

    // === ADMIN LOGIN ===
    if (role === "admin") {
      const foundAdmin = mockData.users.find(
        (u) =>
          u.role === "admin" &&
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (foundAdmin) {
        login(foundAdmin, "admin");
        setShowLogin(false);
        navigate("/admin");
      } else {
        setError("Incorrect admin credentials.");
      }
      return;
    }

    // === DOCTOR LOGIN ===
    if (role === "doctor") {
      const foundDoctor = doctorsData.find(
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
      setShowLogin(false);
      navigate("/doctor/dashboard");
      return;
    }

    // === PATIENT LOGIN ===
    if (role === "patient") {
      const foundPatient = patients.find(
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
        fullName:
          foundPatient.fullName ||
          `${foundPatient.firstName} ${foundPatient.lastName}`,
        email: foundPatient.email,
        phone: foundPatient.phone,
        gender: foundPatient.gender,
        dob: foundPatient.dob,
        role: "patient",
      };

      login(patientData, "patient");
      setShowLogin(false);
      navigate("/");
      return;
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(registerForm);
      setShowRegister(false);
      setError("");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <>
      {/* HEADER NAVBAR */}
      <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-primary fw-bold fs-4">
            MediConnect
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="text-primary fw-medium">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/doctors" className="text-primary fw-medium">
                Doctors
              </Nav.Link>
              <Nav.Link as={Link} to="/articles" className="text-primary fw-medium">
                News
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-primary fw-medium">
                Contact
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="text-primary fw-medium">
                About us
              </Nav.Link>
            </Nav>
            <Nav>
              {user ? (
                <>
                  <span className="me-3 fw-semibold text-primary">
                    Hello,&nbsp;
                    {user.fullName ||
                      user.firstName ||
                      user.name ||
                      user.email}
                  </span>
                  <NavDropdown title="Account" id="user-dropdown" align="end">
                    {role === "admin" && (
                      <>
                        <NavDropdown.Item as={Link} to="/admin">
                          Admin page
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/users">
                          User management
                        </NavDropdown.Item>
                      </>
                    )}
                    {role === "doctor" && (
                      <>
                        <NavDropdown.Item as={Link} to="/doctor/profile">
                          Doctor profile
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/doctor/appointments">
                          Examination schedule
                        </NavDropdown.Item>
                      </>
                    )}
                    {role === "patient" && (
                      <>
                        <NavDropdown.Item as={Link} to="/patient/profile">
                          Patient profile
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/patient/appointments">
                          My appointment schedule
                        </NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={logout}
                      className="text-danger"
                    >
                      Log out
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-primary"
                    className="ms-3"
                    onClick={() => setShowLogin(true)}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    className="ms-2"
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* LOGIN MODAL */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Login</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleLoginSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={loginForm.role}
                onChange={handleLoginChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogin(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* REGISTER MODAL */}
      <Modal show={showRegister} onHide={() => setShowRegister(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Register</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRegisterSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                value={registerForm.firstName}
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                value={registerForm.lastName}
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRegister(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
