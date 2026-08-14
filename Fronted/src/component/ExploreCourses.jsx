import React, { useState } from "react";
import { SiViaplay, SiUikit, SiGoogledataproc, SiOpenaigym } from "react-icons/si";
import { TbDeviceDesktopAnalytics, TbBrandOpenai } from "react-icons/tb";
import { IoMdPhonePortrait } from "react-icons/io";
import { FaHackerrank, FaDatabase } from "react-icons/fa";
import { FiX, FiArrowRight, FiVideo, FiClock } from "react-icons/fi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "./Card";

/* ── category config — label must match exactly what's stored in DB ── */
const categories = [
  { icon: <TbDeviceDesktopAnalytics className="w-9 h-9" />, label: "Web Dev",         dbKey: "Web Development",  color: "var(--accent-2)" },
  { icon: <SiUikit                  className="w-9 h-9" />, label: "UI/UX Design",    dbKey: "UI/UX Design",     color: "var(--accent-3)" },
  { icon: <IoMdPhonePortrait        className="w-9 h-9" />, label: "App Dev",         dbKey: "App Development",  color: "var(--accent)" },
  { icon: <FaHackerrank             className="w-9 h-9" />, label: "Ethical Hacking", dbKey: "Ethical Hacking",  color: "#ef4444" },
  { icon: <TbBrandOpenai            className="w-9 h-9" />, label: "AI / ML",         dbKey: "AI/ML",            color: "var(--accent-2)" },
  { icon: <SiGoogledataproc         className="w-9 h-9" />, label: "Data Science",    dbKey: "Data Science",     color: "#f59e0b" },
  { icon: <FaDatabase               className="w-9 h-9" />, label: "Data Analytics",  dbKey: "Data Analytics",   color: "var(--accent-green)" },
  { icon: <SiOpenaigym              className="w-9 h-9" />, label: "AI Tools",        dbKey: "AI Tools",         color: "var(--accent)" },
];

/* ── rotating "coming soon" messages ── */
const comingSoonMessages = [
  { emoji: "🎬", headline: "Content in Production",      sub: "Our instructors are recording lessons for this category. Stay tuned!" },
  { emoji: "🎙️", headline: "Recording in Progress",      sub: "High-quality content is on its way. Check back soon." },
  { emoji: "🚀", headline: "Launching Soon",             sub: "We're putting the finishing touches on this category. Won't be long!" },
  { emoji: "📹", headline: "Studio Session Active",      sub: "Cameras are rolling! Expect fresh courses here very soon." },
  { emoji: "⚡", headline: "Almost Ready",               sub: "This category is being uploaded and will go live shortly." },
];

/* pick a consistent message per category based on its index */
const getComingSoon = (idx) => comingSoonMessages[idx % comingSoonMessages.length];

const ExploreCourses = () => {
  const navigate                    = useNavigate();
  const { courseData }              = useSelector(s => s.course);
  const [selected, setSelected]     = useState(null); // category object | null

  const handleCategoryClick = (cat) => {
    setSelected(prev => prev?.dbKey === cat.dbKey ? null : cat);
  };

  /* filter published courses by selected category */
  const filteredCourses = selected
    ? (courseData || []).filter(
        c => c.isPublished &&
             c.category?.trim().toLowerCase() === selected.dbKey.trim().toLowerCase()
      )
    : [];

  const selectedIdx = selected ? categories.findIndex(c => c.dbKey === selected.dbKey) : 0;
  const comingSoon  = getComingSoon(selectedIdx);

  return (
    <section className="w-full px-6 lg:px-20 py-20 relative">

      {/* ── top two-column row ── */}
      <div className="flex flex-col lg:flex-row items-start gap-16">

        {/* LEFT */}
        <div className="lg:w-5/12 flex flex-col gap-6">
          <span className="inline-block w-fit px-4 py-1.5 rounded-full text-xs font-semibold glass border"
            style={{ borderColor: "var(--border-hover)", color: "var(--accent)" }}>
            🎓 EXPLORE CATEGORIES
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            Explore Our{" "}
            <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Courses
            </span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            SkillUp is an AI-powered learning platform built to help you grow your knowledge with ease.
            Click any category below to instantly browse its courses.
          </p>
          <button className="btn-primary w-fit px-7 py-3.5 rounded-2xl text-base font-semibold flex items-center gap-2"
            onClick={() => navigate("/allcourses")}>
            Explore All Courses <SiViaplay className="w-4 h-4" />
          </button>
        </div>

        {/* RIGHT — category grid */}
        <div className="lg:w-7/12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const isActive = selected?.dbKey === cat.dbKey;
            return (
              <div
                key={i}
                onClick={() => handleCategoryClick(cat)}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 select-none"
                style={{
                  background:   isActive ? `${cat.color}18`      : "var(--bg-card)",
                  borderColor:  isActive ? cat.color              : "var(--border)",
                  boxShadow:    isActive ? `0 0 18px ${cat.color}30` : "var(--glass-shadow)",
                  backdropFilter: "blur(16px)",
                  transform:    isActive ? "scale(1.06)"          : undefined,
                }}
              >
                <span
                  className="transition-transform duration-300 group-hover:scale-110"
                  style={{ color: cat.color }}>
                  {cat.icon}
                </span>
                <span
                  className="text-xs font-semibold text-center"
                  style={{ color: isActive ? cat.color : "var(--text-secondary)" }}>
                  {cat.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: cat.color }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── results panel — slides in when a category is selected ── */}
      {selected && (
        <div className="mt-12 animate-slide-up">
          {/* panel header */}
          <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${selected.color}18`, color: selected.color, border: `1px solid ${selected.color}30` }}>
                {selected.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {selected.label}
                </h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {filteredCourses.length > 0 && (
                <button
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5"
                  style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                  onClick={() => navigate("/allcourses")}>
                  View All <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-xl glass border transition-all hover:scale-110"
                style={{ borderColor: "var(--border)" }}
                title="Close">
                <FiX className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
          </div>

          {/* ── has courses ── */}
          {filteredCourses.length > 0 ? (
            <div className="flex flex-wrap gap-6">
              {filteredCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="animate-fade-in"
                  style={{ opacity: 0, animationFillMode: "forwards", animationDelay: `${idx * 0.07}s` }}>
                  <Card
                    thumbnail={course.thumbnail}
                    title={course.title}
                    category={course.category}
                    price={course.price}
                    id={course._id}
                    reviews={course.reviews}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* ── empty state ── */
            <div
              className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl border animate-scale-in"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                borderStyle: "dashed",
              }}>
              {/* icon side */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl animate-float"
                  style={{ background: `${selected.color}15`, border: `1.5px solid ${selected.color}30` }}>
                  {comingSoon.emoji}
                </div>
                {/* recording indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                  style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  Recording
                </div>
              </div>

              {/* text side */}
              <div className="flex flex-col gap-3 text-center md:text-left">
                <h4 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {comingSoon.headline}
                </h4>
                <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--text-secondary)" }}>
                  {comingSoon.sub}
                </p>

                {/* timeline chips */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-1">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass border"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    <FiVideo className="w-3 h-3" style={{ color: selected.color }} />
                    Content being prepared
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass border"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    <FiClock className="w-3 h-3" style={{ color: "var(--accent-green)" }} />
                    Coming soon
                  </div>
                </div>

                {/* explore other categories hint */}
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Meanwhile, explore other categories or{" "}
                  <button
                    className="font-semibold hover:underline"
                    style={{ color: "var(--accent)" }}
                    onClick={() => navigate("/allcourses")}>
                    browse all courses →
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ExploreCourses;
