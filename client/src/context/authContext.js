import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Safe parsing: handle null/undefined cases
  const storedUser = localStorage.getItem("user");
  let initialUser = null;

  try {
    initialUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    initialUser = null;
  }

  const [currentUser, setCurrentUser] = useState(initialUser);

  const login = async (inputs) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", inputs, {
        withCredentials: true, // Ensures cookies are sent & received
      });

      if (res.data) {
        setCurrentUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // Store user data
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser)); // Store updated user data
    } else {
      localStorage.removeItem("user"); // Remove user data if logged out
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
