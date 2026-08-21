import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setVideos } from "../redux/systemDesignSlice";
import Nav from "../component/Nav";
import {
  FiPlay, FiArrowLeft, FiLayers, FiVideo,
  FiClock, FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import MD from "../assets/MD.jpeg";

const SystemDesign = () => {
  const dispatch         = useDispatch();
  const navigate         = useNavigate();
  const { videos }       = useSelector(s => s.systemDesign);
  const [loading, setLoading]               = useState(true);
  const [selectedVideo, setSelectedVideo]   = useState(null);
  const [openTopics, setOpenTopics]         = useState({});

  /* fetch all videos */
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/systemdesign/all");
        dispatch(setVideos(res.data));
        /* auto-open first topic */
        if (res.data.length > 0) {
          const firstTopic = res.data[0].topic;
          setOpenTopics({ [firstTopic]: true });
          setSelectedVideo(res.data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  /* group videos by topic */
  const grouped = videos.reduce((acc, v) => {
    if (!acc[v.topic]) acc[v.topic] = [];
    acc[v.topic].push(v);
    return acc;
  }, {});

  const toggleTopic = (topic) =>
    setOpenTopics(prev => ({ ...prev, [topic]: !prev[topic] }));

  return (
    <div className="page-bg min-h-screen">
      <Nav />
      {/* bg orbs */}
      <div className="absolute top-32 left-10 w-40 h-40 lg:w-80 lg:h-80 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "var(--orb-1)", opacity: 0.5 }} />
      <div className="absolute bottom-20 right-10 w-36 h-36 lg:w-72 lg:h-72 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "var(--orb-2)", opacity: 0.4, animationDelay: "3s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* back */}
        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 animate-slide-up">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-2xl blur-lg animate-pulse-glow"
              style={{ background: "rgba(168,85,247,0.4)" }} />
            <img src={MD} alt="MD"
              className="relative w-16 h-16 rounded-2xl object-cover object-top border-2"
              style={{ borderColor: "var(--accent)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineAcademicCap className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--accent)" }}>System Design with MD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>
              System Design Masterclass
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              1+ year Team Lead experience · Real production architecture · Free to watch
            </p>
          </div>
          <div className="md:ml-auto flex items-center gap-3">
            <div className="glass rounded-2xl px-4 py-2.5 border text-center" style={{ borderColor: "var(--border)" }}>
              <p className="text-xl font-bold" style={{ color: "var(--accent)" }}>{videos.length}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Videos</p>
            </div>
            <div className="glass rounded-2xl px-4 py-2.5 border text-center" style={{ borderColor: "var(--border)" }}>
              <p className="text-xl font-bold" style={{ color: "var(--accent-2)" }}>
                {Object.keys(grouped).length}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Topics</p>
            </div>
          </div>
        </div>

        {/* loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
            <p style={{ color: "var(--text-muted)" }}>Loading videos…</p>
          </div>
        )}

        {/* empty state */}
        {!loading && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-5 animate-scale-in">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl animate-float glass border"
              style={{ borderColor: "var(--border)" }}>🎬</div>
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Content in Production
            </h3>
            <p className="text-sm max-w-md text-center" style={{ color: "var(--text-secondary)" }}>
              MD is currently recording System Design lectures. Check back soon — content is uploading!
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Recording in progress
            </div>
          </div>
        )}

        {/* main content */}
        {!loading && videos.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── LEFT: video player ── */}
            <div className="lg:flex-1 flex flex-col gap-4">
              {selectedVideo ? (
                <>
                  {/* player */}
                  <div className="rounded-2xl overflow-hidden border bg-black aspect-video"
                    style={{ borderColor: "var(--border)" }}>
                    <video
                      key={selectedVideo._id}
                      src={selectedVideo.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full"
                    />
                  </div>
                  {/* video info */}
                  <div className="glass rounded-2xl border p-5 animate-slide-up"
                    style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2"
                          style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--border-hover)" }}>
                          {selectedVideo.topic}
                        </span>
                        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                          {selectedVideo.title}
                        </h2>
                        {selectedVideo.description && (
                          <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            {selectedVideo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs flex-shrink-0"
                        style={{ color: "var(--text-muted)" }}>
                        <FiClock className="w-3.5 h-3.5" />
                        {new Date(selectedVideo.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border bg-black aspect-video flex items-center justify-center"
                  style={{ borderColor: "var(--border)" }}>
                  <div className="flex flex-col items-center gap-3" style={{ color: "var(--text-muted)" }}>
                    <FiPlay className="w-12 h-12 opacity-30" />
                    <p className="text-sm">Select a video to watch</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: topic sidebar ── */}
            <div className="lg:w-80 flex-shrink-0 flex flex-col gap-3 max-h-[50vh] lg:max-h-[700px] overflow-y-auto pr-1">
              {Object.entries(grouped).map(([topic, topicVideos]) => {
                const isOpen   = openTopics[topic];
                const hasActive = topicVideos.some(v => v._id === selectedVideo?._id);
                return (
                  <div key={topic} className="glass rounded-2xl border overflow-hidden"
                    style={{ borderColor: hasActive ? "var(--border-hover)" : "var(--border)" }}>
                    {/* topic header */}
                    <button
                      onClick={() => toggleTopic(topic)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-all"
                      style={{ background: hasActive ? "var(--accent-soft)" : "transparent" }}>
                      <div className="flex items-center gap-2.5">
                        <FiLayers className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {topic}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
                          {topicVideos.length}
                        </span>
                      </div>
                      {isOpen
                        ? <FiChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                        : <FiChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                      }
                    </button>

                    {/* video list */}
                    {isOpen && (
                      <div className="flex flex-col border-t" style={{ borderColor: "var(--border)" }}>
                        {topicVideos.map((v, idx) => {
                          const isActive = v._id === selectedVideo?._id;
                          return (
                            <button
                              key={v._id}
                              onClick={() => setSelectedVideo(v)}
                              className="flex items-center gap-3 px-4 py-3 text-left transition-all border-b last:border-b-0"
                              style={{
                                borderColor:  "var(--border)",
                                background:   isActive ? "var(--accent-soft)" : "transparent",
                              }}
                              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-card-hover)"; }}
                              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                            >
                              {/* index or play icon */}
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                                style={{
                                  background: isActive ? "var(--accent)" : "var(--bg-card)",
                                  color:      isActive ? "#fff" : "var(--text-muted)",
                                }}>
                                {isActive ? <FiPlay className="w-3 h-3" /> : idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate leading-snug"
                                  style={{ color: isActive ? "var(--accent)" : "var(--text-primary)" }}>
                                  {v.title}
                                </p>
                                <p className="text-[10px] mt-0.5"
                                  style={{ color: "var(--text-muted)" }}>
                                  {new Date(v.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <FiVideo className="w-3.5 h-3.5 flex-shrink-0"
                                style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }} />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDesign;
