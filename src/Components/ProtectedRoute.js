import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ requiredRoles }) {
  // ✅ Lấy user từ sessionStorage thay vì localStorage
  const currentUser =
    JSON.parse(sessionStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  // ❌ Nếu chưa đăng nhập → quay lại /login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Nếu có yêu cầu role mà user không hợp lệ → quay về /
  if (
    requiredRoles &&
    requiredRoles.length > 0 &&
    !requiredRoles.includes(currentUser.role)
  ) {
    return <Navigate to="/" replace />;
  }

  // ✅ Hợp lệ → cho phép vào
  return <Outlet />;
}
