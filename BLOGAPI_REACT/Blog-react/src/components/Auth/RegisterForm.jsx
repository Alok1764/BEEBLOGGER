import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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
        text: "❌ PASSWORDS DO NOT MATCH",
        type: "error",
      });
      return false;
    }

    if (formData.password.length < 6) {
      setMessage({
        text: "❌ PASSWORD MUST BE AT LEAST 6 CHARACTERS",
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
        text: "✅ REGISTRATION SUCCESSFUL! PLEASE LOGIN.",
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
    } catch (error) {
      setMessage({
        text: `❌ ${error.message.toUpperCase()}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username */}
      <div>
        <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
          USERNAME
        </label>
        <div className="relative">
          <FaUser className="absolute left-4 top-4 w-4 h-4 text-orange-500" />
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="CHOOSE USERNAME"
            required
            className="w-full pl-12 pr-4 py-3 border border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
          EMAIL
        </label>
        <div className="relative">
          <FaEnvelope className="absolute left-4 top-4 w-4 h-4 text-orange-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="YOUR@EMAIL.COM"
            required
            className="w-full pl-12 pr-4 py-3 border border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
          PASSWORD
        </label>
        <div className="relative">
          <FaLock className="absolute left-4 top-4 w-4 h-4 text-orange-500" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="CREATE PASSWORD"
            required
            className="w-full pl-12 pr-12 py-3 border border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-orange-500 hover:opacity-50 transition-opacity"
          >
            {showPassword ? (
              <FaEyeSlash className="w-4 h-4" />
            ) : (
              <FaEye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
          CONFIRM PASSWORD
        </label>
        <div className="relative">
          <FaLock className="absolute left-4 top-4 w-4 h-4 text-orange-500" />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="CONFIRM PASSWORD"
            required
            className="w-full pl-12 pr-4 py-3 border border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white py-4 font-mono text-sm tracking-widest hover:bg-white hover:text-orange-500 border border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
      </button>
    </form>
  );
};

export default RegisterForm;
