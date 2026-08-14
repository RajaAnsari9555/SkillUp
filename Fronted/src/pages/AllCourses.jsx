import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import { useNavigate } from "react-router-dom";
import ai from "../assets/SearchAi.png";
import { useSelector } from "react-redux";
import Card from "../component/Card";
import { FiFilter, FiX, FiSearch, FiZap } from "react-icons/fi";

const categories = [
  "App Development", "AI/ML", "AI Tools", "Data Science",
  "Data Analytics", "Ethical Hacking", "UI/UX Design", "Web Development", "Others",
];

const AllCourses = () => {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [search, setSearch] = useState("");

  const toggleCategory = (val) => {
    setCategory((prev) => prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]);
  };

  const applyFilter = () => {
    let copy = courseData?.slice() || [];
    if (category.length > 0) copy = copy.filter((c) => category.includes(c.category));
    if (search.trim()) copy = copy.filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()));
    setFilterCourses(copy);
  };

  useEffect(() => { setFilterCourses(courseData); }, [courseData]);
  useEffect(() => { applyFilter(); }, [category, search]);

  return (
    <div className="page-bg min-h-screen flex relative overflow-hidden">
      <Nav />
      {/* BG */}
      <div className="absolute top-32 right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.08)" }} />

      {/* Mobile filter toggle */}
      <button
        className="fixed top-20 left-4 z-40 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium glass border md:hidden"
        style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        onClick={() => setIsSidebarVisible((p) => !p)}
      >
        {isSidebarVisible ? <FiX className="w-4 h-4" /> : <FiFilter className="w-4 h-4" />}
        {isSidebarVisible ? "Close" : "Filter"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-[260px] transition-transform duration-300 sidebar pt-20 pb-6 px-5 overflow-y-auto ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-auto md:block`}
      >
        <div className="pt-6">
          <h2 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <FiFilter className="w-4 h-4" style={{ color: "var(--neon-purple)" }} />
            Filter by Category
          </h2>

          {/* AI Search shortcut */}
          <button
            className="btn-primary w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 text-white mb-5"
            onClick={() => navigate("/search")}
          >
            <img src={ai} className="w-5 h-5 rounded-full" alt="" />
            Search with AI
          </button>

          {/* Clear all */}
          {category.length > 0 && (
            <button className="w-full text-xs mb-3 text-left hover:underline" style={{ color: "var(--neon-purple)" }}
              onClick={() => setCategory([])}>
              Clear all filters ({category.length})
            </button>
          )}

          <div className="space-y-2">
            {categories.map((cat) => {
              const active = category.includes(cat);
              return (
                <label key={cat}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border"
                  style={{
                    background: active ? "rgba(168,85,247,0.12)" : "var(--bg-card)",
                    borderColor: active ? "rgba(168,85,247,0.4)" : "var(--border)",
                    color: active ? "var(--neon-purple)" : "var(--text-secondary)",
                  }}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${active ? "border-purple-400" : ""}`}
                    style={{ borderColor: active ? "var(--neon-purple)" : "var(--border)", background: active ? "var(--neon-purple)" : "transparent" }}>
                    {active && <FiX className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" value={cat} checked={active} onChange={() => toggleCategory(cat)} />
                  <span className="text-sm">{cat}</span>
                </label>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {isSidebarVisible && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setIsSidebarVisible(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 pt-24 pb-12 md:pl-[270px] px-4 lg:px-8">
        {/* Search bar */}
        <div className="mb-8 max-w-xl animate-slide-up">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <input type="text" className="input-glass pl-11" placeholder="Search courses..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Results header */}
        <div className="mb-5 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {filterCourses?.length || 0} courses found
          </span>
          {category.map((c) => (
            <span key={c} className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80"
              style={{ background: "rgba(168,85,247,0.12)", borderColor: "rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}
              onClick={() => toggleCategory(c)}>
              {c} <FiX className="w-3 h-3" />
            </span>
          ))}
        </div>

        {/* Course grid */}
        <div className="flex flex-wrap gap-6 justify-start">
          {filterCourses?.length ? (
            filterCourses.map((course, index) => (
              <div key={index} className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: "forwards" }}>
                <Card thumbnail={course.thumbnail} title={course.title} category={course.category}
                  price={course.price} id={course._id} reviews={course.reviews} />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 w-full gap-4">
              <div className="w-16 h-16 rounded-2xl glass border flex items-center justify-center"
                style={{ borderColor: "var(--border)" }}>
                <FiSearch className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
              </div>
              <p style={{ color: "var(--text-secondary)" }}>No courses match your filters</p>
              <button className="btn-secondary px-5 py-2 rounded-xl text-sm" style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => { setCategory([]); setSearch(""); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllCourses;
