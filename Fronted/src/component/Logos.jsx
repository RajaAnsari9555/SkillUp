import React from "react";
import { MdOutlineCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

const stats = [
  { icon: <MdOutlineCastForEducation className="w-6 h-6" />, label: "20K+ Online Courses", accent: "var(--accent)" },
  { icon: <SiOpenaccess              className="w-6 h-6" />, label: "Lifetime Access",     accent: "var(--accent-2)" },
  { icon: <FaSackDollar              className="w-6 h-6" />, label: "Value For Money",     accent: "var(--accent-green)" },
  { icon: <BiSupport                 className="w-6 h-6" />, label: "Lifetime Support",    accent: "var(--accent-3)" },
  { icon: <FaUsers                   className="w-6 h-6" />, label: "Community Support",   accent: "var(--accent)" },
];

const Logos = () => (
  <div className="w-full py-10 px-4 flex items-center justify-center flex-wrap gap-4">
    {stats.map((s, i) => (
      <div key={i}
        className="flex items-center gap-3 px-5 py-3 rounded-2xl glass border cursor-pointer hover:scale-105 transition-all duration-300 group"
        style={{ borderColor: "var(--border)" }}>
        <span className="group-hover:scale-110 transition-transform" style={{ color: s.accent }}>{s.icon}</span>
        <span className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
          {s.label}
        </span>
      </div>
    ))}
  </div>
);

export default Logos;
