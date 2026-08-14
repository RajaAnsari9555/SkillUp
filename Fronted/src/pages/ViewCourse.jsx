import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import { FaPlayCircle, FaLock } from "react-icons/fa";
import axios from "axios";
import empty from "../assets/empty.jpg";
import Card from "../component/Card";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FiArrowLeft, FiCheck, FiStar } from "react-icons/fi";
import Nav from "../component/Nav";

const ViewCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector((s) => s.course);
  const { userData } = useSelector((s) => s.user);
  const dispatch = useDispatch();

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    courseData?.forEach((c) => { if (c._id === courseId) dispatch(setSelectedCourse(c)); });
    const enrolled = userData?.enrolledCourses?.some((c) => (typeof c === "string" ? c : c._id)?.toString() === courseId?.toString());
    setIsEnrolled(!!enrolled);
  }, [courseId, courseData, userData]);

  useEffect(() => {
    if (!selectedCourse?.creator) return;
    axios.post(serverUrl + "/api/course/creator", { userId: selectedCourse.creator?._id || selectedCourse.creator }, { withCredentials: true })
      .then((r) => setCreatorData(r.data)).catch(console.log);
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse?._id && courseData?.length) {
      setCreatorCourses(courseData.filter((c) => c.creator?._id === selectedCourse?.creator?._id && c._id !== courseId));
    }
  }, [selectedCourse, courseData, courseId]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(serverUrl + "/api/payment/razorpay-order", { courseId }, { withCredentials: true });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: "INR",
        name: "SKILLS-UP",
        description: "Course Enrollment",
        order_id: response.data.id,
        handler: async (res) => {
          try {
            const verify = await axios.post(serverUrl + "/api/payment/verify-payment", { ...res, courseId, userId: userData?._id }, { withCredentials: true });
            setIsEnrolled(true);
            toast.success(verify.data.message);
          } catch (e) { toast.error(e.response?.data?.message); }
        },
      };
      new window.Razorpay(options).open();
    } catch (e) { toast.error("Something went wrong while enrolling"); }
  };

  const handleReview = async () => {
    setLoading(true);
    try {
      await axios.post(serverUrl + "/api/review/createreview", { rating, comment, courseId }, { withCredentials: true });
      toast.success("Review added!");
      setRating(0); setComment("");
    } catch (e) { toast.error(e.response?.data?.message); }
    finally { setLoading(false); }
  };

  const avgRating = selectedCourse?.reviews?.length
    ? (selectedCourse.reviews.reduce((s, r) => s + r.rating, 0) / selectedCourse.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      {/* BG */}
      <div className="absolute top-32 right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.08)" }} />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <button onClick={() => navigate("/allcourses")}
          className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        {/* Top section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8 animate-slide-up">
          {/* Thumbnail */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              <img src={selectedCourse?.thumbnail || empty} alt="Course" className="w-full h-64 lg:h-80 object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <span className="inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold capitalize"
              style={{ background: "rgba(168,85,247,0.15)", color: "var(--neon-purple)", border: "1px solid rgba(168,85,247,0.3)" }}>
              {selectedCourse?.category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              {selectedCourse?.title}
            </h1>
            <p style={{ color: "var(--text-secondary)" }} className="text-sm leading-relaxed">
              {selectedCourse?.subTitle}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <FaStar className="text-yellow-400 w-4 h-4" />
                <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{avgRating}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>({selectedCourse?.reviews?.length || 0})</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ₹{selectedCourse?.price}
              </span>
            </div>

            <ul className="space-y-1.5">
              {["10+ hours of video content", "Lifetime access to materials", "Certificate on completion"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <FiCheck className="w-4 h-4 flex-shrink-0" style={{ color: "var(--neon-green)" }} />
                  {item}
                </li>
              ))}
            </ul>

            {!isEnrolled ? (
              <button className="btn-primary py-3.5 rounded-2xl text-base font-semibold text-white mt-2" onClick={handleEnroll}>
                Enroll Now — ₹{selectedCourse?.price}
              </button>
            ) : (
              <button
                className="py-3.5 rounded-2xl text-base font-semibold mt-2 border transition-all hover:scale-[1.02]"
                style={{ background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.4)", color: "var(--neon-green)" }}
                onClick={() => navigate(`/viewlecture/${courseId}`)}>
                ▶ Watch Now
              </button>
            )}
          </div>
        </div>

        {/* Curriculum + Video preview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Lecture list */}
          <div className="lg:col-span-2 glass rounded-2xl border p-5 animate-slide-in-left"
            style={{ borderColor: "var(--border)" }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>Course Curriculum</h2>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              {selectedCourse?.lectures?.length || 0} Lectures
            </p>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {selectedCourse?.lectures?.map((lec, i) => (
                <button key={i}
                  disabled={!lec.isPreviewFree}
                  onClick={() => lec.isPreviewFree && setSelectedLecture(lec)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm"
                  style={{
                    background: selectedLecture?.lectureTitle === lec.lectureTitle ? "rgba(168,85,247,0.12)" : "var(--bg-card)",
                    borderColor: selectedLecture?.lectureTitle === lec.lectureTitle ? "rgba(168,85,247,0.4)" : "var(--border)",
                    color: lec.isPreviewFree ? "var(--text-primary)" : "var(--text-muted)",
                    cursor: lec.isPreviewFree ? "pointer" : "not-allowed",
                    opacity: lec.isPreviewFree ? 1 : 0.55,
                  }}
                >
                  {lec.isPreviewFree
                    ? <FaPlayCircle className="text-purple-400 w-4 h-4 flex-shrink-0" />
                    : <FaLock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                  }
                  <span className="flex-1 truncate">{lec.lectureTitle}</span>
                  {lec.isPreviewFree && <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(16,185,129,0.15)", color: "var(--neon-green)" }}>FREE</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Preview player */}
          <div className="lg:col-span-3 glass rounded-2xl border p-5 animate-slide-in-right"
            style={{ borderColor: "var(--border)" }}>
            <div className="rounded-xl overflow-hidden mb-4 bg-black aspect-video flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video src={selectedLecture.videoUrl} controls className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2" style={{ color: "var(--text-muted)" }}>
                  <FaPlayCircle className="w-12 h-12 opacity-30" />
                  <p className="text-sm">Select a free preview lecture</p>
                </div>
              )}
            </div>
            {selectedLecture && (
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                {selectedLecture.lectureTitle}
              </h3>
            )}
          </div>
        </div>

        {/* Info sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: "What You'll Learn", content: `Learn ${selectedCourse?.category} from scratch to advanced.` },
            { title: "Requirements", content: "Basic programming knowledge is helpful but not required." },
            { title: "Who It's For", content: "Beginners, developers, and professionals looking to upgrade skills." },
          ].map((s) => (
            <div key={s.title} className="glass rounded-2xl border p-5 animate-fade-in"
              style={{ borderColor: "var(--border)" }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.content}</p>
            </div>
          ))}
        </div>

        {/* Review + Instructor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Write review */}
          <div className="glass rounded-2xl border p-6 animate-slide-up" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Write a Review</h2>
            <div className="flex gap-1.5 mb-4">
              {[1,2,3,4,5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-125">
                  <FaStar className={`w-6 h-6 ${s <= rating ? "text-yellow-400" : ""}`}
                    style={{ color: s <= rating ? "#facc15" : "var(--border)" }} />
                </button>
              ))}
            </div>
            <textarea className="input-glass mb-4" rows={3} placeholder="Write your review here..."
              value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
              onClick={handleReview} disabled={loading}>
              {loading ? <ClipLoader size={18} color="white" /> : <><FiStar className="w-4 h-4" /> Submit Review</>}
            </button>
          </div>

          {/* Instructor */}
          {creatorData && (
            <div className="glass rounded-2xl border p-6 animate-slide-up" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Instructor</h2>
              <div className="flex items-start gap-4">
                {creatorData.photoUrl ? (
                  <img src={creatorData.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border"
                    style={{ borderColor: "var(--border)" }} />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)" }}>
                    {creatorData.name?.slice(0,1).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>{creatorData.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--neon-purple)" }}>{creatorData.email}</p>
                  <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>{creatorData.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* More courses */}
        {creatorCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              More by this Instructor
            </h2>
            <div className="flex flex-wrap gap-6">
              {creatorCourses.map((item, idx) => (
                <Card key={idx} thumbnail={item.thumbnail} title={item.title} id={item._id}
                  price={item.price} category={item.category} reviews={item.reviews} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourse;
