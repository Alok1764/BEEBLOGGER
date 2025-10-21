import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../../Services/api";
import { saveToken, getUserFromToken } from "../../Utils/auth";
import { useToast } from "../../Contexts/ToastContext";

const LoginForm = ({ onLoginSuccess, setMessage }) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = await loginUser(formData.userName, formData.password);
      saveToken(token);
      const userInfo = getUserFromToken();

      toast.success("Login successful! Welcome back!");
      setFormData({ userName: "", password: "" });

      setTimeout(() => {
        onLoginSuccess(userInfo);
      }, 1000);
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
            placeholder="ENTER USERNAME"
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
            placeholder="ENTER PASSWORD"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white py-4 font-mono text-sm tracking-widest hover:bg-white hover:text-orange-500 border border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "LOGGING IN..." : "LOGIN"}
      </button>
    </form>
  );
};

export default LoginForm;
