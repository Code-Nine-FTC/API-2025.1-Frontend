import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    };

    if (!isAuthenticated) {
      checkToken();
    }
  }, [isAuthenticated, navigate]);

  return <> {children} </>;
};

export default ProtectedRoute;