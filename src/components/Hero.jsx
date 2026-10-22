import { Link } from "react-router-dom";

// Deterministic floating paws drifting over the video
const HERO_DRIFT_PAWS = [
  { id: 1, left: "8%", size: 30, duration: 16, delay: 0, driftX: 30 },
  { id: 2, left: "22%", size: 22, duration: 19, delay: 3, driftX: -24 },
  { id: 3, left: "38%", size: 28, duration: 22, delay: 7, driftX: 35 },
  { id: 4, left: "54%", size: 24, duration: 17, delay: 2, driftX: -28 },
  { id: 5, left: "70%", size: 34, duration: 20, delay: 5, driftX: 32 },
  { id: 6, left: "86%", size: 26, duration: 18, delay: 1, driftX: -26 },
  { id: 7, left: "94%", size: 20, duration: 21, delay: 8, driftX: 20 }
];

function HeroPawSvg({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="16.5" rx="5" ry="4.2" />
      <circle cx="6.5" cy="9.8" r="2.2" />
      <circle cx="10.2" cy="6.8" r="2.3" />
      <circle cx="13.8" cy="6.8" r="2.3" />
      <circle cx="17.5" cy="9.8" r="2.2" />
    </svg>
  );
}

function Hero({ onOpenChatbot }) {
  // Words for word-by-word reveal: "Find a friend who's already waiting for you."
  const headlineWords = [
    { text: "Find", delay: 0 },
    { text: "a", delay: 110 },
    { text: "friend", delay: 220 },
    { text: "who's", delay: 350 },
    { text: "already", delay: 470 },
    { text: "waiting", delay: 600, highlight: true },
    { text: "for", delay: 710, highlight: true },
    { text: "you.", delay: 820, highlight: true }
  ];

  return (
    <section className="hero" id="home">
      {/* 1. Muted, Looping Cinematic Background Video */}
      <video
        className="hero-cinematic-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=1600&auto=format&fit=crop"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-golden-retriever-dog-getting-a-pat-42436-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Dark / Cream-tinted Overlay */}
      <div className="hero-cinematic-overlay" aria-hidden="true" />

      {/* 3. Floating Paw-shaped particles drifting over the video */}
      <div className="hero-video-paw-particles" aria-hidden="true">
        {HERO_DRIFT_PAWS.map((p) => (
          <div
            key={p.id}
            className="hero-drift-paw"
            style={{
              left: p.left,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: `translateX(${p.driftX}px)`
            }}
          >
            <HeroPawSvg size={p.size} />
          </div>
        ))}
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <p className="kicker">
            <span>🐾</span> Every paw deserves a home
          </p>

          {/* 4. Animated Headline Reveals Word by Word */}
          <h1>
            <span style={{ display: "block" }}>
              {headlineWords.slice(0, 3).map((w, idx) => (
                <span
                  key={idx}
                  className="hero-word-wrap"
                  style={{ animationDelay: `${w.delay}ms` }}
                >
                  {w.text}
                </span>
              ))}
            </span>

            <span style={{ display: "block" }}>
              {headlineWords.slice(3, 5).map((w, idx) => (
                <span
                  key={idx}
                  className="hero-word-wrap"
                  style={{ animationDelay: `${w.delay}ms` }}
                >
                  {w.text}
                </span>
              ))}
            </span>

            <span style={{ display: "block" }}>
              <span className="ink-underline">
                {headlineWords.slice(5).map((w, idx) => (
                  <span
                    key={idx}
                    className="hero-word-wrap"
                    style={{ animationDelay: `${w.delay}ms` }}
                  >
                    {w.text}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <p className="hero-lead">
            FureverCare brings together rescue shelters, volunteer vets, and
            adopting families — so every stray finds a home and no animal in
            crisis waits alone.
          </p>

          <div className="hero-actions">
            {/* 5. CTA Buttons with gentle glow on hover */}
            <Link
              to="/adopt"
              className="btn btn-primary hero-btn-primary"
            >
              <span>Adopt a Friend</span>
              <span style={{ fontSize: "1.1rem" }}>🐾</span>
            </Link>

            <button
              type="button"
              className="btn btn-outline hero-btn-outline"
              onClick={() => {
                if (onOpenChatbot) {
                  onOpenChatbot("I found this injured dog what to do");
                }
              }}
              style={{ cursor: "pointer" }}
              title="Found an injured dog or animal in distress? Get instant AI rescue guidance!"
            >
              <span>🆘 Need Help? (AI Rescue)</span>
            </button>
          </div>

          <div className="hero-trust">
            <p>
              <strong>3,400+</strong> families matched since 2019 • 24/7 Rapid Emergency Network
            </p>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-img hero-img-1"
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=700&auto=format&fit=crop"
            alt="Pet"
          />

          <img
            className="hero-img hero-img-2"
            src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=500&auto=format&fit=crop"
            alt="Cat"
          />

          <div className="hero-card">
            <span className="live-pulse-dot" />
            <div>
              <strong>Milo</strong>
              <p>adopted 2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
