import { useState } from "react";

// Default demo rescue markers located across a mock metro region
const DEFAULT_MARKERS = [
  {
    id: "amb-1",
    type: "ambulance",
    title: "Ambulance Unit 01 (Rapid Care)",
    x: 32,
    y: 42,
    driver: "Rajesh Kumar (Paramedic)",
    status: "En Route to MG Road",
    eta: "8 mins",
    phone: "+91 98765 00001"
  },
  {
    id: "amb-2",
    type: "ambulance",
    title: "Ambulance Unit 04 (Equipped)",
    x: 68,
    y: 28,
    driver: "Vikram Singh (Vet Assistant)",
    status: "Standby at North Hub",
    eta: "Ready",
    phone: "+91 98765 00002"
  },
  {
    id: "amb-3",
    type: "ambulance",
    title: "Ambulance Unit 07 (Critical Care)",
    x: 54,
    y: 74,
    driver: "Sunil Verma (Emergency Driver)",
    status: "Responding near Tech Park",
    eta: "14 mins",
    phone: "+91 98765 00003"
  },
  {
    id: "hosp-1",
    type: "hospital",
    title: "FureverCare Central Animal Hospital",
    x: 48,
    y: 50,
    driver: "Dr. Ananya Roy (Chief Vet)",
    status: "24/7 ICU & Trauma Operating Room Open",
    eta: "Base Center",
    phone: "+91 12345 67890"
  },
  {
    id: "hosp-2",
    type: "hospital",
    title: "Greenwood Partner Vet Clinic",
    x: 78,
    y: 62,
    driver: "Dr. Sharma",
    status: "In-patient recovery wards available",
    eta: "Partner Clinic",
    phone: "+91 12345 67891"
  },
  {
    id: "res-1",
    type: "rescue",
    title: "Injured Golden Retriever",
    x: 28,
    y: 35,
    driver: "Reported by Priya M.",
    status: "Ambulance dispatched (ID: RC-89410)",
    eta: "10 mins ago",
    phone: "Confidential"
  },
  {
    id: "res-2",
    type: "rescue",
    title: "Stray Cat with Leg Trauma",
    x: 62,
    y: 80,
    driver: "Reported by Rohit K.",
    status: "First Aid Team on site",
    eta: "25 mins ago",
    phone: "Confidential"
  }
];

function RescueMap({
  selectedLocation,
  onSelectLocation,
  userCoords,
  isMini = false
}) {
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Approximate landmark names based on grid quadrants
    let area = "Central Sector";
    if (clickX < 40 && clickY < 50) area = "West Ridge / Park Road";
    else if (clickX >= 40 && clickY < 50) area = "North Ring / Mall Area";
    else if (clickX < 50 && clickY >= 50) area = "South Express Way / Metro Stn";
    else area = "East Suburbs / Tech Corridor";

    const lat = (28.5 + (100 - clickY) * 0.003).toFixed(4);
    const lng = (77.1 + clickX * 0.003).toFixed(4);

    if (onSelectLocation) {
      onSelectLocation({
        x: Math.round(clickX),
        y: Math.round(clickY),
        lat,
        lng,
        addressName: `${area} (GPS: ${lat}°N, ${lng}°E)`
      });
    }
  };

  const filteredMarkers = DEFAULT_MARKERS.filter((m) => {
    if (filter === "all") return true;
    if (filter === "ambulances") return m.type === "ambulance";
    if (filter === "hospitals") return m.type === "hospital";
    if (filter === "rescues") return m.type === "rescue";
    return true;
  });

  return (
    <div className={`rescue-map-container ${isMini ? "mini-map" : ""}`}>
      {/* Top Map Header & Controls */}
      <div className="map-toolbar">
        <div className="map-legend-pills">
          <button
            type="button"
            className={`map-filter-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Live ({DEFAULT_MARKERS.length})
          </button>
          <button
            type="button"
            className={`map-filter-pill ${filter === "ambulances" ? "active" : ""}`}
            onClick={() => setFilter("ambulances")}
          >
            🚑 Ambulances (3)
          </button>
          <button
            type="button"
            className={`map-filter-pill ${filter === "rescues" ? "active" : ""}`}
            onClick={() => setFilter("rescues")}
          >
            🚨 In Distress (2)
          </button>
          <button
            type="button"
            className={`map-filter-pill ${filter === "hospitals" ? "active" : ""}`}
            onClick={() => setFilter("hospitals")}
          >
            🏥 Trauma Centers (2)
          </button>
        </div>

        <div className="map-zoom-tools">
          <button
            type="button"
            className="map-tool-btn"
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))}
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            className="map-tool-btn"
            onClick={() => setZoom((z) => Math.max(0.85, z - 0.15))}
            title="Zoom Out"
          >
            −
          </button>
          <button
            type="button"
            className="map-tool-btn map-reset-btn"
            onClick={() => setZoom(1)}
            title="Reset Zoom"
          >
            ⊙
          </button>
        </div>
      </div>

      {/* Map Display Surface */}
      <div
        className="rescue-map-viewport"
        onClick={handleMapClick}
        title="Click anywhere to drop rescue location pin"
      >
        <div
          className="rescue-map-canvas"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Stylized Vector Background */}
          <svg
            className="map-vector-bg"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            {/* Base landmass */}
            <rect width="1000" height="700" fill="#E8EDE4" />

            {/* River / Waterway */}
            <path
              d="M 100 0 C 250 180, 200 400, 340 700 L 400 700 C 260 400, 310 180, 160 0 Z"
              fill="#BEE3F8"
              opacity="0.85"
            />

            {/* Green parks and nature reserves */}
            <rect x="50" y="60" width="180" height="150" rx="20" fill="#C6E2D0" />
            <rect x="680" y="450" width="260" height="180" rx="30" fill="#C6E2D0" />
            <circle cx="850" cy="160" r="90" fill="#C6E2D0" />

            {/* Major Arterial Roads & Expressways */}
            {/* Horizontal Expressways */}
            <line x1="0" y1="210" x2="1000" y2="210" stroke="#FFF" strokeWidth="18" />
            <line x1="0" y1="210" x2="1000" y2="210" stroke="#F6AD55" strokeWidth="3" strokeDasharray="14 10" />

            <line x1="0" y1="460" x2="1000" y2="460" stroke="#FFF" strokeWidth="16" />
            <line x1="0" y1="460" x2="1000" y2="460" stroke="#CBD5E0" strokeWidth="2" />

            {/* Vertical Arterial Highways */}
            <line x1="490" y1="0" x2="490" y2="700" stroke="#FFF" strokeWidth="20" />
            <line x1="490" y1="0" x2="490" y2="700" stroke="#ED8936" strokeWidth="3" strokeDasharray="16 12" />

            <line x1="220" y1="0" x2="220" y2="700" stroke="#FFF" strokeWidth="14" />
            <line x1="760" y1="0" x2="760" y2="700" stroke="#FFF" strokeWidth="14" />

            {/* Diagonal Bypass Roads */}
            <line x1="120" y1="650" x2="880" y2="80" stroke="#FFF" strokeWidth="12" />
            <line x1="80" y1="120" x2="920" y2="600" stroke="#FFF" strokeWidth="10" />

            {/* Grid connecting streets */}
            <line x1="220" y1="100" x2="760" y2="100" stroke="#FAF8F5" strokeWidth="8" />
            <line x1="220" y1="330" x2="760" y2="330" stroke="#FAF8F5" strokeWidth="8" />
            <line x1="220" y1="580" x2="760" y2="580" stroke="#FAF8F5" strokeWidth="8" />
            <line x1="360" y1="100" x2="360" y2="600" stroke="#FAF8F5" strokeWidth="8" />
            <line x1="640" y1="100" x2="640" y2="600" stroke="#FAF8F5" strokeWidth="8" />

            {/* Sector / Region Labels */}
            <text x="70" y="50" fill="#6B7A6A" fontSize="16" fontWeight="700">North Ridge Park</text>
            <text x="750" y="80" fill="#6B7A6A" fontSize="16" fontWeight="700">Metro Hub Sector 4</text>
            <text x="510" y="240" fill="#1F4B43" fontSize="18" fontWeight="800">Grand Trunk Ring Road</text>
            <text x="510" y="490" fill="#6B7A6A" fontSize="16" fontWeight="700">Central Veterinary Zone</text>
            <text x="720" y="650" fill="#6B7A6A" fontSize="16" fontWeight="700">East Wildlife Sanctuary</text>

            {/* LIVE ACTIVE EMERGENCY DISPATCH ROUTE (Vehicle moves along this route) */}
            <path
              d="M 490 350 L 490 210 L 220 210 L 220 250 L 280 245"
              fill="none"
              stroke="rgba(255, 133, 82, 0.45)"
              strokeWidth="14"
              strokeLinecap="round"
              className="route-glow-trail"
            />
            <path
              id="rescueEmergencyRoute"
              d="M 490 350 L 490 210 L 220 210 L 220 250 L 280 245"
              fill="none"
              stroke="#FF8552"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="14 10"
              className="animated-route-path"
            />

            {/* LIVE MOVING RESCUE VEHICLE (AMBULANCE) */}
            <g className="live-moving-ambulance-marker">
              <animateMotion
                dur="9s"
                repeatCount="indefinite"
                rotate="auto"
                path="M 490 350 L 490 210 L 220 210 L 220 250 L 280 245"
              />
              <circle cx="0" cy="0" r="22" fill="#143530" stroke="#FF8552" strokeWidth="3" />
              <text x="0" y="6" textAnchor="middle" fontSize="18">🚑</text>
              {/* Flashing blue and red sirens */}
              <circle cx="-9" cy="-14" r="5" fill="#3B82F6">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="0.6s" repeatCount="indefinite" />
              </circle>
              <circle cx="9" cy="-14" r="5" fill="#EF4444">
                <animate attributeName="opacity" values="1;0.2;1" dur="0.6s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>

          {/* Render Active Markers */}
          {filteredMarkers.map((marker) => {
            const isSelected = selectedMarker?.id === marker.id;
            const isRescueDistress = marker.type === "rescue";

            return (
              <div
                key={marker.id}
                className={`map-marker-pin marker-${marker.type} ${isSelected ? "selected" : ""} ${isRescueDistress ? "active-rescue-pulse" : ""}`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMarker(isSelected ? null : marker);
                }}
              >
                <div className={`marker-radar-wave ${isRescueDistress ? "active-radar-wave" : ""}`} />
                <div className="marker-icon-bubble">
                  {marker.type === "ambulance" && "🚑"}
                  {marker.type === "hospital" && "🏥"}
                  {marker.type === "rescue" && "🚨"}
                </div>
                <span className="marker-label-tag">{marker.title.split(" ")[0]}</span>
                {isRescueDistress && (
                  <span className="active-incident-pill">ACTIVE DISPATCH</span>
                )}
              </div>
            );
          })}

          {/* User Selected / Detected Location Pin */}
          {selectedLocation && (
            <div
              className="map-marker-pin user-drop-pin"
              style={{
                left: `${selectedLocation.x || 50}%`,
                top: `${selectedLocation.y || 50}%`
              }}
            >
              <div className="pin-pulse" />
              <div className="user-pin-head">
                <span>📍</span>
              </div>
              <div className="user-pin-bubble">
                <strong>Rescue Incident Location</strong>
                <p>{selectedLocation.addressName || "Selected via Map"}</p>
              </div>
            </div>
          )}

          {/* GPS Detected Marker (if available) */}
          {userCoords && (
            <div
              className="map-marker-pin gps-live-marker"
              style={{
                left: `${userCoords.x || 52}%`,
                top: `${userCoords.y || 48}%`
              }}
              title="Your Current GPS Location"
            >
              <div className="gps-ripple" />
              <div className="gps-dot" />
            </div>
          )}
        </div>

        {/* Selected Marker Popup Card */}
        {selectedMarker && (
          <div
            className="marker-popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="popup-close-btn"
              onClick={() => setSelectedMarker(null)}
            >
              ×
            </button>
            <div className="popup-badge">
              {selectedMarker.type === "ambulance" && "🚑 Active Ambulance"}
              {selectedMarker.type === "hospital" && "🏥 Critical Trauma Care"}
              {selectedMarker.type === "rescue" && "🚨 Rescue In Progress"}
            </div>
            <h4>{selectedMarker.title}</h4>
            <p><strong>Assigned:</strong> {selectedMarker.driver}</p>
            <p><strong>Status:</strong> {selectedMarker.status}</p>
            <div className="popup-footer">
              <span className="popup-eta">⏱️ ETA / Range: {selectedMarker.eta}</span>
              {selectedMarker.phone !== "Confidential" && (
                <a
                  href={`tel:${selectedMarker.phone}`}
                  className="popup-call-btn"
                >
                  Call Unit
                </a>
              )}
            </div>
          </div>
        )}

        {/* Map Click Hint */}
        <div className="map-interactive-hint">
          <span>👆 Click anywhere on the map to pin animal rescue location</span>
        </div>
      </div>
    </div>
  );
}

export default RescueMap;
