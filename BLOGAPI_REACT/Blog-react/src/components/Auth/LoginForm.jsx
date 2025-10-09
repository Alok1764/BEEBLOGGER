import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../Shared/Input";
import { loginUser } from "../../Services/api";
import { saveToken, getUserFromToken } from "../../Utils/auth";

const LoginForm = ({ onLoginSuccess, setMessage }) => {
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

      setMessage({
        text: "✅ Login Successful!",
        type: "success",
      });

      setFormData({ userName: "", password: "" });

      setTimeout(() => {
        onLoginSuccess(userInfo);
      }, 1000);

      console.log("Login successful!", userInfo);
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
        placeholder="Enter your username"
        icon={User}
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
            placeholder="Enter your password"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium 
                 hover:bg-indigo-700 transition disabled:opacity-50 
                 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
