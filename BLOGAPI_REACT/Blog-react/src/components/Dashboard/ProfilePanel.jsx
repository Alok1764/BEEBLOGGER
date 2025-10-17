import React from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ProfilePanel = ({
  isOpen,
  onClose,
  onLogout,
  userName = "USERNAME",
  userEmail = "user@email.com",
}) => {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-orange-500 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-12 pb-6 border-b border-orange-500">
            <h2 className="text-2xl font-bold font-mono tracking-tighter text-orange-500">
              PROFILE
            </h2>
            <button
              onClick={onClose}
              className="text-orange-500 hover:opacity-50 transition-opacity"
            >
              <FaXmark className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-orange-500">
              <div className="w-16 h-16 bg-orange-500 flex items-center justify-center">
                <FaUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-mono text-lg tracking-wider text-orange-500 font-bold">
                  {userName}
                </h3>
                <p className="font-mono text-xs tracking-widest text-orange-500 opacity-70">
                  {userEmail}
                </p>
              </div>
            </div>

            <div className="space-y-0">
              <button
                className="w-full flex items-center gap-4 py-4 border-b border-orange-500 text-orange-500 hover:opacity-50 transition-opacity hover:cursor-pointer"
                onClick={() => {
                  navigate("/profile");
                  onClose();
                }}
              >
                <FaUser className="w-5 h-5" />
                <span className="font-mono text-sm tracking-widest">
                  VIEW PROFILE
                </span>
              </button>

              <button
                className="w-full flex items-center gap-4 py-4 border-b border-orange-500 text-orange-500 hover:opacity-50 transition-opacity hover:cursor-pointer"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span className="font-mono text-sm tracking-widest">
                  LOG OUT
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-8 right-8 pt-6 border-t border-orange-500">
            <p className="font-mono text-xs tracking-widest text-orange-500 opacity-50">
              © 2025 BEEBLOGGER
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
