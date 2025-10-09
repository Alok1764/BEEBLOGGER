import React from "react";
import { Shield, LogOut } from "lucide-react";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">Blog Dashboard</h1>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white 
                   rounded-lg hover:bg-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
