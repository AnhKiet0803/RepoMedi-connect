import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // ✅ Đăng nhập
  const login = (userData, userRole) => {
    const finalUser = { ...userData, role: userRole || userData.role };
    setUser(finalUser);
    setRole(finalUser.role);
    // 🔄 Dùng sessionStorage thay vì localStorage
    sessionStorage.setItem("user", JSON.stringify(finalUser));
    sessionStorage.setItem("role", finalUser.role);
  };

  // ✅ Đăng xuất
  const logout = () => {
    setUser(null);
    setRole(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
  };

  // ✅ Tải lại dữ liệu khi reload trang
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    const savedRole = sessionStorage.getItem("role");
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
