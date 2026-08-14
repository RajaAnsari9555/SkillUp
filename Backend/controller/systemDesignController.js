import SystemDesignVideo from "../model/systemDesignModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";
import fs from "fs";

/* ── guard: only educators ── */
const requireEducator = async (userId, res) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "educator") {
    res.status(403).json({ message: "Only educators can perform this action" });
    return false;
  }
  return true;
};

/* ────────────────────────────────────────────────
   POST /api/systemdesign/upload
   Body (multipart): title, topic, description, order
   File: video  (field name = "video")
──────────────────────────────────────────────── */
export const uploadSystemDesignVideo = async (req, res) => {
  try {
    if (!(await requireEducator(req.userId, res))) return;

    const { title, topic, description, order } = req.body;

    if (!title || !topic) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Title and topic are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const videoUrl = await uploadOnCloudinary(req.file.path);
    if (!videoUrl) {
      return res.status(500).json({ message: "Video upload to Cloudinary failed" });
    }

    const video = await SystemDesignVideo.create({
      title,
      topic,
      description: description || "",
      videoUrl,
      order: order ? Number(order) : 0,
      uploadedBy: req.userId,
    });

    return res.status(201).json(video);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Upload error: ${error.message}` });
  }
};

/* ────────────────────────────────────────────────
   GET /api/systemdesign/all
   Public — returns all videos sorted by topic + order
──────────────────────────────────────────────── */
export const getAllSystemDesignVideos = async (req, res) => {
  try {
    const videos = await SystemDesignVideo.find()
      .sort({ topic: 1, order: 1, createdAt: 1 })
      .populate("uploadedBy", "name photoUrl");

    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: `Fetch error: ${error.message}` });
  }
};

/* ────────────────────────────────────────────────
   GET /api/systemdesign/my
   Educator only — returns only their own videos
──────────────────────────────────────────────── */
export const getMySystemDesignVideos = async (req, res) => {
  try {
    if (!(await requireEducator(req.userId, res))) return;

    const videos = await SystemDesignVideo.find({ uploadedBy: req.userId })
      .sort({ topic: 1, order: 1, createdAt: 1 });

    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: `Fetch error: ${error.message}` });
  }
};

/* ────────────────────────────────────────────────
   DELETE /api/systemdesign/:videoId
   Educator only — can only delete their own videos
──────────────────────────────────────────────── */
export const deleteSystemDesignVideo = async (req, res) => {
  try {
    if (!(await requireEducator(req.userId, res))) return;

    const { videoId } = req.params;
    const video = await SystemDesignVideo.findById(videoId);

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploadedBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorised to delete this video" });
    }

    await SystemDesignVideo.findByIdAndDelete(videoId);
    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Delete error: ${error.message}` });
  }
};
