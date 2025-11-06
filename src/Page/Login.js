// src/Page/Login.js
import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log('🔐 Login attempt:', { email, password });

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
      const patients = JSON.parse(localStorage.getItem('patients') || '[]');

      const allUsers = [
        ...users,
        ...doctors,
        ...patients
      ].map(u => ({
        ...u,
        role: u.role || 'patient'  // fallback role nếu thiếu
      }));

      console.log('📊 Available accounts:', allUsers.map(u => ({ email: u.email, role: u.role })));

      const user = allUsers.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        console.error('❌ Login failed: user not found or wrong credentials');
        setError('Invalid email or password');
        return;
      }

      console.log('✅ Login successful:', user);
      // lưu trạng thái đăng nhập
      localStorage.setItem("currentUser", JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('❌ Login error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "450px" }}>
      <Card className="p-4 shadow text-start">
        <h3 className="text-center mb-4 text-primary">Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary">Login</Button>
            <Button variant="secondary" onClick={() => navigate("/")}>Cancel</Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <small>
            Don't have an account yet?{" "}
            <Link to="/register" className="text-primary">Register now</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}
