import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { FiArrowLeft, FiEdit2, FiPlusCircle, FiBookOpen } from "react-icons/fi";
import Nav from "../../component/Nav";

const CreateLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector((s) => s.lecture);

  useEffect(() => {
    axios.get(`${serverUrl}/api/course/courselectures/${courseId}`, { withCredentials: true })
      .then((r) => dispatch(setLectureData(r.data.lectures))).catch(console.log);
  }, [courseId]);

  const handleCreate = async () => {
    if (!lectureTitle.trim()) return toast.error("Lecture title cannot be empty");
    setLoading(true);
    try {
      const r = await axios.post(`${serverUrl}/api/course/createlecture/${courseId}`, { lectureTitle }, { withCredentials: true });
      dispatch(setLectureData([...lectureData, r.data.lecture]));
      toast.success("Lecture created!");
      setLectureTitle("");
    } catch (e) { toast.error(e.response?.data?.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      <div className="absolute top-32 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.10)" }} />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <button onClick={() => navigate(`/editcourse/${courseId}`)}
          className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Course
        </button>

        <div className="glass rounded-3xl border p-7 animate-scale-in" style={{ borderColor: "var(--border)" }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <FiBookOpen className="w-5 h-5" style={{ color: "var(--neon-purple)" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Add Lecture</h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Enter title and upload video content</p>
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-3 mb-6">
            <input type="text" className="input-glass flex-1"
              placeholder="e.g. Introduction to MERN Stack"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()} />
            <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 flex-shrink-0"
              disabled={loading} onClick={handleCreate}>
              {loading ? <ClipLoader size={18} color="white" /> : <><FiPlusCircle className="w-4 h-4" /> Add</>}
            </button>
          </div>

          {/* Lecture list */}
          {lectureData?.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                {lectureData.length} Lecture{lectureData.length !== 1 ? "s" : ""}
              </p>
              {lectureData.map((lec, idx) => (
                <div key={idx}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl border transition-all hover:border-purple-400/40 group"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "rgba(168,85,247,0.15)", color: "var(--neon-purple)", border: "1px solid rgba(168,85,247,0.3)" }}>
                      {idx + 1}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>{lec.lectureTitle}</span>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all border"
                    style={{ background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}
                    onClick={() => navigate(`/editlecture/${courseId}/${lec._id}`)}>
                    <FiEdit2 className="w-3 h-3" /> Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No lectures yet — add your first one above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
