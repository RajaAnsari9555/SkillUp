import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FiArrowLeft, FiUpload, FiTrash2, FiSave } from "react-icons/fi";
import Nav from "../../component/Nav";

const EditLecture = () => {
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { courseId, lectureId } = useParams();
  const { lectureData } = useSelector((s) => s.lecture);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedLecture = lectureData.find((l) => l._id === lectureId);
  const [videoUrl, setVideoUrl] = useState(null);
  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "");
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false);
  const [videoFileName, setVideoFileName] = useState("");

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setVideoUrl(file); setVideoFileName(file.name); }
  };

  const editLecture = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("lectureTitle", lectureTitle);
    fd.append("isPreviewFree", isPreviewFree);
    if (videoUrl) fd.append("videoUrl", videoUrl);
    try {
      const r = await axios.post(`${serverUrl}/api/course/editlecture/${lectureId}`, fd, { withCredentials: true });
      dispatch(setLectureData([...lectureData.filter((l) => l._id !== lectureId), r.data]));
      toast.success("Lecture updated!");
      navigate(`/createlecture/${courseId}`);
    } catch (e) { toast.error(e.response?.data?.message || "Update failed"); }
    finally { setLoading(false); }
  };

  const removeLecture = async () => {
    if (!window.confirm("Remove this lecture?")) return;
    setRemoving(true);
    try {
      await axios.delete(`${serverUrl}/api/course/removelecture/${lectureId}`, { withCredentials: true });
      dispatch(setLectureData(lectureData.filter((l) => l._id !== lectureId)));
      toast.success("Lecture removed");
      navigate(`/createlecture/${courseId}`);
    } catch (e) { toast.error("Failed to remove lecture"); }
    finally { setRemoving(false); }
  };

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.12)" }} />

      <div className="max-w-xl mx-auto px-4 pt-28 pb-16">
        <button onClick={() => navigate(`/createlecture/${courseId}`)}
          className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Lectures
        </button>

        <div className="glass rounded-3xl border p-7 animate-scale-in" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Edit Lecture</h2>
            <button onClick={removeLecture} disabled={removing}
              className="btn-danger px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5">
              {removing ? <ClipLoader size={16} color="#f87171" /> : <><FiTrash2 className="w-3.5 h-3.5" /> Remove</>}
            </button>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Lecture Title</label>
              <input type="text" className="input-glass" placeholder="Lecture title"
                value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
            </div>

            {/* Video upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <FiUpload className="w-3.5 h-3.5" /> Upload Video *
              </label>
              <label className="flex flex-col items-center gap-3 px-5 py-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-purple-400/50"
                style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)" }}>
                  <FiUpload className="w-5 h-5" style={{ color: "var(--neon-purple)" }} />
                </div>
                {videoFileName ? (
                  <p className="text-sm font-medium text-center" style={{ color: "var(--neon-purple)" }}>{videoFileName}</p>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Click to select video</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>MP4, MOV, AVI supported</p>
                  </div>
                )}
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
              </label>
            </div>

            {/* Free preview toggle */}
            <label className="flex items-center justify-between px-4 py-3.5 rounded-2xl border cursor-pointer transition-all hover:border-purple-400/40"
              style={{ background: "var(--bg-card)", borderColor: isPreviewFree ? "rgba(168,85,247,0.4)" : "var(--border)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Free Preview</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Allow non-enrolled users to watch this</p>
              </div>
              <div
                onClick={() => setIsPreviewFree((p) => !p)}
                className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                style={{ background: isPreviewFree ? "linear-gradient(135deg,#a855f7,#6366f1)" : "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div
                  className="absolute w-4 h-4 rounded-full top-1 transition-all duration-300 bg-white shadow-md"
                  style={{ left: isPreviewFree ? "24px" : "4px" }} />
              </div>
            </label>

            {loading && (
              <div className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
                style={{ background: "rgba(168,85,247,0.1)", color: "var(--neon-purple)", border: "1px solid rgba(168,85,247,0.2)" }}>
                <div className="w-4 h-4 rounded-full border-2 border-t-purple-400 animate-spin"
                  style={{ borderColor: "rgba(168,85,247,0.3)", borderTopColor: "var(--neon-purple)" }} />
                Uploading video… please wait
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-secondary flex-1 py-3 rounded-2xl text-sm font-medium"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => navigate(`/createlecture/${courseId}`)}>
                Cancel
              </button>
              <button type="button"
                className="btn-primary flex-1 py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                onClick={editLecture} disabled={loading}>
                {loading ? <ClipLoader size={20} color="white" /> : <><FiSave className="w-4 h-4" /> Update</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLecture;
