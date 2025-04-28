import React, { createContext, useContext, useState, useEffect } from "react";
import userStore from "../store/user/getters";
import { useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
	const token = localStorage.getItem("token");
  
	if (token) {
	  const decoded = jwtDecode<JwtPayload>(token);
    const expiresIn = decoded.exp ? decoded.exp * 1000 - Date.now() : 0;
  
	  if (expiresIn > 0) {
		setIsAuthenticated(true);
		const timeout = setTimeout(() => {
		  userStore.logout();
		  setIsAuthenticated(false);
		  navigate("/login");
		}, expiresIn);
  
		return () => clearTimeout(timeout);
	  } else {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
	  }
	}
  }, [navigate]);
  

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await userStore.login(email, password);
      if (response.success) {
        localStorage.setItem("token", response.token || "");
        userStore.userLogged();
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
        console.error("Erro no login: ", error);
        return false;
      }
    };

  const logout = () => {
    userStore.logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};