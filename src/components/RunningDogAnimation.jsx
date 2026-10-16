import { useState, useEffect } from "react";
import "./RunningDogAnimation.css";

const WOOF_MESSAGES = [
  "Woof! 🐾 Let's find every dog a home!",
  "Happy paws on the run! 🐶✨",
  "Thank you for caring for animals! ❤️",
  "Need help? Ask PawPal AI! 🐕",
  "Zoomies! Running for rescue! 🎾"
];

export default function RunningDogAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [pawPrints, setPawPrints] = useState([]);
  const [dogQuote, setDogQuote] = useState("");
  const [isJumping, setIsJumping] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [dogSpeed, setDogSpeed] = useState("normal"); // 'chill', 'normal', 'zoomies'

  // Spawn gentle fading paw prints behind the dog periodically
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPawPrints((prev) => {
        const id = Date.now() + Math.random();
        const newPrints = [...prev.slice(-8), { id }];
        return newPrints;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDogClick = (e) => {
    e.stopPropagation();
    setIsJumping(true);
    const randomQuote =
      WOOF_MESSAGES[Math.floor(Math.random() * WOOF_MESSAGES.length)];
    setDogQuote(randomQuote);

    setTimeout(() => {
      setIsJumping(false);
    }, 900);

    setTimeout(() => {
      setDogQuote("");
    }, 3200);
  };

  const getSpeedClass = () => {
    if (dogSpeed === "zoomies") return "speed-zoomies";
    if (dogSpeed === "chill") return "speed-chill";
    return "speed-normal";
  };

  return (
    <div
      className={`running-dog-ambient-container ${!isPlaying ? "is-paused" : ""}`}
      aria-hidden="true"
    >
      {/* Decorative grass blades and path along bottom */}
      <div className="running-dog-track">
        <div className="track-grass-layer"></div>
      </div>

      {/* Floating fluttering butterfly chasing ahead */}
      {isPlaying && (
        <div className={`running-butterfly ${getSpeedClass()}`}>
          <div className="butterfly-wing wing-left"></div>
          <div className="butterfly-body"></div>
          <div className="butterfly-wing wing-right"></div>
        </div>
      )}

      {/* Main Running Dog Element */}
      <div
        className={`running-dog-actor ${getSpeedClass()} ${isJumping ? "dog-is-jumping" : ""}`}
        onClick={handleDogClick}
        title="Click me! 🐶"
      >
        {/* Floating Speech / Woof Bubble */}
        {dogQuote && (
          <div className="dog-speech-bubble">
            <span>{dogQuote}</span>
            <div className="bubble-pointer"></div>
          </div>
        )}

        {/* SVG Articulated Golden Running Dog */}
        <div className="dog-svg-wrapper">
          <svg
            viewBox="0 0 160 110"
            className="dog-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="furGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5A623" />
                <stop offset="50%" stopColor="#E67E22" />
                <stop offset="100%" stopColor="#D35400" />
              </linearGradient>
              <linearGradient id="bellyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FAD7A0" />
                <stop offset="100%" stopColor="#F5CBA7" />
              </linearGradient>
              <linearGradient id="backLegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BA4A00" />
                <stop offset="100%" stopColor="#935116" />
              </linearGradient>
            </defs>

            {/* Ground Shadow */}
            <ellipse
              cx="80"
              cy="102"
              rx="42"
              ry="7"
              className="dog-ground-shadow"
            />

            {/* Back Legs (Distant Layer, darker shade) */}
            <g className="dog-leg-back-distant">
              <path
                d="M 108 55 C 112 68 116 80 120 98 C 122 101 116 102 112 100 C 109 84 105 70 102 56 Z"
                fill="url(#backLegGrad)"
              />
            </g>

            <g className="dog-leg-front-distant">
              <path
                d="M 46 54 C 42 68 38 82 32 96 C 30 99 35 101 39 99 C 45 84 49 70 52 56 Z"
                fill="url(#backLegGrad)"
              />
            </g>

            {/* Wagging Tail */}
            <g className="dog-tail-group">
              <path
                d="M 124 45 C 138 38 148 24 146 16 C 144 14 139 18 134 26 C 127 34 122 42 120 48 Z"
                fill="url(#furGradient)"
              />
            </g>

            {/* Main Torso / Body */}
            <g className="dog-torso-group">
              {/* Main Body Oval */}
              <ellipse
                cx="82"
                cy="52"
                rx="42"
                ry="22"
                fill="url(#furGradient)"
              />
              {/* Soft Belly Highlight */}
              <ellipse
                cx="78"
                cy="57"
                rx="30"
                ry="13"
                fill="url(#bellyGradient)"
              />
            </g>

            {/* Head, Ears & Neck */}
            <g className="dog-head-group">
              {/* Neck */}
              <path
                d="M 54 48 C 48 38 44 28 40 22 C 45 20 54 26 62 36 Z"
                fill="url(#furGradient)"
              />
              {/* Head Circle */}
              <circle
                cx="34"
                cy="28"
                r="18"
                fill="url(#furGradient)"
              />
              {/* Snout */}
              <path
                d="M 28 26 C 22 28 14 30 11 34 C 10 37 14 41 24 39 C 30 38 34 34 34 30 Z"
                fill="url(#furGradient)"
              />
              {/* Black Nose */}
              <ellipse
                cx="11"
                cy="33"
                rx="3.5"
                ry="2.5"
                fill="#20241F"
              />
              {/* Cheerful Eye */}
              <circle
                cx="27"
                cy="24"
                r="3"
                fill="#143530"
              />
              <circle
                cx="28"
                cy="23"
                r="1"
                fill="#FFFFFF"
              />
              {/* Happy Pink Tongue */}
              <path
                d="M 20 38 C 21 44 26 44 25 39 Z"
                fill="#FF6B6B"
                className="dog-tongue"
              />
              {/* Collar & Gold Tag */}
              <path
                d="M 44 38 C 42 43 38 45 35 44 C 36 41 40 37 42 36 Z"
                fill="#FF8552"
              />
              <circle
                cx="37"
                cy="44"
                r="3"
                fill="#F2B705"
              />

              {/* Floppy Ear (Flutters in the wind!) */}
              <g className="dog-floppy-ear">
                <path
                  d="M 39 16 C 46 14 54 22 52 34 C 50 38 45 38 43 32 C 40 26 36 20 39 16 Z"
                  fill="#BA4A00"
                />
              </g>
            </g>

            {/* Fore Legs (Foreground Layer) */}
            <g className="dog-leg-back-near">
              <path
                d="M 112 56 C 118 70 126 84 135 98 C 138 101 133 102 128 100 C 120 86 114 72 108 58 Z"
                fill="url(#furGradient)"
              />
            </g>

            <g className="dog-leg-front-near">
              <path
                d="M 52 56 C 46 70 38 85 28 98 C 25 101 29 103 34 100 C 44 86 49 72 56 58 Z"
                fill="url(#furGradient)"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Sparkles / Autumn Leaves drifting */}
      {isPlaying && (
        <div className="ambient-particles-trail">
          <span className="ambient-leaf leaf-1">🍂</span>
          <span className="ambient-leaf leaf-2">✨</span>
          <span className="ambient-leaf leaf-3">🐾</span>
        </div>
      )}

      {/* Ambient Animation Quick Controls (Bottom-left discreet badge) */}
      <div className="running-dog-badge-control">
        <button
          className="badge-toggle-btn"
          onClick={() => setShowControls(!showControls)}
          title="Running Dog Animation Controls"
        >
          <span>🐕</span>
          <span className="badge-status-text">
            {isPlaying ? "Active (Click pup!)" : "Paused"}
          </span>
        </button>

        {showControls && (
          <div className="running-dog-mini-menu">
            <div className="menu-header">
              <strong>🐾 FureverCare Pup</strong>
              <button onClick={() => setShowControls(false)}>✕</button>
            </div>
            <div className="menu-buttons">
              <button
                className={`menu-opt ${isPlaying ? "active" : ""}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? "⏸️ Pause Running" : "▶️ Play Running"}
              </button>
              <div className="speed-buttons">
                <button
                  className={dogSpeed === "chill" ? "active" : ""}
                  onClick={() => setDogSpeed("chill")}
                >
                  Chill Walk
                </button>
                <button
                  className={dogSpeed === "normal" ? "active" : ""}
                  onClick={() => setDogSpeed("normal")}
                >
                  Jog
                </button>
                <button
                  className={dogSpeed === "zoomies" ? "active" : ""}
                  onClick={() => setDogSpeed("zoomies")}
                >
                  Zoomies! ⚡
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
