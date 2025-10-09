import React, { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthLayout = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRegisterSuccess = () => {
    setIsLogin(true);
    setMessage({ text: "", type: "" });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
                    flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {isLogin
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
              setIsLogin(true);
              setMessage({ text: "", type: "" });
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all 
                       flex items-center justify-center gap-2 ${
                         isLogin
                           ? "bg-white text-indigo-600 shadow"
                           : "text-gray-600 hover:text-gray-800"
                       }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage({ text: "", type: "" });
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all 
                       flex items-center justify-center gap-2 ${
                         !isLogin
                           ? "bg-white text-indigo-600 shadow"
                           : "text-gray-600 hover:text-gray-800"
                       }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        {isLogin ? (
          <LoginForm onLoginSuccess={onLoginSuccess} setMessage={setMessage} />
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
