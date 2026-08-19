import React from "react";
import video from "../assets/video.mp4";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { FiUsers, FiBookOpen, FiAward, FiTrendingUp } from "react-icons/fi";

const stats    = [
  { icon: <FiUsers />,      value: "50K+", label: "Students" },
  { icon: <FiBookOpen />,   value: "20K+", label: "Courses" },
  { icon: <FiAward />,      value: "500+", label: "Instructors" },
  { icon: <FiTrendingUp />, value: "95%",  label: "Success" },
];
const features = [
  "Simplified Learning","Expert Trainers","Big Experience",
  "Lifetime Access","AI-Powered Tools","Community Support",
];

const About = () => (
  <section className="w-full py-20 px-6 lg:px-20 relative overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
      {/* video side */}
      <div className="lg:w-5/12 relative">
        {/* Static border instead of animated spin */}
        <div className="absolute -inset-4 rounded-3xl border pointer-events-none"
          style={{ borderColor: "var(--border)", opacity: 0.3 }} />
        <video src={video} className="relative w-full rounded-2xl border shadow-2xl"
          style={{ borderColor: "var(--border)" }}
          controls autoPlay loop muted />
        <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-4 border min-w-[130px]"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">50K+</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Active learners</p>
        </div>
      </div>

      {/* text side */}
      <div className="lg:w-7/12 flex flex-col gap-6">
        <span className="inline-block w-fit px-4 py-1.5 rounded-full text-xs font-semibold glass border"
          style={{ borderColor: "var(--border-hover)", color: "var(--accent)" }}>
          ABOUT US
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
          We Are{" "}
          <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">Maximizing</span>{" "}
          Your Learning Growth
        </h2>
        <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          We provide a modern Learning Management System powered by AI — designed to simplify online
          education, track your progress, and enhance collaboration between students and instructors.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 glass rounded-xl px-4 py-3 border transition-all"
              style={{ borderColor: "var(--border)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <BiSolidBadgeCheck className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 mt-2">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4 border text-center group transition-all"
              style={{ borderColor: "var(--border)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <div className="flex justify-center mb-1.5 text-lg group-hover:scale-110 transition-transform"
                style={{ color: "var(--accent)" }}>{s.icon}</div>
              <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
