import React, { useState, useEffect, useRef } from "react";
import {
  FiBookOpen, FiAward, FiZap, FiStar, FiTrendingUp,
  FiBell, FiCheck, FiPlay, FiUsers, FiArrowRight,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

/* ── intersection observer ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ── notification data ── */
const notifications = [
  {
    id: 1,
    app: "SkillUp",
    icon: <FiBookOpen className="w-3.5 h-3.5" />,
    iconBg: "linear-gradient(135deg,#a855f7,#6366f1)",
    title: "New Lecture Unlocked 🎉",
    body: "MERN Stack — Chapter 8: JWT Auth is now live!",
    time: "just now",
    dot: "#a855f7",
  },
  {
    id: 2,
    app: "SkillUp",
    icon: <FiAward className="w-3.5 h-3.5" />,
    iconBg: "linear-gradient(135deg,#f59e0b,#ef4444)",
    title: "Certificate Earned! 🏆",
    body: "You completed React.js — Fundamentals course.",
    time: "2m ago",
    dot: "#f59e0b",
  },
  {
    id: 3,
    app: "SkillUp",
    icon: <FiStar className="w-3.5 h-3.5" />,
    iconBg: "linear-gradient(135deg,#06b6d4,#0891b2)",
    title: "Streak: 7 Days 🔥",
    body: "Keep it up! You're on a 7-day learning streak.",
    time: "5m ago",
    dot: "#06b6d4",
  },
  {
    id: 4,
    app: "SkillUp",
    icon: <FiZap className="w-3.5 h-3.5" />,
    iconBg: "linear-gradient(135deg,#10b981,#059669)",
    title: "Quiz Score: 95% ⚡",
    body: "You're in the top 5% on the Node.js leaderboard!",
    time: "12m ago",
    dot: "#10b981",
  },
  {
    id: 5,
    app: "SkillUp",
    icon: <FiUsers className="w-3.5 h-3.5" />,
    iconBg: "linear-gradient(135deg,#ec4899,#be185d)",
    title: "Classmate joined 👥",
    body: "Ravi enrolled in the same System Design course.",
    time: "18m ago",
    dot: "#ec4899",
  },
];

/* ── features list on left ── */
const features = [
  { icon: <FiBell className="w-5 h-5" />,      color: "#a855f7", title: "Instant Alerts",        desc: "Get notified the moment new lectures, quizzes or certificates are ready." },
  { icon: <FiTrendingUp className="w-5 h-5" />, color: "#06b6d4", title: "Progress Tracking",     desc: "Live streak counters, score updates and milestone badges delivered to your device." },
  { icon: <FiPlay className="w-5 h-5" />,       color: "#10b981", title: "Resume Anywhere",       desc: "Pick up exactly where you left off — phone, tablet or desktop." },
  { icon: <HiSparkles className="w-5 h-5" />,   color: "#f59e0b", title: "Smart Recommendations", desc: "AI suggests your next course based on your learning pattern." },
];

/* ── single notification card ── */
const NotifCard = ({ notif, index, visible }) => (
  <div
    className="flex items-start gap-3 px-4 py-3 rounded-2xl border w-full transition-all duration-700"
    style={{
      background: "rgba(255,255,255,0.07)",
      backdropFilter: "blur(16px)",
      borderColor: "rgba(255,255,255,0.12)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0) scale(1)" : "translateX(40px) scale(0.95)",
      transitionDelay: `${index * 0.18 + 0.3}s`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
    }}
  >
    {/* app icon */}
    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md"
      style={{ background: notif.iconBg }}>
      {notif.icon}
    </div>
    {/* content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-1 mb-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 text-white">{notif.app}</span>
        <span className="text-[10px] opacity-50 text-white flex-shrink-0">{notif.time}</span>
      </div>
      <p className="text-xs font-semibold text-white leading-tight">{notif.title}</p>
      <p className="text-[11px] opacity-70 text-white leading-tight mt-0.5 truncate">{notif.body}</p>
    </div>
    {/* unread dot */}
    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1 animate-pulse"
      style={{ background: notif.dot }} />
  </div>
);

/* ── phone frame component ── */
const PhoneMockup = ({ visible }) => {
  const [now, setNow] = useState(new Date());

  /* tick every second */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative flex justify-center items-center"
      style={{ animation: visible ? "float 4s ease-in-out infinite" : "none" }}>

      {/* outer glow */}
      <div className="absolute inset-0 rounded-[52px] blur-3xl pointer-events-none"
        style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(6,182,212,0.18))", transform: "scale(1.08)" }} />

      {/* phone shell with realistic frame */}
      <div className="relative w-[340px] rounded-[48px] overflow-hidden"
        style={{
          background: "#1a1a2e",
          padding: "12px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}>
        
        {/* Screen with rounded corners */}
        <div className="relative rounded-[38px] overflow-hidden"
          style={{
            background: "linear-gradient(165deg,#0f0f1e 0%,#1a1a2e 100%)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}>
          
          {/* Dynamic Island / Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2">
            <div className="h-7 px-6 rounded-full flex items-center justify-center"
              style={{ 
                background: "#000", 
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.6)"
              }}>
              <div className="w-10 h-1 rounded-full bg-gray-800" />
              <div className="w-2 h-2 rounded-full bg-blue-500 ml-4 opacity-80" />
            </div>
          </div>

          {/* status bar */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2 relative z-10">
            <span className="text-white text-xs font-semibold">{timeStr}</span>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              {[4,3,5].map((h, i) => (
                <div key={i} className="w-1 rounded-full bg-white" style={{ height: `${h * 1.5}px` }} />
              ))}
              {/* WiFi icon */}
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6c3.537 0 6.837 1.353 9.293 3.809a1 1 0 11-1.415 1.415A10.97 10.97 0 0012 8c-2.94 0-5.683 1.162-7.878 3.224a1 1 0 11-1.415-1.415A12.97 12.97 0 0112 6zm0 4c2.347 0 4.52.921 6.122 2.585a1 1 0 01-1.415 1.415A6.98 6.98 0 0012 12a6.98 6.98 0 00-4.707 2a1 1 0 01-1.415-1.415A8.98 8.98 0 0112 10zm0 4a3 3 0 11.001 5.999A3 3 0 0112 14z"/>
              </svg>
              {/* Battery */}
              <div className="w-6 h-3 rounded border border-white/50 flex items-center justify-end px-0.5 ml-1">
                <div className="w-4 h-2 rounded-sm bg-white" />
              </div>
              <div className="w-0.5 h-1.5 rounded-r-sm bg-white/50" />
            </div>
          </div>

          {/* lock screen time */}
          <div className="text-center py-6">
            <p className="text-white text-5xl font-extralight tracking-tight">{timeStr}</p>
            <p className="text-white/60 text-sm mt-1 font-light">{dateStr}</p>
          </div>

          {/* notification area */}
          <div className="px-4 pb-6 flex flex-col gap-3 min-h-[320px]">
            {notifications.map((notif, i) => (
              <NotifCard key={notif.id} notif={notif} index={i} visible={visible} />
            ))}
          </div>

          {/* home indicator */}
          <div className="flex items-center justify-center pb-3">
            <div className="w-32 h-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Side buttons hint */}
        <div className="absolute right-0 top-32 w-1 h-12 rounded-l-full bg-gradient-to-b from-gray-600/50 to-gray-700/50" />
        <div className="absolute right-0 top-48 w-1 h-16 rounded-l-full bg-gradient-to-b from-gray-600/50 to-gray-700/50" />
        <div className="absolute left-0 top-40 w-1 h-8 rounded-r-full bg-gradient-to-b from-gray-600/50 to-gray-700/50" />
      </div>

      {/* subtle ring behind phone */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(168,85,247,0.15)", animation: "ping-slow 4s ease-out infinite" }} />
    </div>
  );
};

/* ══════════ Main Section ══════════ */
const MobileNotificationSection = () => {
  const navigate = useNavigate();
  const [sectionRef, visible] = useInView(0.1);

  return (
    <section ref={sectionRef} className="w-full py-24 px-4 lg:px-16 relative overflow-hidden">
      {/* bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full blur-3xl"
          style={{ background: "var(--orb-2)", opacity: 0.45 }} />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "var(--orb-1)", opacity: 0.35 }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── section badge ── */}
        <div className={`flex justify-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border text-sm font-semibold"
            style={{ borderColor: "var(--border-hover)", color: "var(--accent-2)" }}>
            <FiBell className="w-4 h-4" />
            LEARN ON THE GO
          </span>
        </div>

        {/* ── two-column ── */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">

          {/* LEFT — features */}
          <div className={`lg:w-1/2 flex flex-col gap-8 transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4"
                style={{ color: "var(--text-primary)" }}>
                Your Learning{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                  Follows You
                </span>
                <br />Everywhere
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Never miss a lecture, quiz result or milestone. SkillUp keeps you in the loop with
                smart, real-time notifications — so your progress never stops.
              </p>
            </div>

            {/* feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i}
                  className="glass rounded-2xl p-4 border flex gap-3 transition-all duration-700 hover:scale-[1.02]"
                  style={{
                    borderColor: "var(--border)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${i * 0.15 + 0.3}s`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}30` }}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{f.title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* stat chips */}
            <div className="flex flex-wrap gap-3">
              {[["50K+","Active Learners"],["98%","Completion Rate"],["4.9★","App Rating"]].map(([val, label]) => (
                <div key={label}
                  className="glass rounded-2xl px-5 py-3 border flex flex-col items-center"
                  style={{ borderColor: "var(--border)" }}>
                  <span className="text-xl font-extrabold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">{val}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-3 flex-wrap">
              <button className="btn-primary px-7 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2"
                onClick={() => navigate("/allcourses")}>
                <FiPlay className="w-4 h-4" /> Start Learning <FiArrowRight className="w-4 h-4" />
              </button>
              <button className="btn-secondary px-7 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => navigate("/signup")}>
                <FiCheck className="w-4 h-4" style={{ color: "var(--accent-green)" }} /> Free Sign Up
              </button>
            </div>
          </div>

          {/* RIGHT — phone */}
          <div className={`lg:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
            <PhoneMockup visible={visible} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileNotificationSection;
