import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", userRole);
    };

    const logout = () => {
      setUser(null);
      setRole(null);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/");
    };

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedRole = localStorage.getItem("role");
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

