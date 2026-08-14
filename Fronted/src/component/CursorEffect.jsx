import { useEffect, useRef } from "react";

/*
  Simple cursor glow  — desktop only
  Simple touch ripple — mobile only
  No canvas, no particles, no trails.
*/

const CursorEffect = () => {
  const dotRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch) {
      /* ── Desktop: small glowing dot follows cursor ── */
      const dot = dotRef.current;
      if (!dot) return;

      let x = 0, y = 0;
      let tx = 0, ty = 0;
      let raf;

      const onMove = (e) => { tx = e.clientX; ty = e.clientY; };

      const animate = () => {
        x += (tx - x) * 0.15;
        y += (ty - y) * 0.15;
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(animate);
      };

      window.addEventListener("mousemove", onMove);
      raf = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(raf);
      };
    } else {
      /* ── Mobile: tiny ripple circle on touchmove ── */
      let last = 0;

      const onTouchMove = (e) => {
        const now = Date.now();
        if (now - last < 200) return;
        last = now;

        const t = e.touches[0];
        const el = document.createElement("div");
        Object.assign(el.style, {
          position:      "fixed",
          left:          `${t.clientX}px`,
          top:           `${t.clientY}px`,
          width:         "8px",
          height:        "8px",
          borderRadius:  "50%",
          border:        "1px solid rgba(168,85,247,0.6)",
          transform:     "translate(-50%,-50%) scale(1)",
          opacity:       "0.6",
          pointerEvents: "none",
          zIndex:        "9999",
          transition:    "transform 500ms ease-out, opacity 500ms ease-out",
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transform = "translate(-50%,-50%) scale(4)";
          el.style.opacity   = "0";
        });
        setTimeout(() => el.remove(), 520);
      };

      window.addEventListener("touchmove", onTouchMove, { passive: true });
      return () => window.removeEventListener("touchmove", onTouchMove);
    }
  }, []);

  /* render nothing on touch devices */
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={dotRef}
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "10px",
        height:        "10px",
        borderRadius:  "50%",
        background:    "rgba(168,85,247,0.7)",
        boxShadow:     "0 0 8px rgba(168,85,247,0.5)",
        pointerEvents: "none",
        zIndex:        99999,
        willChange:    "transform",
      }}
    />
  );
};

export default CursorEffect;
