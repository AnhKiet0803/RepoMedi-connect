import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ requiredRoles }) {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentRole = localStorage.getItem('role');

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (
    requiredRoles &&
    requiredRoles.length > 0 &&
    !requiredRoles.includes(currentRole)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
