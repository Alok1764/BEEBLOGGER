import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../Shared/Input";
import { registerUser } from "../../Services/api";

const RegisterForm = ({ onRegisterSuccess, setMessage }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        text: "❌ Passwords do not match!",
        type: "error",
      });
      return false;
    }

    if (formData.password.length < 6) {
      setMessage({
        text: "❌ Password must be at least 6 characters!",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);

      setMessage({
        text: "✅ Registration Successful! Please login.",
        type: "success",
      });

      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);

      console.log("Registration successful!");
    } catch (error) {
      setMessage({
        text: `❌ ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        type="text"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        placeholder="Choose a username"
        icon={User}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your.email@example.com"
        icon={Mail}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                     outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                     outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium 
                 hover:bg-indigo-700 transition disabled:opacity-50 
                 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
