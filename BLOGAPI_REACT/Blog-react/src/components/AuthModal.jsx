import React from "react";
import { FaXmark } from "react-icons/fa6";
import AuthLayout from "./Auth/AuthLayout";

const AuthModal = ({ isOpen, onClose, mode, onLoginSuccess, onSwitchMode }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Blurred Overlay */}
      <div
        className="fixed inset-0 bg-white/20 backdrop-blur-md z-[95] transition-all"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md">
        <div className="bg-white border-2 border-orange-500 relative shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-orange-500 hover:opacity-50 transition-opacity z-10"
          >
            <FaXmark className="w-6 h-6" />
          </button>

          {/* Auth Layout */}
          <div className="p-12">
            <AuthLayout
              onLoginSuccess={onLoginSuccess}
              initialMode={mode}
              onSwitchMode={onSwitchMode}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
