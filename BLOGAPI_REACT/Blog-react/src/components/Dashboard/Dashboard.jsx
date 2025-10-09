import React from "react";
import { Home, UserPlus, User } from "lucide-react";
import Navbar from "./Navbar";
import StatsCard from "./StatsCard";

const Dashboard = ({ userInfo, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <Navbar onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome Back! 🎉
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Username:</span>{" "}
              {userInfo?.sub || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Role:</span>{" "}
              {userInfo?.roles || "AUTHOR"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Token Expires:</span>{" "}
              {userInfo?.exp
                ? new Date(userInfo.exp * 1000).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            icon={Home}
            iconColor="bg-blue-100"
            iconTextColor="text-blue-600"
            title="My Posts"
            description="View and manage your blog posts"
            buttonText="View Posts"
            buttonColor="bg-blue-500 hover:bg-blue-600"
            onClick={() => alert("View Posts feature coming soon!")}
          />

          <StatsCard
            icon={UserPlus}
            iconColor="bg-green-100"
            iconTextColor="text-green-600"
            title="Create Post"
            description="Write a new blog post"
            buttonText="New Post"
            buttonColor="bg-green-500 hover:bg-green-600"
            onClick={() => alert("Create Post feature coming soon!")}
          />

          <StatsCard
            icon={User}
            iconColor="bg-purple-100"
            iconTextColor="text-purple-600"
            title="Profile"
            description="Update your profile settings"
            buttonText="Edit Profile"
            buttonColor="bg-purple-500 hover:bg-purple-600"
            onClick={() => alert("Edit Profile feature coming soon!")}
          />
        </div>

        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">
            🔐 JWT Token Info
          </h3>
          <div className="font-mono text-xs text-gray-600 space-y-2">
            <p>
              <span className="font-semibold">Token stored in:</span>{" "}
              localStorage
            </p>
            <p>
              <span className="font-semibold">Usage:</span> Automatically
              attached to API requests
            </p>
            <p>
              <span className="font-semibold">Format:</span> Authorization:
              Bearer TOKEN
            </p>
            <button
              onClick={() => {
                const token = localStorage.getItem("jwtToken");
                console.log("Your JWT Token:", token);
                alert("Check console (F12) for your JWT token!");
              }}
              className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg 
                       hover:bg-gray-700 transition text-sm"
            >
              View Token in Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
