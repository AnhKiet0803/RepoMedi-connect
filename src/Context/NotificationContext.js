import { createContext, useEffect, useState } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem("notifications");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to parse notifications", err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "notifications") {
        const updated = e.newValue ? JSON.parse(e.newValue) : [];
        setNotifications(updated);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addNotification = (notification) => {
    const withId = {
      id: Date.now(),
      read: false,
      // thêm timestamp để hiển thị/sắp xếp
      date: new Date().toISOString(),
      ...notification,
    };
    setNotifications((prev) => [withId, ...prev]);
    // kích hoạt các view khác trong cùng tab nếu cần
    try {
      window.dispatchEvent(new CustomEvent("notifications_updated"));
    } catch {}
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getDoctorNotifications = (doctorId) => {
    return notifications
      .filter((n) => n.doctorId === doctorId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, getDoctorNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
