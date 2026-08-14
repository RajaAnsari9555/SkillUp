import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Nav from "../component/Nav";
import Logos from "../component/Logos";
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import About from "../component/About";
import Footer from "../component/Footer";
import ReviewPage from "../component/ReviewPage";
import LiveCodingBox from "../component/LiveCodingBox";
import QuizArena from "../component/QuizArena";
import MentorSection from "../component/MentorSection";
import MobileNotificationSection from "../component/MobileNotificationSection";
import { useNavigate } from "react-router-dom";
import ai  from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import {
  FiArrowRight, FiZap, FiAward, FiUsers, FiBookOpen, FiStar, FiTrendingUp,
} from "react-icons/fi";

/* ── floating particle ── */
const Particle = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none animate-pulse-glow" style={style} />
);

/* ── typewriter headline ── */
const words = ["MERN Developer","React Expert","Node.js Pro","Full-Stack Dev","Cloud Builder"];
const TypeWriter = () => {
  const [wordIdx,   setWordIdx]   = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting,  setDeleting]  = useState(false);
  useEffect(() => {
    const word = words[wordIdx];
    const t = deleting
      ? displayed.length === 0
        ? setTimeout(() => { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }, 300)
        : setTimeout(() => setDisplayed(d => d.slice(0, -1)), 60)
      : displayed.length === word.length
        ? setTimeout(() => setDeleting(true), 1800)
        : setTimeout(() => setDisplayed(d => word.slice(0, d.length + 1)), 80);
    return () => clearTimeout(t);
  }, [displayed, deleting, wordIdx]);
  return (
    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
      {displayed}<span className="animate-pulse" style={{ color: "var(--accent)" }}>|</span>
    </span>
  );
};

/* ── animated count-up stat ── */
const CountStat = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value);
  useEffect(() => {
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      setCount(c => { if (c + step >= target) { clearInterval(t); return target; } return c + step; });
    }, 25);
    return () => clearInterval(t);
  }, [target]);
  return (
    <div className="flex flex-col items-center gap-1 text-center group">
      <div className="mb-1 group-hover:scale-125 transition-transform" style={{ color: "var(--accent)" }}>{icon}</div>
      <span className="text-3xl lg:text-4xl font-extrabold" style={{ color: "var(--stat-text)" }}>
        {count.toLocaleString()}{value.includes("K") ? "K+" : value.includes("%") ? "%" : "+"}
      </span>
      <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="w-full overflow-x-hidden" style={{ background: "var(--bg-base)" }}>
      <Nav />

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-4 overflow-hidden">
        {/* hero bg */}
        <div className="absolute inset-0 transition-all duration-500" style={{ background: "var(--hero-bg)" }} />

        {/* orbs */}
        <div className="absolute top-20 left-[10%] w-96 h-96 rounded-full blur-3xl animate-orb pointer-events-none"
          style={{ background: "var(--orb-1)" }} />
        <div className="absolute bottom-10 right-[8%] w-80 h-80 rounded-full blur-3xl animate-orb pointer-events-none"
          style={{ background: "var(--orb-2)", animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--orb-3)" }} />

        {/* grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--grid-line) 1px,transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />

        {/* particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <Particle key={i} style={{
            width:  `${Math.random() * 5 + 2}px`,
            height: `${Math.random() * 5 + 2}px`,
            top:    `${Math.random() * 100}%`,
            left:   `${Math.random() * 100}%`,
            background: i % 3 === 0 ? "var(--particle-1)" : i % 3 === 1 ? "var(--particle-2)" : "var(--particle-3)",
            opacity: isDark ? Math.random() * 0.5 + 0.2 : Math.random() * 0.3 + 0.1,
            animationDelay:    `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }} />
        ))}

        {/* rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full animate-spin-slow pointer-events-none"
          style={{ border: "1px solid var(--ring)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ border: "1px solid var(--ring)", animation: "spin-slow 30s linear infinite reverse" }} />

        {/* ── content ── */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6">
          {/* badge */}
          <div className="animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border text-sm font-medium"
              style={{ borderColor: "var(--border-hover)", color: "var(--accent)" }}>
              <FiZap className="w-4 h-4 text-yellow-400" />
              AI-Powered Learning Platform
            </span>
          </div>

          {/* headline */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
              style={{ color: "var(--text-primary)" }}>
              Grow Your Skills
            </h1>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mt-1">
              Become a <TypeWriter />
            </h1>
          </div>

          {/* sub */}
          <div className="animate-slide-up" style={{ animationDelay: "0.35s", opacity: 0, animationFillMode: "forwards" }}>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Master MERN Stack, AI/ML, Cloud and more with expert-led courses, live coding challenges,
              AI-powered search, and real-time quizzes. Join 50,000+ learners today.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 animate-slide-up"
            style={{ animationDelay: "0.5s", opacity: 0, animationFillMode: "forwards" }}>
            <button className="btn-primary px-8 py-4 rounded-2xl text-base font-semibold flex items-center gap-2"
              onClick={() => navigate("/allcourses")}>
              Explore Courses <FiArrowRight className="w-5 h-5" />
            </button>
            <button className="btn-secondary px-8 py-4 rounded-2xl text-base font-semibold flex items-center gap-2"
              onClick={() => navigate("/search")}>
              <img src={ai} alt="AI" className="w-5 h-5 rounded-full hidden sm:block" />
              <img src={ai1} alt="AI" className="w-5 h-5 rounded-full sm:hidden" />
              AI Course Search
            </button>
          </div>

          {/* social proof */}
          <div className="flex items-center gap-3 mt-2 animate-fade-in"
            style={{ animationDelay: "0.8s", opacity: 0, animationFillMode: "forwards" }}>
            <div className="flex -space-x-2">
              {["A","B","C","D"].map((l, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${i*60+250},65%,50%)`, borderColor: "var(--social-border)" }}>
                  {l}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <FiStar key={i} className="w-3.5 h-3.5 text-yellow-400" />)}
              </div>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>4.9</span> from 12K+ reviews
              </span>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div className="relative z-10 w-full max-w-4xl mx-auto mt-20 animate-slide-up"
          style={{ animationDelay: "0.6s", opacity: 0, animationFillMode: "forwards" }}>
          <div className="glass rounded-3xl p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-8"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--glass-shadow)" }}>
            <CountStat value="50K" label="Students"    icon={<FiUsers     className="w-5 h-5" />} />
            <CountStat value="20K" label="Courses"     icon={<FiBookOpen  className="w-5 h-5" />} />
            <CountStat value="500" label="Instructors" icon={<FiAward     className="w-5 h-5" />} />
            <CountStat value="95"  label="Success Rate %" icon={<FiTrendingUp className="w-5 h-5" />} />
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: "var(--scroll-border)" }}>
            <div className="w-1.5 h-2.5 rounded-full animate-bounce"
              style={{ background: "var(--scroll-dot)" }} />
          </div>
        </div>
      </section>

      <div className="section-divider" />
      <Logos />
      <div className="section-divider" />
      <ExploreCourses />
      <div className="section-divider" />
      <CardPage />
      <div className="section-divider" />
      <LiveCodingBox />
      <div className="section-divider" />
      <QuizArena />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <MentorSection />
      <div className="section-divider" />
      <MobileNotificationSection />
      <div className="section-divider" />
      <ReviewPage />
      <Footer />
    </div>
  );
};

export default Home;
