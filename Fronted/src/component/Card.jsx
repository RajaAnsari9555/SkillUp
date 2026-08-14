import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const Card = ({ thumbnail, title, category, price, id, reviews }) => {
  const avg = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const navigate = useNavigate();

  return (
    <div
      className="group relative max-w-sm w-full glass rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{ borderColor: "var(--border)", boxShadow: "var(--glass-shadow)" }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(109,40,217,0.14)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "var(--glass-shadow)";
      }}
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* thumbnail */}
      <div className="relative overflow-hidden h-48">
        <img src={thumbnail} alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize text-white"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          {category}
        </span>
      </div>

      {/* content */}
      <div className="p-5 space-y-2.5">
        <h2 className="text-sm font-semibold leading-snug line-clamp-2 transition-colors"
          style={{ color: "var(--text-primary)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-primary)"}>
          {title}
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
            ₹{price}
          </span>
          <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
            <FaStar className="text-yellow-400 w-3.5 h-3.5" />
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>{avg}</span>
            <span style={{ color: "var(--text-muted)" }}>({reviews?.length || 0})</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
          style={{ color: "var(--accent)" }}>
          View Course <FiArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default Card;
