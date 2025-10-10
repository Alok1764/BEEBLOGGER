import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import { sendOTP, verifyOTP, resetPassword } from "../../Services/api";
import { useToast } from "../../Contexts/ToastContext";
import Input from "../Shared/Input";

const ForgotPassword = ({ onBack }) => {
  const toast = useToast();

  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOTP(formData.email);
      toast.success("OTP sent to your email! Check your inbox.");
      setStep("otp");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOTP(formData.email, formData.otp);
      toast.success("OTP verified! Now set your new password.");
      setStep("password");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(formData.email, formData.otp, formData.newPassword);
      toast.success("Password reset successfully! Please login.");

      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 
                    flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 bg-indigo-100 rounded-full flex items-center 
                         justify-center mx-auto mb-4"
          >
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            {step === "email" && "Enter your email to receive OTP"}
            {step === "otp" && "Enter the OTP sent to your email"}
            {step === "password" && "Create your new password"}
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                           ${
                             step === "email"
                               ? "bg-indigo-600 text-white"
                               : "bg-green-500 text-white"
                           }`}
            >
              {step === "email" ? "1" : "✓"}
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                           ${
                             step === "otp"
                               ? "bg-indigo-600 text-white"
                               : step === "password"
                               ? "bg-green-500 text-white"
                               : "bg-gray-300 text-gray-600"
                           }`}
            >
              {step === "password" ? "✓" : "2"}
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                           ${
                             step === "password"
                               ? "bg-indigo-600 text-white"
                               : "bg-gray-300 text-gray-600"
                           }`}
            >
              3
            </div>
          </div>
        </div>

        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              icon={Mail}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full py-3 px-4 border border-gray-300 rounded-lg 
                         text-center text-2xl font-bold tracking-widest
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                         outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Check your email for the 6-digit OTP
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => handleSendOTP({ preventDefault: () => {} })}
              disabled={loading}
              className="w-full text-indigo-600 text-sm hover:underline"
            >
              Didn't receive OTP? Resend
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
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
                       hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <button
          onClick={onBack}
          className="mt-6 w-full flex items-center justify-center gap-2 
                   text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
