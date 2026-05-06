import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user is already logged in on app load
  useEffect(() => {
    const savedUser  = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ── Login — calls real backend ──
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      const normalizedUser = { ...user, name: user.fullName };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);

return { success: true, message: "Login successful!", user: normalizedUser };

    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  // ── Register — calls real backend ──
  const register = async (fullName, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        fullName,
        email,
        password,
      });
      const { token, user } = response.data;
      
      // save token + user to localStorage
      const normalizedUser = { ...user, name: user.fullName };

localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(normalizedUser));
setUser(normalizedUser);

return { success: true, message: "Registration successful!", user: normalizedUser };

    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  // ── Logout ──
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};