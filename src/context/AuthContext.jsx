import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backend_uri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backend_uri}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (name, email) => {
    try {
      const response = await fetch(`${backend_uri}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error" };
    }
  };

  const register = async (name, email) => {
    try {
      const response = await fetch(`${backend_uri}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Network error" };
    }
  };

  const logout = async () => {
    try {
      // await fetch(`${backend_uri}/auth/logout`, {
      //   method: "POST",
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });

      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
