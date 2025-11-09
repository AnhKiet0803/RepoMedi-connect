import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import mockData from "../data/mockData.json";
import AuthContext from "../Context/Context";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Page.css";

function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const doctorsData = mockData.doctors;
  const doctor = doctorsData.find((doc) => doc.id === parseInt(id, 10));

  // Tạo ngày hôm nay
  const today = new Date();

  // State cho ngày và giờ
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState(null);

  // Danh sách khung giờ
  const scheduleTimes = [
    "07:30 - 08:00",
    "08:00 - 08:30",
    "08:30 - 09:00",
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
    "16:00 - 16:30",
  ];

  // --- Hàm lấy toàn bộ lịch hẹn của tất cả bệnh nhân ---
  const getAllAppointments = () => {
    let allAppointments = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("appointments_")) {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        allAppointments = [...allAppointments, ...data];
      }
    });
    return allAppointments;
  };

  // --- Theo dõi thay đổi realtime từ localStorage ---
  const [slotCounts, setSlotCounts] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const calculateSlotCounts = () => {
      const allAppointments = getAllAppointments();
      const newCounts = {};
      scheduleTimes.forEach((time) => {
        const count = allAppointments.filter(
          (a) =>
            a.doctorId === doctor?.id &&
            a.date === selectedDate &&
            a.time === time &&
            a.status !== "Canceled" // ✅ bỏ qua lịch đã hủy
        ).length;
        newCounts[time] = count;
      });
      setSlotCounts(newCounts);
    };

    // Gọi lần đầu
    calculateSlotCounts();

    // Lắng nghe event cập nhật
    const onStorage = (e) => {
      if (e.key === "appointment_version") {
        setRefreshTrigger(Date.now());
      }
    };
    const onAppointmentsUpdated = () => setRefreshTrigger(Date.now());

    window.addEventListener("storage", onStorage);
    window.addEventListener("appointments_updated", onAppointmentsUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("appointments_updated", onAppointmentsUpdated);
    };
  }, [doctor?.id, selectedDate]); // dependency gọn và ổn định hơn

  useEffect(() => {
    const allAppointments = getAllAppointments();
    const newCounts = {};
    scheduleTimes.forEach((time) => {
      const count = allAppointments.filter(
        (a) =>
          a.doctorId === doctor?.id &&
          a.date === selectedDate &&
          a.time === time &&
          a.status !== "Canceled" // ✅ bỏ qua lịch đã hủy
      ).length;
      newCounts[time] = count;
    });
    setSlotCounts(newCounts);
  }, [refreshTrigger, selectedDate, doctor?.id]);

  // --- Nếu không tìm thấy bác sĩ ---
  if (!doctor) {
    return (
      <div className="container my-5 text-center">
        <h3>Doctor not found.</h3>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // --- Xác nhận lịch hẹn ---
  const handleConfirmAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert("⚠️ Please select both date and time before confirming.");
      return;
    }

    if (!user) {
      alert("⚠️ Please log in to book an appointment.");
      navigate("/login", { state: { from: `/doctor/${id}` } });
      return;
    }

    // 🔹 Kiểm tra trùng khung giờ (chỉ tính lịch CHƯA hủy)
    const allAppointments = getAllAppointments();
    const slotCount = allAppointments.filter(
      (a) =>
        a.doctorId === doctor.id &&
        a.date === selectedDate &&
        a.time === selectedTime &&
        a.status !== "Canceled"
    ).length;

    if (slotCount >= 1) {
      alert("⚠️ This time slot is already booked by another patient!");
      setSelectedTime(null);
      return;
    }

    // 🔹 Không thêm lịch ở đây nữa (tránh trùng), chuyển sang trang confirm để thanh toán & tạo lịch
    navigate("/confirm-appointment", {
      state: { doctor, selectedDate, selectedTime },
    });
  };

  return (
    <div className="doctor-detail-page fade-in">
      <div className="container my-5">
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="card shadow-sm p-4">
          <div className="row align-items-center">
            <div className="col-md-3 text-center">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="img-fluid rounded"
                style={{ maxHeight: "220px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-9">
              <h3 className="fw-bold text-primary">{doctor.name}</h3>
              <p className="mb-1">{doctor.specialty}</p>
              <p className="text-muted">{doctor.hospital}</p>
              <p>
                <strong>Clinical Experience:</strong> Over 15 years of
                professional medical practice.
              </p>
              <p>
                <strong>Location:</strong> Ho Chi Minh City, Vietnam
              </p>
            </div>
          </div>

          <hr />

          {/* --- Chọn ngày khám --- */}
          <h5 className="fw-bold mt-3 mb-2 text-center">Select Appointment Date</h5>
          <div className="mb-4 d-flex justify-content-center">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span className="input-group-text bg-primary text-white">📅</span>
              <DatePicker
                selected={new Date(selectedDate)}
                onChange={(date) => {
                  const formatted = date.toISOString().split("T")[0];
                  setSelectedDate(formatted);
                  setSelectedTime(null);
                }}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                maxDate={new Date(
                  new Date().setDate(new Date().getDate() + 30)
                )}
                className="form-control text-center"
                placeholderText="Choose appointment date"
              />
            </div>
          </div>
          <small className="text-muted d-block text-center">
            You can book an appointment up to 30 days in advance.
          </small>

          {/* --- Chọn khung giờ --- */}
          <h5 className="fw-bold mt-3 mb-2">Select Time Slot</h5>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {scheduleTimes.map((time, index) => {
              const count = slotCounts[time] || 0;
              const isFull = count >= 1;
              return (
                <button
                  key={index}
                  className={`btn ${
                    isFull
                      ? "btn-secondary opacity-75"
                      : selectedTime === time
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => !isFull && setSelectedTime(time)}
                  disabled={isFull}
                  style={{ cursor: isFull ? "not-allowed" : "pointer" }}
                >
                  {time} {isFull ? "❌" : ""}
                </button>
              );
            })}
          </div>

          {/* --- Thông tin tóm tắt --- */}
          <div className="border-top pt-3">
            <p>
              <strong>Selected Date:</strong> {selectedDate}
            </p>
            <p>
              <strong>Selected Time:</strong> {selectedTime || "No time selected"}
            </p>
            <p>
              <strong>Clinic Address:</strong> {doctor.hospital}
            </p>
            <p>
              <strong>Consultation Fee:</strong> 100$
            </p>
            <button
              className="btn btn-success"
              disabled={!selectedDate || !selectedTime}
              onClick={handleConfirmAppointment}
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetailPage;
