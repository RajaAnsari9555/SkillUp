import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2, FiArrowLeft, FiTrash2, FiSave, FiEye, FiEyeOff, FiImage, FiVideo } from "react-icons/fi";
import empty from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../redux/courseSlice";
import Nav from "../../component/Nav";

const categories = ["App Development","AI/ML","Data Science","AI Tools","Data Analytics","Ethical Hacking","UI/UX Design","Web Development","Others"];
const levels    = ["Beginner","Intermediate","Advance"];

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
    <input type={type} className="input-glass" placeholder={placeholder}
      value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const EditCourse = () => {
  const navigate   = useNavigate();
  const { courseId } = useParams();
  const thumb      = useRef();
  const dispatch   = useDispatch();
  const { courseData } = useSelector((s) => s.course);

  const [course,  setCourse]    = useState(null);
  const [isPublish, setPublish] = useState(false);
  const [title,   setTitle]     = useState("");
  const [subTitle,setSubTitle]  = useState("");
  const [desc,    setDesc]      = useState("");
  const [cat,     setCat]       = useState("");
  const [level,   setLevel]     = useState("");
  const [price,   setPrice]     = useState("");
  const [previewImg, setPreviewImg] = useState(empty);
  const [backendImg, setBackendImg] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true })
      .then((r) => setCourse(r.data)).catch(console.log);
  }, []);

  useEffect(() => {
    if (!course) return;
    setTitle(course.title || "");
    setSubTitle(course.subTitle || "");
    setDesc(course.description || "");
    setCat(course.category || "");
    setLevel(course.level || "");
    setPrice(course.price || "");
    setPreviewImg(course.thumbnail || empty);
    setPublish(course.isPublished || false);
  }, [course]);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) { setBackendImg(file); setPreviewImg(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("title", title); fd.append("subTitle", subTitle);
    fd.append("description", desc); fd.append("category", cat);
    fd.append("level", level); fd.append("price", price);
    fd.append("isPublished", isPublish);
    if (backendImg) fd.append("thumbnail", backendImg);
    try {
      const r = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, fd, { withCredentials: true });
      const updated = r.data;
      const list = isPublish
        ? (courseData.some((c) => c._id === courseId) ? courseData.map((c) => c._id === courseId ? updated : c) : [...courseData, updated])
        : courseData.filter((c) => c._id !== courseId);
      dispatch(setCourseData(list));
      toast.success("Course updated!");
      navigate("/courses");
    } catch (e) { toast.error(e.response?.data?.message || "Update failed"); }
    finally { setLoading(false); }
  };

  const handleRemove = async () => {
    if (!window.confirm("Remove this course? This cannot be undone.")) return;
    setLoading1(true);
    try {
      await axios.delete(`${serverUrl}/api/course/remove/${courseId}`, { withCredentials: true });
      dispatch(setCourseData(courseData.filter((c) => c._id !== courseId)));
      toast.success("Course removed");
      navigate("/courses");
    } catch (e) { toast.error(e.response?.data?.message); }
    finally { setLoading1(false); }
  };

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      <div className="absolute top-32 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.08)" }} />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/courses")} className="p-2 rounded-xl glass border hover:scale-105 transition-transform"
              style={{ borderColor: "var(--border)" }}>
              <FiArrowLeft className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
            </button>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Edit Course</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 border transition-all"
              style={{
                background: isPublish ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                borderColor: isPublish ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)",
                color: isPublish ? "#f87171" : "var(--neon-green)",
              }}
              onClick={() => setPublish((p) => !p)}>
              {isPublish ? <><FiEyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><FiEye className="w-3.5 h-3.5" /> Publish</>}
            </button>
            <button onClick={() => navigate(`/createlecture/${course?._id}`)}
              className="btn-primary px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-1.5">
              <FiVideo className="w-3.5 h-3.5" /> Lectures
            </button>
            <button onClick={handleRemove} disabled={loading1}
              className="btn-danger px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5">
              {loading1 ? <ClipLoader size={16} color="#f87171" /> : <><FiTrash2 className="w-3.5 h-3.5" /> Remove</>}
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl border p-6 lg:p-8 animate-slide-up" style={{ borderColor: "var(--border)" }}>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Title" value={title} onChange={setTitle} placeholder="Course title" />
              <InputField label="Subtitle" value={subTitle} onChange={setSubTitle} placeholder="Short subtitle" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Description</label>
              <textarea className="input-glass" rows={4} placeholder="Describe your course..."
                value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Category</label>
                <select className="input-glass" value={cat} onChange={(e) => setCat(e.target.value)}>
                  <option value="">Select</option>
                  {categories.map((c) => <option key={c} value={c} style={{ background: "var(--bg-layer)" }}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Level</label>
                <select className="input-glass" value={level} onChange={(e) => setLevel(e.target.value)}>
                  {levels.map((l) => <option key={l} value={l} style={{ background: "var(--bg-layer)" }}>{l}</option>)}
                </select>
              </div>
              <InputField label="Price (₹)" value={price} onChange={setPrice} placeholder="999" type="number" />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <FiImage className="w-3.5 h-3.5" /> Thumbnail
              </label>
              <input type="file" accept="image/*" ref={thumb} hidden onChange={handleThumbnail} />
              <div className="relative w-72 h-44 rounded-2xl overflow-hidden border cursor-pointer group"
                style={{ borderColor: "var(--border)" }}
                onClick={() => thumb.current.click()}>
                <img src={previewImg} alt="thumbnail" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiEdit2 className="text-white w-7 h-7" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-secondary px-6 py-3 rounded-2xl text-sm font-medium"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => navigate("/courses")}>
                Cancel
              </button>
              <button type="button" className="btn-primary px-8 py-3 rounded-2xl text-sm font-semibold text-white flex items-center gap-2"
                onClick={handleSave} disabled={loading}>
                {loading ? <ClipLoader size={20} color="white" /> : <><FiSave className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
