import React, { useState } from "react";
import { FaEnvelope, FaLock, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { sendOTP, verifyOTP, resetPassword } from "../../Services/api";
import { useToast } from "../../Contexts/ToastContext";

const ForgotPassword = ({ onBack }) => {
  const toast = useToast();

  const [step, setStep] = useState("email"); // "email", "otp", "password"
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

  // Step 1: Send OTP
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

  // Step 2: Verify OTP
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

  // Step 3: Reset Password
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
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-orange-500">
        <div className="w-16 h-16 border-2 border-orange-500 flex items-center justify-center mx-auto mb-4">
          <FaShieldAlt className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold font-mono tracking-tighter text-orange-500 mb-2">
          RESET PASSWORD
        </h1>
        <p className="text-xs font-mono tracking-widest text-orange-500 opacity-70">
          {step === "email" && "ENTER YOUR EMAIL"}
          {step === "otp" && "ENTER OTP CODE"}
          {step === "password" && "CREATE NEW PASSWORD"}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          {/* Step 1 */}
          <div
            className={`w-10 h-10 border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${
              step === "email"
                ? "border-orange-500 bg-orange-500 text-white"
                : step === "otp" || step === "password"
                ? "border-orange-500 bg-white text-orange-500"
                : "border-gray-300 bg-white text-gray-400"
            }`}
          >
            {step === "otp" || step === "password" ? "✓" : "1"}
          </div>

          <div className="w-12 h-px bg-orange-500"></div>

          {/* Step 2 */}
          <div
            className={`w-10 h-10 border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${
              step === "otp"
                ? "border-orange-500 bg-orange-500 text-white"
                : step === "password"
                ? "border-orange-500 bg-white text-orange-500"
                : "border-gray-300 bg-white text-gray-400"
            }`}
          >
            {step === "password" ? "✓" : "2"}
          </div>

          <div className="w-12 h-px bg-orange-500"></div>

          {/* Step 3 */}
          <div
            className={`w-10 h-10 border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${
              step === "password"
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-gray-300 bg-white text-gray-400"
            }`}
          >
            3
          </div>
        </div>
      </div>

      {/* Step 1: Email Input */}
      {step === "email" && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
              EMAIL ADDRESS
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 font-mono text-sm tracking-widest hover:bg-white hover:text-orange-500 border border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SENDING OTP..." : "SEND OTP"}
          </button>
        </form>
      )}

      {/* Step 2: OTP Input */}
      {step === "otp" && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
              ENTER OTP
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="123456"
              maxLength={6}
              required
              className="w-full py-4 px-4 border-2 border-orange-500 bg-white text-orange-500 text-center text-3xl font-mono font-bold tracking-widest focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
            />
            <p className="text-xs font-mono tracking-wider text-orange-500 opacity-50 mt-2 text-center">
              CHECK YOUR EMAIL FOR 6-DIGIT CODE
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 font-mono text-sm tracking-widest hover:bg-white hover:text-orange-500 border border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "VERIFYING..." : "VERIFY OTP"}
          </button>

          <button
            type="button"
            onClick={() => handleSendOTP({ preventDefault: () => {} })}
            disabled={loading}
            className="w-full text-xs font-mono tracking-widest text-orange-500 hover:opacity-50 transition-opacity"
          >
            DIDN'T RECEIVE? RESEND OTP
          </button>
        </form>
      )}

      {/* Step 3: New Password */}
      {step === "password" && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
              NEW PASSWORD
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-4 w-4 h-4 text-orange-500" />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="ENTER NEW PASSWORD"
                required
                className="w-full pl-12 pr-4 py-3 border border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-orange-500 mb-2">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-4 w-4 h-4 text-orange-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="CONFIRM PASSWORD"
                required
                className="w-full pl-12 pr-4 py-3 border border-orange-500 bg-white text-orange-500 font-mono text-sm tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 font-mono text-sm tracking-widest hover:bg-white hover:text-orange-500 border border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "RESETTING..." : "RESET PASSWORD"}
          </button>
        </form>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-8 w-full flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-orange-500 hover:opacity-50 transition-opacity"
      >
        <FaArrowLeft className="w-3 h-3" />
        BACK TO LOGIN
      </button>
    </div>
  );
};

export default ForgotPassword;
