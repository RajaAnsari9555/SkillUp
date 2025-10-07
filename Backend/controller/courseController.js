import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../model/coursemodel.js";
import Lecture from "../model/lectureModel.js";
import fs from "fs";
import User from "../model/userModel.js"

// Create a new course
export const CreateCourse = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title or category is required" });
    }

    const course = await Course.create({
      title,
      category,
      creator: req.userId
    });

    return res.status(201).json(course);

  } catch (error) {
    return res.status(500).json({ message: `CreateCourse error: ${error}` });
  }
};

// Get all published courses
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate("lectures reviews")

    if (!courses || courses.length === 0) {
      return res.status(400).json({ message: "Courses are not found" });
    }

    return res.status(200).json(courses);

  } catch (error) {
    return res.status(500).json({ message: `Failed to find published courses: ${error}` });
  }
};

// Get courses created by the logged-in user
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ creator: userId }).populate("lectures")

    if (!courses || courses.length === 0) {
      return res.status(400).json({ message: "Courses are not found" });
    }

    return res.status(200).json(courses);

  } catch (error) {
    return res.status(500).json({ message: `Failed to get creator courses: ${error}` });
  }
};

// Edit an existing course
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, subTitle, description, category, level, isPublished, price } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Use let thumbnail here
    let thumbnail;

    if (req.file) {
      // Do not redeclare with const, use the outer let
      thumbnail = await uploadOnCloudinary(req.file.path);

      // Safely delete local file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const updateData = {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
      price,
      ...(thumbnail && { thumbnail }), // add thumbnail only if exists
    };

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
    return res.status(200).json(updatedCourse);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Failed to edit course: ${error.message}` });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course is not found" });
    }

    return res.status(200).json(course);

  } catch (error) {
    return res.status(500).json({ message: `Failed to get course by ID: ${error}` });
  }
};

// Remove a course
export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course is not found" });
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ message: "Course removed successfully" });

  } catch (error) {
    return res.status(500).json({ message: `Failed to delete course: ${error}` });
  }
};

// ----------------- Lecture Controllers -----------------

// Edit lecture

export const editLecture = async (req,res) => {
    try {
        const {lectureId} = req.params
        const {isPreviewFree , lectureTitle} = req.body
        const lecture = await Lecture.findById(lectureId)
          if(!lecture){
            return res.status(404).json({message:"Lecture not found"})
        }
        let videoUrl
        if(req.file){
            videoUrl =await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
                }
        if(lectureTitle){
            lecture.lectureTitle = lectureTitle
        }
        lecture.isPreviewFree = isPreviewFree
        
         await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({message:`Failed to edit Lectures ${error}`})
    }
    
}



// Remove lecture
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture){ 
      return res.status(404).json({ message: "Lecture not found" })
    }
     await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    )
      return res.status(200).json({ message: "Lecture removed successfully" });

   

  } catch (error) {
    return res.status(500).json({ message: `Failed to delete lecture: ${error}` });
  }
};
 
// ---------- Lecture Controllers ----------

// Fetch lectures for a specific course
export const getLecturesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lectures = await Lecture.find({ course: courseId });

    if (!lectures || lectures.length === 0) {
      return res.status(404).json({ message: "No lectures found for this course" });
    }

    return res.status(200).json(lectures);

  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch lectures: ${error}` });
  }
};

//for Lecture 

export const createLecture = async (req,res) => {
    try {
        const {lectureTitle}= req.body
        const {courseId} = req.params

        if(!lectureTitle || !courseId){
             return res.status(400).json({message:"Lecture Title required"})
        }
        const lecture = await Lecture.create({lectureTitle})
        const course = await Course.findById(courseId)
        if(course){
            course.lectures.push(lecture._id)
               const validLevels = ["Beginner", "Intermediate", "Advanced"]
            if(!course.level || !validLevels.includes(course.level)){
                course.level = "Beginner"
            }
            
        }
        await course.populate("lectures")
        await course.save()
        return res.status(201).json({lecture,course})
        
    } catch (error) {
        return res.status(500).json({message:`Failed to Create Lecture ${error}`})
    }
    
}
export const getCourseLecture = async(req,res)=>{
  try {
    const {courseId} = req.params
    const course = await Course.findById(courseId)
    if(!course){
      return res.status(404).json({message:"Course is not found"})
    }
  await  course.populate("lectures")
  await  course.save()
    return res.status(200).json(course)
  } catch (error) {
    return res.status(500).json({ message: `Failed to get Course lectures: ${error}` });
  }
}

//get creator

export const getCreatorById = async(req,res)=>{
  try {
    const {userId} = req.body

   

    const user = await User.findById(userId).select("-password")

    if(!user){
      return res.status(404).json({message:"User is not found"})
    }
      
//only send necessary fields


    return res.status(200).json(user)
  } catch (error) {
     return res.status(500).json({ message: `Failed to get Creator: ${error}` });
  }
}