import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiBook, FiEdit2, FiUser, FiShield } from "react-icons/fi";
import Nav from "../component/Nav";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      {/* BG orbs */}
      <div className="absolute top-32 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.12)" }} />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(6,182,212,0.08)", animationDelay: "3s" }} />

      <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Profile card */}
        <div className="glass rounded-3xl border overflow-hidden animate-slide-up" style={{ borderColor: "var(--border)" }}>
          {/* Header banner */}
          <div className="h-28 relative" style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.4),rgba(6,182,212,0.3))" }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.3) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
          </div>

          <div className="px-6 lg:px-10 pb-8">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-14 mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-lg animate-pulse-glow"
                  style={{ background: "rgba(168,85,247,0.5)" }} />
                {userData?.photoUrl ? (
                  <img src={userData.photoUrl} alt=""
                    className="relative w-24 h-24 rounded-full object-cover border-4"
                    style={{ borderColor: "var(--bg-base)" }} />
                ) : (
                  <div className="relative w-24 h-24 rounded-full border-4 flex items-center justify-center text-3xl font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", borderColor: "var(--bg-base)" }}>
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "var(--bg-base)", border: "2px solid var(--border)" }}>
                  <span className="text-[9px]">{userData?.role === "educator" ? "🏫" : "🎓"}</span>
                </div>
              </div>
              <button className="btn-primary px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 text-white"
                onClick={() => navigate("/editprofile")}>
                <FiEdit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>

            {/* Name & role */}
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{userData?.name}</h1>
            <div className="flex items-center gap-2 mt-1 mb-5">
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold capitalize border"
                style={{ background: "rgba(168,85,247,0.12)", borderColor: "rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}>
                <FiShield className="inline w-3 h-3 mr-1" />
                {userData?.role}
              </span>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <FiMail />, label: "Email", value: userData?.email },
                { icon: <FiBook />, label: "Enrolled Courses", value: `${userData?.enrolledCourses?.length || 0} courses` },
                { icon: <FiUser />, label: "Bio", value: userData?.description || "No bio added yet", full: true },
              ].map((item) => (
                <div key={item.label} className={`glass rounded-2xl p-4 border ${item.full ? "sm:col-span-2" : ""}`}
                  style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2 mb-1.5" style={{ color: "var(--neon-purple)" }}>
                    {item.icon}
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="flex gap-3 mt-6 flex-wrap">
              <button className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => navigate("/mycourses")}>
                📚 My Courses
              </button>
              {userData?.role === "educator" && (
                <button className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                  onClick={() => navigate("/dashboard")}>
                  📊 Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
