import express from "express";
import {
  uploadSystemDesignVideo,
  getAllSystemDesignVideos,
  getMySystemDesignVideos,
  deleteSystemDesignVideo,
} from "../controller/systemDesignController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const systemDesignRouter = express.Router();

/* public */
systemDesignRouter.get("/all", getAllSystemDesignVideos);

/* educator only */
systemDesignRouter.post(
  "/upload",
  isAuth,
  upload.single("video"),
  uploadSystemDesignVideo
);
systemDesignRouter.get("/my", isAuth, getMySystemDesignVideos);
systemDesignRouter.delete("/:videoId", isAuth, deleteSystemDesignVideo);

export default systemDesignRouter;
