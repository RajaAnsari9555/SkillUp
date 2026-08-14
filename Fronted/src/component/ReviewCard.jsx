import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";

const ReviewCard = ({ comment, rating, photoUrl, name, description, courseTitle }) => (
  <div className="group relative glass rounded-2xl p-6 border max-w-sm w-full transition-all duration-300 hover:scale-[1.02]"
    style={{ borderColor: "var(--border)", boxShadow: "var(--glass-shadow)" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(109,40,217,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--glass-shadow)"; }}>

    {/* stars */}
    <div className="flex items-center gap-0.5 mb-4">
      {Array(5).fill(0).map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">
          {i < rating ? <FaStar /> : <FaRegStar style={{ color: "var(--border)" }} />}
        </span>
      ))}
      <span className="ml-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{rating}/5</span>
    </div>

    {/* course */}
    <div className="flex items-start gap-2 mb-3">
      <FiBookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        <span className="font-medium" style={{ color: "var(--accent)" }}>{courseTitle}</span>
      </p>
    </div>

    {/* comment */}
    <blockquote className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
      "{comment}"
    </blockquote>

    {/* divider */}
    <div className="h-px mb-4" style={{ background: "var(--border)" }} />

    {/* user */}
    <div className="flex items-center gap-3">
      {photoUrl ? (
        <img src={photoUrl} alt={name} className="w-10 h-10 rounded-full object-cover border flex-shrink-0"
          style={{ borderColor: "var(--border)" }} />
      ) : (
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-2))" }}>
          {name?.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div>
        <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{name}</h4>
        <p className="text-xs line-clamp-1" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
    </div>
  </div>
);

export default ReviewCard;
