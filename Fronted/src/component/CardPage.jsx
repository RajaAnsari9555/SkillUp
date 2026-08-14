import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const CardPage = () => {
  const { courseData } = useSelector(s => s.course);
  const [popularCourses, setPopularCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(courseData)) setPopularCourses(courseData.slice(0, 6));
  }, [courseData]);

  return (
    <section className="relative w-full py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold glass border mb-4"
            style={{ borderColor: "rgba(6,182,212,0.30)", color: "var(--accent-2)" }}>
            🔥 TRENDING NOW
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Popular Courses
            </span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Top-rated courses designed to boost your skills and unlock opportunities in tech, AI, and beyond.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {popularCourses.length === 0 ? (
            <div className="glass rounded-2xl border p-12 text-center" style={{ borderColor: "var(--border)" }}>
              <p style={{ color: "var(--text-muted)" }}>Loading courses…</p>
            </div>
          ) : (
            popularCourses.map((course, i) => (
              <Card key={i} thumbnail={course.thumbnail} title={course.title}
                category={course.category} price={course.price} id={course._id} reviews={course.reviews} />
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <button className="btn-secondary px-8 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2 mx-auto"
            style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
            onClick={() => navigate("/allcourses")}>
            View All Courses <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CardPage;
