import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import axios from "axios";
import { FiArrowLeft, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success("Login Successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* BG Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.15)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(6,182,212,0.10)", animationDelay: "3s" }} />

      {/* Back btn */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-all hover:scale-105"
        style={{ color: "var(--text-secondary)" }}
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="w-full max-w-4xl glass rounded-3xl border overflow-hidden flex animate-scale-in"
        style={{ borderColor: "var(--border)" }}>
        {/* Left — Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center gap-5">
          <div className="mb-2">
            <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              Welcome Back 👋
            </h1>
            <p style={{ color: "var(--text-secondary)" }} className="text-sm">
              Sign in to continue learning
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              className="input-glass"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className="input-glass pr-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--text-muted)" }}
                onClick={() => setShow((p) => !p)}
                type="button"
              >
                {show ? <IoEyeSharp className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            className="text-xs text-left transition-colors hover:underline"
            style={{ color: "var(--neon-purple)" }}
            onClick={() => navigate("/forget")}
          >
            Forgot your password?
          </button>

          <button
            className="btn-primary w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 text-white"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <ClipLoader size={22} color="white" /> : <><FiZap className="w-4 h-4" /> Sign In</>}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <button
              className="font-semibold hover:underline"
              style={{ color: "var(--neon-purple)" }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Right — Branding */}
        <div className="hidden md:flex w-[42%] flex-col items-center justify-center gap-6 relative overflow-hidden p-10"
          style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.15))", borderLeft: "1px solid var(--border)" }}>
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full blur-3xl"
            style={{ background: "rgba(168,85,247,0.25)" }} />
          <div className="absolute bottom-10 left-10 w-28 h-28 rounded-full blur-3xl"
            style={{ background: "rgba(6,182,212,0.2)" }} />
          <div className="relative animate-float">
            <div className="absolute inset-0 rounded-2xl blur-lg" style={{ background: "rgba(168,85,247,0.4)" }} />
            <img src={logo} alt="SkillUp" className="relative w-20 h-20 rounded-2xl object-cover border border-white/20" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              SkillUp
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              AI-Powered Learning Platform
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            {[["50K+", "Students"], ["20K+", "Courses"], ["500+", "Instructors"], ["4.9★", "Rating"]].map(([v, l]) => (
              <div key={l} className="glass rounded-xl p-3 text-center" style={{ borderColor: "var(--border)" }}>
                <p className="font-bold text-sm bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{v}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
