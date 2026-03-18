import { useState, useEffect } from "react";
import { api } from "../lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch user data from backend
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await api.get("/api/auth/me");
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    fetchUser(); // Fetch user data after login
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsLoggedIn(false);
  };

  return {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    refetchUser: fetchUser,
  };
}

export default useSession;
