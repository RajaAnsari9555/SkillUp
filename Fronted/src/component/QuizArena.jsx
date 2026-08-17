import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  FiAward, FiZap, FiClock, FiCheckCircle, FiXCircle,
  FiRefreshCw, FiArrowRight, FiTrendingUp,
} from "react-icons/fi";
import { FaTrophy, FaMedal } from "react-icons/fa";
import { useSelector } from "react-redux";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const TOPICS = ["MongoDB","Express.js","React.js","Node.js","REST API","JWT Auth","Redux","Async/Await"];
const QUESTION_TIME = 20;

const fallbackQuestions = [
  { question: "Which MongoDB method returns a cursor to all matching documents?", options: ["find()","fetchAll()","getAll()","query()"], answer: 0, explanation: "db.collection.find() returns a cursor to all matching documents.", topic: "MongoDB" },
  { question: "What does next() do in Express.js middleware?", options: ["Ends the request","Sends a response","Passes control to next middleware","Throws an error"], answer: 2, explanation: "next() passes control to the next middleware or route handler.", topic: "Express.js" },
  { question: "Which React hook runs side effects after render?", options: ["useState","useEffect","useContext","useReducer"], answer: 1, explanation: "useEffect runs side effects and replaces lifecycle methods.", topic: "React.js" },
  { question: "What does JWT stand for?", options: ["JavaScript Web Token","JSON Web Token","Java Web Transfer","JSON Web Transfer"], answer: 1, explanation: "JWT = JSON Web Token — a compact URL-safe authentication token.", topic: "JWT Auth" },
  { question: "Which RTK function creates reducers + actions together?", options: ["createReducer","createStore","createSlice","createAction"], answer: 2, explanation: "createSlice generates action creators and reducers from one config.", topic: "Redux" },
];

const rankIcons = [
  <FaTrophy className="w-4 h-4 text-yellow-400" />,
  <FaMedal  className="w-4 h-4 text-slate-400"  />,
  <FaMedal  className="w-4 h-4 text-amber-600"  />,
];

const QuizArena = () => {
  const { userData } = useSelector(s => s.user);
  const [phase,      setPhase]      = useState("idle");
  const [questions,  setQuestions]  = useState([]);
  const [currentQ,   setCurrentQ]   = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [score,      setScore]      = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(QUESTION_TIME);
  const [answers,    setAnswers]    = useState([]);
  const [leaderboard,setLeaderboard]= useState(() => {
    try { return JSON.parse(localStorage.getItem("skillup_leaderboard") || "[]"); } catch { return []; }
  });
  const [streak,     setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loadError,  setLoadError]  = useState(false);
  const timerRef = useRef(null);

  const clearTimer = () => clearInterval(timerRef.current);

  const handleTimeout = () => {
    setRevealed(true); setSelected(-1);
    setAnswers(p => [...p, { correct: false, timeout: true }]);
    setStreak(0);
  };

  const startTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, [currentQ]);

  const fetchQuestions = async () => {
    setPhase("loading"); setLoadError(false);
    try {
      const res = await axios.post(GEMINI_URL,
        { contents: [{ parts: [{ text: `Generate 5 multiple-choice quiz questions about MERN stack (${TOPICS.join(", ")}).
Return ONLY a JSON array (no markdown, no code blocks): [{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"...","topic":"..."}]
Rules: answer is 0-based index. All 4 options must be plausible. Intermediate difficulty. Return ONLY the raw JSON array, nothing else.` }] }] },
        { headers: { "Content-Type": "application/json" } }
      );
      const raw = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      // strip markdown code fences if model wraps anyway
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("No JSON array found in response");
      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed) || !parsed.length) throw new Error("Empty or invalid array");
      setQuestions(parsed);
    } catch (err) {
      console.error("Gemini API error:", err?.response?.data || err?.message || err);
      setQuestions(fallbackQuestions); setLoadError(true);
    } finally {
      setPhase("quiz"); setCurrentQ(0); setScore(0);
      setAnswers([]); setSelected(null); setRevealed(false); setStreak(0);
    }
  };

  useEffect(() => {
    if (phase === "quiz" && questions.length) startTimer();
    return clearTimer;
  }, [phase, currentQ, questions]);

  const handleSelect = idx => {
    if (revealed) return;
    clearTimer(); setSelected(idx); setRevealed(true);
    const ok = idx === questions[currentQ].answer;
    const ns = ok ? streak + 1 : 0;
    const pts = ok ? 10 + (ns >= 3 ? 10 : 0) + Math.ceil(timeLeft * 0.5) : 0;
    setScore(s => s + pts); setStreak(ns); setBestStreak(b => Math.max(b, ns));
    setAnswers(p => [...p, { correct: ok, points: pts }]);
  };

  const handleNext = () => {
    clearTimer();
    if (currentQ + 1 >= questions.length) finishQuiz();
    else { setCurrentQ(q => q + 1); setSelected(null); setRevealed(false); }
  };

  const finishQuiz = () => {
    const entry = { name: userData?.name || "Anonymous", score, streak: bestStreak,
      date: new Date().toLocaleDateString(), avatar: (userData?.name || "A").slice(0,1).toUpperCase() };
    const updated = [...leaderboard, entry].sort((a,b) => b.score - a.score).slice(0,10);
    setLeaderboard(updated);
    localStorage.setItem("skillup_leaderboard", JSON.stringify(updated));
    setPhase("result");
  };

  const resetQuiz = () => {
    clearTimer(); setPhase("idle"); setQuestions([]); setCurrentQ(0);
    setScore(0); setAnswers([]); setSelected(null); setRevealed(false);
    setStreak(0); setBestStreak(0);
  };

  const q = questions[currentQ];
  const progress = questions.length ? ((currentQ + (revealed ? 1 : 0)) / questions.length) * 100 : 0;

  // ── shared card style ──
  const cardStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    backdropFilter: "blur(16px)",
  };

  return (
    <section className="w-full py-24 px-4 relative overflow-hidden">
      {/* bg orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--orb-2)" }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--orb-1)" }} />

      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold glass border mb-4"
            style={{ borderColor: "rgba(6,182,212,0.30)", color: "var(--accent-2)" }}>
            🧠 AI-POWERED QUIZ ARENA
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Test Your{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
               Skills
            </span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            AI-generated questions . Earn points, build streaks, claim your spot on the leaderboard.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Quiz panel ── */}
          <div className="flex-1">

            {/* IDLE */}
            {phase === "idle" && (
              <div className="rounded-3xl p-10 text-center flex flex-col items-center gap-6"
                style={cardStyle}>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl animate-float">
                  <FiZap className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Ready to challenge yourself?
                </h3>
                <p style={{ color: "var(--text-secondary)" }} className="max-w-sm">
                  5 AI-generated MERN questions. Score points for correct answers — speed bonuses apply!
                </p>
                <div className="flex gap-6 text-center">
                  {[["5","Questions"],["20s","Per Q"],["+10","Per Answer"],["🔥","Streak Bonus"]].map(([val, label]) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">{val}</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary px-10 py-4 rounded-2xl text-base font-semibold flex items-center gap-2 mt-2"
                  onClick={fetchQuestions}>
                  <FiZap className="w-5 h-5" /> Start Quiz
                </button>
              </div>
            )}

            {/* LOADING */}
            {phase === "loading" && (
              <div className="rounded-3xl p-16 text-center flex flex-col items-center gap-6"
                style={cardStyle}>
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "var(--border)" }} />
                  <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"
                    style={{ borderColor: "transparent", borderTopColor: "var(--accent)" }} />
                  <span className="absolute inset-0 flex items-center justify-center text-2xl">🧠</span>
                </div>
                <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                  Generating questions with AI…
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Crafting MERN-specific challenges just for you
                </p>
              </div>
            )}

            {/* QUIZ */}
            {phase === "quiz" && q && (
              <div className="rounded-3xl overflow-hidden" style={cardStyle}>
                {/* progress */}
                <div className="h-1.5 w-full" style={{ background: "var(--border)" }}>
                  <div className="h-full transition-all duration-500"
                    style={{ width: `${progress}%`, background: "linear-gradient(90deg,var(--accent-2),var(--accent))" }} />
                </div>

                <div className="p-6 lg:p-8">
                  {/* top bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        Q {currentQ + 1} / {questions.length}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold glass border"
                        style={{ borderColor: "var(--border-hover)", color: "var(--accent)" }}>
                        {q.topic}
                      </span>
                      {streak >= 2 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                          style={{ background: "rgba(251,146,60,0.15)", borderColor: "rgba(251,146,60,0.35)", color: "#fb923c" }}>
                          🔥 {streak} streak
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" style={{ color: timeLeft <= 5 ? "#f87171" : "var(--text-muted)" }} />
                      <span className="font-bold text-lg font-mono"
                        style={{ color: timeLeft <= 5 ? "#f87171" : "var(--text-primary)" }}>
                        {timeLeft}s
                      </span>
                    </div>
                  </div>

                  {/* question */}
                  <h3 className="text-lg lg:text-xl font-semibold mb-6 leading-relaxed"
                    style={{ color: "var(--text-primary)" }}>
                    {q.question}
                  </h3>

                  {/* options */}
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {q.options.map((opt, idx) => {
                      let bg, border, color, cursor = "pointer";
                      if (!revealed) {
                        bg = "var(--bg-card)"; border = "var(--border)"; color = "var(--text-secondary)";
                      } else if (idx === q.answer) {
                        bg = "rgba(16,185,129,0.12)"; border = "rgba(16,185,129,0.50)"; color = "#10b981";
                      } else if (idx === selected && idx !== q.answer) {
                        bg = "rgba(239,68,68,0.10)"; border = "rgba(239,68,68,0.45)"; color = "#f87171";
                      } else {
                        bg = "var(--bg-card)"; border = "var(--border)"; color = "var(--text-muted)"; cursor = "default";
                      }
                      return (
                        <button key={idx}
                          onClick={() => handleSelect(idx)}
                          disabled={revealed}
                          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-300 text-left border"
                          style={{ background: bg, borderColor: border, color, cursor }}
                        >
                          <span className="w-7 h-7 flex-shrink-0 rounded-full glass border flex items-center justify-center text-xs font-bold"
                            style={{ borderColor: border, color }}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {revealed && idx === q.answer   && <FiCheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#10b981" }} />}
                          {revealed && idx === selected && idx !== q.answer && <FiXCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#f87171" }} />}
                        </button>
                      );
                    })}
                  </div>

                  {/* explanation */}
                  {revealed && (
                    <div className="p-4 rounded-2xl mb-4 animate-slide-up border"
                      style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.25)" }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>💡 Explanation</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{q.explanation}</p>
                    </div>
                  )}

                  {/* score + next */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiAward className="w-5 h-5 text-yellow-400" />
                      <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{score}</span>
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>pts</span>
                    </div>
                    {revealed && (
                      <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                        onClick={handleNext}>
                        {currentQ + 1 >= questions.length ? "See Results" : "Next"}
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* RESULT */}
            {phase === "result" && (
              <div className="rounded-3xl p-8 text-center" style={cardStyle}>
                {loadError && (
                  <p className="text-xs mb-4" style={{ color: "#f59e0b" }}>
                    ⚠️ Used fallback questions (Gemini API key not configured)
                  </p>
                )}
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl mb-4">
                  <FaTrophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  Quiz Complete!
                </h3>
                <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
                  {userData?.name || "You"} scored{" "}
                  <span className="font-bold text-xl text-yellow-500">{score} points</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    ["Correct",      `${answers.filter(a => a.correct).length}/${questions.length}`, "#10b981"],
                    ["Best Streak",  `🔥 ${bestStreak}`,                                             "#fb923c"],
                    ["Score",        `${score} pts`,                                                 "#f59e0b"],
                  ].map(([label, val, color]) => (
                    <div key={label} className="rounded-2xl p-4 border"
                      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                      <div className="text-xl font-bold" style={{ color }}>{val}</div>
                      <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-center">
                  <button className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                    onClick={fetchQuestions}>
                    <FiRefreshCw className="w-4 h-4" /> Try Again
                  </button>
                  <button className="btn-secondary px-6 py-3 rounded-xl text-sm font-semibold"
                    style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                    onClick={resetQuiz}>
                    Back to Menu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Leaderboard ── */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="rounded-3xl overflow-hidden" style={cardStyle}>
              {/* header */}
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ borderBottom: "1px solid var(--border)", background: "rgba(251,191,36,0.06)" }}>
                <FiTrendingUp className="w-5 h-5 text-yellow-400" />
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Leaderboard</h3>
              </div>

              <div className="p-4 flex flex-col gap-2 max-h-[440px] overflow-y-auto">
                {!leaderboard.length ? (
                  <div className="text-center py-10 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full glass border flex items-center justify-center text-2xl"
                      style={{ borderColor: "var(--border)" }}>🏆</div>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No scores yet — be the first!</p>
                  </div>
                ) : leaderboard.map((entry, idx) => (
                  <div key={idx}
                    className="flex items-center gap-3 p-3 rounded-2xl border transition-all"
                    style={{
                      background: idx < 3 ? "var(--bg-card-hover)" : "var(--bg-card)",
                      borderColor: idx < 3 ? "var(--border-hover)" : "var(--border)",
                    }}>
                    <div className="flex-shrink-0 w-6 text-center">
                      {idx < 3 ? rankIcons[idx] : (
                        <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>#{idx+1}</span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-2))" }}>
                      {entry.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{entry.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{entry.date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-yellow-500">{entry.score}</p>
                      {entry.streak >= 2 && <p className="text-xs text-orange-400">🔥{entry.streak}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {leaderboard.length > 0 && (
                <div className="px-4 pb-4">
                  <button className="w-full py-2 text-xs transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                    onClick={() => { localStorage.removeItem("skillup_leaderboard"); setLeaderboard([]); }}>
                    Clear leaderboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizArena;
