import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiPlay, FiRefreshCw, FiChevronRight, FiPause } from "react-icons/fi";
import { SiMongodb, SiExpress, SiReact, SiNodedotjs } from "react-icons/si";

// ─── Challenge data ──────────────────────────────────────────────────────────
const challenges = [
  {
    id: 1,
    title: "MongoDB: Find Active Users",
    icon: <SiMongodb className="text-green-400" />,
    tag: "MongoDB",
    tagColor: "from-green-500 to-emerald-600",
    code: `// Find all active users sorted by name
db.users.find(
  { isActive: true },
  { name: 1, email: 1, _id: 0 }
).sort({ name: 1 })
 .limit(10);`,
    output: `[
  { name: "Alice", email: "alice@dev.io" },
  { name: "Bob",   email: "bob@dev.io"  },
  { name: "Carol", email: "carol@dev.io" }
]`,
    explanation: "Uses projection to select fields, sort() for ordering, limit() to cap results.",
  },
  {
    id: 2,
    title: "Express: Auth Middleware",
    icon: <SiExpress className="text-slate-300" />,
    tag: "Express.js",
    tagColor: "from-slate-500 to-gray-600",
    code: `// JWT authentication middleware
const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }
  try {
    const decoded = jwt.verify(
      token, process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};`,
    output: `✅ Token verified
✅ User attached to req.user
✅ next() called — route proceeds`,
    explanation: "Reads JWT from HttpOnly cookie, verifies it, attaches decoded payload to req.user.",
  },
  {
    id: 3,
    title: "React: Custom useFetch Hook",
    icon: <SiReact className="text-cyan-400" />,
    tag: "React",
    tagColor: "from-cyan-500 to-blue-600",
    code: `// Reusable data fetching hook
const useFetch = (url) => {
  const [data, setData]    = useState(null);
  const [loading, setLoad] = useState(true);
  const [error, setError]  = useState(null);

  useEffect(() => {
    axios.get(url)
      .then(res  => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoad(false));
  }, [url]);

  return { data, loading, error };
};`,
    output: `{
  data: [...courses],
  loading: false,
  error: null
}`,
    explanation: "Generic hook handles loading, error and data states for any GET endpoint.",
  },
  {
    id: 4,
    title: "Node.js: Rate Limiter",
    icon: <SiNodedotjs className="text-green-500" />,
    tag: "Node.js",
    tagColor: "from-green-600 to-lime-600",
    code: `import rateLimit from "express-rate-limit";

// Allow 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests"
  }
});

app.use("/api/", limiter);`,
    output: `🛡️ Rate limiter active
→ 100 req / 15 min / IP
→ RateLimit-Limit, RateLimit-Remaining`,
    explanation: "express-rate-limit middleware protects your API from brute-force and abuse.",
  },
  {
    id: 5,
    title: "React: Redux Slice",
    icon: <SiReact className="text-purple-400" />,
    tag: "Redux Toolkit",
    tagColor: "from-purple-500 to-violet-600",
    code: `import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null },
  reducers: {
    login: (state, action) => {
      state.user  = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user  = null;
      state.token = null;
    }
  }
});

export const { login, logout } = authSlice.actions;`,
    output: `✅ Slice created with 2 reducers
✅ Actions: login, logout exported
✅ Immutable updates via Immer`,
    explanation: "createSlice auto-generates action creators and reducers using Immer under the hood.",
  },
];

const ROTATE_INTERVAL = 9000;

// ─── Token-based syntax highlighter ─────────────────────────────────────────
// Tokenises one line into an array of { type, text } without ever mutating
// already-classified tokens. Each character belongs to exactly one token.

const KEYWORDS = new Set([
  "const","let","var","function","return","if","else","for","while","do",
  "try","catch","finally","throw","new","delete","typeof","instanceof",
  "async","await","import","export","default","from","class","extends",
  "super","this","null","undefined","true","false","void","in","of",
  "switch","case","break","continue","static","get","set",
]);

function tokenise(line) {
  const tokens = [];
  let i = 0;

  const push = (type, text) => {
    if (text) tokens.push({ type, text });
  };

  while (i < line.length) {
    // ── single-line comment //
    if (line[i] === "/" && line[i + 1] === "/") {
      push("comment", line.slice(i));
      break;
    }

    // ── string " ' `
    if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === "\\" ) { j += 2; continue; }
        if (line[j] === quote) { j++; break; }
        j++;
      }
      push("string", line.slice(i, j));
      i = j;
      continue;
    }

    // ── number
    if (/[0-9]/.test(line[i]) && (i === 0 || /\W/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[0-9._]/.test(line[j])) j++;
      push("number", line.slice(i, j));
      i = j;
      continue;
    }

    // ── identifier or keyword
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      // peek ahead: if followed by ( it's a function call
      const nextNonSpace = line.slice(j).trimStart();
      if (KEYWORDS.has(word)) {
        push("keyword", word);
      } else if (nextNonSpace.startsWith("(")) {
        push("fn", word);
      } else {
        push("ident", word);
      }
      i = j;
      continue;
    }

    // ── punctuation / operators (one char at a time)
    const ch = line[i];
    if ("(){}[]:;,.<>=!&|+-*/%^~?".includes(ch)) {
      push("punct", ch);
      i++;
      continue;
    }

    // ── whitespace — preserve exactly
    if (line[i] === " " || line[i] === "\t") {
      let j = i;
      while (j < line.length && (line[j] === " " || line[j] === "\t")) j++;
      push("space", line.slice(i, j));
      i = j;
      continue;
    }

    // ── anything else
    push("other", line[i]);
    i++;
  }

  return tokens;
}

// colour map
const TOKEN_COLOR = {
  keyword:  "#c792ea",   // purple
  string:   "#c3e88d",   // green
  number:   "#f78c6c",   // orange
  comment:  "#637777",   // grey-green italic
  fn:       "#82aaff",   // blue
  ident:    "#eeffff",   // near-white
  punct:    "#89ddff",   // cyan
  space:    "inherit",
  other:    "#eeffff",
};

const CodeLine = ({ line }) => {
  if (line === "") return <span style={{ display: "block", minHeight: "20px" }} />;
  const tokens = tokenise(line);
  return (
    <span style={{ display: "block", lineHeight: "20px" }}>
      {tokens.map((tok, idx) => (
        <span
          key={idx}
          style={{
            color: TOKEN_COLOR[tok.type] || "#eeffff",
            fontStyle: tok.type === "comment" ? "italic" : "normal",
            whiteSpace: "pre",
          }}
        >
          {tok.text}
        </span>
      ))}
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const LiveCodingBox = () => {
  const [currentIdx,    setCurrentIdx]    = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping,      setIsTyping]      = useState(true);
  const [showOutput,    setShowOutput]    = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [paused,        setPaused]        = useState(false);

  const typingRef      = useRef(null);
  const progressRef    = useRef(null);
  const rotateRef      = useRef(null);
  // persistent counters so we can resume from where we stopped
  const typingPos      = useRef(0);
  const progressPos    = useRef(0);

  const challenge = challenges[currentIdx];

  // ── clear all running timers ──
  const clearAll = () => {
    clearInterval(typingRef.current);
    clearInterval(progressRef.current);
    clearTimeout(rotateRef.current);
  };

  // ── start typing from position `from` ──
  const startTyping = useCallback((code, from = 0) => {
    setIsTyping(true);
    let i = from;
    clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      i++;
      typingPos.current = i;
      setDisplayedCode(code.slice(0, i));
      if (i >= code.length) {
        clearInterval(typingRef.current);
        setIsTyping(false);
        setTimeout(() => setShowOutput(true), 400);
      }
    }, 16);
  }, []);

  // ── start progress bar from value `from` ──
  const startProgress = useCallback((from = 0) => {
    let p = from;
    clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      p += 100 / (ROTATE_INTERVAL / 100);
      progressPos.current = Math.min(p, 100);
      setProgress(progressPos.current);
      if (p >= 100) clearInterval(progressRef.current);
    }, 100);
  }, []);

  // ── schedule auto-rotate ──
  const scheduleRotate = useCallback((delayMs) => {
    clearTimeout(rotateRef.current);
    rotateRef.current = setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % challenges.length);
    }, delayMs);
  }, []);

  // ── full reset when challenge changes ──
  const launchChallenge = useCallback((code) => {
    clearAll();
    typingPos.current   = 0;
    progressPos.current = 0;
    setDisplayedCode("");
    setShowOutput(false);
    setPaused(false);
    startTyping(code, 0);
    startProgress(0);
    scheduleRotate(ROTATE_INTERVAL);
  }, [startTyping, startProgress, scheduleRotate]);

  // ── navigate to a specific challenge ──
  const goTo = (idx) => {
    clearAll();
    setPaused(false);
    setCurrentIdx(idx);
  };

  // ── pause: freeze everything in place ──
  const handlePause = () => {
    clearAll();
    setPaused(true);
    // show full code + output immediately so user can read it
    setDisplayedCode(challenge.code);
    setIsTyping(false);
    setShowOutput(true);
  };

  // ── resume: restart typing + progress from scratch for current challenge ──
  const handleResume = () => {
    setPaused(false);
    typingPos.current   = 0;
    progressPos.current = 0;
    setDisplayedCode("");
    setShowOutput(false);
    setIsTyping(true);
    startTyping(challenge.code, 0);
    startProgress(0);
    scheduleRotate(ROTATE_INTERVAL);
  };

  // launch on mount + challenge switch
  useEffect(() => {
    launchChallenge(challenge.code);
    return clearAll;
  }, [currentIdx]);

  // split displayed code into lines for rendering
  const lines = displayedCode.split("\n");

  return (
    <section className="w-full py-14 lg:py-24 px-4 relative overflow-hidden">
      {/* bg glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(168,85,247,0.08)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="text-center mb-14">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold glass border mb-4"
            style={{ borderColor: "rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}
          >
            ⚡ LIVE CODE PLAYGROUND
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Watch MERN Code{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Come Alive
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: "var(--text-secondary)" }}>
            Real-world MERN stack snippets — auto-rotating every 9 seconds. Watch, learn, and master.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* sidebar */}
          <div className="lg:w-56 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {challenges.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => goTo(idx)}
                className="flex-shrink-0 flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left border"
                style={{
                  background: idx === currentIdx ? "rgba(168,85,247,0.15)" : "var(--glass-bg)",
                  borderColor: idx === currentIdx ? "rgba(168,85,247,0.5)" : "var(--glass-border)",
                  color: idx === currentIdx ? "var(--text-primary)" : "var(--text-secondary)",
                  boxShadow: idx === currentIdx ? "0 0 20px rgba(168,85,247,0.2)" : "none",
                  backdropFilter: "blur(16px)",
                }}
              >
                <span className="text-xl flex-shrink-0">{c.icon}</span>
                <span className="hidden lg:block text-xs leading-tight">{c.title}</span>
              </button>
            ))}
          </div>

          {/* editor */}
          <div
            className="flex-1 rounded-2xl overflow-hidden border flex flex-col"
            style={{
              background: "rgba(12,12,24,0.85)",
              borderColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              minHeight: "420px",
            }}
          >
            {/* titlebar */}
            <div
              className="flex items-center justify-between px-3 sm:px-5 py-3 border-b flex-wrap gap-2"
              style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono" style={{ color: "#637777" }}>
                  challenge.js
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${challenge.tagColor} text-white`}
                >
                  {challenge.tag}
                </span>
                {/* ── PAUSE / RESUME ── */}
                <button
                  onClick={paused ? handleResume : handlePause}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-200 text-xs font-semibold"
                  style={{
                    background: paused
                      ? "rgba(168,85,247,0.18)"
                      : "rgba(251,191,36,0.12)",
                    borderColor: paused
                      ? "rgba(168,85,247,0.45)"
                      : "rgba(251,191,36,0.4)",
                    color: paused ? "#a855f7" : "#fbbf24",
                  }}
                  title={paused ? "Resume auto-rotation" : "Pause — freeze code to read"}
                >
                  {paused ? (
                    <><FiPlay className="w-3 h-3" /> <span className="hidden sm:inline">Resume</span></>
                  ) : (
                    <><FiPause className="w-3 h-3" /> <span className="hidden sm:inline">Pause</span></>
                  )}
                </button>
                <button
                  onClick={() => { clearAll(); setPaused(false); launchChallenge(challenge.code); }}
                  className="p-1.5 rounded-lg border transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#637777" }}
                  title="Restart"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => goTo((currentIdx + 1) % challenges.length)}
                  className="p-1.5 rounded-lg border transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#637777" }}
                  title="Next"
                >
                  <FiChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* progress bar */}
            <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div
                className="h-full transition-all duration-100"
                style={{
                  width: paused ? "100%" : `${progress}%`,
                  background: paused
                    ? "linear-gradient(90deg, #a855f7, #7c3aed)"
                    : "linear-gradient(90deg, #a855f7, #06b6d4)",
                  opacity: paused ? 0.5 : 1,
                }}
              />
            </div>

            {/* paused banner */}
            {paused && (
              <div
                className="flex items-center justify-between px-3 sm:px-5 py-2 gap-2"
                style={{ background: "rgba(168,85,247,0.10)", borderBottom: "1px solid rgba(168,85,247,0.2)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "#a855f7" }}
                  />
                  <span style={{ color: "#a855f7", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
                    PAUSED — auto-rotation stopped
                  </span>
                </div>
                <button
                  onClick={handleResume}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                  style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7" }}
                >
                  <FiPlay className="w-3 h-3" /> Resume
                </button>
              </div>
            )}

            {/* code + output */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* ── code panel ── */}
              <div className="flex-1 overflow-auto p-3 lg:p-5" style={{ fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace", fontSize: "13px" }}>
                <div className="flex gap-5">
                  {/* line numbers */}
                  <div className="select-none text-right flex-shrink-0" style={{ color: "#3b4b5b", minWidth: "20px", lineHeight: "20px" }}>
                    {lines.map((_, i) => (
                      <div key={i} style={{ lineHeight: "20px" }}>{i + 1}</div>
                    ))}
                  </div>

                  {/* highlighted code */}
                  <div className="flex-1 overflow-x-auto">
                    {lines.map((line, i) => (
                      <CodeLine key={i} line={line} />
                    ))}
                    {/* blinking cursor */}
                    {isTyping && (
                      <span
                        className="inline-block animate-pulse rounded-sm"
                        style={{ width: "8px", height: "16px", background: "#a855f7", verticalAlign: "text-bottom" }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* ── output panel ── */}
              <div
                className="lg:w-56 flex flex-col gap-3 p-4 transition-all duration-500"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  opacity: showOutput ? 1 : 0,
                }}
              >
                {/* output label */}
                <div className="flex items-center gap-2">
                  <FiPlay style={{ color: "#4ade80", width: "14px", height: "14px" }} />
                  <span style={{ color: "#4ade80", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>OUTPUT</span>
                </div>

                {/* output text */}
                <pre
                  className="flex-1 whitespace-pre-wrap rounded-xl p-3 leading-5"
                  style={{
                    fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace",
                    fontSize: "12px",
                    color: "#c3e88d",
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {challenge.output}
                </pre>

                {/* explanation */}
                <div
                  className="p-3 rounded-xl leading-relaxed"
                  style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.18)" }}
                >
                  <p style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.6" }}>
                    {challenge.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* dot nav */}
        <div className="flex justify-center gap-2 mt-8">
          {challenges.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: idx === currentIdx ? "32px" : "8px",
                background: idx === currentIdx
                  ? paused
                    ? "linear-gradient(90deg,#a855f7,#7c3aed)"
                    : "linear-gradient(90deg,#a855f7,#06b6d4)"
                  : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveCodingBox;
