import React from "react";
import { useNavigate } from "react-router-dom";
import empty from "../../assets/empty.jpg";
import { FiEdit2, FiArrowLeft, FiPlusCircle, FiBookOpen } from "react-icons/fi";
import { useSelector } from "react-redux";
import getCreatorCourse from "../../customHooks/getCreatorCourse";
import Nav from "../../component/Nav";

const Courses = () => {
  const navigate = useNavigate();
  const { creatorCourseData } = useSelector((s) => s.course);
  getCreatorCourse();

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      <div className="absolute top-32 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.08)" }} />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl glass border hover:scale-105 transition-transform"
              style={{ borderColor: "var(--border)" }}>
              <FiArrowLeft className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>My Courses</h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {creatorCourseData?.length || 0} courses created
              </p>
            </div>
          </div>
          <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
            onClick={() => navigate("/createcourse")}>
            <FiPlusCircle className="w-4 h-4" /> Create Course
          </button>
        </div>

        {/* Empty */}
        {!creatorCourseData?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl glass border flex items-center justify-center"
              style={{ borderColor: "var(--border)" }}>
              <FiBookOpen className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
            </div>
            <p style={{ color: "var(--text-secondary)" }}>No courses yet. Create your first one!</p>
            <button className="btn-primary px-7 py-3 rounded-2xl text-sm font-semibold text-white"
              onClick={() => navigate("/createcourse")}>
              Create Course
            </button>
          </div>
        ) : (
          <div className="glass rounded-2xl border overflow-hidden animate-slide-up" style={{ borderColor: "var(--border)" }}>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <span className="col-span-6">Course</span>
              <span className="col-span-2">Price</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-2">Action</span>
            </div>

            {/* Rows */}
            {creatorCourseData.map((course, i) => (
              <div key={i}
                className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center px-5 py-4 border-b gap-3 transition-all hover:bg-white/5 group"
                style={{ borderColor: "var(--border)", animationDelay: `${i * 0.06}s` }}>
                {/* Title + thumb */}
                <div className="col-span-6 flex items-center gap-4">
                  <img src={course.thumbnail || empty} alt=""
                    className="w-16 h-12 rounded-xl object-cover border flex-shrink-0"
                    style={{ borderColor: "var(--border)" }} />
                  <div>
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: "var(--text-primary)" }}>
                      {course.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {course.lectures?.length || 0} lectures
                    </p>
                  </div>
                </div>
                {/* Price */}
                <div className="col-span-2 md:block flex items-center gap-2">
                  <span className="text-xs md:hidden font-medium" style={{ color: "var(--text-muted)" }}>Price:</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {course.price ? `₹${course.price}` : "—"}
                  </span>
                </div>
                {/* Status */}
                <div className="col-span-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      background: course.isPublished ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.10)",
                      borderColor: course.isPublished ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)",
                      color: course.isPublished ? "var(--neon-green)" : "#f87171",
                    }}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                {/* Edit */}
                <div className="col-span-2">
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105 border"
                    style={{ background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}
                    onClick={() => navigate(`/editcourse/${course._id}`)}>
                    <FiEdit2 className="w-3 h-3" /> Edit
                  </button>
                </div>
              </div>
            ))}

            <p className="text-center text-xs py-4" style={{ color: "var(--text-muted)" }}>
              Your complete course library
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
