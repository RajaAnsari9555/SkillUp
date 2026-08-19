import Note from "../model/noteModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";
import fs from "fs";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ── helper: Extract public ID from Cloudinary URL ── */
const getPublicIdFromUrl = (url) => {
  // Example URL: https://res.cloudinary.com/dk0bc5cvx/raw/upload/v1787170569/lmhwe7h6rk4gjkkhj2jl.pdf
  try {
    // Match everything after /upload/ (with or without version)
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\?|$)/);
    if (!match) return null;
    
    return match[1]; // Returns: lmhwe7h6rk4gjkkhj2jl.pdf
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

/* ── helper: Generate signed URL for Cloudinary ── */
const getSignedUrl = (fileUrl) => {
  try {
    const publicId = getPublicIdFromUrl(fileUrl);
    if (!publicId) {
      console.log("⚠️ Could not extract public ID, using original URL");
      return fileUrl;
    }

    console.log("🔑 Public ID extracted:", publicId);

    // Determine resource type from URL
    let resourceType = 'image'; // Default to image (works for most files)
    if (fileUrl.includes('/video/upload')) {
      resourceType = 'video';
    } else if (fileUrl.includes('/raw/upload')) {
      resourceType = 'raw';
    }

    console.log("📦 Resource type:", resourceType);

    // Use Cloudinary's SDK to generate signed URL
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type: 'upload',
      sign_url: true,
      secure: true
    });

    console.log("🔐 Generated signed URL:", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("❌ Error generating signed URL:", error);
    return fileUrl; // Return original URL as fallback
  }
};

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
   GET /api/notes/:noteId/view
   Public - Proxy/stream the file for viewing
───────────────────────────────────────────── */
export const viewNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    console.log("📄 View request for:", note.title);
    console.log("🔗 Original URL:", note.fileUrl);

    // Try to fetch directly from Cloudinary
    const response = await axios.get(note.fileUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      maxRedirects: 5,
      timeout: 30000
    });

    console.log("✅ File fetched successfully, status:", response.status);
    
    // Set appropriate headers
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Stream the file
    response.data.pipe(res);
  } catch (error) {
    console.error("❌ View error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    
    // Return helpful error message
    return res.status(500).json({ 
      message: `Unable to load file. Please check Cloudinary settings or re-upload the file.`,
      details: error.message,
      hint: "Ensure 'PDF and ZIP files delivery' is enabled in Cloudinary Security settings"
    });
  }
};

/* ─────────────────────────────────────────────
   GET /api/notes/:noteId/download
   Public — serve file for download & increment counter
───────────────────────────────────────────── */
export const downloadNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.noteId,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!note) return res.status(404).json({ message: "Note not found" });

    console.log("⬇️  Download request for:", note.title);
    console.log("🔗 Original URL:", note.fileUrl);

    // Try to fetch directly from Cloudinary
    const response = await axios.get(note.fileUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      maxRedirects: 5,
      timeout: 30000
    });

    console.log("✅ File fetched successfully, status:", response.status);

    // Set headers for file download
    const fileName = `${note.title.replace(/[^a-z0-9\s]/gi, '_').replace(/\s+/g, '_')}.${note.fileType}`;
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Stream the file
    response.data.pipe(res);
  } catch (error) {
    console.error("❌ Download error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    
    return res.status(500).json({ 
      message: `Unable to download file. Please check Cloudinary settings or re-upload the file.`,
      details: error.message,
      hint: "Ensure 'PDF and ZIP files delivery' is enabled in Cloudinary Security settings"
    });
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
