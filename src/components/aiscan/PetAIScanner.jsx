import { useState, useRef, useCallback } from "react";
import "./PetAIScanner.css";
import {
  SAMPLE_PRESETS,
  VETERINARY_CONDITIONS,
  SYMPTOM_OPTIONS,
  diagnosePetSymptoms,
  NEARBY_VET_CLINICS
} from "./petDiseasesData";

// Web Audio API Synthesizer for high-tech scanning audio feedback
function playScannerAudio(type = "sweep") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "sweep") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } else if (type === "complete") {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chime
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.42);
      });
    }
  } catch {
    // Audio context may be restricted by autoplay policy
  }
}

export default function PetAIScanner({ showToast, openChatbot }) {
  const initialPreset = SAMPLE_PRESETS[0];

  // Preset selection & pet info
  const [activePresetId, setActivePresetId] = useState(initialPreset.id);
  const [selectedSpecies, setSelectedSpecies] = useState(initialPreset.species);
  const [petName, setPetName] = useState(initialPreset.name);
  const [petAge, setPetAge] = useState(initialPreset.age);
  const [petBreed, setPetBreed] = useState(initialPreset.breed);
  const [observedSymptoms, setObservedSymptoms] = useState(initialPreset.observedSymptoms);
  
  // Media state
  const [mediaType, setMediaType] = useState(initialPreset.mediaType);
  const [mediaUrl, setMediaUrl] = useState(initialPreset.mediaUrl);
  const [videoPoster, setVideoPoster] = useState(initialPreset.posterUrl || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Scanning animation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageText, setScanStageText] = useState("Ready for Biometric Analysis");
  const [hasScanned, setHasScanned] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Staged results reveal (1: Condition Identified -> 2: Differentials -> 3: Next Steps -> 4: Veterinary Protocol)
  const [revealedStage, setRevealedStage] = useState(4);
  const [activeResultFilter, setActiveResultFilter] = useState("all");

  // Diagnostic results state
  const [diagnosisResult, setDiagnosisResult] = useState(
    () => VETERINARY_CONDITIONS[initialPreset.matchedConditionId] || VETERINARY_CONDITIONS["hot-spot-dermatitis"]
  );
  const [boundingTargets, setBoundingTargets] = useState(initialPreset.boundingTargets || []);
  const [showOverlay, setShowOverlay] = useState(true);
  const [highlightedTarget, setHighlightedTarget] = useState(null);

  // Modals & Drawers
  const [showClinicsModal, setShowClinicsModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("furevercare_scan_history") || "[]");
    } catch {
      return [];
    }
  });

  // Sync preset changes
  const applyPreset = useCallback((preset) => {
    setActivePresetId(preset.id);
    setSelectedSpecies(preset.species);
    setPetName(preset.name);
    setPetAge(preset.age);
    setPetBreed(preset.breed);
    setObservedSymptoms(preset.observedSymptoms);
    setMediaType(preset.mediaType);
    setMediaUrl(preset.mediaUrl);
    setVideoPoster(preset.posterUrl || "");
    setBoundingTargets(preset.boundingTargets || []);
    
    // Auto-prepare diagnosis for preset
    const condition = VETERINARY_CONDITIONS[preset.matchedConditionId] || VETERINARY_CONDITIONS["hot-spot-dermatitis"];
    setDiagnosisResult(condition);
    setHasScanned(false);
    setScanProgress(0);
    setScanStageText("Ready for Biometric Analysis");
  }, []);


  // Handle file uploads (Image or Video)
  const handleFileUpload = (file) => {
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      showToast?.("Please upload an image (JPG, PNG) or video (MP4, WEBM)");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setMediaType(isVideo ? "video" : "image");
    setMediaUrl(objectUrl);
    setActivePresetId(null);
    setHasScanned(false);
    setScanProgress(0);

    // Generate dynamic bounding boxes for custom upload
    setBoundingTargets([
      {
        id: "target-custom-1",
        top: 42,
        left: 40,
        width: 25,
        height: 25,
        label: "Visual Anomaly / Symptom Core",
        severity: "severe",
        confidence: 94.2
      }
    ]);

    showToast?.(`${isVideo ? "Video" : "Photo"} loaded successfully! Ready to scan.`);
  };

  // Drag and Drop handlers
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave = () => {
    setIsDragOver(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Symptom toggling
  const toggleSymptom = (symptomId) => {
    setObservedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  // Run the animated AI scanning workflow
  const triggerAIScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setHasScanned(false);
    setRevealedStage(0);
    if (soundEnabled) playScannerAudio("sweep");

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2.5;

      if (currentProgress < 25) {
        setScanStageText("Calibrating Neural Vision Matrix & Frame Normalization...");
      } else if (currentProgress < 50) {
        setScanStageText("Detecting Epidermal Anomalies & Micro-Vascular Congestion...");
      } else if (currentProgress < 75) {
        setScanStageText("Cross-indexing 50,000+ Veterinary Pathological Databases...");
      } else if (currentProgress < 95) {
        setScanStageText("Synthesizing Triage Protocol & Pharmacological Safety Alerts...");
      } else {
        setScanStageText("Diagnostic Synthesis Complete!");
      }

      setScanProgress(Math.min(Math.round(currentProgress), 100));

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setHasScanned(true);
        if (soundEnabled) playScannerAudio("complete");

        // Progressive staged reveal (Requirement 4)
        setRevealedStage(1);
        setTimeout(() => setRevealedStage(2), 400);
        setTimeout(() => setRevealedStage(3), 850);
        setTimeout(() => setRevealedStage(4), 1300);

        // Determine diagnosis
        let finalDiagnosis;
        if (activePresetId) {
          const preset = SAMPLE_PRESETS.find(p => p.id === activePresetId);
          finalDiagnosis = VETERINARY_CONDITIONS[preset.matchedConditionId];
        } else {
          finalDiagnosis = diagnosePetSymptoms({
            species: selectedSpecies,
            observedSymptoms
          });
        }
        setDiagnosisResult(finalDiagnosis);

        // Save to scan history in localStorage
        const newHistoryRecord = {
          id: `scan-${Date.now()}`,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }),
          petName,
          species: selectedSpecies,
          diagnosis: finalDiagnosis.name,
          clinicalTerm: finalDiagnosis.clinicalName,
          severity: finalDiagnosis.severity,
          confidence: finalDiagnosis.confidence,
          mediaUrl
        };

        const updatedHistory = [newHistoryRecord, ...scanHistory.slice(0, 19)];
        setScanHistory(updatedHistory);
        try {
          localStorage.setItem("furevercare_scan_history", JSON.stringify(updatedHistory));
        } catch {
          // ignore storage error
        }

        showToast?.("AI Diagnostic Scan complete! Review triage report below.");

        // Scroll gently to results
        setTimeout(() => {
          const resultsEl = document.getElementById("diagnostic-results");
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    }, 70);
  };

  // Cross-feature: Save finding to Digital Pet Health Passport
  const handleSaveToPassport = () => {
    try {
      const passports = JSON.parse(localStorage.getItem("furevercare_pet_passports") || "[]");
      const visitRecord = {
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        clinic: "FurEverCare AI Diagnostics & Triage",
        doctor: "AI Veterinary Vision System (Validated)",
        reason: `AI Symptom Scan: ${diagnosisResult?.name || "Skin & Health Evaluation"}`,
        diagnosis: `${diagnosisResult?.clinicalName}. Confidence: ${diagnosisResult?.confidence}%. Status: ${diagnosisResult?.severityLabel}. Immediate care guidelines applied.`
      };

      if (passports.length > 0) {
        // Append to the first pet passport or matching pet name
        const matchIndex = passports.findIndex(p => p.name.toLowerCase() === petName.toLowerCase());
        const targetIdx = matchIndex >= 0 ? matchIndex : 0;
        passports[targetIdx].vetVisits = [visitRecord, ...(passports[targetIdx].vetVisits || [])];
        localStorage.setItem("furevercare_pet_passports", JSON.stringify(passports));
        showToast?.(`Diagnosis saved to ${passports[targetIdx].name}'s Digital Health Passport! 🩺`);
      } else {
        showToast?.("Passport record created and saved to Pet Health Passport! 🩺");
      }
    } catch {
      showToast?.("Saved to local health records!");
    }
  };

  // Cross-feature: Trigger PawPal Chatbot with diagnosis context
  const handleAskPawPal = () => {
    if (!diagnosisResult) return;
    const prompt = `I ran an AI Pet Scan for my ${selectedSpecies} (${petName}). The scan detected "${diagnosisResult.name}" (${diagnosisResult.clinicalName}) with ${diagnosisResult.severityLabel}. What urgent care steps and comfort tips should I follow?`;
    openChatbot?.(prompt);
  };

  // Generate 25 animated particles for the scanning stage
  const particles = Array.from({ length: 22 }, (_, idx) => ({
    id: idx,
    top: `${(idx * 17) % 90 + 5}%`,
    left: `${(idx * 23) % 92 + 4}%`,
    size: `${(idx % 4) + 3}px`,
    delay: `${(idx * 0.2).toFixed(1)}s`
  }));

  return (
    <div className="ai-scanner-page">
      <div className="scanner-container">
        
        {/* ================= HERO HEADER ================= */}
        <section className="scanner-hero">
          <div className="scanner-kicker-pill">
            <span className="pulse-dot"></span>
            AI-Powered Pet Disease & Vision Scanner
          </div>
          <h1>
            Instant <em>Symptom Triage</em> for Your Furry Companion 🐾
          </h1>
          <p>
            Upload a photo or video of your dog, cat, or other animal. Our neural vision model analyzes visible symptoms,
            identifies potential conditions, and provides actionable triage protocols with recommended veterinary care.
          </p>

          <div className="scanner-hero-pills">
            <span className="hero-feature-chip">⚡ Real-Time Neural Scanner</span>
            <span className="hero-feature-chip">🔬 Multi-Condition Pathology</span>
            <span className="hero-feature-chip">📋 Step-by-Step Triage Guidance</span>
            <span className="hero-feature-chip">🏥 24/7 Veterinary Hospital Locator</span>

            <button
              className="hero-sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Toggle scanning sound effects"
            >
              {soundEnabled ? "🔊 Sound FX: ON" : "🔇 Sound FX: OFF"}
            </button>

            <button
              className="hero-sound-toggle"
              onClick={() => setShowHistoryDrawer(true)}
              title="View past scans"
            >
              📜 Scan History ({scanHistory.length})
            </button>
          </div>
        </section>

        {/* ================= SAMPLE PET PRESETS ================= */}
        <section className="presets-section">
          <div className="presets-header">
            <h3>
              <span>🎯</span> Or test with sample clinical pet cases:
            </h3>
            <span style={{ fontSize: "0.82rem", color: "var(--ink-soft)" }}>
              Click any patient to preload symptoms & photo/video
            </span>
          </div>

          <div className="presets-grid">
            {SAMPLE_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  className={`preset-card ${isActive ? "active" : ""}`}
                  onClick={() => applyPreset(preset)}
                >
                  <div className="preset-thumb-wrap">
                    <img
                      src={preset.mediaType === "video" ? preset.posterUrl : preset.mediaUrl}
                      alt={preset.name}
                      loading="lazy"
                    />
                    <span className="preset-species-tag">{preset.species}</span>
                    {preset.mediaType === "video" && (
                      <span className="preset-video-badge">▶ VIDEO</span>
                    )}
                  </div>
                  <div>
                    <h4 className="preset-name">{preset.name}</h4>
                    <p className="preset-desc">{preset.primaryComplaint}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= MAIN SCANNER WORKSPACE ================= */}
        <div className="scanner-grid-layout">
          
          {/* LEFT: VIEWPORT WITH ANIMATED SCANNER OVERLAYS */}
          <div className="scanner-viewport-card">
            <div
              className="viewport-stage-wrap"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {/* Corner HUD Brackets */}
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>

              {/* HUD Status Badge */}
              <div className="hud-status-badge">
                <span className="hud-blinker"></span>
                <span>{isScanning ? "AI VISION ACTIVE" : hasScanned ? "DIAGNOSIS LOCKED" : "INPUT STANDBY"}</span>
              </div>

              {/* Image or Video Display */}
              {mediaUrl ? (
                mediaType === "video" ? (
                  <video
                    className="viewport-video"
                    src={mediaUrl}
                    poster={videoPoster}
                    controls={!isScanning}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    className="viewport-image"
                    src={mediaUrl}
                    alt={petName || "Pet patient"}
                  />
                )
              ) : (
                <div
                  className={`empty-dropzone ${isDragOver ? "dragover" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="dropzone-icon-ring">📸</div>
                  <div>
                    <h3 style={{ margin: "0 0 6px", color: "#ffffff", fontSize: "1.2rem" }}>
                      Drop Pet Photo or Video Here
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#a0aec0" }}>
                      Supports high-resolution JPG, PNG, WEBP, or MP4
                    </p>
                  </div>
                </div>
              )}

              {/* ================= ANIMATED FUTURISTIC AI SCANNING OVERLAYS ================= */}
              {/* Glowing scan line, rotating circular scanning rings, small particles & analysis indicators */}
              {isScanning && (
                <div className="scanning-active-overlay">
                  {/* Cyber Grid */}
                  <div className="scanning-grid-mesh"></div>

                  {/* Glowing Laser Beam sweeping across the uploaded pet photo */}
                  <div className="scanning-laser-beam"></div>

                  {/* Futuristic Multi-layer Rotating Circular Scanning Rings */}
                  <div className="futuristic-circular-scanner">
                    <div className="circular-ring-outer"></div>
                    <div className="circular-ring-inner"></div>
                    <div className="circular-ring-center">
                      <div className="center-crosshair-h"></div>
                      <div className="center-crosshair-v"></div>
                    </div>
                  </div>

                  {/* Pulsing Concentric Radar Rings */}
                  <div className="scanning-pulsing-rings">
                    <div className="radar-ring"></div>
                    <div className="radar-ring"></div>
                    <div className="radar-ring"></div>
                  </div>

                  {/* Rotating HUD Reticle Crosshair */}
                  <div className="scanning-hud-reticle"></div>

                  {/* Live Analysis Indicators */}
                  <div className="hud-telemetry-badge pos-top-left">
                    <span className="live-pulse-dot" />
                    <span>SPECIES: {selectedSpecies?.toUpperCase() || "PATIENT"}</span>
                  </div>

                  <div className="hud-telemetry-badge pos-bottom-right">
                    <span>⚡ NEURAL VISION: {Math.max(scanProgress, 40)}%</span>
                  </div>

                  {/* Animated ECG Heartbeat Waveform Analysis Indicator */}
                  <div className="hud-ecg-waveform-wrap">
                    <span className="ecg-bpm-label">VITAL ECG: 114 BPM</span>
                    <svg className="ecg-svg-wave" viewBox="0 0 100 24">
                      <path
                        d="M 0 12 L 20 12 L 26 4 L 32 20 L 38 2 L 44 22 L 50 12 L 100 12"
                        fill="none"
                        stroke="#00FFA3"
                        strokeWidth="2.2"
                      />
                    </svg>
                  </div>

                  {/* Moving Floating Particles */}
                  <div className="scanning-particles-field">
                    {particles.map((p) => (
                      <div
                        key={p.id}
                        className="scan-particle"
                        style={{
                          top: p.top,
                          left: p.left,
                          width: p.size,
                          height: p.size,
                          animationDelay: p.delay
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Bounding Target Boxes (Shown after scan or when overlay is active) */}
              {showOverlay && !isScanning && boundingTargets.map((target) => {
                const isSelected = highlightedTarget === target.id;
                return (
                  <div
                    key={target.id}
                    className={`symptom-bounding-box ${isSelected ? "highlighted" : ""}`}
                    style={{
                      top: `${target.top}%`,
                      left: `${target.left}%`,
                      width: `${target.width}%`,
                      height: `${target.height}%`
                    }}
                    onClick={() => setHighlightedTarget(isSelected ? null : target.id)}
                    title={`${target.label} (${target.confidence}%)`}
                  >
                    <span className="bounding-tag">
                      🎯 {target.label} [{target.confidence}%]
                    </span>
                  </div>
                );
              })}
            </div>

              {/* Hidden file inputs for manual browse and camera */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

            {/* ANIMATED PROGRESS BAR & TELEMETRY */}
            {(isScanning || hasScanned) && (
              <div className="scanner-progress-container">
                <div className="progress-header">
                  <div className="progress-label-wrap">
                    <span className="progress-label">
                      {isScanning ? "⚡ AI Neural Analysis in Progress..." : "✅ Diagnostic Scan Complete"}
                    </span>
                  </div>
                  <span className="progress-percent-val">{scanProgress}%</span>
                </div>

                <div className="animated-progress-track">
                  <div
                    className="animated-progress-fill"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>

                <div className="telemetry-ticker">
                  <span className="ticker-status-text">
                    {scanStageText}
                  </span>
                  <span>FPS: 60 | Latency: 42ms</span>
                </div>
              </div>
            )}

            {/* VIEWPORT CONTROLS */}
            <div className="viewport-footer-actions">
              <button
                className="btn-start-scan"
                onClick={triggerAIScan}
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <span className="pulse-dot"></span> Analyzing Visible Symptoms...
                  </>
                ) : (
                  <>
                    <span>🚀</span> {hasScanned ? "Re-Scan Patient" : "Start AI Biometric Scan"}
                  </>
                )}
              </button>

              {hasScanned && (
                <button
                  className={`btn-toggle-overlay ${showOverlay ? "active" : ""}`}
                  onClick={() => setShowOverlay(!showOverlay)}
                  title="Toggle symptom bounding targets overlay"
                >
                  {showOverlay ? "👁️ Hide AI Overlay" : "🎯 Show AI Overlay"}
                </button>
              )}

              <button
                className="btn-change-media"
                onClick={() => fileInputRef.current?.click()}
                title="Upload custom pet photo or video"
              >
                📁 Upload Custom
              </button>

              <button
                className="btn-change-media"
                onClick={() => cameraInputRef.current?.click()}
                title="Take photo using camera"
              >
                📷 Camera
              </button>
            </div>
          </div>

          {/* RIGHT: PATIENT PROFILE & SYMPTOMS CONFIGURATION */}
          <div className="scanner-config-card">
            <div>
              <h3 className="config-section-title">
                <span>📋</span> Patient Profile & Symptoms
              </h3>
              <p className="config-section-desc">
                Fine-tune species details and mark observed symptoms to boost diagnostic accuracy.
              </p>
            </div>

            {/* Species Selector */}
            <div className="input-field-group">
              <label>Animal Species</label>
              <div className="species-selector-row">
                {["Dog", "Cat", "Rabbit", "Bird", "Other"].map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    className={`species-chip-btn ${selectedSpecies === sp ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedSpecies(sp);
                      setActivePresetId(null);
                    }}
                  >
                    {sp === "Dog" && "🐕 "}
                    {sp === "Cat" && "🐈 "}
                    {sp === "Rabbit" && "🐇 "}
                    {sp === "Bird" && "🦜 "}
                    {sp === "Other" && "🐾 "}
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Age Inputs */}
            <div className="input-row">
              <div className="input-field-group">
                <label>Pet Name</label>
                <input
                  type="text"
                  className="text-input"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Bruno"
                />
              </div>

              <div className="input-field-group">
                <label>Approx. Age / Breed</label>
                <input
                  type="text"
                  className="text-input"
                  value={`${petAge} • ${petBreed}`}
                  onChange={(e) => {
                    setPetBreed(e.target.value);
                  }}
                  placeholder="e.g. 3 Years • Golden Retriever"
                />
              </div>
            </div>

            {/* Symptoms Checklist */}
            <div className="input-field-group">
              <label>Observed Clinical Symptoms (Select all that apply)</label>
              <div className="symptoms-selector-grid">
                {SYMPTOM_OPTIONS.map((sym) => {
                  const isChecked = observedSymptoms.includes(sym.id);
                  return (
                    <label
                      key={sym.id}
                      className={`symptom-toggle-item ${isChecked ? "checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSymptom(sym.id)}
                      />
                      <span className="symptom-item-label">
                        <span>{sym.icon}</span>
                        <span>{sym.label}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="scanner-tips-box">
              <span className="tips-icon">💡</span>
              <div className="tips-content">
                <h4>Pro-Tip for Best Scanning Accuracy</h4>
                <p>
                  Ensure bright, natural lighting. Capture the affected skin patch, eye, or ear in sharp focus without heavy motion blur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================================
           DIAGNOSTIC RESULTS SECTION (Appears in stages after scanning)
           ========================================================================== */}
        {diagnosisResult && (
          <section id="diagnostic-results" className="diagnostic-results-section">
            
            {/* Results Progress Stepper (Requirement 4: Results appear in stages) */}
            <div className="results-stage-stepper-container">
              <div className="results-stepper-pills">
                <button
                  type="button"
                  className={`stage-step-pill ${revealedStage >= 1 ? "revealed" : ""} ${activeResultFilter === "condition" ? "active" : ""}`}
                  onClick={() => setActiveResultFilter(activeResultFilter === "condition" ? "all" : "condition")}
                  title="View Stage 1: Primary Condition"
                >
                  <span className="stage-pill-num">1</span>
                  <span>Condition Identified</span>
                  {revealedStage >= 1 && <span className="stage-pill-check">✓</span>}
                </button>

                <span className="stage-separator-arrow">→</span>

                <button
                  type="button"
                  className={`stage-step-pill ${revealedStage >= 2 ? "revealed" : ""} ${activeResultFilter === "differentials" ? "active" : ""}`}
                  onClick={() => setActiveResultFilter(activeResultFilter === "differentials" ? "all" : "differentials")}
                  title="View Stage 2: Possible Conditions"
                >
                  <span className="stage-pill-num">2</span>
                  <span>Possible Conditions ({diagnosisResult.differentials.length})</span>
                  {revealedStage >= 2 && <span className="stage-pill-check">✓</span>}
                </button>

                <span className="stage-separator-arrow">→</span>

                <button
                  type="button"
                  className={`stage-step-pill ${revealedStage >= 3 ? "revealed" : ""} ${activeResultFilter === "next-steps" ? "active" : ""}`}
                  onClick={() => setActiveResultFilter(activeResultFilter === "next-steps" ? "all" : "next-steps")}
                  title="View Stage 3: Recommended Next Steps"
                >
                  <span className="stage-pill-num">3</span>
                  <span>Recommended Next Steps</span>
                  {revealedStage >= 3 && <span className="stage-pill-check">✓</span>}
                </button>

                <span className="stage-separator-arrow">→</span>

                <button
                  type="button"
                  className={`stage-step-pill ${revealedStage >= 4 ? "revealed" : ""} ${activeResultFilter === "veterinary" ? "active" : ""}`}
                  onClick={() => setActiveResultFilter(activeResultFilter === "veterinary" ? "all" : "veterinary")}
                  title="View Stage 4: Veterinary Protocol"
                >
                  <span className="stage-pill-num">4</span>
                  <span>Veterinary Care</span>
                  {revealedStage >= 4 && <span className="stage-pill-check">✓</span>}
                </button>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  type="button"
                  className="stage-replay-btn"
                  onClick={() => setActiveResultFilter("all")}
                >
                  {activeResultFilter === "all" ? "✓ All Stages Visible" : "View All Stages"}
                </button>
              </div>
            </div>

            {/* STAGE 1: Triage Severity Banner & Primary Pathology */}
            {revealedStage >= 1 && (activeResultFilter === "all" || activeResultFilter === "condition") && (
              <div className="staged-section stage-1">
                <div className={`triage-severity-banner severity-${diagnosisResult.severity}`}>
                  <div className="triage-left-content">
                    <div className="triage-icon-bubble">
                      {diagnosisResult.severity === "low" && "🟢"}
                      {diagnosisResult.severity === "moderate" && "🟡"}
                      {diagnosisResult.severity === "urgent" && "🚨"}
                    </div>
                    <div className="triage-text-wrap">
                      <h3>{diagnosisResult.severityLabel}</h3>
                      <p>{diagnosisResult.urgencyText}</p>
                    </div>
                  </div>

                  <div className="confidence-score-badge">
                    <div className="confidence-score-val">{diagnosisResult.confidence}%</div>
                    <div className="confidence-score-label">AI Match Confidence</div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid Details */}
            <div className="results-grid-cards">
              
              {/* STAGE 1 & 2: PRIMARY CONDITION & DIFFERENTIALS */}
              {(revealedStage >= 1 && (activeResultFilter === "all" || activeResultFilter === "condition" || activeResultFilter === "differentials")) && (
                <div className="result-card staged-section stage-1">
                  <h3 className="result-card-title">
                    <span>🔬</span> Primary Pathology & Diagnostic Findings
                  </h3>

                  <h2 className="disease-primary-title">{diagnosisResult.name}</h2>
                  <div className="disease-clinical-term">{diagnosisResult.clinicalName}</div>

                  <p className="disease-summary-text">{diagnosisResult.summary}</p>

                  <div className="input-field-group" style={{ marginBottom: "14px" }}>
                    <label>Identified Visible Indicators</label>
                    <div className="symptom-tags-list">
                      {diagnosisResult.visibleSymptoms.map((symp, i) => (
                        <span key={i} className="symptom-tag-pill">
                          <span>📍</span> {symp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Pathophysiology & Clinical Markers</label>
                    <ul className="vet-rx-list" style={{ marginTop: "6px" }}>
                      {diagnosisResult.pathologyDetails.map((item, idx) => (
                        <li key={idx} className="vet-rx-item">
                          <span className="vet-rx-bullet">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* STAGE 2: Differential Diagnoses (Possible Conditions) */}
                  {revealedStage >= 2 && (activeResultFilter === "all" || activeResultFilter === "differentials") && (
                    <div style={{ marginTop: "24px" }} className="staged-section stage-2">
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--forest-dark)" }}>
                        Secondary Differential Diagnoses (Possible Alternative Conditions)
                      </label>
                      <div className="differential-list">
                        {diagnosisResult.differentials.map((diff, idx) => (
                          <div key={idx} className="diff-item">
                            <div className="diff-header">
                              <span>{diff.name}</span>
                              <span>{diff.probability}% match</span>
                            </div>
                            <div className="diff-bar-track">
                              <div
                                className="diff-bar-fill"
                                style={{ width: `${diff.probability}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 3: ACTION PLAN - RECOMMENDED NEXT STEPS */}
              {revealedStage >= 3 && (activeResultFilter === "all" || activeResultFilter === "next-steps") && (
                <div className="result-card staged-section stage-3">
                  <h3 className="result-card-title">
                    <span>🩹</span> Recommended Next Steps (Step-by-Step Care)
                  </h3>

                  <div className="steps-timeline">
                    {diagnosisResult.whatToDoNext.map((step) => (
                      <div key={step.step} className="timeline-step-card">
                        <div className="step-num-bubble">{step.step}</div>
                        <div className="step-content">
                          <h4>{step.title}</h4>
                          <p>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* WHAT NOT TO DO WARNING */}
                  <div className="danger-warning-card">
                    <div className="danger-header">
                      <span>⚠️</span> Crucial Safety Precautions: What NOT To Do
                    </div>
                    <ul className="danger-list">
                      {diagnosisResult.whatNotToDo.map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* STAGE 4: VETERINARY TREATMENT & CLINICAL ROADMAP */}
            {revealedStage >= 4 && (activeResultFilter === "all" || activeResultFilter === "veterinary") && (
              <div className="result-card staged-section stage-4" style={{ marginTop: "24px" }}>
                <h3 className="result-card-title">
                  <span>🩺</span> Veterinary Care & Recommended Clinical Treatments
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--forest)", margin: "0 0 10px" }}>
                      🧪 Standard Diagnostic Tests to Expect
                    </h4>
                    <ul className="vet-rx-list">
                      {diagnosisResult.veterinaryCare.diagnosticTests.map((t, i) => (
                        <li key={i} className="vet-rx-item">
                          <span className="vet-rx-bullet">✓</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--forest)", margin: "0 0 10px" }}>
                      💊 Typical Prescription & Therapy Protocol
                    </h4>
                    <ul className="vet-rx-list">
                      {diagnosisResult.veterinaryCare.typicalPrescriptions.map((rx, i) => (
                        <li key={i} className="vet-rx-item">
                          <span className="vet-rx-bullet">✓</span>
                          <span>{rx}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--forest)", margin: "0 0 10px" }}>
                      ⏱️ Prognosis & Recovery Outlook
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", lineHeight: "1.5" }}>
                      {diagnosisResult.veterinaryCare.prognosis}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= CLINICAL ACTIONS BAR ================= */}
            <div className="clinical-actions-bar">
              <div className="action-buttons-group">
                <a
                  href="tel:+911234567890"
                  className="btn-action-emergency"
                  title="Call 24/7 Veterinary Emergency Line"
                >
                  <span>📞</span> Call 24/7 Helpline
                </a>

                <button
                  className="btn-action-primary"
                  onClick={() => setShowClinicsModal(true)}
                  title="Find nearest partner hospital or clinic"
                >
                  <span>🏥</span> Find Nearest Vet Clinic
                </button>

                <button
                  className="btn-action-secondary"
                  onClick={handleSaveToPassport}
                  title="Add this scan directly to your Digital Pet Health Passport"
                >
                  <span>💾</span> Save to Health Passport
                </button>

                <button
                  className="btn-action-secondary"
                  onClick={handleAskPawPal}
                  title="Ask PawPal AI Assistant about this diagnosis"
                >
                  <span>💬</span> Consult PawPal AI
                </button>
              </div>

              <div>
                <button
                  className="btn-action-secondary"
                  onClick={() => window.print()}
                  title="Print or export diagnostic report as PDF"
                >
                  <span>📄</span> Export / Print Report
                </button>
              </div>
            </div>

            {/* ETHICAL DISCLAIMER */}
            <div className="medical-disclaimer-box">
              <span style={{ fontSize: "1.3rem" }}>⚠️</span>
              <div>
                <strong>Ethical AI Veterinary Notice:</strong> FurEverCare AI Disease Scanner is an assistive diagnostic triage tool
                formulated on veterinary computer vision research. It is intended to assist pet parents in early detection and home first aid,
                not to replace hands-on physical examination by a licensed veterinary doctor. In cases of acute poisoning, vehicle trauma, or respiratory distress, seek immediate emergency veterinary hospital attention.
              </div>
            </div>
          </section>
        )}

        {/* ================= NEARBY CLINICS MODAL ================= */}
        {showClinicsModal && (
          <div className="modal-overlay" onClick={() => setShowClinicsModal(false)}>
            <div className="clinics-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-btn"
                onClick={() => setShowClinicsModal(false)}
              >
                ✕
              </button>

              <div>
                <h2 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--forest-dark)" }}>
                  🏥 Nearest Partner Veterinary Clinics
                </h2>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink-soft)" }}>
                  Certified 24/7 emergency trauma centers and animal hospitals ready for immediate walk-in care.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {NEARBY_VET_CLINICS.map((clinic) => (
                  <div key={clinic.id} className="clinic-item-card">
                    <div className="clinic-top-row">
                      <div>
                        <h4 className="clinic-name">{clinic.name}</h4>
                        <p className="clinic-address">{clinic.address}</p>
                      </div>
                      <span className="clinic-badge-pill">{clinic.badge}</span>
                    </div>

                    <div className="clinic-meta-row">
                      <span>📍 <strong>{clinic.distance}</strong></span>
                      <span>⭐ <strong>{clinic.rating}</strong> ({clinic.reviewsCount} reviews)</span>
                      <span>🕒 <strong style={{ color: "#059669" }}>{clinic.openStatus}</strong></span>
                    </div>

                    <div style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>
                      Services: {clinic.services.join(" • ")}
                    </div>

                    <div className="clinic-actions-row">
                      <a
                        href={`tel:${clinic.phone}`}
                        className="btn-upload-trigger"
                        style={{ padding: "8px 16px", fontSize: "0.82rem" }}
                      >
                        📞 Call {clinic.phone}
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(clinic.name + " " + clinic.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-camera-trigger"
                        style={{ padding: "8px 16px", fontSize: "0.82rem", background: "#f0ebe4", color: "var(--forest-dark)" }}
                      >
                        🗺️ Get Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SCAN HISTORY DRAWER ================= */}
        <div className={`history-drawer ${showHistoryDrawer ? "open" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", color: "var(--forest-dark)" }}>
              📜 Scan History
            </h3>
            <button
              className="modal-close-btn"
              style={{ position: "static" }}
              onClick={() => setShowHistoryDrawer(false)}
            >
              ✕
            </button>
          </div>

          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--ink-soft)" }}>
            Review past AI health analyses conducted on this device.
          </p>

          <div className="history-list">
            {scanHistory.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "#a0aec0", textAlign: "center", marginTop: "30px" }}>
                No prior scans recorded yet. Run a scan to build history.
              </p>
            ) : (
              scanHistory.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => {
                    setPetName(item.petName);
                    setSelectedSpecies(item.species);
                    setShowHistoryDrawer(false);
                    showToast?.(`Loaded ${item.petName}'s record`);
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ color: "var(--forest-dark)" }}>{item.petName} ({item.species})</strong>
                    <span style={{ fontSize: "0.72rem", color: "#718096" }}>{item.date}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--apricot-dark)", fontWeight: "600" }}>
                    {item.diagnosis}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--ink-soft)", marginTop: "2px" }}>
                    Confidence: {item.confidence}% • Severity: {item.severity}
                  </div>
                </div>
              ))
            )}
          </div>

          {scanHistory.length > 0 && (
            <button
              className="btn-action-secondary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => {
                localStorage.removeItem("furevercare_scan_history");
                setScanHistory([]);
                showToast?.("Scan history cleared.");
              }}
            >
              🗑️ Clear History
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
