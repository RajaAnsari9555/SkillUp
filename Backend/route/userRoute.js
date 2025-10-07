import express from "express"
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js"

import { getCurrentUser, updateProfile } from "../controller/userController.js"
import User from "../model/userModel.js"

const userRouter = express.Router()




userRouter.get("/getcurrentuser",isAuth ,getCurrentUser)
userRouter.post("/profile",isAuth,upload.single("photoUrl"),updateProfile)

export default userRouter