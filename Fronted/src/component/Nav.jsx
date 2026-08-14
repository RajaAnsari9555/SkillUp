import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import { IoPersonCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiSplitCross } from "react-icons/gi";
import { FiZap, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const Nav = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isDark, toggle } = useTheme();
  const [show, setShow] = useState(false);
  const [showHam, setShowHam] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => { if (!e.target.closest(".profile-dropdown")) setShow(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const navLinks = [
    { label: "Home",    path: "/" },
    { label: "Courses", path: "/allcourses" },
    { label: "Notes",   path: "/notes" },
    { label: "AI Search", path: "/search" },
  ];

  return (
    <>
      <nav
        className={`w-full h-[68px] fixed top-0 left-0 z-50 flex items-center justify-between px-5 lg:px-12 transition-all duration-500 ${
          scrolled ? "glass-dark shadow-xl" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-purple-500 blur-md opacity-50 group-hover:opacity-80 transition-opacity animate-pulse-glow" />
            <img
              src={logo}
              alt="SkillUp"
              className="relative w-[42px] h-[42px] rounded-lg border border-purple-400/40 object-cover"
            />
          </div>
          <span className="text-[1.15rem] font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
            SkillUp
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`text-sm font-medium transition-all duration-300 relative group pb-0.5 ${
                location.pathname === link.path
                  ? "text-purple-400"
                  : "text-secondary hover:text-primary"
              }`}
              style={{ color: location.pathname === link.path ? "var(--neon-purple)" : "var(--text-secondary)" }}
            >
              {link.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-300 rounded-full ${
                  location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-3 relative profile-dropdown">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="relative w-[52px] h-[28px] rounded-full glass border transition-all duration-300 hover:scale-105 flex items-center px-1 overflow-hidden"
            style={{ borderColor: "var(--border)" }}
            aria-label="Toggle theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {/* Track */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-500"
              style={{
                background: isDark
                  ? "rgba(168,85,247,0.15)"
                  : "rgba(251,191,36,0.15)",
                borderColor: isDark ? "rgba(168,85,247,0.3)" : "rgba(251,191,36,0.4)",
              }}
            />
            {/* Icons */}
            <span className="absolute left-1.5 text-xs z-10 transition-opacity duration-300" style={{ opacity: isDark ? 1 : 0 }}>
              <FiMoon className="w-3 h-3 text-purple-400" />
            </span>
            <span className="absolute right-1.5 text-xs z-10 transition-opacity duration-300" style={{ opacity: isDark ? 0 : 1 }}>
              <FiSun className="w-3 h-3 text-yellow-400" />
            </span>
            {/* Knob */}
            <div
              className="relative z-20 w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                background: isDark
                  ? "linear-gradient(135deg,#a855f7,#6366f1)"
                  : "linear-gradient(135deg,#fbbf24,#f59e0b)",
                transform: isDark ? "translateX(0)" : "translateX(24px)",
                boxShadow: isDark
                  ? "0 2px 8px rgba(168,85,247,0.5)"
                  : "0 2px 8px rgba(251,191,36,0.5)",
              }}
            />
          </button>

          {userData?.role === "educator" && (
            <button
              className="btn-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5"
              onClick={() => navigate("/dashboard")}
            >
              <FiZap className="w-3.5 h-3.5" /> Dashboard
            </button>
          )}

          {!userData ? (
            <button
              className="btn-secondary px-4 py-2 rounded-xl text-sm font-medium"
              onClick={() => navigate("/login")}
              style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
            >
              Login
            </button>
          ) : (
            <>
              <button
                className="btn-secondary px-4 py-2 rounded-xl text-sm font-medium"
                onClick={handleLogout}
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
              >
                Logout
              </button>
              <div
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer border border-white/20 hover:scale-110 transition-transform shadow-lg"
                onClick={() => setShow((p) => !p)}
              >
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            </>
          )}

          {!userData && (
            <IoPersonCircle
              className="w-9 h-9 cursor-pointer hover:scale-110 transition-transform"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setShow((p) => !p)}
            />
          )}

          {show && (
            <div
              className="absolute top-[120%] right-0 glass rounded-2xl p-2.5 flex flex-col gap-1 min-w-[175px] border z-50 animate-scale-in"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                style={{ color: "var(--text-primary)" }}
                onClick={() => { navigate("/profile"); setShow(false); }}
              >
                👤 My Profile
              </button>
              <button
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                style={{ color: "var(--text-primary)" }}
                onClick={() => { navigate("/mycourses"); setShow(false); }}
              >
                📚 My Courses
              </button>
            </div>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-xl glass border hover:scale-105 transition-all"
            style={{ borderColor: "var(--border)" }}
            aria-label="Toggle theme"
          >
            {isDark
              ? <FiSun className="w-4 h-4 text-yellow-400" />
              : <FiMoon className="w-4 h-4 text-purple-400" />
            }
          </button>
          <button
            className="p-2 rounded-xl glass border"
            style={{ borderColor: "var(--border)" }}
            onClick={() => setShowHam(true)}
          >
            <GiHamburgerMenu className="w-4 h-4" style={{ fill: "var(--text-primary)" }} />
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 transition-all duration-500 lg:hidden ${
          showHam ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
        }`}
        style={{ background: "var(--nav-bg)", backdropFilter: "blur(28px)" }}
      >
        <button
          className="absolute top-5 right-5 p-2 rounded-xl glass border"
          style={{ borderColor: "var(--border)" }}
          onClick={() => setShowHam(false)}
        >
          <GiSplitCross className="w-5 h-5" style={{ fill: "var(--text-primary)" }} />
        </button>

        <div className="flex flex-col items-center gap-3 w-64">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setShowHam(false); }}
              className="w-full py-3.5 rounded-2xl glass border text-base font-medium transition-all hover:border-purple-400/50"
              style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
            >
              {link.label}
            </button>
          ))}
          {userData && (
            <>
              <button onClick={() => { navigate("/profile"); setShowHam(false); }}
                className="w-full py-3.5 rounded-2xl glass border text-base font-medium transition-all"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}>
                My Profile
              </button>
              <button onClick={() => { navigate("/mycourses"); setShowHam(false); }}
                className="w-full py-3.5 rounded-2xl glass border text-base font-medium"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}>
                My Courses
              </button>
              {userData.role === "educator" && (
                <button onClick={() => { navigate("/dashboard"); setShowHam(false); }}
                  className="w-full py-3.5 rounded-2xl btn-primary text-base font-medium">
                  Dashboard
                </button>
              )}
              <button onClick={() => { handleLogout(); setShowHam(false); }}
                className="w-full py-3.5 rounded-2xl btn-danger text-base font-medium">
                Logout
              </button>
            </>
          )}
          {!userData && (
            <button onClick={() => { navigate("/login"); setShowHam(false); }}
              className="w-full py-3.5 rounded-2xl btn-primary text-base font-medium text-white">
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Nav;
