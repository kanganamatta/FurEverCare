import { useState, useEffect } from "react";

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

function RescueTracker({ currentReport, allReports = [], onSelectReport }) {
  const [selectedId, setSelectedId] = useState(currentReport?.id || "");
  const [searchId, setSearchId] = useState(currentReport?.id || "");
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 minutes countdown demo
  const [copyFeedback, setCopyFeedback] = useState(false);

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

  const handleAdvanceStage = () => {
    if (!activeReport) return;
    const currentStage = activeReport.currentStageIndex ?? 2;
    const nextStage = Math.min(TRACKING_STAGES.length - 1, currentStage + 1);

    const updated = {
      ...activeReport,
      currentStageIndex: nextStage,
      status: TRACKING_STAGES[nextStage].title
    };

    // Update in localStorage
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

  return (
    <div className="rescue-tracker-container">
      {/* Search Bar & Quick Chips */}
      <div className="tracker-search-section">
        <form onSubmit={handleSearch} className="tracker-search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="tracker-search-input"
              placeholder="Enter Rescue ID (e.g. RC-849201)..."
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
                  setActiveReport(rep);
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
                  onClick={handleAdvanceStage}
                  title="Advance stage for demo testing"
                >
                  ⏩ Advance Stage (Demo)
                </button>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="tracker-timeline-section">
            <h3>Live Rescue Progression</h3>
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
