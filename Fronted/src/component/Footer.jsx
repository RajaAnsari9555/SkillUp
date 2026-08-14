import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from "react-icons/fi";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full overflow-hidden"
      style={{ borderTop: "1px solid var(--border)" }}>

      {/* subtle bg gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg-layer))" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--orb-1)" }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg blur-md opacity-40"
                  style={{ background: "var(--accent)" }} />
                <img src={logo} alt="SkillUp"
                  className="relative w-10 h-10 rounded-lg object-cover border"
                  style={{ borderColor: "var(--border-hover)" }} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                SkillUp
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6"
              style={{ color: "var(--text-secondary)" }}>
              AI-powered learning platform to help you grow smarter. Learn anything, anytime,
              anywhere — with expert instructors and a vibrant community.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin, FiInstagram].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-xl glass border flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home",       path: "/" },
                { label: "All Courses",path: "/allcourses" },
                { label: "Login",      path: "/login" },
                { label: "My Profile", path: "/profile" },
                { label: "AI Search",  path: "/search" },
              ].map(item => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-sm transition-colors flex items-center gap-1.5 group"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >
                    <span className="w-1.5 h-1.5 rounded-full transition-colors"
                      style={{ background: "var(--border)" }} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
              Categories
            </h4>
            <ul className="space-y-2.5">
              {["Web Development","AI / ML","Data Science","UI/UX Design","Ethical Hacking","App Dev"].map(cat => (
                <li key={cat}>
                  <span
                    className="text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--accent-2)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--border)" }} />
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} SkillUp. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
