import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { FiZap } from "react-icons/fi";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, password, email, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* BG orbs */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.15)" }} />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(16,185,129,0.10)", animationDelay: "4s" }} />

      <div className="w-full max-w-4xl glass rounded-3xl border overflow-hidden flex animate-scale-in"
        style={{ borderColor: "var(--border)" }}>
        {/* Left — Branding (hidden on mobile) */}
        <div className="hidden md:flex w-[42%] flex-col items-center justify-center gap-6 p-10 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(16,185,129,0.12))", borderRight: "1px solid var(--border)" }}>
          <div className="absolute top-8 left-8 w-28 h-28 rounded-full blur-3xl" style={{ background: "rgba(168,85,247,0.25)" }} />
          <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full blur-3xl" style={{ background: "rgba(16,185,129,0.2)" }} />
          <div className="relative animate-float">
            <div className="absolute inset-0 rounded-2xl blur-lg" style={{ background: "rgba(168,85,247,0.4)" }} />
            <img src={logo} alt="SkillUp" className="relative w-20 h-20 rounded-2xl object-cover border border-white/20" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Join SkillUp
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              Start your learning journey today
            </p>
          </div>
          <ul className="space-y-2.5 w-full">
            {["Access 20K+ courses", "AI-powered search", "Expert instructors", "Learn at your pace"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: "rgba(168,85,247,0.2)", color: "var(--neon-purple)" }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center gap-4">
          <div className="mb-1">
            <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              Create Account 🚀
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Fill in your details to get started
            </p>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Full Name</label>
            <input type="text" className="input-glass" placeholder="Your name"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Email</label>
            <input type="email" className="input-glass" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} className="input-glass pr-11" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }} onClick={() => setShow((p) => !p)}>
                {show ? <IoEyeSharp className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-secondary)" }}>I am a...</label>
            <div className="flex gap-3">
              {["student", "educator"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all border"
                  style={{
                    background: role === r ? "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(99,102,241,0.2))" : "var(--bg-card)",
                    borderColor: role === r ? "var(--neon-purple)" : "var(--border)",
                    color: role === r ? "var(--neon-purple)" : "var(--text-secondary)",
                    boxShadow: role === r ? "0 0 12px rgba(168,85,247,0.2)" : "none",
                  }}
                >
                  {r === "student" ? "🎓 Student" : "🏫 Educator"}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 text-white mt-1"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <ClipLoader size={22} color="white" /> : <><FiZap className="w-4 h-4" /> Create Account</>}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <button
              className="font-semibold hover:underline"
              style={{ color: "var(--accent)" }}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
