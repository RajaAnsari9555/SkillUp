import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyNotes, addNote, removeNote } from "../../redux/noteSlice";
import Nav from "../../component/Nav";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  FiArrowLeft, FiUpload, FiTrash2, FiFileText,
  FiType, FiAlignLeft, FiBookOpen, FiDownload,
} from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";

const SUBJECTS = [
  "System Design", "Web Development", "Data Structures & Algorithms",
  "Database Management", "Operating Systems", "Computer Networks",
  "AI / Machine Learning", "React.js", "Node.js", "MongoDB",
  "Interview Preparation", "Others",
];

const TypeBadge = ({ type }) => {
  const map = {
    pdf:   { label: "PDF",  color: "#f87171" },
    doc:   { label: "DOC",  color: "#60a5fa" },
    other: { label: "FILE", color: "var(--accent)" },
  };
  const s = map[type] || map.other;
  return (
    <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</span>
  );
};

const NotesUpload = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { myNotes } = useSelector(s => s.notes);
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [subject,     setSubject]     = useState("");
  const [file,        setFile]        = useState(null);
  const [fileName,    setFileName]    = useState("");
  const [uploading,   setUploading]   = useState(false);
  const [deletingId,  setDeletingId]  = useState(null);
  const [fetchLoad,   setFetchLoad]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/notes/my", { withCredentials: true });
        dispatch(setMyNotes(res.data));
      } catch (e) { console.error(e); }
      finally { setFetchLoad(false); }
    };
    load();
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setFileName(f.name); }
  };

  const handleUpload = async () => {
    if (!title.trim() || !subject || !file) {
      return toast.error("Title, subject and file are all required");
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title",       title.trim());
      fd.append("description", description.trim());
      fd.append("subject",     subject);
      fd.append("file",        file);

      const res = await axios.post(serverUrl + "/api/notes/upload", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(addNote(res.data));
      toast.success("Note uploaded successfully!");
      setTitle(""); setDescription(""); setSubject("");
      setFile(null); setFileName("");
    } catch (e) {
      const errMsg = e.response?.data?.message || "Upload failed";
      console.error("Upload error:", e);
      
      // Show specific guidance for authentication errors
      if (e.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(errMsg);
      }
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${serverUrl}/api/notes/${id}`, { withCredentials: true });
      dispatch(removeNote(id));
      toast.success("Note deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    } finally { setDeletingId(null); }
  };

  /* group by subject */
  const grouped = myNotes.reduce((acc, n) => {
    if (!acc[n.subject]) acc[n.subject] = [];
    acc[n.subject].push(n);
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
            📄 NOTES & PDF STUDIO
          </span>
          <h1 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            Upload Study Materials
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Upload PDF notes, cheatsheets, and reference documents for students to download free.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Upload form ── */}
          <div className="glass rounded-3xl border p-7 animate-slide-in-left"
            style={{ borderColor: "var(--border)" }}>
            <h2 className="text-base font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}>
              <FiUpload className="w-4 h-4" style={{ color: "var(--accent)" }} />
              New Material
            </h2>

            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              {/* title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiType className="w-3.5 h-3.5" /> Title *
                </label>
                <input className="input-glass" placeholder="e.g. CAP Theorem Cheatsheet"
                  value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              {/* subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiBookOpen className="w-3.5 h-3.5" /> Subject *
                </label>
                <select className="input-glass" value={subject} onChange={e => setSubject(e.target.value)}>
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(s => (
                    <option key={s} value={s} style={{ background: "var(--bg-layer)" }}>{s}</option>
                  ))}
                </select>
              </div>

              {/* description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiAlignLeft className="w-3.5 h-3.5" /> Description (optional)
                </label>
                <textarea className="input-glass" rows={3}
                  placeholder="What does this note cover?"
                  value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              {/* file */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <FiFileText className="w-3.5 h-3.5" /> File (PDF / DOC) *
                </label>
                <label
                  className="flex flex-col items-center gap-3 px-5 py-7 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
                  style={{ borderColor: file ? "var(--accent)" : "var(--border)", background: "var(--bg-card)" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = file ? "var(--accent)" : "var(--border)"}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--border-hover)" }}>
                    <HiOutlineDocumentText className="w-6 h-6" />
                  </div>
                  {fileName ? (
                    <div className="text-center">
                      <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>✓ {fileName}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        Click to select file
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        PDF, DOC, DOCX, TXT supported
                      </p>
                    </div>
                  )}
                  <input type="file"
                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                    className="hidden"
                    onChange={handleFileChange} />
                </label>
              </div>

              {uploading && (
                <div className="px-4 py-3 rounded-2xl text-xs flex items-center gap-2"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--border-hover)" }}>
                  <div className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: "rgba(168,85,247,0.3)", borderTopColor: "var(--accent)" }} />
                  Uploading… please wait
                </div>
              )}

              <button
                className="btn-primary w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 mt-2"
                onClick={handleUpload}
                disabled={uploading}>
                {uploading
                  ? <ClipLoader size={18} color="white" />
                  : <><FiUpload className="w-4 h-4" /> Upload Note</>
                }
              </button>
            </form>
          </div>

          {/* ── My uploaded notes ── */}
          <div className="glass rounded-3xl border p-7 animate-slide-in-right"
            style={{ borderColor: "var(--border)" }}>
            <h2 className="text-base font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}>
              <FiFileText className="w-4 h-4" style={{ color: "var(--accent-2)" }} />
              Your Materials
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
                {myNotes.length} total
              </span>
            </h2>

            {fetchLoad ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 animate-spin"
                  style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
              </div>
            ) : myNotes.length === 0 ? (
              <div className="flex flex-col items-center py-14 gap-3">
                <div className="w-14 h-14 rounded-2xl glass border flex items-center justify-center"
                  style={{ borderColor: "var(--border)" }}>
                  <HiOutlineDocumentText className="w-7 h-7" style={{ color: "var(--text-muted)" }} />
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No materials uploaded yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
                {Object.entries(grouped).map(([subj, items]) => (
                  <div key={subj}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 pl-1"
                      style={{ color: "var(--text-muted)" }}>{subj}</p>
                    {items.map(note => (
                      <div key={note._id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border mb-1 group transition-all"
                        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                          <HiOutlineDocumentText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                              {note.title}
                            </p>
                            <TypeBadge type={note.fileType} />
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <FiDownload className="w-2.5 h-2.5" style={{ color: "var(--text-muted)" }} />
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {note.downloads || 0} downloads
                            </span>
                          </div>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg btn-danger flex-shrink-0"
                          onClick={() => handleDelete(note._id)}
                          disabled={deletingId === note._id}>
                          {deletingId === note._id
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

export default NotesUpload;
