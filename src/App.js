import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute';
import ScrollToTop from "./Components/ScrollToTop";
import initMockData from './utils/initMockData';
import { Button } from 'react-bootstrap';
// Contexts
import { AuthProvider } from './Context/Context';
import { AppointmentProvider } from './Context/AppointmentContext';
import { NotificationProvider } from './Context/NotificationContext';

// Public Pages
import HomePage from './Page/HomePage';
import Login from './Page/Login';
import Register from './Page/Register';
import AllDoctorsPage from './Page/AllDoctorsPage';
import DoctorDetailPage from './Page/DoctorDetailPage';
import ConfirmAppointmentPage from './Page/ConfirmAppointmentPage';
import MyAppointments from './Page/MyAppointmentSchedule';
import PatientProfile from './Page/PatientProfile';
import SpecialtySection from './Components/SpecialtySection';
import SpecialtyDetailPage from './Page/SpecialtyDetailPage';
import NewsPage from './Page/NewsPage';
import NewsDetailPage from './Page/NewsDetailPage';
import AboutUs from './Page/AboutUs';
import Contacts from './Page/Contacts';
import WhyUs from './Page/WhyUs';
import DoctorsIntro from './Page/DoctorIntro';
import AdvicePage from './Page/AdvicePage';
import HomeExamination from './Page/Services/HomeExamination';
import NutritionConsulting from './Page/Services/NutritionConsulting';

// Doctor Pages
import DoctorDashboard from './Page/Doctor/DoctorDashboard';
import DoctorProfile from './Page/Doctor/DoctorProfile';
import DoctorAppointments from './Page/Doctor/DoctorAppointment';
import DoctorNotifications from './Page/Doctor/DoctorNotifications';

// Admin Pages
import AdminDashboard from './Components/AdminDashboard';
import Dashboard from './Page/admin/Dashboard';
import DoctorManager from './Page/admin/DoctorManager';
import PatientManager from './Page/admin/PatientManager';
import UserManager from './Page/admin/UserManager';
import ContentManager from './Page/admin/ContentManager';

function App() {
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('data_initialized')) {
      initMockData();
    }
  }, []);

  const Layout = ({ children }) => (
    <>
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  );

  return (
    <AuthProvider>
      <NotificationProvider>
        <AppointmentProvider>
          <div className="App">
            <ScrollToTop />
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/register" element={<Layout><Register /></Layout>} />
              <Route path="/doctors" element={<Layout><AllDoctorsPage /></Layout>} />
              <Route path="/doctor/:id" element={<Layout><DoctorDetailPage /></Layout>} />
              <Route path="/confirm-appointment" element={<Layout><ConfirmAppointmentPage /></Layout>} />
              <Route path="/patient/profile" element={<Layout><PatientProfile /></Layout>} />
              <Route path="/patient/appointments" element={<Layout><MyAppointments /></Layout>} />
              <Route path="/specialties" element={<Layout><SpecialtySection /></Layout>} />
              <Route path="/specialty/:id" element={<Layout><SpecialtyDetailPage /></Layout>} />
              <Route path="/articles" element={<Layout><NewsPage /></Layout>} />
              <Route path="/news/:id" element={<Layout><NewsDetailPage /></Layout>} />
              <Route path="/about" element={<Layout><AboutUs /></Layout>} />
              <Route path="/contact" element={<Layout><Contacts /></Layout>} />
              <Route path="/why-us" element={<Layout><WhyUs /></Layout>} />
              <Route path="/doctorintro" element={<Layout><DoctorsIntro /></Layout>} />
              <Route path="/advicepage" element={<Layout><AdvicePage /></Layout>} />
              <Route path="/service/1" element={<Layout><HomeExamination /></Layout>} />
              <Route path="/service/2" element={<Layout><NutritionConsulting /></Layout>} />

              {/* ===== DOCTOR ROUTES ===== */}
              <Route element={<ProtectedRoute requiredRoles={["doctor"]} />}>
                <Route path="/doctor/dashboard" element={<Layout><DoctorDashboard /></Layout>} />
                <Route path="/doctor/profile" element={<Layout><DoctorProfile /></Layout>} />
                <Route path="/doctor/appointments" element={<Layout><DoctorAppointments /></Layout>} />
                <Route path="/doctor/notifications" element={<Layout><DoctorNotifications /></Layout>} />
              </Route>

              {/* ===== ADMIN ROUTES ===== */}
              <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<Dashboard />} />
                  <Route path="doctors" element={<DoctorManager />} />
                  <Route path="patients" element={<PatientManager />} />
                  <Route path="users" element={<UserManager />} />
                  <Route path="content" element={<ContentManager />} />
                </Route>
              </Route>

              {/* ===== 404 ===== */}
              <Route path="*" element={
                <Layout>
                  <div className="text-center my-5">
                    <h3 className="text-danger">404 - Không tìm thấy trang</h3>
                    <Button variant="primary" onClick={() => window.location.href = '/'}>
                      Quay về trang chủ
                    </Button>
                  </div>
                </Layout>
              } />
            </Routes>
          </div>
        </AppointmentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;