import express  from "express"
import { CreateCourse, editCourse,getCourseById, getCreatorCourses, getPublishedCourses, removeCourse,editLecture, removeLecture, createLecture, getCourseLecture, getCreatorById } from "../controller/courseController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"

const courseRouter = express.Router()

courseRouter.post("/create" ,isAuth , CreateCourse)
courseRouter.get("/getpublished" , getPublishedCourses)
courseRouter.get("/getcreator" , isAuth , getCreatorCourses)
courseRouter.post("/editcourse/:courseId" , isAuth , upload.single("thumbnail") , editCourse)

courseRouter.get("/getcourse/:courseId" , isAuth ,getCourseById )
courseRouter.delete("/remove/:courseId" , isAuth , removeCourse)

// New Lecture Routes will be added here//

courseRouter.post("/createlecture/:courseId", isAuth , createLecture);
courseRouter.get("/courselectures/:courseId", isAuth, getCourseLecture);

courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture);
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture);
courseRouter.post ("/creator",isAuth,getCreatorById)
import { getLecturesByCourse } from "../controller/courseController.js";
import { searchWithAi } from "../controller/searchController.js"

// for search
courseRouter.post("/search",searchWithAi)


export default courseRouter