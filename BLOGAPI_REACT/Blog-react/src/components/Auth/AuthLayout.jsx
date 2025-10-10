import React, { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";

const AuthLayout = ({ onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState("login");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRegisterSuccess = () => {
    setCurrentView("login");
    setMessage({ text: "", type: "" });
  };

  const handleForgotPassword = () => {
    setCurrentView("forgot");
    setMessage({ text: "", type: "" });
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
    setMessage({ text: "", type: "" });
  };

  if (currentView === "forgot") {
    return <ForgotPassword onBack={handleBackToLogin} />;
  }

  return (
    <div
      className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 
                    flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {currentView === "login" ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {currentView === "login"
              ? "Login to your blog account"
              : "Register to start blogging"}
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setCurrentView("login");
              setMessage({ text: "", type: "" });
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all 
                       flex items-center justify-center gap-2 ${
                         currentView === "login"
                           ? "bg-white text-indigo-600 shadow"
                           : "text-gray-600 hover:text-gray-800"
                       }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => {
              setCurrentView("register");
              setMessage({ text: "", type: "" });
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all 
                       flex items-center justify-center gap-2 ${
                         currentView === "register"
                           ? "bg-white text-indigo-600 shadow"
                           : "text-gray-600 hover:text-gray-800"
                       }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        {currentView === "login" ? (
          <>
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              setMessage={setMessage}
            />
            <button
              onClick={handleForgotPassword}
              className="mt-4 w-full text-center text-sm text-indigo-600 
                       hover:text-indigo-800 hover:underline transition"
            >
              Forgot Password?
            </button>
          </>
        ) : (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            setMessage={setMessage}
          />
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-mono">
            <span className="font-semibold">Backend:</span>{" "}
            http://localhost:8080
            <br />
            <span className="font-semibold">Token:</span> Stored in localStorage
            <br />
            <span className="font-semibold">Console:</span> Press F12 for logs
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
