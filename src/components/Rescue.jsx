import { useState, useRef } from "react";
import RescueMap from "./rescue/RescueMap";
import RescueTracker from "./rescue/RescueTracker";
import CommunityBoard from "./rescue/CommunityBoard";
import VoiceRescueAssistant from "./rescue/VoiceRescueAssistant";

const SEED_REPORTS = [
  {
    id: "RC-89410283",
    animalType: "Dog",
    location: "West Ridge / Park Road, Sector 3",
    situation: "Street dog with limp on front leg, staying near tea stall, needs medical dressing.",
    phone: "9876543210",
    priority: "Critical",
    tags: ["Hit by vehicle", "Fractured limb"],
    photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
    date: "15 mins ago",
    currentStageIndex: 2,
    status: "Ambulance En Route",
    mapCoords: { x: 32, y: 42, addressName: "West Ridge / Park Road" }
  },
  {
    id: "RC-78192044",
    animalType: "Cat",
    location: "North Ring / Mall Area, Near Gate 4",
    situation: "Stray calico kitten trapped in storm drain, crying for 2 hours.",
    phone: "9811223344",
    priority: "Urgent",
    tags: ["Trapped", "Puppy/Kitten litter"],
    photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
    date: "40 mins ago",
    currentStageIndex: 3,
    status: "On-Site Triage & Stabilization",
    mapCoords: { x: 62, y: 80, addressName: "North Ring / Mall Area" }
  },
  {
    id: "RC-67291039",
    animalType: "Bird",
    location: "East Suburbs / Tech Corridor",
    situation: "Injured black kite with thread entangled in wing, safely transported.",
    phone: "9899001122",
    priority: "Normal",
    tags: ["Bleeding / Trauma"],
    photoUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80",
    date: "2 hours ago",
    currentStageIndex: 5,
    status: "Admitted & Recovering at Shelter",
    mapCoords: { x: 78, y: 25, addressName: "East Suburbs / Tech Corridor" }
  }
];

const SEVERITY_TAG_OPTIONS = [
  "Bleeding / Trauma",
  "Hit by vehicle",
  "Fractured limb",
  "Dehydrated / Unresponsive",
  "Puppy / Kitten litter",
  "Trapped in drain / fence"
];

function Rescue({ showToast }) {
  const [activeTab, setActiveTab] = useState("report"); // report | map | tracker | community

  // Reports state initialized from localStorage
  const [reports, setReports] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("rescueReports") || "[]");
      if (saved && saved.length > 0) return saved;
      // Pre-seed default demo reports
      localStorage.setItem("rescueReports", JSON.stringify(SEED_REPORTS));
      return SEED_REPORTS;
    } catch {
      return SEED_REPORTS;
    }
  });

  const [trackedReport, setTrackedReport] = useState(() => {
    return reports[0] || null;
  });

  // Form State
  const [formData, setFormData] = useState({
    animalType: "",
    location: "",
    situation: "",
    phone: "",
    priority: "Critical"
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [animalPhoto, setAnimalPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [mapLocation, setMapLocation] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef(null);

  // Handle Tag toggle
  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle Photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFormError("Image file size should be less than 8MB.");
      return;
    }

    setAnimalPhoto(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setFormError("");
  };

  const handleRemovePhoto = () => {
    setAnimalPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // One-Click GPS Location Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus("Geolocation not supported by your browser");
      return;
    }

    setIsLocating(true);
    setGpsStatus("🛰️ Contacting GPS satellites & acquiring coordinates...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const latFormatted = latitude.toFixed(4);
        const lngFormatted = longitude.toFixed(4);

        // Map lat/lng into percentage coordinate on mock vector map
        const normX = Math.min(90, Math.max(10, Math.round(35 + (longitude % 1) * 60)));
        const normY = Math.min(85, Math.max(15, Math.round(30 + (latitude % 1) * 60)));

        const locationString = `Live GPS: ${latFormatted}°N, ${lngFormatted}°E (Accurate within ${Math.round(accuracy)}m)`;

        setGpsLocation({ x: normX, y: normY, lat: latFormatted, lng: lngFormatted });
        setMapLocation({
          x: normX,
          y: normY,
          lat: latFormatted,
          lng: lngFormatted,
          addressName: locationString
        });

        setFormData((prev) => ({
          ...prev,
          location: prev.location ? `${prev.location} [${locationString}]` : locationString
        }));

        setIsLocating(false);
        setGpsStatus(`✓ GPS Locked: ${latFormatted}°N, ${lngFormatted}°E`);

        if (showToast) {
          showToast("📍 Exact GPS location detected and pinned on map!");
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = "Could not detect GPS location. You can click on the map to drop a pin.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Click on the map to pin your location.";
        }
        setGpsStatus(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Map pin drop handler
  const handleMapPinSelect = (loc) => {
    setMapLocation(loc);
    setFormData((prev) => ({
      ...prev,
      location: loc.addressName
    }));
    if (showToast) {
      showToast(`📍 Rescue pin dropped at ${loc.addressName.split("(")[0]}`);
    }
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.animalType) {
      setFormError("Please select the animal species.");
      return;
    }

    if (!formData.location.trim()) {
      setFormError("Please specify or pin the incident location.");
      return;
    }

    if (!formData.situation.trim()) {
      setFormError("Please provide details of the animal's distress/injury.");
      return;
    }

    if (formData.phone && !/^[0-9+ -]{7,15}$/.test(formData.phone.trim())) {
      setFormError("Please enter a valid mobile number for paramedic coordination.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const rescueId = "RC-" + Math.floor(10000000 + Math.random() * 90000000);

      const newReport = {
        id: rescueId,
        animalType: formData.animalType,
        location: formData.location.trim(),
        situation: formData.situation.trim(),
        phone: formData.phone.trim() || "Confidential",
        priority: formData.priority,
        tags: selectedTags,
        photoUrl: photoPreview || null,
        date: "Just now",
        currentStageIndex: 1, // Alert logged & assigned
        status: "Ambulance Dispatched",
        mapCoords: mapLocation || { x: 50, y: 50, addressName: formData.location }
      };

      const updated = [newReport, ...reports];
      setReports(updated);

      try {
        localStorage.setItem("rescueReports", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed saving report", err);
      }

      setIsSubmitting(false);
      setTrackedReport(newReport);
      setActiveTab("tracker");

      // Reset form
      setFormData({
        animalType: "",
        location: "",
        situation: "",
        phone: "",
        priority: "Critical"
      });
      setSelectedTags([]);
      handleRemovePhoto();

      if (showToast) {
        showToast(`🚨 Priority Rescue Alert ${rescueId} dispatched!`);
      }
    }, 900);
  };

  return (
    <section className="section section-tinted rescue-advanced-page" id="rescue">
      {/* Top Emergency Stats Banner */}
      <div className="rescue-stats-ticker">
        <div className="ticker-item">
          <span className="ticker-dot pulse" />
          <span><strong>8 Ambulances</strong> Active on Patrol</span>
        </div>
        <div className="ticker-divider">•</div>
        <div className="ticker-item">
          <span>⚡ Avg. Response Time: <strong>14 Mins</strong></span>
        </div>
        <div className="ticker-divider">•</div>
        <div className="ticker-item">
          <span>🐾 Rescues This Month: <strong>342</strong></span>
        </div>
        <div className="ticker-divider">•</div>
        <div className="ticker-item helpline-item">
          <span>24/7 Helpline: </span>
          <a href="tel:+911234567890"><strong>+91 12345 67890</strong></a>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="rescue-main-head">
        <p className="kicker">Emergency animal rescue</p>
        <h2>Spotted an animal in distress?</h2>
        <p className="section-lead">
          Pin incident location, upload photos of injured animals, and track rescue ambulances in real-time.
        </p>

        {/* Navigation Tabs */}
        <div className="rescue-nav-tabs">
          <button
            type="button"
            className={`rescue-tab-btn ${activeTab === "report" ? "active" : ""}`}
            onClick={() => setActiveTab("report")}
          >
            <span>🚨</span> Report Rescue Alert
          </button>
          <button
            type="button"
            className={`rescue-tab-btn ${activeTab === "map" ? "active" : ""}`}
            onClick={() => setActiveTab("map")}
          >
            <span>🗺️</span> Live Rescue Radar Map
          </button>
          <button
            type="button"
            className={`rescue-tab-btn ${activeTab === "tracker" ? "active" : ""}`}
            onClick={() => setActiveTab("tracker")}
          >
            <span>📍</span> Track Rescue Status
            {reports.length > 0 && <span className="tab-counter-pill">{reports.length}</span>}
          </button>
          <button
            type="button"
            className={`rescue-tab-btn ${activeTab === "community" ? "active" : ""}`}
            onClick={() => setActiveTab("community")}
          >
            <span>🐾</span> Uploaded Animals ({reports.length})
          </button>

          <button
            type="button"
            className={`rescue-tab-btn ${activeTab === "voice" ? "active" : ""}`}
            onClick={() => setActiveTab("voice")}
            style={{
              background: activeTab === "voice" ? "var(--forest)" : "#FFF3ED",
              color: activeTab === "voice" ? "#ffffff" : "var(--apricot-dark)",
              borderColor: "var(--apricot)",
              fontWeight: "700"
            }}
          >
            <span>🎙️</span> Voice Rescue AI (EN / हिन्दी / ਪੰਜਾਬੀ)
            <span style={{
              background: "var(--apricot)",
              color: "#ffffff",
              fontSize: "0.72rem",
              padding: "2px 7px",
              borderRadius: "999px",
              marginLeft: "6px"
            }}>
              NEW
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: REPORT RESCUE ALERT */}
      {activeTab === "report" && (
        <div className="rescue-report-layout">
          {/* Left Column: Interactive Mini Map & Location Detection */}
          <div className="rescue-map-sidecard">
            <div className="sidecard-header">
              <div>
                <h3>📍 Pin Distress Location</h3>
                <p>Click on the map or use GPS to guide paramedics directly to the animal.</p>
              </div>
              <button
                type="button"
                className="gps-detect-btn"
                onClick={handleDetectLocation}
                disabled={isLocating}
              >
                {isLocating ? "🛰️ Detecting..." : "📍 Detect My Location"}
              </button>
            </div>

            {gpsStatus && (
              <div className="gps-status-indicator">
                <span>{gpsStatus}</span>
              </div>
            )}

            {/* Embedded Mini-Map */}
            <RescueMap
              selectedLocation={mapLocation}
              onSelectLocation={handleMapPinSelect}
              userCoords={gpsLocation}
              isMini={true}
            />

            <div className="map-hints-row">
              <div className="hint-pill">
                <span>🚑</span> 3 Ambulances within 5km
              </div>
              <div className="hint-pill">
                <span>🏥</span> FureverCare Central Hospital: Open
              </div>
            </div>

            {/* Response Commitments */}
            <ul className="rescue-commitments-list">
              <li>
                <strong>⚡ Rapid Deployment</strong> — Average dispatch under 15 minutes for critical injuries.
              </li>
              <li>
                <strong>🐾 Zero Denial Policy</strong> — Strays, companion pets, cows, birds, and wildlife.
              </li>
              <li>
                <strong>🔒 Anonymous Reporting</strong> — Share only what you are comfortable with.
              </li>
            </ul>
          </div>

          {/* Right Column: Advanced Rescue Report Form with Photo Upload */}
          <form className="advanced-rescue-form" onSubmit={handleSubmit}>
            <div className="form-head-bar">
              <h3>Animal Distress Report</h3>
              <span className="live-pill">⚡ Direct Dispatch Connected</span>
            </div>

            {/* Quick Voice Mode Banner for hands-free emergency reporting */}
            <div
              style={{
                background: "linear-gradient(135deg, #FFF6F1 0%, #FEECE3 100%)",
                border: "1.5px solid #FCDBC5",
                borderRadius: "16px",
                padding: "14px 18px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                cursor: "pointer"
              }}
              onClick={() => setActiveTab("voice")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.8rem" }}>🎙️</span>
                <div>
                  <strong style={{ color: "var(--apricot-dark)", fontSize: "0.95rem", display: "block" }}>
                    Hard to type during an animal emergency?
                  </strong>
                  <span style={{ fontSize: "0.84rem", color: "#666" }}>
                    Speak in English, हिन्दी, or ਪੰਜਾਬੀ — our AI will extract location, animal & injury in seconds!
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "var(--apricot)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  whiteSpace: "nowrap"
                }}
              >
                Use Voice AI 🎙️
              </button>
            </div>

            {formError && (
              <div className="error-alert-banner">
                ⚠️ {formError}
              </div>
            )}

            {/* Animal Photo Upload Section */}
            <div className="form-section-card">
              <label className="section-card-title">
                1. Upload Animal / Injury Photo (Recommended)
              </label>
              <p className="section-card-sub">
                Photos help our attending veterinarians prepare oxygen, splints, or emergency surgical kits in advance.
              </p>

              {!photoPreview ? (
                <div
                  className="photo-upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <div className="dropzone-icon">📷</div>
                  <strong>Click or Drag Photo of Animal Here</strong>
                  <span>Supports Camera, PNG, JPG up to 8MB</span>
                  <button
                    type="button"
                    className="browse-photos-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Select Photo
                  </button>
                </div>
              ) : (
                <div className="photo-preview-card">
                  <img
                    src={photoPreview}
                    alt="Distress preview"
                    className="photo-preview-img"
                  />
                  <div className="photo-preview-info">
                    <span className="photo-name-tag">✓ Photo Attached</span>
                    <p>{animalPhoto?.name || "Animal Injury Photo"}</p>
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={handleRemovePhoto}
                    >
                      Remove / Change Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Animal Type & Priority */}
            <div className="form-section-card">
              <label className="section-card-title">
                2. Species & Emergency Severity
              </label>

              <div className="form-grid-2">
                <div>
                  <label className="field-label">Animal Species *</label>
                  <select
                    value={formData.animalType}
                    onChange={(e) =>
                      setFormData({ ...formData, animalType: e.target.value })
                    }
                    className="rescue-form-input"
                    required
                  >
                    <option value="">Select species</option>
                    <option value="Dog">Dog (Canine)</option>
                    <option value="Cat">Cat (Feline)</option>
                    <option value="Puppy/Kitten">Puppy or Kitten</option>
                    <option value="Bird">Bird (Avian / Pigeon / Kite)</option>
                    <option value="Livestock">Cattle / Cow / Donkey</option>
                    <option value="Wildlife">Monkey / Squirrel / Wildlife</option>
                    <option value="Other">Other Animal</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Emergency Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="rescue-form-input"
                  >
                    <option value="Critical">🚨 Critical (Immediate Dispatch)</option>
                    <option value="Urgent">⚡ Urgent (Trauma / Moderate)</option>
                    <option value="Normal">📅 Standard (Limp / Skin / Non-lethal)</option>
                  </select>
                </div>
              </div>

              {/* Severity / Symptoms Tags */}
              <div style={{ marginTop: "14px" }}>
                <label className="field-label">Condition & Symptoms Tags (Select all that apply)</label>
                <div className="severity-tags-grid">
                  {SEVERITY_TAG_OPTIONS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`severity-tag-chip ${isSelected ? "selected" : ""}`}
                        onClick={() => handleToggleTag(tag)}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Location & Details */}
            <div className="form-section-card">
              <label className="section-card-title">
                3. Incident Location & Situation
              </label>

              <div style={{ marginBottom: "12px" }}>
                <div className="label-with-action">
                  <label className="field-label">Incident Location / Landmark *</label>
                  <button
                    type="button"
                    className="inline-gps-trigger"
                    onClick={handleDetectLocation}
                  >
                    📍 Use GPS
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Street name, landmark, gate number or pinned coordinates"
                  className="rescue-form-input"
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label className="field-label">What happened to the animal? *</label>
                <textarea
                  rows={3}
                  value={formData.situation}
                  onChange={(e) =>
                    setFormData({ ...formData, situation: e.target.value })
                  }
                  placeholder="Describe injury, animal's behavior, exact spot where sitting or hiding..."
                  className="rescue-form-input"
                  maxLength={350}
                  required
                />
                <small className="char-count">
                  {formData.situation.length}/350 characters
                </small>
              </div>

              <div>
                <label className="field-label">Your Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Paramedics will call if unable to spot the animal"
                  className="rescue-form-input"
                  maxLength={15}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="rescue-submit-alert-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="order-spinner" /> Dispatching Ambulance Unit...
                </>
              ) : (
                <>
                  <span>🚨 Dispatch Emergency Rescue Alert</span>
                  <span>→</span>
                </>
              )}
            </button>
            <p className="form-guarantee-note">
              🔒 100% Free Service. Our emergency response team will be dispatched immediately.
            </p>
          </form>
        </div>
      )}

      {/* TAB 2: FULL RESCUE RADAR MAP */}
      {activeTab === "map" && (
        <div className="rescue-map-tab-view">
          <div className="map-view-hero">
            <div>
              <h3>🗺️ Live Animal Rescue Radar Map</h3>
              <p>
                Visual monitoring of emergency ambulances, veterinary trauma centers, and ongoing rescue operations.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab("report")}
            >
              + Report New Distress Incident
            </button>
          </div>

          <RescueMap
            selectedLocation={mapLocation}
            onSelectLocation={handleMapPinSelect}
            userCoords={gpsLocation}
            isMini={false}
          />
        </div>
      )}

      {/* TAB 3: LIVE RESCUE TRACKER */}
      {activeTab === "tracker" && (
        <RescueTracker
          currentReport={trackedReport}
          allReports={reports}
          onSelectReport={(rep) => setTrackedReport(rep)}
        />
      )}

      {/* TAB 4: COMMUNITY ANIMAL BOARD */}
      {activeTab === "community" && (
        <CommunityBoard
          reports={reports}
          onTrackReport={(rep) => {
            setTrackedReport(rep);
            setActiveTab("tracker");
          }}
          onOpenReportTab={() => setActiveTab("report")}
        />
      )}

      {/* TAB 5: VOICE-BASED ANIMAL RESCUE ASSISTANT */}
      {activeTab === "voice" && (
        <VoiceRescueAssistant
          showToast={showToast}
          onDispatch={(newReport) => {
            const updated = [newReport, ...reports];
            setReports(updated);
            try {
              localStorage.setItem("rescueReports", JSON.stringify(updated));
            } catch (err) {
              console.error(err);
            }
            setTrackedReport(newReport);
            setActiveTab("tracker");
            if (showToast) {
              showToast(`🚨 Priority Voice Rescue Alert ${newReport.id} dispatched!`);
            }
          }}
        />
      )}
    </section>
  );
}

export default Rescue;