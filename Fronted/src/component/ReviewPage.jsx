import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";
import { FiStar } from "react-icons/fi";

const ReviewPage = () => {
  const { reviewData } = useSelector(s => s.review);
  const [latest, setLatest] = useState([]);
  useEffect(() => { setLatest(reviewData?.slice(0, 6) || []); }, [reviewData]);

  const avg = reviewData?.length
    ? (reviewData.reduce((s, r) => s + r.rating, 0) / reviewData.length).toFixed(1)
    : null;

  return (
    <section className="relative w-full py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold glass border mb-4"
            style={{ borderColor: "rgba(251,191,36,0.30)", color: "#d97706" }}>
            ⭐ STUDENT REVIEWS
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Real Reviews for{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Real Courses
            </span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Discover how SkillUp is transforming learning experiences through authentic feedback from students worldwide.
          </p>
          {avg && (
            <div className="inline-flex items-center gap-2 mt-6 glass px-5 py-2.5 rounded-full border"
              style={{ borderColor: "rgba(251,191,36,0.25)" }}>
              <FiStar className="text-yellow-400 w-4 h-4" />
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{avg}</span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                average from {reviewData.length} reviews
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {latest.length ? latest.map((r, i) => (
            <ReviewCard key={i} comment={r?.comment} rating={r?.rating}
              photoUrl={r?.user?.photoUrl} courseTitle={r?.course?.title}
              description={r?.user?.description} name={r?.user?.name} />
          )) : (
            <div className="glass rounded-2xl border p-12 text-center" style={{ borderColor: "var(--border)" }}>
              <p style={{ color: "var(--text-muted)" }}>No reviews yet — be the first learner!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewPage;
