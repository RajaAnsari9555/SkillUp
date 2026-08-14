import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { FiArrowLeft, FiPlay, FiList } from "react-icons/fi";
import Nav from "../component/Nav";

const ViewLecture = () => {
  const { courseId } = useParams();
  const { courseData } = useSelector((s) => s.course);
  const selectedCourse = courseData?.find((c) => c._id === courseId);
  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCourse?.lectures?.length > 0) setSelectedLecture(selectedCourse.lectures[0]);
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse?.creator) return;
    axios.post(serverUrl + "/api/course/creator", { userId: selectedCourse.creator?._id || selectedCourse.creator }, { withCredentials: true })
      .then((r) => setCreatorData(r.data)).catch(console.log);
  }, [selectedCourse]);

  return (
    <div className="page-bg min-h-screen flex flex-col relative overflow-hidden">
      <Nav />

      <div className="flex flex-1 pt-[68px] max-h-screen overflow-hidden">
        {/* Main video area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video header */}
          <div className="px-4 lg:px-8 py-4 border-b flex items-center gap-4"
            style={{ borderColor: "var(--border)", background: "var(--bg-layer)" }}>
            <button onClick={() => navigate("/mycourses")}
              className="flex items-center gap-1.5 text-sm hover:scale-105 transition-transform"
              style={{ color: "var(--text-secondary)" }}>
              <FiArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">My Courses</span>
            </button>
            <div className="h-4 w-px" style={{ background: "var(--border)" }} />
            <div className="flex-1 min-w-0">
              <h1 className="text-sm lg:text-base font-bold truncate" style={{ color: "var(--text-primary)" }}>
                {selectedCourse?.title}
              </h1>
              <div className="flex gap-3 text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                <span>{selectedCourse?.category}</span>
                {selectedCourse?.level && <span>• {selectedCourse.level}</span>}
              </div>
            </div>
            {/* Mobile sidebar toggle */}
            <button className="lg:hidden glass border p-2 rounded-xl" style={{ borderColor: "var(--border)" }}
              onClick={() => setSidebarOpen((p) => !p)}>
              <FiList className="w-4 h-4" style={{ color: "var(--text-primary)" }} />
            </button>
          </div>

          {/* Video player */}
          <div className="px-4 lg:px-8 py-6 flex-1">
            <div className="rounded-2xl overflow-hidden bg-black aspect-video border mb-5"
              style={{ borderColor: "var(--border)" }}>
              {selectedLecture?.videoUrl ? (
                <video className="w-full h-full" src={selectedLecture.videoUrl} controls autoPlay key={selectedLecture._id} />
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-3"
                  style={{ color: "var(--text-muted)" }}>
                  <FiPlay className="w-12 h-12 opacity-30" />
                  <p className="text-sm">Select a lecture to start watching</p>
                </div>
              )}
            </div>

            {selectedLecture && (
              <div className="glass rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {selectedLecture.lectureTitle}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {selectedCourse?.title}
                </p>
              </div>
            )}

            {/* Instructor card */}
            {creatorData && (
              <div className="glass rounded-2xl border p-5 mt-4" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-muted)" }}>INSTRUCTOR</h3>
                <div className="flex items-center gap-3">
                  {creatorData.photoUrl ? (
                    <img src={creatorData.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border"
                      style={{ borderColor: "var(--border)" }} />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)" }}>
                      {creatorData.name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{creatorData.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{creatorData.email}</p>
                    {creatorData.description && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{creatorData.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lecture sidebar */}
        <div
          className={`${sidebarOpen ? "flex" : "hidden"} lg:flex flex-col w-80 border-l overflow-y-auto flex-shrink-0 sidebar`}
          style={{ borderColor: "var(--border)" }}
        >
          <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              All Lectures
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {selectedCourse?.lectures?.length || 0} lectures
            </p>
          </div>

          <div className="flex flex-col gap-1.5 p-3">
            {selectedCourse?.lectures?.length ? (
              selectedCourse.lectures.map((lec, idx) => {
                const active = selectedLecture?._id === lec._id;
                return (
                  <button key={idx} onClick={() => setSelectedLecture(lec)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all border text-sm"
                    style={{
                      background: active ? "rgba(168,85,247,0.15)" : "transparent",
                      borderColor: active ? "rgba(168,85,247,0.4)" : "transparent",
                    }}>
                    <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{ background: active ? "rgba(168,85,247,0.25)" : "var(--bg-card)", color: active ? "var(--neon-purple)" : "var(--text-muted)" }}>
                      {active ? <FiPlay className="w-3 h-3" /> : idx + 1}
                    </div>
                    <span className="flex-1 truncate" style={{ color: active ? "var(--neon-purple)" : "var(--text-primary)" }}>
                      {lec.lectureTitle}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                No lectures available
              </p>
            )}
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default ViewLecture;
