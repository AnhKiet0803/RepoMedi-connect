import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute usage examples:
 * - Require login: <Route element={<ProtectedRoute />} />
 * - Require role: <Route element={<ProtectedRoute requiredRoles={["admin"]} />} />
 */
export default function ProtectedRoute({ requiredRoles }) {
  // Lấy thông tin người dùng đã đăng nhập từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu về vai trò và người dùng không có vai trò phù hợp, chuyển hướng về trang chủ
  if (
    requiredRoles &&
    requiredRoles.length > 0 &&
    !requiredRoles.includes(currentUser.role)
  ) {
    return <Navigate to="/" replace />;
  }

  // Nếu hợp lệ, render các route con
  return <Outlet />;
}
