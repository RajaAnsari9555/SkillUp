import React, { useState, useEffect, useRef } from "react";
import MD from "../assets/MD.jpeg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiPlay, FiStar, FiBriefcase, FiUsers, FiAward,
  FiBookOpen, FiArrowRight, FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";

/* ── intersection-observer fade-in ── */
const useInView = (threshold = 0.15) => {
  const ref  = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ── expertise chips ── */
const skills = [
  "System Design", "HLD / LLD", "Microservices", "Database Sharding",
  "Load Balancing", "Caching Strategies", "Message Queues", "Scalability",
];

/* ── credential cards ── */
const credentials = [
  { icon: <FiBriefcase />,  label: "Team Lead",          sub: "1+ Year Experience",   color: "#a855f7" },
  { icon: <FiUsers />,      label: "500+ Students",       sub: "Mentored directly",    color: "#06b6d4" },
  { icon: <FiAward />,      label: "Industry Expert",     sub: "Real-world projects",  color: "#f59e0b" },
  { icon: <FiTrendingUp />, label: "System Architect",    sub: "Distributed systems",  color: "#10b981" },
];

const MentorSection = () => {
  const navigate              = useNavigate();
  const { courseData }        = useSelector(s => s.course);
  const [sectionRef, visible] = useInView();
  const [imgRef,  imgVisible] = useInView(0.1);

  /* ── find any published System Design course from the backend data ── */
  const systemDesignCourses = (courseData || []).filter(c =>
    c.isPublished &&
    (c.title?.toLowerCase().includes("system design") ||
     c.category?.toLowerCase().includes("system design"))
  );

  const hasContent   = systemDesignCourses.length > 0;
  const firstCourse  = systemDesignCourses[0];

  /* ── navigate to system design page ── */
  const handleExplore = () => {
    navigate("/systemdesign");
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 px-4 lg:px-16 relative overflow-hidden"
    >
      {/* ── background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "var(--orb-1)", opacity: 0.6 }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "var(--orb-2)", opacity: 0.5 }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── section badge ── */}
        <div className={`flex justify-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border text-sm font-semibold"
            style={{ borderColor: "var(--border-hover)", color: "var(--accent)" }}>
            <HiOutlineAcademicCap className="w-4 h-4" />
            LEARN FROM AN INDUSTRY EXPERT
          </span>
        </div>

        {/* ── main two-column layout ── */}
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* ════ LEFT — photo card ════ */}
          <div ref={imgRef} className={`lg:w-5/12 flex justify-center transition-all duration-1000 ${imgVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
            <div className="relative">

              {/* outer glow ring */}
              <div className="absolute -inset-4 rounded-3xl blur-2xl animate-pulse-glow pointer-events-none"
                style={{ background: "linear-gradient(135deg,var(--orb-1),var(--orb-2))", opacity: 0.5 }} />

              {/* rotating badge ring */}
              <div className="absolute -inset-6 rounded-full border border-dashed animate-spin-slow pointer-events-none"
                style={{ borderColor: "var(--border-hover)" }} />

              {/* photo */}
              <div className="relative w-72 h-80 lg:w-80 lg:h-96 rounded-3xl overflow-hidden border-4 shadow-2xl"
                style={{ borderColor: "var(--accent)", boxShadow: `0 0 40px rgba(168,85,247,0.3)` }}>
                <img src={MD} alt="MD — System Design Mentor"
                  className="w-full h-full object-cover object-top" />
                {/* overlay gradient at bottom */}
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                {/* name tag */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-lg leading-tight">MD</p>
                  <p className="text-purple-300 text-xs font-medium">Team Lead · System Design Expert</p>
                </div>
              </div>

              {/* floating credential cards */}
              {credentials.map((c, i) => {
                const positions = [
                  "top-4 -right-16",
                  "top-28 -right-20",
                  "-bottom-6 -right-14",
                  "-bottom-6 -left-14",
                ];
                const delays = [0, 0.3, 0.6, 0.9];
                return (
                  <div key={i}
                    className={`absolute ${positions[i]} glass rounded-2xl px-3 py-2.5 border flex items-center gap-2 shadow-xl
                      transition-all duration-700`}
                    style={{
                      borderColor: "var(--border)",
                      minWidth: "140px",
                      opacity: imgVisible ? 1 : 0,
                      transform: imgVisible ? "scale(1) translateY(0)" : "scale(0.8) translateY(10px)",
                      transitionDelay: `${delays[i] + 0.5}s`,
                      animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                      style={{ background: `${c.color}22`, color: c.color }}>
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight" style={{ color: "var(--text-primary)" }}>{c.label}</p>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{c.sub}</p>
                    </div>
                  </div>
                );
              })}

              {/* experience badge — top-left */}
              <div className="absolute -top-5 -left-5 w-16 h-16 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-xl"
                style={{
                  background: "linear-gradient(135deg,var(--accent),#6366f1)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.5)",
                  opacity: imgVisible ? 1 : 0,
                  transition: "opacity 0.8s 0.4s",
                }}>
                <span className="text-xl leading-none">1+</span>
                <span className="text-[9px] leading-tight opacity-90">Years</span>
              </div>
            </div>
          </div>

          {/* ════ RIGHT — content ════ */}
          <div className={`lg:w-7/12 flex flex-col gap-6 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>

            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight" style={{ color: "var(--text-primary)" }}>
              Learn{" "}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                System Design
              </span>
              <br />with MD
            </h2>

            <p className="text-base leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
              MD brings <span style={{ color: "var(--accent)", fontWeight: 600 }}>1+ year of hands-on Team Lead experience</span> from
              real production systems. Learn how to architect scalable, fault-tolerant systems the same
              way top-tier engineers do in FAANG-level companies.
            </p>

            {/* skill chips */}
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105"
                  style={{
                    background: "var(--accent-soft)",
                    borderColor: "var(--border-hover)",
                    color: "var(--accent)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(8px)",
                    transition: `all 0.5s ${0.1 * i + 0.4}s`,
                  }}>
                  {s}
                </span>
              ))}
            </div>

            {/* what you'll learn list */}
            <ul className="space-y-2">
              {[
                "Design systems that handle millions of requests",
                "Master High-Level & Low-Level Design patterns",
                "Real interview prep with actual case studies",
                "Hands-on with distributed systems architecture",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--accent-green)" }} />
                  {item}
                </li>
              ))}
            </ul>

            {/* ── CTA ── */}
            <div className="flex flex-wrap gap-3 items-center mt-2">
              <button
                className="btn-primary px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2 text-sm"
                onClick={handleExplore}>
                <FiPlay className="w-4 h-4" /> Watch System Design
                <FiArrowRight className="w-4 h-4" />
              </button>
              {hasContent ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass border text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  <FiBookOpen className="w-4 h-4" style={{ color: "var(--accent-green)" }} />
                  {systemDesignCourses.length} course{systemDesignCourses.length !== 1 ? "s" : ""} available
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass border text-sm"
                  style={{ borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  Recording in progress
                </div>
              )}
            </div>

            {/* rating row */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
              </div>
              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>4.9</span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>· Rated by 200+ learners</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorSection;
