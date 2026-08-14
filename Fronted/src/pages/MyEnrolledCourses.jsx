import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlay, FiBook } from "react-icons/fi";
import Nav from "../component/Nav";
import empty from "../assets/empty.jpg";

const MyEnrolledCourses = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      {/* BG orbs */}
      <div className="absolute top-40 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.1)" }} />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(6,182,212,0.08)", animationDelay: "4s" }} />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold glass border mb-4"
            style={{ borderColor: "rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}>
            📚 MY LEARNING
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            My Enrolled Courses
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {userData?.enrolledCourses?.length || 0} courses in your library
          </p>
        </div>

        {/* Empty state */}
        {!userData?.enrolledCourses?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl glass border flex items-center justify-center"
              style={{ borderColor: "var(--border)" }}>
              <FiBook className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
              You haven't enrolled in any course yet
            </p>
            <button className="btn-primary px-7 py-3 rounded-2xl text-sm font-semibold text-white"
              onClick={() => navigate("/allcourses")}>
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="glass rounded-2xl border overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
                style={{ borderColor: "var(--border)", animationDelay: `${index * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}
                onClick={() => navigate(`/viewlecture/${course._id}`)}
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course?.thumbnail || empty}
                    alt={course?.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                      <FiPlay className="text-white w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                    style={{ background: "rgba(168,85,247,0.3)", color: "white", backdropFilter: "blur(8px)", border: "1px solid rgba(168,85,247,0.4)" }}>
                    {course?.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors"
                    style={{ color: "var(--text-primary)" }}>
                    {course?.title}
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    Level: {course?.level || "Beginner"}
                  </p>
                  <button className="btn-primary w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2">
                    <FiPlay className="w-3.5 h-3.5" /> Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrolledCourses;
