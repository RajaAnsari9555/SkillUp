import Note from "../model/noteModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";
import fs from "fs";

/* ── helper: only educators can upload/delete ── */
const requireEducator = async (userId, res) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "educator") {
    res.status(403).json({ message: "Only educators can perform this action" });
    return false;
  }
  return true;
};

/* ─────────────────────────────────────────────
   POST /api/notes/upload
   multipart: title, description, subject
   file field: "file"  (PDF / DOC / any)
───────────────────────────────────────────── */
export const uploadNote = async (req, res) => {
  try {
    if (!(await requireEducator(req.userId, res))) return;

    const { title, description, subject } = req.body;

    if (!title || !subject) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Title and subject are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileUrl = await uploadOnCloudinary(req.file.path);
    if (!fileUrl) {
      return res.status(500).json({ message: "File upload to Cloudinary failed" });
    }

    /* detect type from original filename */
    const ext = req.file.originalname.split(".").pop().toLowerCase();
    const fileType = ext === "pdf" ? "pdf" : ["doc", "docx"].includes(ext) ? "doc" : "other";

    const note = await Note.create({
      title,
      description: description || "",
      subject,
      fileUrl,
      fileType,
      uploadedBy: req.userId,
    });

    const populated = await note.populate("uploadedBy", "name photoUrl");
    return res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Upload error: ${error.message}` });
  }
};

/* ─────────────────────────────────────────────
   GET /api/notes/all
   Public — all notes sorted by subject + date
───────────────────────────────────────────── */
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .sort({ subject: 1, createdAt: -1 })
      .populate("uploadedBy", "name photoUrl");
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: `Fetch error: ${error.message}` });
  }
};

/* ─────────────────────────────────────────────
   GET /api/notes/my
   Educator only — their own notes
───────────────────────────────────────────── */
export const getMyNotes = async (req, res) => {
  try {
    if (!(await requireEducator(req.userId, res))) return;
    const notes = await Note.find({ uploadedBy: req.userId })
      .sort({ subject: 1, createdAt: -1 });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: `Fetch error: ${error.message}` });
  }
};

/* ─────────────────────────────────────────────
   PATCH /api/notes/:noteId/download
   Public — increment download count
───────────────────────────────────────────── */
export const incrementDownload = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.noteId,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.status(200).json({ downloads: note.downloads });
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error.message}` });
  }
};

/* ─────────────────────────────────────────────
   DELETE /api/notes/:noteId
   Educator only — only their own notes
───────────────────────────────────────────── */
export const deleteNote = async (req, res) => {
  try {
    if (!(await requireEducator(req.userId, res))) return;

    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.uploadedBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorised to delete this note" });
    }

    await Note.findByIdAndDelete(req.params.noteId);
    return res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    return res.status(500).json({ message: `Delete error: ${error.message}` });
  }
};
