import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { serverUrl } from "../../App";
import axios from "axios";
import { FiArrowLeft, FiBookOpen, FiTag, FiZap } from "react-icons/fi";
import Nav from "../../component/Nav";

const categories = [
  "App Development", "AI/ML", "Data Science", "AI Tools",
  "Data Analytics", "Ethical Hacking", "UI/UX Design", "Web Development", "Others",
];

const CreateCourses = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async () => {
    if (!title.trim() || !category) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true });
      navigate("/courses");
      toast.success("Course created!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating course");
    } finally { setLoading(false); }
  };

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.12)" }} />

      <div className="max-w-xl mx-auto px-4 pt-28 pb-16">
        <button onClick={() => navigate("/courses")} className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        <div className="glass rounded-3xl border p-8 animate-scale-in" style={{ borderColor: "var(--border)" }}>
          {/* Icon header */}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <FiBookOpen className="w-5 h-5" style={{ color: "var(--neon-purple)" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Create Course</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Start with a title and category</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <FiBookOpen className="w-3.5 h-3.5" /> Course Title
              </label>
              <input type="text" className="input-glass" placeholder="e.g. Complete MERN Stack Bootcamp"
                value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <FiTag className="w-3.5 h-3.5" /> Category
              </label>
              <select className="input-glass" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c} style={{ background: "var(--bg-layer)" }}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-secondary flex-1 py-3 rounded-2xl text-sm font-medium"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => navigate("/courses")}>
                Cancel
              </button>
              <button type="button"
                className="btn-primary flex-1 py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                onClick={handleCreateCourse} disabled={loading}>
                {loading ? <ClipLoader size={20} color="white" /> : <><FiZap className="w-4 h-4" /> Create</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourses;
