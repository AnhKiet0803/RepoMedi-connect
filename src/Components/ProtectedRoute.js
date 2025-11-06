import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute usage examples:
 * - Require login: <Route element={<ProtectedRoute />} />
 * - Require role: <Route element={<ProtectedRoute requiredRoles={["admin"]} />} />
 */
export default function ProtectedRoute({ requiredRoles }) {
  // ✅ Đọc user từ cả Context-based và legacy key
  const currentUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("currentUser"));

  // Nếu chưa đăng nhập
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu về role mà user không hợp lệ
  if (
    requiredRoles &&
    requiredRoles.length > 0 &&
    !requiredRoles.includes(currentUser.role)
  ) {
    return <Navigate to="/" replace />;
  }

  // ✅ Nếu hợp lệ → cho phép vào
  return <Outlet />;
}
