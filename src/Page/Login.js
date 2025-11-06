import React, { useState, useContext } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../Context/Context";
import mockData from "../data/mockData.json";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Lấy danh sách user, doctor, patient từ mockData
      const users = mockData.users || [];
      const doctors = mockData.doctors || [];
      const patients = mockData.patients || [];

      // ✅ Gom tất cả user vào chung 1 mảng
      const allUsers = [...users, ...doctors, ...patients].map((u) => ({
        ...u,
        role:
          u.role || (u.specialty ? "doctor" : "patient"), // doctor có specialty thì role = doctor
        name:
          u.name || u.fullName || `${u.firstName || ""} ${u.lastName || ""}`,
      }));

      console.log(
        "📊 Available accounts:",
        allUsers.map((u) => ({ email: u.email, role: u.role }))
      );

      // ✅ Kiểm tra tài khoản hợp lệ
      const foundUser = allUsers.find(
        (u) =>
          u.email?.toLowerCase() === email.toLowerCase().trim() &&
          u.password === password
      );

      if (!foundUser) {
        setError("❌ Invalid email or password");
        return;
      }

      console.log("✅ Login successful:", foundUser);

      // ✅ Lưu user vào context
      login(foundUser, foundUser.role);

      // ✅ Nếu user bị redirect khi đặt lịch → quay lại trang đó
      if (location.state?.from) {
        setTimeout(() => {
          navigate(location.state.from, { replace: true });
        }, 100);
        return;
      }

      // ✅ Điều hướng theo vai trò (có độ trễ 100ms để Context cập nhật)
      setTimeout(() => {
        switch (foundUser.role) {
          case "admin":
            navigate("/admin");
            break;
          case "doctor":
            navigate("/doctor/dashboard");
            break;
          case "patient":
          default:
            navigate("/");
            break;
        }
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

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

          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary">
              Login
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <small>
            Don't have an account yet?{" "}
            <Link to="/register" className="text-primary">
              Register now
            </Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}
