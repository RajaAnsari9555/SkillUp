import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setNotes, bumpDownload } from "../redux/noteSlice";
import Nav from "../component/Nav";
import { useNavigate } from "react-router-dom";
import {
  FiDownload, FiArrowLeft, FiSearch, FiBookOpen,
  FiFileText, FiFilter, FiX, FiEye, FiExternalLink,
} from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";

/* ── file type badge ── */
const TypeBadge = ({ type }) => {
  const map = {
    pdf:   { label: "PDF",  bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",  color: "#f87171" },
    doc:   { label: "DOC",  bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)", color: "#60a5fa" },
    other: { label: "FILE", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)", color: "var(--accent)" },
  };
  const s = map[type] || map.other;
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
      style={{ background: s.bg, borderColor: s.border, color: s.color }}>
      {s.label}
    </span>
  );
};

/* ── Preview Modal ── */
const PreviewModal = ({ note, onClose, onDownload }) => {
  const isPDF = note.fileType === 'pdf';
  const viewUrl = `${serverUrl}/api/notes/${note._id}/view`;
  const downloadUrl = `${serverUrl}/api/notes/${note._id}/download`;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}>
      <div className="glass rounded-3xl border w-full max-w-6xl max-h-[90vh] flex flex-col animate-scale-in"
        style={{ borderColor: "var(--border-hover)" }}
        onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
              <HiOutlineDocumentText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{note.title}</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{note.subject}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}>
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden p-5">
          {isPDF ? (
            <iframe
              src={viewUrl}
              className="w-full h-full rounded-2xl border"
              style={{ borderColor: "var(--border)", minHeight: "500px" }}
              title={note.title}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-5">
              <div className="w-20 h-20 rounded-3xl glass border flex items-center justify-center"
                style={{ borderColor: "var(--border)" }}>
                <HiOutlineDocumentText className="w-10 h-10" style={{ color: "var(--accent)" }} />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  Preview not available
                </h4>
                <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                  This {note.fileType?.toUpperCase()} file cannot be previewed in browser.
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Please download to view the content.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-5 border-t" style={{ borderColor: "var(--border)" }}>
          <a
            href={viewUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            style={{ textDecoration: "none" }}>
            <FiExternalLink className="w-3.5 h-3.5" /> Open in New Tab
          </a>
          <a
            href={downloadUrl}
            onClick={() => onDownload(note._id)}
            className="btn-primary flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            style={{ textDecoration: "none" }}>
            <FiDownload className="w-3.5 h-3.5" /> Download {note.fileType?.toUpperCase()}
          </a>
        </div>
      </div>
    </div>
  );
};

/* ── single note card ── */
const NoteCard = ({ note, onDownload, onPreview, index }) => {
  const downloadUrl = `${serverUrl}/api/notes/${note._id}/download`;
  
  return (
    <div
      className="glass rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
      style={{
        borderColor: "var(--border)",
        animationDelay: `${index * 0.06}s`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {/* icon + type */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--border-hover)" }}>
          <HiOutlineDocumentText className="w-5 h-5" />
        </div>
        <TypeBadge type={note.fileType} />
      </div>

      {/* subject chip */}
      <span className="text-[10px] font-bold uppercase tracking-wider w-fit px-2.5 py-0.5 rounded-full"
        style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
        {note.subject}
      </span>

      {/* title & desc */}
      <div>
        <h3 className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
          {note.title}
        </h3>
        {note.description && (
          <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
            {note.description}
          </p>
        )}
      </div>

      {/* meta row */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1.5">
          {note.uploadedBy?.photoUrl ? (
            <img src={note.uploadedBy.photoUrl} alt=""
              className="w-5 h-5 rounded-full object-cover border" style={{ borderColor: "var(--border)" }} />
          ) : (
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-2))" }}>
              {note.uploadedBy?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {note.uploadedBy?.name}
          </span>
        </div>
        <div className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
          <FiDownload className="w-3 h-3" />
          <span className="text-[10px]">{note.downloads || 0}</span>
        </div>
      </div>

      {/* action buttons */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onPreview(note)}
          className="btn-secondary flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
          <FiEye className="w-3.5 h-3.5" /> Preview
        </button>
        <a
          href={downloadUrl}
          onClick={() => onDownload(note._id)}
          className="btn-primary flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          style={{ textDecoration: "none" }}>
          <FiDownload className="w-3.5 h-3.5" /> Download
        </a>
      </div>
    </div>
  );
};

/* ══════════ Main Page ══════════ */
const Notes = () => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const { notes }       = useSelector(s => s.notes);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [subject,  setSubject]  = useState("All");
  const [previewNote, setPreviewNote] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/notes/all");
        dispatch(setNotes(res.data));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleDownload = async (id) => {
    // Download count is already incremented by the backend endpoint
    // Just update local state
    dispatch(bumpDownload(id));
  };

  const handlePreview = (note) => {
    setPreviewNote(note);
  };

  const handleClosePreview = () => {
    setPreviewNote(null);
  };

  /* unique subjects */
  const subjects = ["All", ...Array.from(new Set(notes.map(n => n.subject))).sort()];

  /* filtered */
  const filtered = notes.filter(n => {
    const matchSubject = subject === "All" || n.subject === subject;
    const matchSearch  = !search.trim() ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.description?.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div className="page-bg min-h-screen">
      <Nav />
      {/* Preview Modal */}
      {previewNote && (
        <PreviewModal
          note={previewNote}
          onClose={handleClosePreview}
          onDownload={handleDownload}
        />
      )}
      
      {/* bg orbs */}
      <div className="absolute top-32 right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "var(--orb-1)", opacity: 0.45 }} />
      <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "var(--orb-2)", opacity: 0.35, animationDelay: "4s" }} />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* back */}
        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 animate-slide-up">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold glass border mb-3"
              style={{ borderColor: "var(--border-hover)", color: "var(--accent)" }}>
              📚 STUDY RESOURCES
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>
              Notes & PDFs
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Free study materials uploaded by our expert educators
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="glass rounded-2xl px-4 py-2.5 border text-center" style={{ borderColor: "var(--border)" }}>
              <p className="text-xl font-bold" style={{ color: "var(--accent)" }}>{notes.length}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Resources</p>
            </div>
            <div className="glass rounded-2xl px-4 py-2.5 border text-center" style={{ borderColor: "var(--border)" }}>
              <p className="text-xl font-bold" style={{ color: "var(--accent-2)" }}>{subjects.length - 1}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Subjects</p>
            </div>
          </div>
        </div>

        {/* search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              className="input-glass pl-11"
              placeholder="Search notes by title, subject or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
                onClick={() => setSearch("")}>
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <FiFilter className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
            {subjects.map(s => (
              <button key={s}
                onClick={() => setSubject(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:scale-105"
                style={{
                  background:  subject === s ? "var(--accent-soft)"  : "var(--bg-card)",
                  borderColor: subject === s ? "var(--border-hover)"  : "var(--border)",
                  color:       subject === s ? "var(--accent)"        : "var(--text-secondary)",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* loading */}
        {loading && (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 rounded-full border-4 animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
          </div>
        )}

        {/* empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-28 gap-5 animate-scale-in">
            <div className="w-20 h-20 rounded-3xl glass border flex items-center justify-center animate-float"
              style={{ borderColor: "var(--border)" }}>
              <FiBookOpen className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {notes.length === 0 ? "No notes uploaded yet" : "No results found"}
            </h3>
            <p className="text-sm text-center max-w-sm" style={{ color: "var(--text-secondary)" }}>
              {notes.length === 0
                ? "Educators are preparing study materials. Check back soon!"
                : "Try a different search term or subject filter."}
            </p>
            {notes.length === 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Content being prepared
              </div>
            )}
            {notes.length > 0 && (
              <button className="btn-secondary px-5 py-2 rounded-xl text-sm"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => { setSearch(""); setSubject("All"); }}>
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* grid */}
        {!loading && filtered.length > 0 && (
          <>
            <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
              Showing {filtered.length} of {notes.length} resources
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((note, i) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notes;
