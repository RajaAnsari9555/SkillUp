import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import {  useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import { FaPlayCircle } from "react-icons/fa";
import axios from "axios";
import img from "../assets/empty.jpg";
import Card from "../component/Card";
import { serverUrl } from '../App';
import { FaLock } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const ViewCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating , setRating] = useState(0)
  const [comment , setComment] = useState("")
const [loading ,setLoading] = useState(false)
 

  // Fetch selected course
  const fetchCourseData = () => {
    courseData.map((course) => {
      if (course._id === courseId) {
        dispatch(setSelectedCourse(course));
        console.log(selectedCourse);
      }
    });
  };

  
    useEffect(()=>{

    const getCreator = async () => {
      if(selectedCourse?.creator){
        try {
           const result = await axios.post(serverUrl + "/api/course/creator" , {userId:selectedCourse?.creator?._id || selectedCourse?.creator}, {withCredentials:true})

           console.log(result.data);
           setCreatorData(result.data)
           

        } catch (error) {
          console.log(error);
          
        }
      }
    }
    getCreator()

  },[selectedCourse])
  
  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c => {
    const enrolledId = typeof c === 'string' ? c : c._id;
    return enrolledId?.toString() === courseId?.toString();
  });

  console.log("Enrollment verified:", verify);
  if (verify) {
    setIsEnrolled(true);
  }
};

useEffect(() => {
    fetchCourseData();
     checkEnrollment();
  }, [courseId, courseData , userData]);

  // Handle payment order creation
  const handleEnroll = async (courseId) => {
    try {
      const response = await axios.post(
        serverUrl + "/api/payment/razorpay-order",
        { courseId  },
        { withCredentials: true }
      );
      console.log("Order Data:", response.data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: "INR",
        name: "SKILLS-UP",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: response.data.id,

        handler: async (response) => {
          console.log("Razorpay response:", response);

          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/payment/verify-payment",
              {
                ...response,
                courseId,
               userId:userData?._id
              },
              { withCredentials: true }
            );

            setIsEnrolled(true); // ✅ ensures Watch Now button shows immediately

            toast.success(verifyPayment.data.message);
          } catch (error) {
            toast.error(error.response.data.message);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(
        "Error creating Razorpay order:",
        error.response?.data || error.message
      );
      toast.error("Something went wrong while enrolling");
    }
  };

  // Filter other courses by creator
  useEffect(() => {
    if (selectedCourse?._id && courseData.length > 0) {
      const otherCourses = courseData.filter(
        (course) =>
          course.creator?._id === selectedCourse?.creator?._id &&
          course._id !== courseId
      );
      setCreatorCourses(otherCourses);
    }
  }, [selectedCourse, courseData, courseId]);

  const handleReview = async () =>{
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/review/createreview",{rating ,comment ,courseId} ,{withCredentials:true})

      setLoading(false)
      toast.success("Review Added")
      console.log(result.data);
      setRating(0)
      setComment("")

      
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
      setRating(0)
      setComment("")
      
    }

  }

  const calculateAvgReview = (reviews) => {
    if(!reviews || reviews.length === 0){
      return 0
    }
    const total = reviews.reduce((sum , review)=> sum + review.rating , 0)
    return (total / reviews.length).toFixed(1)
    
  }

  const avgRating = calculateAvgReview(selectedCourse?.reviews)

 
  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6 ">
             
          {/* Thumbnail */}
          <div className="w-full md:w-1/2">
             <FaArrowLeftLong  className='text-[black] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
            {selectedCourse?.thumbnail ? <img
              src={selectedCourse?.thumbnail}
              alt="Course Thumbnail"
              className="rounded-xl w-full object-cover"
            /> :  <img
              src={img}
              alt="Course Thumbnail"
              className="rounded-xl  w-full  object-cover"
            /> }
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-2 mt-[20px]">
            <h1 className="text-2xl font-bold">{selectedCourse?.title}</h1>
            <p className="text-gray-600">{selectedCourse?.subTitle}</p>

            {/* Rating & Price */}
            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium flex gap-2">
               <span className=" flex items-center justify-start  gap-1"><FaStar/>{avgRating}</span>
               <span className=" text-gray-400">(1,200 reviews)</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-black">{selectedCourse?.price}</span>{" "}
                <span className="line-through text-sm text-gray-400">₹599</span>
              </div>
            </div>

            {/* Highlights */}
            <ul className="text-sm text-gray-700 space-y-1 pt-2">
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
              
            </ul>

            {/* Enroll Button */}
            {!isEnrolled ?<button className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3" onClick={()=>handleEnroll(courseId , userData._id)}>
              Enroll Now
            </button> :
            <button className="bg-green-200 text-green-600 px-6 py-2 rounded hover:bg-gray-100 hover:border mt-3" onClick={()=>navigate(`/viewlecture/${courseId}`)}>
             Watch Now
            </button>
            }
          </div>
        </div>

        {/* What You'll Learn */}
        <div>
          <h2 className="text-xl font-semibold mb-2">What You’ll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourse?.category} from Beginning</li>
            
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">Basic programming knowledge is helpful but not required.</p>
        </div>

        {/* Who This Course Is For */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade skills.
          </p>
        </div>

        {/* course lecture   */}
         <div className="flex flex-col md:flex-row gap-6">
  {/* Left Side - Curriculum */}
  <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
    <h2 className="text-xl font-bold mb-1 text-gray-800">Course Curriculum</h2>
    <p className="text-sm text-gray-500 mb-4">{selectedCourse?.lectures?.length} Lectures</p>

    <div className="flex flex-col gap-3">
      {selectedCourse?.lectures?.map((lecture, index) => (
        <button
          key={index}
          disabled={!lecture.isPreviewFree}
          onClick={() => {
            if (lecture.isPreviewFree) {
              setSelectedLecture(lecture);
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
            lecture.isPreviewFree
              ? "hover:bg-gray-100 cursor-pointer border-gray-300"
              : "cursor-not-allowed opacity-60 border-gray-200"
          } ${
            selectedLecture?.lectureTitle === lecture.lectureTitle
              ? "bg-gray-100 border-gray-400"
              : ""
          }`}
        >
          <span className="text-lg text-gray-700">
            {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
          </span>
          <span className="text-sm font-medium text-gray-800">
            {lecture.lectureTitle}
          </span>
        </button>
      ))}
    </div>
  </div>

  {/* Right Side - Video + Info */}
  <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
    <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
      {selectedLecture?.videoUrl ? (
        <video
          src={selectedLecture.videoUrl}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white text-sm">Select a preview lecture to watch</span>
      )}
    </div>

    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      {selectedLecture?.lectureTitle || "Lecture Title"}
    </h3>
    <p className="text-gray-600 text-sm">
      {selectedCourse?.title}
    </p>
  </div>
</div>
<div className="mt-8 border-t pt-6">
    <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
    <div className="mb-4">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
         
            <FaStar  key={star}
            onClick={() => setRating(star)} className={star <= rating ? "fill-yellow-500" : "fill-gray-300"} />
         
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
        className="w-full border border-gray-300 rounded-lg p-2"
        rows="3"
      />
      <button
        
        className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800" onClick={handleReview}
      >
        Submit Review
      </button>
    </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-4 pt-4 border-t ">
          {creatorData?.photoUrl ?<img
            src={creatorData?.photoUrl}
            alt="Instructor"
            className="w-16 h-16 rounded-full object-cover"
          />: <img
            src={img}
            alt="Instructor"
            className="w-16 h-16 rounded-full object-cover"
          />
          }
          <div>
            <h3 className="text-lg font-semibold">{creatorData?.name}</h3>
            <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.description}</p>
            <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.email}</p>
            
          </div>
        </div>
        <div>
          <p className='text-xl font-semibold mb-2'>Other Published Courses by the Educator -</p>
        <div className='w-full transition-all duration-300 py-[20px]   flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px] '>
          
            {
               creatorCourses?.map((item,index)=>(
                    <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category}/>
                ))
            }
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default ViewCourse
