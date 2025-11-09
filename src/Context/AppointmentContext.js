import React, { createContext, useState, useEffect, useContext } from "react";
import NotificationContext from "./NotificationContext";
import AuthContext from "./Context";

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  // Lấy hàm push notification nếu có Provider bao ngoài
  const notificationCtx = useContext(NotificationContext);
  const addNotif = notificationCtx?.addNotification;
  const { user } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);

  // ---------- Helpers ----------
  const getAllAppointmentKeys = () =>
    Object.keys(localStorage).filter((k) => k.startsWith("appointments_"));

  const loadAllAppointments = () => {
    let all = [];
    getAllAppointmentKeys().forEach((key) => {
      try {
        const arr = JSON.parse(localStorage.getItem(key) || "[]");
        all = all.concat(arr);
      } catch {
        /* noop */
      }
    });
    return all;
  };

  const loadPatientAppointments = (email) => {
    try {
      return JSON.parse(localStorage.getItem(`appointments_${email}`) || "[]");
    } catch {
      return [];
    }
  };

  const reloadForRole = () => {
    if (!user?.email) return;
    if (user.role === "admin" || user.role === "doctor") {
      setAppointments(loadAllAppointments());
    } else {
      setAppointments(loadPatientAppointments(user.email));
    }
  };

  const broadcastSync = () => {
    try {
      // Cho components trong cùng tab
      window.dispatchEvent(new CustomEvent("appointments_updated"));
      // Cho các tab khác
      window.dispatchEvent(new Event("storage"));
      // Nhiều nơi đang lắng key này để refresh nhanh
      localStorage.setItem("appointment_version", Date.now().toString());
    } catch {
      /* noop */
    }
  };

  // Kiểm tra xem notification booking cho appt này đã tồn tại chưa
  const bookingNotifExists = (doctorId, appointmentId) => {
    try {
      const list = JSON.parse(localStorage.getItem("notifications") || "[]");
      return list.some(
        (n) =>
          n &&
          n.type === "booking" &&
          n.doctorId === doctorId &&
          n.appointmentId === appointmentId
      );
    } catch {
      return false;
    }
  };

  // ---------- Load lần đầu theo user ----------
  useEffect(() => {
    reloadForRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ---------- Patient tự lưu kho riêng mỗi khi state đổi ----------
  useEffect(() => {
    if (!user?.email) return;
    if (user.role === "patient") {
      localStorage.setItem(
        `appointments_${user.email}`,
        JSON.stringify(appointments)
      );
    }
  }, [appointments, user]);

  // ---------- Lắng nghe realtime (storage + custom) ----------
  useEffect(() => {
    if (!user?.email) return;

    const onStorage = (e) => {
      if (user.role === "patient") {
        if (
          !e ||
          !e.key ||
          e.key === `appointments_${user.email}` ||
          e.key.startsWith("appointments_")
        ) {
          setAppointments(loadPatientAppointments(user.email));
        }
        return;
      }
      if (user.role === "doctor" || user.role === "admin") {
        if (!e || (e.key && e.key.startsWith("appointments_"))) {
          setAppointments(loadAllAppointments());
        }
      }
    };

    const onCustom = () => {
      reloadForRole();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("appointments_updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("appointments_updated", onCustom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ---------- API: Thêm lịch hẹn ----------
  const addAppointment = (appointment) => {
    if (!appointment?.patientEmail) {
      console.error("Missing patientEmail in appointment payload");
      return;
    }

    const targetKey = `appointments_${appointment.patientEmail}`;
    const stored = JSON.parse(localStorage.getItem(targetKey) || "[]");

    // Chặn trùng slot (cùng bác sĩ + ngày + giờ) trong kho của bệnh nhân đó
    const isDuplicate = stored.some(
      (a) =>
        a.doctorId === appointment.doctorId &&
        a.date === appointment.date &&
        a.time === appointment.time
    );
    if (isDuplicate) {
      alert("⚠️ This time slot is already booked!");
      return;
    }

    // Giữ id nếu có (từ trang confirm), nếu chưa thì tạo mới
    const ensureId =
      appointment.id ||
      (window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

    const newAppt = {
      ...appointment,
      id: ensureId,
      slot_id: appointment.slot_id, // giữ slot id để hủy/mở lại
      status: appointment.status || "Haven't examined yet",
      createdAt: appointment.createdAt || new Date().toISOString(),
    };

    const updatedList = [...stored, newAppt];
    localStorage.setItem(targetKey, JSON.stringify(updatedList));

    // Nếu patient hiện tại là chủ nhân lịch → cập nhật UI ngay
    if (user?.role === "patient" && user.email === appointment.patientEmail) {
      setAppointments(updatedList);
    } else if (user?.role === "doctor" || user?.role === "admin") {
      // Bác sĩ/admin đang mở màn tổng hợp → cập nhật ngay cho mượt
      setAppointments(loadAllAppointments());
    }

    // Gửi notification booking cho bác sĩ (chống trùng)
    try {
      if (
        typeof addNotif === "function" &&
        !bookingNotifExists(newAppt.doctorId, newAppt.id)
      ) {
        addNotif({
          doctorId: newAppt.doctorId,
          type: "booking",
          message: `📅 New appointment by ${newAppt.patientName} at ${newAppt.time} on ${newAppt.date}.`,
          appointmentId: newAppt.id,
          appointmentDate: newAppt.date,
          appointmentTime: newAppt.time,
        });
      }
    } catch (error) {
      console.error("Notification failed:", error);
    }

    broadcastSync();
  };

  // ---------- API: Cập nhật trạng thái ----------
  const updateAppointmentStatus = (id, newStatus) => {
    if (!id) return;

    // Doctor/Admin: cập nhật toàn bộ kho appointments_*
    if (user?.role === "admin" || user?.role === "doctor") {
      const keys = getAllAppointmentKeys();
      let merged = [];
      keys.forEach((key) => {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = data.map((a) =>
          a.id === id ? { ...a, status: newStatus } : a
        );
        localStorage.setItem(key, JSON.stringify(updated));
        merged = merged.concat(updated);
      });
      setAppointments(merged);
      broadcastSync();
      return;
    }

    // Patient: chỉ kho của chính họ
    if (user?.role === "patient" && user.email) {
      const key = `appointments_${user.email}`;
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = data.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a
      );
      localStorage.setItem(key, JSON.stringify(updated));
      setAppointments(updated);
      broadcastSync();
    }
  };

  // ---------- API: Xóa lịch hẹn (admin) ----------
  const removeAppointment = (id) => {
    if (user?.role !== "admin") {
      alert("Only admin can remove appointments!");
      return;
    }
    const keys = getAllAppointmentKeys();
    keys.forEach((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = data.filter((a) => a.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
    });
    broadcastSync();
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        setAppointments,
        addAppointment,
        updateAppointmentStatus,
        removeAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentContext;
