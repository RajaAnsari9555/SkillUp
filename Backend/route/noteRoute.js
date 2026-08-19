import express from "express";
import {
  uploadNote,
  getAllNotes,
  getMyNotes,
  viewNote,
  downloadNote,
  deleteNote,
} from "../controller/noteController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const noteRouter = express.Router();

/* public */
noteRouter.get("/all", getAllNotes);
noteRouter.get("/:noteId/view", viewNote);
noteRouter.get("/:noteId/download", downloadNote);

/* educator only */
noteRouter.post("/upload", isAuth, upload.single("file"), uploadNote);
noteRouter.get("/my", isAuth, getMyNotes);
noteRouter.delete("/:noteId", isAuth, deleteNote);

export default noteRouter;
