import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyVideos, addVideo, removeVideo } from "../../redux/systemDesignSlice";
import Nav from "../../component/Nav";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  FiArrowLeft, FiUpload, FiTrash2, FiLayers,
  FiVideo, FiType, FiAlignLeft, FiHash, FiPlay,
} from "react-icons/fi";

/* ── topic suggestions ── */
const TOPIC_SUGGESTIONS = [
  "Introduction to System Design",
  "Scalability & Load Balancing",
  "Database Design & Sharding",
  "Caching Strategies",
  "Message Queues & Event-Driven",
  "Microservices Architecture",
  "API Design & Rate Limiting",
  "Consistent Hashing",
  "CAP Theorem",
  "Real-World Case Studies",
];

const SystemDesignUpload = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { myVideos } = useSelector(s => s.systemDesign);
  const [title,       setTitle]       = useState("");
  const [topic,       setTopic]       = useState("");
  const [description, setDescription] = useState("");
  const [order,       setOrder]       = useState("");
  const [videoFile,   setVideoFile]   = useState(null);
  const [videoName,   setVideoName]   = useState("");
  const [uploading,   setUploading]   = useState(false);
  const [deletingId,  setDeletingId]  = useState(null);
  const [fetchLoad,   setFetchLoad]   = useState(true);

  /* fetch educator's own videos */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/systemdesign/my", { withCredentials: true });
        dispatch(setMyVideos(res.data));
      } catch (e) { console.error(e); }
      finally { setFetchLoad(false); }
    };
    load();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setVideoFile(file); setVideoName(file.name); }
  };

  const handleUpload = async () => {
    if (!title.trim() || !topic.trim() || !videoFile) {
      return toast.error("Title, topic and video are all required");
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title",       title.trim());
      fd.append("topic",       topic.trim());
      fd.append("description", description.trim());
      fd.append("order",       order || "0");
      fd.append("video",       videoFile);

      const res = await axios.post(serverUrl + "/api/systemdesign/upload", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(addVideo(res.data));
      toast.success("Video uploaded successfully!");
      setTitle(""); setTopic(""); setDescription(""); setOrder("");
      setVideoFile(null); setVideoName("");
    } catch (e) {
      toast.error(e.response?.data?.message || "Upload failed");
    } finally { setUploading(false); }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    setDeletingId(videoId);
    try {
      await axios.delete(`${serverUrl}/api/systemdesign/${videoId}`, { withCredentials: true });
      dispatch(removeVideo(videoId));
      toast.success("Video deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    } finally { setDeletingId(null); }
  };

  /* group for display */
  const grouped = myVideos.reduce((acc, v) => {
    if (!acc[v.topic]) acc[v.topic] = [];
    acc[v.topic].push(v);
    return acc;
  }, {});

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      <div className="absolute top-32 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.10)" }} />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* header */}
        <div className="mb-8 animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold glass border mb-3"
            style={{ borderColor: "var(--border-hover)", color: "var(--accent)" }}>
            🎬 SYSTEM DESIGN STUDIO
          </span>
          <h1 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            Upload System Design Videos
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            No thumbnail needed — just a title, topic and your video. Students can watch for free.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Upload form ── */}
          <div className="glass rounded-3xl border p-7 animate-slide-in-left"
            style={{ borderColor: "var(--border)" }}>
            <h2 className="text-base font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}>
              <FiUpload className="w-4 h-4" style={{ color: "var(--accent)" }} />
              New Video
            </h2>

            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              {/* title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiType className="w-3.5 h-3.5" /> Video Title *
                </label>
                <input className="input-glass" placeholder="e.g. Load Balancer Deep Dive"
                  value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              {/* topic */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiLayers className="w-3.5 h-3.5" /> Topic / Chapter *
                </label>
                <input className="input-glass" placeholder="e.g. Scalability & Load Balancing"
                  value={topic} onChange={e => setTopic(e.target.value)}
                  list="topic-suggestions" />
                <datalist id="topic-suggestions">
                  {TOPIC_SUGGESTIONS.map(t => <option key={t} value={t} />)}
                </datalist>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  Videos with the same topic are grouped together for students
                </p>
              </div>

              {/* description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiAlignLeft className="w-3.5 h-3.5" /> Description (optional)
                </label>
                <textarea className="input-glass" rows={3}
                  placeholder="What will students learn in this video?"
                  value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              {/* order */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiHash className="w-3.5 h-3.5" /> Order within topic (optional)
                </label>
                <input type="number" min="0" className="input-glass"
                  placeholder="0 = first, 1 = second…"
                  value={order} onChange={e => setOrder(e.target.value)} />
              </div>

              {/* video upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiVideo className="w-3.5 h-3.5" /> Video File *
                </label>
                <label
                  className="flex flex-col items-center gap-3 px-5 py-7 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
                  style={{ borderColor: videoFile ? "var(--accent)" : "var(--border)", background: "var(--bg-card)" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = videoFile ? "var(--accent)" : "var(--border)"}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--border-hover)" }}>
                    <FiUpload className="w-5 h-5" />
                  </div>
                  {videoName ? (
                    <p className="text-xs font-semibold text-center" style={{ color: "var(--accent)" }}>
                      ✓ {videoName}
                    </p>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        Click to select video
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        MP4, MOV, AVI, WebM supported
                      </p>
                    </div>
                  )}
                  <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              {uploading && (
                <div className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--border-hover)" }}>
                  <div className="w-4 h-4 rounded-full border-2 border-t-purple-500 animate-spin"
                    style={{ borderColor: "rgba(168,85,247,0.3)", borderTopColor: "var(--accent)" }} />
                  Uploading to Cloudinary… this may take a moment
                </div>
              )}

              <button
                className="btn-primary w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 mt-2"
                onClick={handleUpload}
                disabled={uploading}>
                {uploading
                  ? <ClipLoader size={18} color="white" />
                  : <><FiUpload className="w-4 h-4" /> Upload Video</>
                }
              </button>
            </form>
          </div>

          {/* ── My uploaded videos ── */}
          <div className="glass rounded-3xl border p-7 animate-slide-in-right"
            style={{ borderColor: "var(--border)" }}>
            <h2 className="text-base font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}>
              <FiLayers className="w-4 h-4" style={{ color: "var(--accent-2)" }} />
              Your Videos
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
                {myVideos.length} total
              </span>
            </h2>

            {fetchLoad ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-t-purple-500 animate-spin"
                  style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
              </div>
            ) : myVideos.length === 0 ? (
              <div className="flex flex-col items-center py-14 gap-3">
                <div className="w-14 h-14 rounded-2xl glass border flex items-center justify-center"
                  style={{ borderColor: "var(--border)" }}>
                  <FiVideo className="w-7 h-7" style={{ color: "var(--text-muted)" }} />
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No videos uploaded yet
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[520px] overflow-y-auto pr-1">
                {Object.entries(grouped).map(([t, vids]) => (
                  <div key={t}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 pl-1"
                      style={{ color: "var(--text-muted)" }}>{t}</p>
                    {vids.map(v => (
                      <div key={v._id}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl border mb-1.5 group transition-all"
                        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                          <FiPlay className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {v.title}
                          </p>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                            {new Date(v.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg btn-danger flex-shrink-0"
                          onClick={() => handleDelete(v._id)}
                          disabled={deletingId === v._id}>
                          {deletingId === v._id
                            ? <ClipLoader size={12} color="#f87171" />
                            : <FiTrash2 className="w-3.5 h-3.5" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDesignUpload;
