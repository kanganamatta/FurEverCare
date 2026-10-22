import { useState, useEffect, useRef } from "react";

// The 4 Core Emergency Status Milestones as specified in requirements:
// Reported → Assigned → En Route → Rescued
const CORE_STATUS_STEPS = [
  {
    stepIndex: 0,
    threshold: 0,
    key: "reported",
    title: "Reported",
    subtitle: "Alert Logged in Grid",
    icon: "📝"
  },
  {
    stepIndex: 1,
    threshold: 1,
    key: "assigned",
    title: "Assigned",
    subtitle: "Response Squad & Vet",
    icon: "👨‍⚕️"
  },
  {
    stepIndex: 2,
    threshold: 2,
    key: "en-route",
    title: "En Route",
    subtitle: "Ambulance with Sirens",
    icon: "🚑"
  },
  {
    stepIndex: 3,
    threshold: 5,
    key: "rescued",
    title: "Rescued",
    subtitle: "Safely Stabilized & Sheltered",
    icon: "💚"
  }
];

const TRACKING_STAGES = [
  {
    step: 1,
    title: "Rescue Alert Logged",
    desc: "Incident details, location, and severity registered in FureverCare dispatch grid.",
    icon: "📝",
    timeOffset: "0 mins"
  },
  {
    step: 2,
    title: "Team & Vet Assigned",
    desc: "Rescue Specialist Rajesh K. & Dr. Ananya Roy assigned to response team.",
    icon: "👨‍⚕️",
    timeOffset: "+3 mins"
  },
  {
    step: 3,
    title: "Ambulance En Route",
    desc: "Mobile trauma van Unit 01 dispatched with oxygen, stretcher, and analgesics.",
    icon: "🚑",
    timeOffset: "+6 mins"
  },
  {
    step: 4,
    title: "On-Site Triage & Stabilization",
    desc: "Paramedics administering wound dressing, pain relief, and gentle containment.",
    icon: "🩺",
    timeOffset: "+18 mins"
  },
  {
    step: 5,
    title: "Transport to Trauma Hospital",
    desc: "Animal safely secured inside heated ambulance chamber en route to ICU.",
    icon: "🏥",
    timeOffset: "+28 mins"
  },
  {
    step: 6,
    title: "Admitted & Recovering at Shelter",
    desc: "Animal undergoing diagnostic X-ray, post-op care, and safe shelter boarding.",
    icon: "💚",
    timeOffset: "+45 mins"
  }
];

// Reusable Count-up Number Component using IntersectionObserver
function StatCountUp({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setCount(Math.floor(eased * target));
      if (elapsed < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref} className="kpi-number">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function RescueTracker({ currentReport, allReports = [], onSelectReport }) {
  const [selectedId, setSelectedId] = useState(currentReport?.id || "");
  const [searchId, setSearchId] = useState(currentReport?.id || "");
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 minutes countdown demo
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);

  // Derived active report
  const effectiveId = selectedId || currentReport?.id || allReports[0]?.id;
  const activeReport =
    allReports.find((r) => r.id === effectiveId) ||
    currentReport ||
    allReports[0] ||
    null;

  // Live ETA countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => (prev > 10 ? prev - 1 : 480));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-simulation of dispatch lifecycle
  useEffect(() => {
    if (!isAutoSimulating || !activeReport) return;

    const interval = setInterval(() => {
      const currentStage = activeReport.currentStageIndex ?? 0;
      if (currentStage >= TRACKING_STAGES.length - 1) {
        setIsAutoSimulating(false);
        return;
      }
      const nextStage = currentStage + 1;
      const updated = {
        ...activeReport,
        currentStageIndex: nextStage,
        status: TRACKING_STAGES[nextStage].title
      };
      if (onSelectReport) onSelectReport(updated);
      setSelectedId(updated.id);
    }, 2800);

    return () => clearInterval(interval);
  }, [isAutoSimulating, activeReport, onSelectReport]);

  const formatEta = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    const found = allReports.find(
      (r) => r.id.toUpperCase() === query || r.id.toUpperCase().includes(query)
    );
    if (found) {
      setSelectedId(found.id);
      if (onSelectReport) onSelectReport(found);
    } else {
      alert(`No rescue report found for ID "${searchId}". Try picking one of the active reports below.`);
    }
  };

  const handleAdvanceStage = (explicitIndex = null) => {
    if (!activeReport) return;
    const currentStage = activeReport.currentStageIndex ?? 2;
    const nextStage =
      explicitIndex !== null
        ? explicitIndex
        : Math.min(TRACKING_STAGES.length - 1, currentStage + 1);

    const updated = {
      ...activeReport,
      currentStageIndex: nextStage,
      status: TRACKING_STAGES[nextStage].title
    };

    try {
      const saved = JSON.parse(localStorage.getItem("rescueReports") || "[]");
      const updatedList = saved.map((r) => (r.id === updated.id ? updated : r));
      localStorage.setItem("rescueReports", JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }

    if (onSelectReport) onSelectReport(updated);
    setSelectedId(updated.id);
  };

  const handleCopyId = () => {
    if (!activeReport?.id) return;
    navigator.clipboard.writeText(activeReport.id);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const currentStageIndex = activeReport?.currentStageIndex ?? 2;
  const progressPercent = Math.round(
    ((currentStageIndex + 1) / TRACKING_STAGES.length) * 100
  );

  // Determine which of the 4 core steps is active/completed
  // Reported: index 0
  // Assigned: index 1
  // En Route: index 2, 3, 4
  // Rescued: index 5
  const getCoreStepStatus = (stepKey) => {
    if (stepKey === "reported") {
      return currentStageIndex > 0 ? "completed" : "current";
    }
    if (stepKey === "assigned") {
      if (currentStageIndex > 1) return "completed";
      if (currentStageIndex === 1) return "current";
      return "upcoming";
    }
    if (stepKey === "en-route") {
      if (currentStageIndex >= 5) return "completed";
      if (currentStageIndex >= 2 && currentStageIndex < 5) return "current";
      return "upcoming";
    }
    if (stepKey === "rescued") {
      if (currentStageIndex >= 5) return "current completed";
      return "upcoming";
    }
    return "upcoming";
  };

  return (
    <div className="rescue-tracker-container">
      {/* ================= RESCUE STATISTICS COUNT-UP BANNER ================= */}
      {/* Live rescue statistics count up when they enter the screen */}
      <div className="rescue-stats-kpi-grid">
        <div className="rescue-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-ambulance">🚑</div>
          <div className="kpi-data">
            <div className="kpi-number-row">
              <StatCountUp target={8} />
              <span className="kpi-pulse-dot" title="Live GPS link active" />
            </div>
            <span className="kpi-label">Ambulances Active on Grid</span>
          </div>
        </div>

        <div className="rescue-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-time">⚡</div>
          <div className="kpi-data">
            <div className="kpi-number-row">
              <StatCountUp target={11} suffix=" mins" />
            </div>
            <span className="kpi-label">Avg Emergency Response Time</span>
          </div>
        </div>

        <div className="rescue-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-rescues">🐾</div>
          <div className="kpi-data">
            <div className="kpi-number-row">
              <StatCountUp target={1850} suffix="+" />
            </div>
            <span className="kpi-label">Animals Rescued & Sheltered</span>
          </div>
        </div>

        <div className="rescue-kpi-card">
          <div className="kpi-icon-wrap kpi-icon-success">🏥</div>
          <div className="kpi-data">
            <div className="kpi-number-row">
              <StatCountUp target={98} suffix="%" />
            </div>
            <span className="kpi-label">ICU Trauma Stabilization Rate</span>
          </div>
        </div>
      </div>

      {/* ================= 4 STATUS STEPS ANIMATION ================= */}
      {/* Status steps animate: Reported → Assigned → En Route → Rescued */}
      <div className="emergency-steps-pipeline-card">
        <div className="pipeline-header">
          <h3>
            <span>🚨</span> Live Emergency Dispatch Pipeline
          </h3>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span className="pipeline-status-badge">
              <span className="live-pulse-dot" /> CURRENT: {TRACKING_STAGES[currentStageIndex]?.title.toUpperCase()}
            </span>
            <button
              type="button"
              className="simulate-stage-btn"
              style={{ background: "#ffffff", color: "#143530" }}
              onClick={() => setIsAutoSimulating(!isAutoSimulating)}
              title="Toggle automatic real-time progression simulation"
            >
              {isAutoSimulating ? "⏸ Pause Auto-Play" : "▶ Auto-Simulate Live Dispatch"}
            </button>
          </div>
        </div>

        <div className="emergency-steps-pipeline">
          {CORE_STATUS_STEPS.map((st, idx) => {
            const status = getCoreStepStatus(st.key);
            const isCompleted = status.includes("completed");
            const isCurrent = status.includes("current");

            return (
              <div key={st.key} style={{ display: "contents" }}>
                <div
                  className={`step-pipeline-item ${status}`}
                  onClick={() => handleAdvanceStage(st.threshold)}
                  title={`Click to set stage to ${st.title}`}
                >
                  <div className="step-pipeline-node">
                    <span>{st.icon}</span>
                    {isCompleted && (
                      <span className="step-pipeline-badge">✓</span>
                    )}
                  </div>
                  <span className="step-pipeline-name">{st.title}</span>
                  <span className="step-pipeline-time">{st.subtitle}</span>
                </div>

                {idx < CORE_STATUS_STEPS.length - 1 && (
                  <div
                    className={`step-pipeline-rail ${
                      isCompleted ? "completed" : isCurrent ? "active-flow" : ""
                    }`}
                  >
                    <div
                      className="step-pipeline-rail-fill"
                      style={{
                        width: isCompleted ? "100%" : isCurrent ? "50%" : "0%"
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Quick Chips */}
      <div className="tracker-search-section">
        <form onSubmit={handleSearch} className="tracker-search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="tracker-search-input"
              placeholder="Enter Rescue ID (e.g. RC-89410283)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button type="submit" className="tracker-search-btn">
            Track Rescue
          </button>
        </form>

        {allReports.length > 0 && (
          <div className="recent-reports-chips">
            <span className="chips-label">Quick View Active:</span>
            {allReports.slice(0, 4).map((rep) => (
              <button
                key={rep.id}
                type="button"
                className={`report-chip ${activeReport?.id === rep.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedId(rep.id);
                  setSearchId(rep.id);
                  if (onSelectReport) onSelectReport(rep);
                }}
              >
                <span>{rep.animalType === "Cat" ? "🐱" : "🐕"}</span>
                <strong>{rep.id}</strong>
                <small>({rep.location?.split(",")[0] || "Location"})</small>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeReport ? (
        <div className="tracker-card">
          {/* Tracker Card Header */}
          <div className="tracker-header">
            <div className="tracker-id-col">
              <div className="tracker-badge-row">
                <span className="live-pulse-dot" />
                <span className="tracker-live-tag">LIVE EMERGENCY TRACKING</span>
                <span className={`priority-pill priority-${(activeReport.priority || "Normal").toLowerCase()}`}>
                  {activeReport.priority || "Normal"} Priority
                </span>
              </div>
              <h2>
                Rescue ID: <span className="highlight-id">{activeReport.id}</span>
                <button
                  type="button"
                  className="copy-id-btn"
                  onClick={handleCopyId}
                  title="Copy Tracking ID"
                >
                  {copyFeedback ? "✓ Copied" : "📋 Copy"}
                </button>
              </h2>
              <p className="report-time-meta">
                Reported on: <strong>{activeReport.date || "Just now"}</strong>
              </p>
            </div>

            <div className="tracker-eta-card">
              <span className="eta-label">ESTIMATED AMBULANCE ARRIVAL</span>
              <strong className="eta-clock">{formatEta(etaSeconds)}</strong>
              <span className="eta-unit">Ambulance Unit 01 (Speed: 44 km/h)</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="tracker-progress-track">
            <div className="progress-info-row">
              <span>Mission Progress: <strong>{TRACKING_STAGES[currentStageIndex].title}</strong></span>
              <span>{progressPercent}% Completed</span>
            </div>
            <div className="progress-bar-rail">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* ================= LIVE ROUTE ANIMATION & MOVING AMBULANCE ================= */}
          {/* A rescue vehicle moves along a route on the map & active rescue marker pulses */}
          <div className="tracker-route-radar-box">
            <div className="radar-box-header">
              <strong>
                <span>🗺️</span> Real-time Dispatch Route & GPS Telemetry
              </strong>
              <span className="radar-speed-tag">Ambulance Unit 01: 44 km/h</span>
            </div>

            <div className="mini-route-svg-wrap">
              <svg
                className="mini-route-svg"
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
              >
                {/* Background road network */}
                <rect width="800" height="200" fill="#E8EDE4" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="#FFFFFF" strokeWidth="16" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="#CBD5E0" strokeWidth="2" strokeDasharray="8 6" />

                {/* Animated Glowing Emergency Route */}
                <path
                  d="M 60 100 C 220 30, 420 170, 720 100"
                  fill="none"
                  stroke="rgba(255, 133, 82, 0.45)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 100 C 220 30, 420 170, 720 100"
                  fill="none"
                  stroke="#FF8552"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                  className="animated-route-path"
                />

                {/* Base Station Pin */}
                <g transform="translate(60, 100)">
                  <circle cx="0" cy="0" r="16" fill="#143530" stroke="#fff" strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fontSize="14">🏥</text>
                  <text x="0" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill="#143530">Trauma Base</text>
                </g>

                {/* Pulsing Active Rescue Marker Pin */}
                <g transform="translate(720, 100)">
                  {/* Outer pulsating radar ring */}
                  <circle cx="0" cy="0" r="28" fill="rgba(255, 59, 48, 0.25)" stroke="#FF3B30" strokeWidth="2">
                    <animate attributeName="r" values="18;34;18" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="16" fill="#FF3B30" stroke="#fff" strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fontSize="14">🚨</text>
                  <text x="0" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#C81E1E">Distress Location</text>
                </g>

                {/* Moving Rescue Vehicle along route */}
                <g>
                  <animateMotion
                    dur="7s"
                    repeatCount="indefinite"
                    rotate="auto"
                    path="M 60 100 C 220 30, 420 170, 720 100"
                  />
                  <circle cx="0" cy="0" r="18" fill="#143530" stroke="#FF8552" strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fontSize="15">🚑</text>
                  {/* Flashing blue & red sirens */}
                  <circle cx="-8" cy="-11" r="4" fill="#3B82F6">
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="8" cy="-11" r="4" fill="#EF4444">
                    <animate attributeName="opacity" values="1;0.2;1" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                </g>
              </svg>
            </div>
          </div>

          {/* Animal Profile & Incident Summary */}
          <div className="tracker-summary-grid">
            {/* Animal Photo & Specs */}
            <div className="animal-snapshot-box">
              <div className="snapshot-img-wrap">
                {activeReport.photoUrl ? (
                  <img
                    src={activeReport.photoUrl}
                    alt="Reported Animal"
                    className="snapshot-image"
                  />
                ) : (
                  <div className="snapshot-placeholder">
                    <span>{activeReport.animalType === "Cat" ? "🐱" : "🐾"}</span>
                    <small>Photo not provided</small>
                  </div>
                )}
              </div>

              <div className="snapshot-details">
                <h4>{activeReport.animalType || "Animal in Distress"}</h4>
                <p><strong>Location:</strong> {activeReport.location}</p>
                <p><strong>Reported Situation:</strong> {activeReport.situation}</p>
                {activeReport.tags && activeReport.tags.length > 0 && (
                  <div className="snapshot-tags">
                    {activeReport.tags.map((t, idx) => (
                      <span key={idx} className="snapshot-tag">
                        ⚠️ {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Rescuer & Medic Card */}
            <div className="rescuer-profile-card">
              <div className="rescuer-header">
                <div className="rescuer-avatar">👨‍⚕️</div>
                <div>
                  <strong>Paramedic Rajesh Kumar</strong>
                  <span className="rescuer-role">FureverCare Emergency Squad</span>
                </div>
              </div>

              <div className="rescuer-meta">
                <div className="meta-row">
                  <span>Assigned Vehicle:</span>
                  <strong>Ambulance Unit 01 (Trauma Van)</strong>
                </div>
                <div className="meta-row">
                  <span>Attending Vet:</span>
                  <strong>Dr. Ananya Roy (Chief Surgeon)</strong>
                </div>
                <div className="meta-row">
                  <span>Destination:</span>
                  <strong>FureverCare Trauma ICU & Shelter</strong>
                </div>
              </div>

              <div className="rescuer-actions">
                <a href="tel:+911234567890" className="call-unit-btn">
                  📞 Call Emergency Team
                </a>
                <button
                  type="button"
                  className="simulate-stage-btn"
                  onClick={() => handleAdvanceStage()}
                  title="Advance stage for demo testing"
                >
                  ⏩ Advance Stage ({TRACKING_STAGES[Math.min(TRACKING_STAGES.length - 1, currentStageIndex + 1)]?.title})
                </button>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="tracker-timeline-section">
            <h3>Complete Mission Timeline</h3>
            <div className="stepper-timeline">
              {TRACKING_STAGES.map((stg, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const isUpcoming = index > currentStageIndex;

                return (
                  <div
                    key={stg.step}
                    className={`stepper-item ${
                      isCompleted ? "completed" : ""
                    } ${isCurrent ? "current" : ""} ${
                      isUpcoming ? "upcoming" : ""
                    }`}
                  >
                    <div className="stepper-node">
                      <span className="stepper-icon">{stg.icon}</span>
                      {isCompleted && <span className="stepper-check">✓</span>}
                    </div>

                    <div className="stepper-content">
                      <div className="stepper-head">
                        <span className="stepper-title">{stg.title}</span>
                        <span className="stepper-time">{stg.timeOffset}</span>
                      </div>
                      <p className="stepper-desc">{stg.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="tracker-empty-state">
          <span>🔎</span>
          <h3>No Rescue Selected</h3>
          <p>
            Enter a Rescue ID above or submit a new rescue alert to monitor real-time ambulance dispatch.
          </p>
        </div>
      )}
    </div>
  );
}

export default RescueTracker;
