import React, { useState, useRef, useEffect } from "react";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import { RiMicAiFill } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import start from "../assets/start.mp3";
import { FiArrowLeft, FiSearch, FiArrowRight } from "react-icons/fi";
import Nav from "../component/Nav";

function SearchWithAi() {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  function speak(msg) {
    const utterance = new SpeechSynthesisUtterance(msg);
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = async (e) => {
      const t = e.results[0][0].transcript.trim();
      setInput(t);
      await handleRecommendation(t);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    setListening(true);
    new Audio(start).play().catch(() => {});
    recognitionRef.current.start();
  };

  const handleRecommendation = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/course/search`, { input: query }, { withCredentials: true });
      setRecommendations(result.data);
      speak(result.data.length > 0 ? "Here are the top courses I found for you" : "No courses found");
    } catch (e) { console.log(e); }
    finally { setLoading(false); setListening(false); }
  };

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      {/* BG */}
      <div className="absolute top-32 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.15)" }} />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(6,182,212,0.12)", animationDelay: "3s" }} />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm mb-8 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md animate-pulse-glow"
                style={{ background: "rgba(168,85,247,0.5)" }} />
              <img src={ai} alt="AI" className="relative w-14 h-14 rounded-full object-cover border border-purple-400/30" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Search with{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Speak or type what you want to learn — AI finds the best courses for you
          </p>
        </div>

        {/* Search box */}
        <div className="glass rounded-3xl border p-6 lg:p-8 mb-10 animate-scale-in" style={{ borderColor: "var(--border)" }}>
          <div className="relative flex items-center gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                className="input-glass pl-12 pr-16 py-4 text-base rounded-2xl"
                placeholder="e.g. React hooks, MongoDB aggregation, Node.js authentication..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRecommendation(input)}
              />
              {input && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(168,85,247,0.2)", color: "var(--neon-purple)" }}
                  onClick={() => handleRecommendation(input)}
                >
                  <FiArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mic button */}
            <button
              onClick={handleVoiceSearch}
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              style={{ background: listening ? "rgba(236,72,153,0.2)" : "rgba(168,85,247,0.15)", border: `2px solid ${listening ? "rgba(236,72,153,0.5)" : "rgba(168,85,247,0.3)"}` }}
              title="Click to search by voice"
            >
              {listening && (
                <div className="absolute inset-0 rounded-2xl animate-ping"
                  style={{ background: "rgba(236,72,153,0.3)" }} />
              )}
              <RiMicAiFill className="w-6 h-6 relative z-10"
                style={{ color: listening ? "#ec4899" : "var(--neon-purple)" }} />
            </button>
          </div>

          {/* Listening indicator */}
          {listening && (
            <div className="flex items-center gap-2 mt-4 animate-fade-in">
              <div className="flex gap-1">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-1 rounded-full bg-pink-400 animate-bounce"
                    style={{ height: `${8 + (i % 3) * 4}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <span className="text-sm" style={{ color: "#ec4899" }}>Listening... speak now</span>
            </div>
          )}

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Try:</span>
            {["MERN Stack", "React Hooks", "Node.js API", "MongoDB Atlas", "JWT Authentication"].map((s) => (
              <button key={s}
                className="text-xs px-3 py-1 rounded-full glass border transition-all hover:border-purple-400/50 hover:scale-105"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                onClick={() => { setInput(s); handleRecommendation(s); }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-10 h-10 rounded-full border-4 border-t-purple-400 animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--neon-purple)" }} />
            <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>Searching with AI...</p>
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-5">
              <img src={ai1} alt="" className="w-8 h-8 rounded-full object-cover" />
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                AI found {recommendations.length} courses for you
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((course, idx) => (
                <div key={idx}
                  className="glass rounded-2xl border p-5 cursor-pointer transition-all hover:scale-[1.02] hover:border-purple-400/40 animate-fade-in group"
                  style={{ borderColor: "var(--border)", animationDelay: `${idx * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}
                  onClick={() => navigate(`/viewcourse/${course._id}`)}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm leading-snug mb-1 group-hover:text-purple-400 transition-colors"
                        style={{ color: "var(--text-primary)" }}>
                        {course.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(168,85,247,0.12)", color: "var(--neon-purple)", border: "1px solid rgba(168,85,247,0.2)" }}>
                        {course.category}
                      </span>
                    </div>
                    <FiArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: "var(--neon-purple)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !recommendations.length && !listening && input && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl glass border flex items-center justify-center mx-auto mb-4"
              style={{ borderColor: "var(--border)" }}>
              <FiSearch className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
            </div>
            <p style={{ color: "var(--text-secondary)" }}>No courses found for "{input}"</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;
