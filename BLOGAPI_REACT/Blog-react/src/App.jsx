import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import AuthLayout from "./components/Auth/AuthLayout";
import { getUserFromToken, removeToken, isAuthenticated } from "./Utils/auth";
import { ToastProvider } from "./Contexts/ToastContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUserFromToken();
      if (user) {
        setUserInfo(user);
        setIsLoggedIn(true);
        console.log("User already logged in:", user);
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setUserInfo(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    removeToken();
    setUserInfo(null);
    setIsLoggedIn(false);
    console.log("User logged out");
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-amber-400">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <AuthLayout onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <AuthLayout onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard userInfo={userInfo} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="*"
            element={
              <h2 className="text-center mt-10 text-2xl">
                404 - Page Not Found
              </h2>
            }
          />
        </Routes>
      </div>
    </ToastProvider>
  );
};

export default App;
