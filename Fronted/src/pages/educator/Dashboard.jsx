import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from "recharts";
import { FiArrowLeft, FiPlusCircle, FiBookOpen, FiUsers, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import Nav from "../../component/Nav";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 border text-sm" style={{ borderColor: "rgba(168,85,247,0.3)" }}>
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-bold" style={{ color: "var(--neon-purple)" }}>{payload[0].value}</p>
    </div>
  );
};

const Dashboard = () => {
  const { userData } = useSelector((s) => s.user);
  const { creatorCourseData } = useSelector((s) => s.course);
  const navigate = useNavigate();

  const lectureData = creatorCourseData?.map((c) => ({
    name: c.title?.slice(0, 12) + "…",
    lectures: c.lectures?.length || 0,
  })) || [];

  const enrollData = creatorCourseData?.map((c) => ({
    name: c.title?.slice(0, 12) + "…",
    students: c.enrolledStudents?.length || 0,
  })) || [];

  const totalEarning = creatorCourseData?.reduce((sum, c) => sum + ((c.price || 0) * (c.enrolledStudents?.length || 0)), 0) || 0;
  const totalStudents = creatorCourseData?.reduce((s, c) => s + (c.enrolledStudents?.length || 0), 0) || 0;

  const stats = [
    { icon: <FiBookOpen />, label: "Courses", value: creatorCourseData?.length || 0, color: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", text: "var(--neon-purple)" },
    { icon: <FiUsers />, label: "Students", value: totalStudents, color: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.3)", text: "var(--neon-cyan)" },
    { icon: <FiDollarSign />, label: "Earnings", value: `₹${totalEarning.toLocaleString()}`, color: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "var(--neon-green)" },
    { icon: <FiTrendingUp />, label: "Published", value: creatorCourseData?.filter((c) => c.isPublished).length || 0, color: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", text: "#f59e0b" },
  ];

  const tickStyle = { fill: "var(--text-muted)", fontSize: 11 };

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      {/* BG */}
      <div className="absolute top-32 right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.08)" }} />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile banner */}
        <div className="glass rounded-3xl border p-6 mb-8 flex flex-col sm:flex-row items-center gap-5 animate-slide-up"
          style={{ borderColor: "var(--border)" }}>
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full blur-lg animate-pulse-glow"
              style={{ background: "rgba(168,85,247,0.5)" }} />
            {userData?.photoUrl ? (
              <img src={userData.photoUrl} className="relative w-20 h-20 rounded-full object-cover border-4"
                style={{ borderColor: "var(--bg-base)" }} alt="" />
            ) : (
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4"
                style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", borderColor: "var(--bg-base)" }}>
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <p className="text-sm mb-0.5" style={{ color: "var(--text-muted)" }}>Welcome back,</p>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {userData?.name || "Educator"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {userData?.description || "Start creating courses for your students"}
            </p>
          </div>
          <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
            onClick={() => navigate("/courses")}>
            <FiPlusCircle className="w-4 h-4" /> Manage Courses
          </button>
          <button className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
            onClick={() => navigate("/systemdesign/upload")}>
            🎬 System Design
          </button>
          <button className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
            onClick={() => navigate("/notes/upload")}>
            📄 Notes & PDFs
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl border p-5 animate-fade-in"
              style={{ borderColor: "var(--border)", animationDelay: `${i * 0.1}s`, opacity: 0, animationFillMode: "forwards" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg"
                style={{ background: s.color, border: `1px solid ${s.border}`, color: s.text }}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold" style={{ color: s.text }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl border p-6 animate-slide-in-left"
            style={{ borderColor: "var(--border)" }}>
            <h2 className="text-base font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              Lectures per Course
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={lectureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(168,85,247,0.06)" }} />
                <Bar dataKey="lectures" fill="url(#purpleGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl border p-6 animate-slide-in-right"
            style={{ borderColor: "var(--border)" }}>
            <h2 className="text-base font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              Student Enrollment
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(6,182,212,0.06)" }} />
                <Bar dataKey="students" fill="url(#cyanGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
