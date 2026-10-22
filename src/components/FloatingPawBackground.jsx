import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./FloatingPawBackground.css";

// SVG Paw Icon
function PawSvg({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main pad */}
      <ellipse cx="12" cy="16.5" rx="5" ry="4.2" />
      {/* 4 toe pads */}
      <circle cx="6.5" cy="9.8" r="2.2" />
      <circle cx="10.2" cy="6.8" r="2.3" />
      <circle cx="13.8" cy="6.8" r="2.3" />
      <circle cx="17.5" cy="9.8" r="2.2" />
    </svg>
  );
}

// SVG Heart Icon
function HeartSvg({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

// SVG Sparkle Star Icon
function SparkleSvg({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2L14.2 9.2L21.4 11.4L14.2 13.6L12 20.8L9.8 13.6L2.6 11.4L9.8 9.2L12 2Z" />
    </svg>
  );
}

// Deterministic seed particle list
const PARTICLES_CONFIG = [
  { id: 1, type: "paw", left: "4%", size: 30, duration: 24, delay: 0, driftX: 32, driftRot: 22, opacity: 0.08, isAccent: false },
  { id: 2, type: "heart", left: "11%", size: 16, duration: 20, delay: 4, driftX: -24, driftRot: -18, opacity: 0.12 },
  { id: 3, type: "paw", left: "19%", size: 24, duration: 27, delay: 8, driftX: 20, driftRot: 14, opacity: 0.09, isAccent: true },
  { id: 4, type: "sparkle", left: "26%", size: 15, duration: 19, delay: 2, driftX: -18, driftRot: 35, opacity: 0.14 },
  { id: 5, type: "paw", left: "34%", size: 34, duration: 29, delay: 11, driftX: 38, driftRot: -25, opacity: 0.07, isAccent: false },
  { id: 6, type: "heart", left: "42%", size: 18, duration: 22, delay: 6, driftX: 25, driftRot: 15, opacity: 0.11 },
  { id: 7, type: "paw", left: "49%", size: 26, duration: 25, delay: 14, driftX: -30, driftRot: 28, opacity: 0.08, isAccent: true },
  { id: 8, type: "sparkle", left: "57%", size: 17, duration: 21, delay: 3, driftX: 22, driftRot: -40, opacity: 0.15 },
  { id: 9, type: "paw", left: "64%", size: 32, duration: 28, delay: 9, driftX: -26, driftRot: -20, opacity: 0.08, isAccent: false },
  { id: 10, type: "heart", left: "71%", size: 15, duration: 23, delay: 15, driftX: 20, driftRot: 18, opacity: 0.12 },
  { id: 11, type: "paw", left: "79%", size: 28, duration: 26, delay: 1, driftX: 34, driftRot: 24, opacity: 0.09, isAccent: true },
  { id: 12, type: "sparkle", left: "86%", size: 16, duration: 20, delay: 7, driftX: -25, driftRot: 30, opacity: 0.13 },
  { id: 13, type: "paw", left: "93%", size: 25, duration: 30, delay: 13, driftX: -28, driftRot: -16, opacity: 0.07, isAccent: false },
  { id: 14, type: "paw", left: "15%", size: 36, duration: 32, delay: 17, driftX: 35, driftRot: 30, opacity: 0.06, isAccent: false },
  { id: 15, type: "heart", left: "53%", size: 17, duration: 24, delay: 19, driftX: -22, driftRot: -14, opacity: 0.10 },
  { id: 16, type: "paw", left: "82%", size: 22, duration: 25, delay: 16, driftX: 26, driftRot: 16, opacity: 0.08, isAccent: true }
];

export default function FloatingPawBackground({ forcePage = null }) {
  const location = useLocation();

  // Detect current page to adjust density
  const pageClass = useMemo(() => {
    if (forcePage) return `density-${forcePage}`;
    const path = location.pathname;
    if (path === "/" || path === "/home") return "density-home";
    if (path.startsWith("/adopt")) return "density-adopt";
    return "density-subtle";
  }, [location.pathname, forcePage]);

  return (
    <div
      className={`floating-paw-bg-container ${pageClass}`}
      aria-hidden="true"
    >
      {PARTICLES_CONFIG.map((p) => {
        let content = null;
        let variantClass = "";

        if (p.type === "paw") {
          variantClass = `particle-paw ${p.isAccent ? "accent" : ""}`;
          content = <PawSvg size={p.size} />;
        } else if (p.type === "heart") {
          variantClass = "particle-heart";
          content = <HeartSvg size={p.size} />;
        } else if (p.type === "sparkle") {
          variantClass = "particle-sparkle";
          content = <SparkleSvg size={p.size} />;
        }

        return (
          <div
            key={p.id}
            className={`floating-paw-particle ${variantClass}`}
            style={{
              left: p.left,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift-x": `${p.driftX}px`,
              "--drift-rot": `${p.driftRot}deg`,
              "--target-opacity": p.opacity
            }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
