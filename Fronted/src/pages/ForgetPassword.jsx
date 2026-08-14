import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FiMail, FiLock, FiArrowLeft, FiCheck } from "react-icons/fi";

const steps = ["Enter Email", "Verify OTP", "New Password"];

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/sendotp", { email }, { withCredentials: true });
      setStep(2);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/verifyotp", { email, otp }, { withCredentials: true });
      setStep(3);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (newpassword !== conPassword) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/resetpassword", { email, password: newpassword }, { withCredentials: true });
      toast.success(result.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.15)" }} />
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(6,182,212,0.10)", animationDelay: "2s" }} />

      <button onClick={() => navigate("/login")}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-all hover:scale-105"
        style={{ color: "var(--text-secondary)" }}>
        <FiArrowLeft className="w-4 h-4" /> Back to Login
      </button>

      <div className="w-full max-w-md glass rounded-3xl border p-8 lg:p-10 animate-scale-in"
        style={{ borderColor: "var(--border)" }}>
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border ${
                    done ? "bg-gradient-to-br from-purple-500 to-cyan-500 border-transparent text-white" :
                    active ? "border-purple-400 text-purple-400" : ""
                  }`}
                    style={!done && !active ? { borderColor: "var(--border)", color: "var(--text-muted)" } : {}}>
                    {done ? <FiCheck className="w-4 h-4" /> : n}
                  </div>
                  <span className="text-[10px]" style={{ color: active ? "var(--neon-purple)" : "var(--text-muted)" }}>{s}</span>
                </div>
                {i < 2 && (
                  <div className="flex-1 h-0.5 mx-2 rounded-full transition-all duration-500"
                    style={{ background: step > n ? "linear-gradient(90deg,#a855f7,#06b6d4)" : "var(--border)" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-slide-up">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Forgot Password?</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>We'll send an OTP to your email</p>
            </div>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <input type="email" className="input-glass pl-11" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()} />
            </div>
            <button className="btn-primary w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 text-white"
              onClick={sendOtp} disabled={loading}>
              {loading ? <ClipLoader size={22} color="white" /> : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-5 animate-slide-up">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Enter OTP</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Code sent to <span style={{ color: "var(--neon-purple)" }}>{email}</span>
              </p>
            </div>
            <input type="text" className="input-glass text-center text-2xl tracking-[0.5em] font-bold"
              placeholder="• • • •" maxLength={6}
              value={otp} onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyOTP()} />
            <button className="btn-primary w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 text-white"
              onClick={verifyOTP} disabled={loading}>
              {loading ? <ClipLoader size={22} color="white" /> : "Verify OTP"}
            </button>
            <button className="text-sm text-center hover:underline" style={{ color: "var(--text-muted)" }} onClick={() => setStep(1)}>
              Resend OTP
            </button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-5 animate-slide-up">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>New Password</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Choose a strong password</p>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <input type="password" className="input-glass pl-11" placeholder="New password"
                value={newpassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <input type="password" className="input-glass pl-11" placeholder="Confirm password"
                value={conPassword} onChange={(e) => setConPassword(e.target.value)} />
            </div>
            {newpassword && conPassword && (
              <p className="text-xs" style={{ color: newpassword === conPassword ? "var(--neon-green)" : "#f87171" }}>
                {newpassword === conPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}
            <button className="btn-primary w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 text-white"
              onClick={resetPassword} disabled={loading}>
              {loading ? <ClipLoader size={22} color="white" /> : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
