import "./App.css";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";
import { useEffect } from 'react';

//Pages & Components
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import HomePage from "./Page/HomePage";
import Login from "./Page/Login";
import Register from "./Page/Register";
import AllDoctorsPage from "./Page/AllDoctorsPage";
import DoctorDetailPage from "./Page/DoctorDetailPage";
import ConfirmAppointmentPage from "./Page/ConfirmAppointmentPage";
import MyAppointments from "./Page/MyAppointmentSchedule";
import PatientProfile from "./Page/PatientProfile";
import SpecialtySection from "./Components/SpecialtySection";
import SpecialtyDetailPage from "./Page/SpecialtyDetailPage";
import NewsPage from "./Page/NewsPage";
import NewsDetailPage from "./Page/NewsDetailPage";
import AboutUs from "./Page/AboutUs";
import Contacts from "./Page/Contacts";
import WhyUs from "./Page/WhyUs";
import DoctorsIntro from "./Page/DoctorIntro";
import AdvicePage from "./Page/AdvicePage";
import HomeExamination from "./Page/Services/HomeExamination";
import NutritionConsulting from "./Page/Services/NutritionConsulting";

//Doctor Pages
import DoctorDashboard from "./Page/Doctor/DoctorDashboard";
import DoctorProfile from "./Page/Doctor/DoctorProfile";
import DoctorAppointments from "./Page/Doctor/DoctorAppointment";
import DoctorNotifications from "./Page/Doctor/DoctorNotifications";

//Admin Pages
import AdminDashboard from './Components/AdminDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Page/admin/Dashboard';
import DoctorManager from './Page/admin/DoctorManager';
import PatientManager from './Page/admin/PatientManager';
import UserManager from './Page/admin/UserManager';
import ContentManager from './Page/admin/ContentManager';
import initMockData from './Page/utils/initMockData';

//Contexts
import { AuthProvider } from "./Context/Context";
import { AppointmentProvider } from "./Context/AppointmentContext";
import { NotificationProvider } from "./Context/NotificationContext";

function App() {
  useEffect(() => {
    initMockData();
  }, []);
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppointmentProvider>
          <div className="App d-flex flex-column min-vh-100">
            {/* Header*/}
            <Header />

            {/* Nội dung chính */}
            <main className="flex-grow-1">
              <ScrollToTop />
              <Routes>
                {/* Trang chính */}
                <Route path="/" element={<HomePage />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Trang admin */}
                <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
                  <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<Dashboard />} />
                    <Route path="doctores" element={<DoctorManager />} />
                    <Route path="patientes" element={<PatientManager />} />
                    <Route path="users" element={<UserManager />} />
                    <Route path="content" element={<ContentManager />} />
                  </Route>
                </Route>

                {/* Trang bác sĩ */}
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/profile" element={<DoctorProfile />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/notifications" element={<DoctorNotifications />} />

                {/* Danh sách bác sĩ & chi tiết */}
                <Route path="/doctors" element={<AllDoctorsPage />} />
                <Route path="/doctor/:id" element={<DoctorDetailPage />} />

                {/* Đặt lịch & bệnh nhân */}
                <Route path="/confirm-appointment" element={<ConfirmAppointmentPage />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
                <Route path="/patient/appointments" element={<MyAppointments />} />

                {/* Chuyên khoa */}
                <Route path="/specialties" element={<SpecialtySection />} />
                <Route path="/specialty/:id" element={<SpecialtyDetailPage />} />

                {/* Tin tức */}
                <Route path="/articles" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />

                {/* Giới thiệu & liên hệ */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contacts />} />
                <Route path="/why-us" element={<WhyUs />} />
                <Route path="/doctorintro" element={<DoctorsIntro />} />
                <Route path="/advicepage" element={<AdvicePage />} />

                {/* Dịch vụ */}
                <Route path="/service/1" element={<HomeExamination />} />
                <Route path="/service/2" element={<NutritionConsulting />} />

                {/* 404 fallback */}
                <Route path="*" element={<div className="text-center my-5"><h3 className="text-danger">404 - Page Not Found</h3></div>}/>
              </Routes>
            </main>

            {/*Footer */}
            <Footer />
          </div>
        </AppointmentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
