import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentContext from "../Context/AppointmentContext";
import AuthContext from "../Context/Context";
import "./Page.css";

export default function ConfirmAppointmentPage() {
  const navigate = useNavigate();
  const [fadeClass, setFadeClass] = useState("fade-in");
  const location = useLocation();
  const { doctor, selectedDate, selectedTime } = location.state || {};
  const { user } = useContext(AuthContext);
  const { addAppointment } = useContext(AppointmentContext);

  const isLoggedIn = !!user;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    receiptEmail: "",
    cardNumber: "",
    cardExpiry: "",
  });

  const [errors, setErrors] = useState({});
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Prefill if logged in
  useEffect(() => {
    if (user) {
      let day = "", month = "", year = "";
      if (user.dob) {
        const d = new Date(user.dob);
        day = d.getDate().toString();
        month = (d.getMonth() + 1).toString();
        year = d.getFullYear().toString();
      }
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        confirmEmail: user.email || prev.confirmEmail,
        phone: user.phone || prev.phone,
        gender: user.gender || prev.gender,
        day,
        month,
        year,
      }));
    }
  }, [user]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const m = parseInt(form.month, 10);
    const y = parseInt(form.year, 10);
    if (m && y) {
      const days = new Date(y, m, 0).getDate();
      const arr = Array.from({ length: days }, (_, i) => i + 1);
      setDaysInMonth(arr);
      if (form.day && parseInt(form.day, 10) > days) {
        setForm((prev) => ({ ...prev, day: "" }));
      }
    } else {
      setDaysInMonth([]);
    }
  }, [form.month, form.year, form.day]);

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    setForm((prev) => ({ ...prev, cardExpiry: value.slice(0, 5) }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!isLoggedIn) {
      if (!form.firstName || form.firstName.trim().length < 2)
        e.firstName = "Please enter at least 2 characters.";
      if (!form.lastName || form.lastName.trim().length < 2)
        e.lastName = "Please enter at least 2 characters.";
      if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
        e.email = "Please enter a valid email.";
      if (form.email !== form.confirmEmail)
        e.confirmEmail = "Emails do not match.";
    }
    if (!/^[0-9]{9,15}$/.test(form.phone))
        e.phone = "Please enter a valid phone number.";
    // if (!form.phone || form.phone.trim().length < 9)
    //   e.phone = "Please enter a valid phone number.";
    if (!(form.day && form.month && form.year))
      e.dob = "Please select your full date of birth.";
    if (!form.gender)
      e.gender = "Please select gender.";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.cardNumber || form.cardNumber.replace(/\s+/g, "").length < 8)
      e.cardNumber = "Invalid card number.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry))
      e.cardExpiry = "Enter expiry in MM/YY format.";
    if (form.receiptEmail && !/^\S+@\S+\.\S+$/.test(form.receiptEmail))
      e.receiptEmail = "Please enter a valid receipt email.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleNext = () => {
    const stepErrors = validateStep1();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    const validation = validateStep2();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsProcessing(true);
    setErrors({});
    try {
      await new Promise((res) => setTimeout(res, 1500));

      const doctorIdValue =
        doctor?.id || doctor?.doctorId || doctor?.email || doctor?.name;

      // Tạo lịch hẹn mới (thực sự tạo sau khi thanh toán)
      const appt = {
        id: Date.now(), // có thể bỏ, AppointmentContext sẽ tự tạo nếu thiếu
        doctorId: doctorIdValue,
        doctor: doctor?.name,
        specialty: doctor?.specialty,
        hospital: doctor?.hospital,
        date: selectedDate,
        time: selectedTime,
        slot_id: `${doctorIdValue}_${selectedDate}_${selectedTime.split(" - ")[0]}`,
        status: "Haven't examined yet",
        patientName: `${form.firstName} ${form.lastName}`.trim(),
        patientEmail: form.email.trim(),
        userId: user?.id || null,
        reason: form.reason || "General Checkup",
      };

      // Lưu lịch hẹn qua Context
      addAppointment(appt);

      // Đánh dấu slot đã được dùng
      try {
        const storedSlots =
          JSON.parse(localStorage.getItem("appointment_slots")) || [];
        const updatedSlots = storedSlots.map((slot) =>
          `${slot.doctor_id}_${slot.slot_date}_${slot.start_time}` === appt.slot_id
            ? { ...slot, is_available: false }
            : slot
        );
        localStorage.setItem("appointment_slots", JSON.stringify(updatedSlots));
      } catch (err) {
        console.error("❌ Failed to update slot:", err);
      }

      // Thông báo thay đổi để màn bác sĩ reload slot
      localStorage.setItem("appointment_version", Date.now().toString());
      window.dispatchEvent(new CustomEvent("appointments_updated"));
      window.dispatchEvent(new Event("storage"));

      // Thành công
      setIsPaid(true);
    } catch {
      setErrors({ submit: "Payment failed. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!doctor) {
    return (
      <div className="container my-5 text-center">
        <h4>No appointment details found.</h4>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className={`confirm-appointment-page ${fadeClass}`}>
      <div className="container my-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: 760 }}>
          <h3 className="text-center text-primary mb-4">Confirm Appointment</h3>

          {/* Progress bar */}
          <div className="progress mb-4" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-success"
              style={{ width: currentStep === 1 ? "50%" : "100%" }}
            ></div>
          </div>

          {/* Appointment Summary */}
          <div className="mb-4">
            <p><strong>Doctor:</strong> {doctor.name}</p>
            <p><strong>Specialty:</strong> {doctor.specialty}</p>
            <p><strong>Hospital:</strong> {doctor.hospital}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Consultation Fee:</strong> 100$</p>
          </div>

          {!isPaid ? (
            <form onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h5 className="text-center text-secondary mb-3">
                      Step 1: Patient Information
                    </h5>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>First Name</label>
                        <input
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Last Name</label>
                        <input
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label>Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <label>Confirm Email</label>
                      <input
                        name="confirmEmail"
                        type="email"
                        value={form.confirmEmail}
                        onChange={handleChange}
                        className={`form-control ${errors.confirmEmail ? "is-invalid" : ""}`}
                      />
                      {errors.confirmEmail && <div className="invalid-feedback">{errors.confirmEmail}</div>}
                    </div>

                    <div className="mb-3">
                      <label>Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <div className="mb-3">
                      <label>Date of Birth</label>
                      <div className="d-flex gap-2">
                        <select
                          name="day"
                          value={form.day}
                          onChange={handleChange}
                          className={`form-select ${errors.dob ? "is-invalid" : ""}`}
                          style={{ width: 100 }}
                        >
                          <option value="">Day</option>
                          {daysInMonth.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <select
                          name="month"
                          value={form.month}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Month</option>
                          {months.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                          ))}
                        </select>
                        <select
                          name="year"
                          value={form.year}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      {errors.dob && <div className="text-danger small mt-1">{errors.dob}</div>}
                    </div>

                    <div className="text-center mb-3">
                      <label className="me-2">Gender:</label>
                      <div className="form-check form-check-inline">
                        <input
                          id="male"
                          name="gender"
                          type="radio"
                          value="male"
                          checked={form.gender === "male"}
                          onChange={handleChange}
                          className="form-check-input"
                        />
                        <label htmlFor="male" className="form-check-label">Male</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          id="female"
                          name="gender"
                          type="radio"
                          value="female"
                          checked={form.gender === "female"}
                          onChange={handleChange}
                          className="form-check-input"
                        />
                        <label htmlFor="female" className="form-check-label">Female</label>
                      </div>
                      {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
                    </div>

                    <div className="text-end">
                      <button type="button" className="btn btn-primary" onClick={handleNext}>
                        Next →
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h5 className="text-center text-secondary mb-3">Step 2: Payment Details</h5>

                    <div className="mb-3">
                      <label>Email for Receipt</label>
                      <input
                        name="receiptEmail"
                        type="email"
                        value={form.receiptEmail}
                        onChange={handleChange}
                        className={`form-control ${errors.receiptEmail ? "is-invalid" : ""}`}
                      />
                      {errors.receiptEmail && <div className="invalid-feedback">{errors.receiptEmail}</div>}
                    </div>

                    <div className="mb-3">
                      <label>Card Info</label>
                      <div className="d-flex gap-2">
                        <input
                          name="cardNumber"
                          placeholder="Card number"
                          value={form.cardNumber}
                          onChange={handleChange}
                          className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`}
                        />
                        <input
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={form.cardExpiry}
                          onChange={handleExpiryChange}
                          className={`form-control ${errors.cardExpiry ? "is-invalid" : ""}`}
                          style={{ width: 100 }}
                        />
                      </div>
                      {errors.cardNumber && <div className="invalid-feedback d-block">{errors.cardNumber}</div>}
                      {errors.cardExpiry && <div className="invalid-feedback d-block">{errors.cardExpiry}</div>}
                    </div>

                    {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

                    <div className="d-flex justify-content-between mt-3">
                      <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
                        ← Back
                      </button>
                      <button type="submit" className="btn btn-success" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" /> Processing...
                          </>
                        ) : (
                          "Make Payment 100$"
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          ) : (
            <div className="text-center">
              <div className="alert alert-success">
                <h5>Appointment successfully booked!</h5>
              </div>
              <p>
                Thank you — a receipt has been sent
                {form.receiptEmail ? ` to ${form.receiptEmail}` : ""}.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setFadeClass("fade-out");
                    setTimeout(() => navigate("/"), 400);
                  }}
                >
                  Back to Home
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => window.print()}
                >
                  Print
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
