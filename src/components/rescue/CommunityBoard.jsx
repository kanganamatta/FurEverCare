import { useState } from "react";

function CommunityBoard({ reports = [], onTrackReport, onOpenReportTab }) {
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReports = reports.filter((item) => {
    const matchesSpecies =
      speciesFilter === "all" ||
      item.animalType?.toLowerCase() === speciesFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && item.currentStageIndex < 5) ||
      (statusFilter === "safe" && item.currentStageIndex >= 5);

    return matchesSpecies && matchesStatus;
  });

  return (
    <div className="community-board-container">
      {/* Board Header */}
      <div className="community-board-head">
        <div>
          <h3>🐾 Uploaded Animal Rescues & Community Sighting Board</h3>
          <p>
            Browse real-time incidents reported by compassionate citizens and volunteer spotters across the city.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onOpenReportTab}
        >
          + Upload & Report Animal
        </button>
      </div>

      {/* Filter Bar */}
      <div className="community-filter-bar">
        <div className="filter-group">
          <span className="filter-group-label">Species:</span>
          {["all", "Dog", "Cat", "Bird", "Livestock", "Wildlife"].map((sp) => (
            <button
              key={sp}
              type="button"
              className={`filter-btn-pill ${speciesFilter === sp ? "active" : ""}`}
              onClick={() => setSpeciesFilter(sp)}
            >
              {sp === "all" ? "All Species" : sp}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Status:</span>
          <button
            type="button"
            className={`filter-btn-pill ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-btn-pill ${statusFilter === "active" ? "active" : ""}`}
            onClick={() => setStatusFilter("active")}
          >
            🚨 Active Rescues
          </button>
          <button
            type="button"
            className={`filter-btn-pill ${statusFilter === "safe" ? "active" : ""}`}
            onClick={() => setStatusFilter("safe")}
          >
            💚 Safe / Recovered
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredReports.length > 0 ? (
        <div className="community-cards-grid">
          {filteredReports.map((report) => (
            <div key={report.id} className="community-animal-card">
              <div className="card-photo-wrapper">
                {report.photoUrl ? (
                  <img
                    src={report.photoUrl}
                    alt={report.animalType}
                    className="card-photo"
                  />
                ) : (
                  <div className="card-photo-fallback">
                    <span>
                      {report.animalType === "Cat"
                        ? "🐱"
                        : report.animalType === "Bird"
                        ? "🦜"
                        : report.animalType === "Livestock"
                        ? "🐄"
                        : "🐕"}
                    </span>
                    <small>Incident Verified</small>
                  </div>
                )}
                <span className={`card-priority-badge badge-${(report.priority || "Normal").toLowerCase()}`}>
                  {report.priority || "Normal"} Priority
                </span>
                <span className="card-id-tag">{report.id}</span>
              </div>

              <div className="card-body">
                <div className="card-title-row">
                  <h4>{report.animalType || "Animal in Distress"}</h4>
                  <span className="card-time-ago">{report.date || "Today"}</span>
                </div>

                <p className="card-location">
                  📍 <strong>{report.location}</strong>
                </p>

                <p className="card-situation">
                  {report.situation}
                </p>

                {report.tags && report.tags.length > 0 && (
                  <div className="card-tags-list">
                    {report.tags.map((t, idx) => (
                      <span key={idx} className="card-tag-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-footer-row">
                  <span className="card-status-indicator">
                    <span className="status-dot-pulse" />
                    {report.status || "Rescue Team Notified"}
                  </span>

                  <button
                    type="button"
                    className="card-track-btn"
                    onClick={() => onTrackReport(report)}
                  >
                    Track Progress →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="community-empty-box">
          <span>🐾</span>
          <h4>No matching animal reports found</h4>
          <p>Try clearing filters or report a new animal in distress to add them to the community board.</p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenReportTab}
          >
            Report an Animal Now
          </button>
        </div>
      )}
    </div>
  );
}

export default CommunityBoard;
