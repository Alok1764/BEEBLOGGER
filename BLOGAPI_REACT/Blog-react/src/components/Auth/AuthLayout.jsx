import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";

const AuthLayout = ({ onLoginSuccess, initialMode, onSwitchMode }) => {
  const [currentView, setCurrentView] = useState(initialMode || "login");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRegisterSuccess = () => {
    setCurrentView("login");
    setMessage({ text: "", type: "" });
    if (onSwitchMode) onSwitchMode("login");
  };

  const handleForgotPassword = () => {
    setCurrentView("forgot");
    setMessage({ text: "", type: "" });
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
    setMessage({ text: "", type: "" });
    if (onSwitchMode) onSwitchMode("login");
  };

  const handleSwitchView = (view) => {
    setCurrentView(view);
    setMessage({ text: "", type: "" });
    if (onSwitchMode) onSwitchMode(view);
  };

  if (currentView === "forgot") {
    return <ForgotPassword onBack={handleBackToLogin} />;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-orange-500">
        <h1 className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
          {currentView === "login" ? "LOGIN" : "REGISTER"}
        </h1>
        <p className="text-xs font-mono tracking-widest text-orange-500 opacity-70">
          {currentView === "login" ? "WELCOME BACK" : "CREATE YOUR ACCOUNT"}
        </p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-6 p-4 border ${
            message.type === "success"
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          <p
            className={`text-xs font-mono tracking-wider ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex gap-px bg-orange-500 mb-8">
        <button
          onClick={() => handleSwitchView("login")}
          className={`flex-1 py-4 font-mono text-sm tracking-widest transition-all ${
            currentView === "login"
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-500 hover:opacity-70"
          }`}
        >
          LOGIN
        </button>
        <button
          onClick={() => handleSwitchView("register")}
          className={`flex-1 py-4 font-mono text-sm tracking-widest transition-all ${
            currentView === "register"
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-500 hover:opacity-70"
          }`}
        >
          REGISTER
        </button>
      </div>

      {/* Forms */}
      {currentView === "login" ? (
        <>
          <LoginForm onLoginSuccess={onLoginSuccess} setMessage={setMessage} />
          <button
            onClick={handleForgotPassword}
            className="mt-6 w-full text-center text-xs font-mono tracking-widest text-orange-500 hover:opacity-50 transition-opacity"
          >
            FORGOT PASSWORD?
          </button>
        </>
      ) : (
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          setMessage={setMessage}
        />
      )}
    </div>
  );
};

export default AuthLayout;
