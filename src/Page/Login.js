import React, { useState, useContext, useEffect } from "react";
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
  const { login, user, role } = useContext(AuthContext);

  const getStoredCollection = (key) => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (storageError) {
      console.error(`Unable to parse ${key} from localStorage`, storageError);
    }
    return Array.isArray(mockData[key]) ? mockData[key] : [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      //  Gom tất cả user, doctor, patient lại (3 nhóm khác nhau)
      const users = getStoredCollection("users");
      const doctors = getStoredCollection("doctors");
      const patients = getStoredCollection("patients");

      //  Hợp nhất không trùng email
      const mergeUsers = (arr1, arr2, arr3) => {
        const map = new Map();
        [...arr1, ...arr2, ...arr3].forEach((u) => {
          const email = u.email?.toLowerCase();
          if (!map.has(email)) {
            map.set(email, {
              ...u,
              role: u.role || (u.specialty ? "doctor" : "patient"),
              name:
                u.name ||
                u.fullName ||
                `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            });
          }
        });
        return Array.from(map.values());
      };

      const allUsers = mergeUsers(users, doctors, patients);

      //  Tìm người dùng hợp lệ
      const foundUser = allUsers.find(
        (u) =>
          u.email?.toLowerCase() === email.toLowerCase().trim() &&
          u.password === password
      );

      if (!foundUser) {
        setError("❌ Invalid email or password");
        return;
      }

      //  Lưu vào Context
      login(foundUser, foundUser.role);
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    }
  };

  //  Điều hướng tự động khi Context cập nhật xong (fix lỗi navigate sớm)
  useEffect(() => {
    if (user && role) {
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
      } else {
        switch (role) {
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
      }
    }
  }, [user, role, navigate, location.state]);

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
