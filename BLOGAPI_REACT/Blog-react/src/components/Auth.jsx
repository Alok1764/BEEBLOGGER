import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  Home,
  LogOut,
  Shield,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api/v1/auth";

const Auth = () => {
  const [currentView, setCurrentView] = useState("auth"); // 'auth' or 'dashboard'
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userInfo, setUserInfo] = useState(null);

  const [loginForm, setLoginForm] = useState({ userName: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Check if user is already logged in when app loads
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        // Decode JWT to get user info
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setUserInfo(payload);
        setCurrentView("dashboard");
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("jwtToken");
      }
    }
  }, []);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: loginForm.userName,
          password: loginForm.password,
        }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwtToken", token);

        // Decode token to get user info
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setUserInfo(payload);

        setMessage({ text: "✅ Login Successful!", type: "success" });
        setLoginForm({ userName: "", password: "" });

        // Switch to dashboard after 1 second
        setTimeout(() => {
          setCurrentView("dashboard");
          setMessage({ text: "", type: "" });
        }, 1000);

        console.log("JWT Token:", token);
        console.log("User Info:", payload);
      } else {
        const error = await response.text();
        setMessage({ text: `❌ Login Failed: ${error}`, type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "❌ Network Error! Check if backend is running",
        type: "error",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage({ text: "❌ Passwords do not match!", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: registerForm.userName,
          email: registerForm.email,
          roles: ["AUTHOR"],
          password: registerForm.password,
        }),
      });

      if (response.ok) {
        setMessage({
          text: "✅ Registration Successful! Please login.",
          type: "success",
        });
        setRegisterForm({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setIsLogin(true);
          setMessage({ text: "", type: "" });
        }, 2000);
      } else {
        const error = await response.text();
        setMessage({ text: `❌ Registration Failed: ${error}`, type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "❌ Network Error! Check if backend is running",
        type: "error",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setUserInfo(null);
    setCurrentView("auth");
    setMessage({ text: "✅ Logged out successfully!", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 2000);
  };

  // Example: Making authenticated API request
  const makeAuthenticatedRequest = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch("http://localhost:8080/api/v1/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach JWT token
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Protected data:", data);
      } else if (response.status === 401) {
        // Token expired or invalid
        alert("Session expired! Please login again.");
        handleLogout();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Dashboard View
  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Blog Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome Back! 🎉
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span>{" "}
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

          {/* Example Protected Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">My Posts</h3>
              <p className="text-gray-600 text-sm">
                View and manage your blog posts
              </p>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                View Posts
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Create Post
              </h3>
              <p className="text-gray-600 text-sm">Write a new blog post</p>
              <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                New Post
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Profile</h3>
              <p className="text-gray-600 text-sm">
                Update your profile settings
              </p>
              <button className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
                Edit Profile
              </button>
            </div>
          </div>

          {/* JWT Token Info */}
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
                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
              >
                View Token in Console
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auth View (Login/Register)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              isLogin ? "bg-white text-indigo-600 shadow" : "text-gray-600"
            }`}
          >
            <LogIn className="inline w-4 h-4 mr-2" />
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage({ text: "", type: "" });
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              !isLogin ? "bg-white text-indigo-600 shadow" : "text-gray-600"
            }`}
          >
            <UserPlus className="inline w-4 h-4 mr-2" />
            Register
          </button>
        </div>

        {isLogin ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="userName"
                  value={loginForm.userName}
                  onChange={handleLoginChange}
                  placeholder="alok1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="userName"
                  value={registerForm.userName}
                  onChange={handleRegisterChange}
                  placeholder="alok1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="alok@gmail.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Confirm password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Backend:</span> {API_BASE_URL}
            <br />
            <span className="font-semibold">Token:</span> Stored in localStorage
            <br />
            <span className="font-semibold">Console:</span> Press F12 to see
            logs
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
