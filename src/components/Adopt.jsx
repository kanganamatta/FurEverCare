import { useState } from "react";
import { pets } from "../pets";
import MeetGreetModal from "./MeetGreetModal";

function Adopt({ onPetClick, showToast }) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("all"); // all | 5 | 10
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Wishlist state loaded from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("furevercare_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  // Scheduled Meet & Greets loaded from localStorage
  const [scheduledVisits, setScheduledVisits] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("furevercare_meet_greets") || "[]"
      );
    } catch {
      return [];
    }
  });

  // Meet and Greet Modal state
  const [selectedPetForMeet, setSelectedPetForMeet] = useState(null);
  const [poppingPetId, setPoppingPetId] = useState(null);

  // Toggle Wishlist handler
  const handleToggleWishlist = (pet, e) => {
    if (e) e.stopPropagation();
    setPoppingPetId(pet.id);
    setTimeout(() => setPoppingPetId(null), 700);

    setWishlist((prev) => {
      const isFavorited = prev.includes(pet.id);
      let updated;
      if (isFavorited) {
        updated = prev.filter((id) => id !== pet.id);
        if (showToast) showToast(`Removed ${pet.name} from Wishlist`);
      } else {
        updated = [...prev, pet.id];
        if (showToast) showToast(`❤️ Added ${pet.name} to Wishlist!`);
      }
      try {
        localStorage.setItem("furevercare_wishlist", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Cancel Scheduled Visit
  const handleCancelVisit = (bookingId) => {
    const updated = scheduledVisits.filter((v) => v.bookingId !== bookingId);
    setScheduledVisits(updated);
    try {
      localStorage.setItem("furevercare_meet_greets", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    if (showToast) showToast(`Meet & Greet ${bookingId} cancelled.`);
  };

  // Open Meet & Greet Modal
  const handleOpenMeetModal = (pet, e) => {
    if (e) e.stopPropagation();
    setSelectedPetForMeet(pet);
    document.body.style.overflow = "hidden";
  };

  const handleCloseMeetModal = () => {
    setSelectedPetForMeet(null);
    document.body.style.overflow = "";
  };

  const handleMeetBooked = (bookingData) => {
    setScheduledVisits((prev) => [bookingData, ...prev]);
    if (showToast) {
      showToast(`🤝 Meet & Greet scheduled with ${bookingData.petName}!`);
    }
  };

  // Filter and Search Logic
  const filteredPets = pets.filter((pet) => {
    // Species filter
    const matchesSpecies = filter === "all" || pet.species === filter;

    // Search query
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      pet.name.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query) ||
      pet.species.toLowerCase().includes(query) ||
      (pet.shelter && pet.shelter.toLowerCase().includes(query)) ||
      (pet.cityArea && pet.cityArea.toLowerCase().includes(query)) ||
      (pet.personality &&
        pet.personality.some((p) => p.toLowerCase().includes(query))) ||
      pet.desc.toLowerCase().includes(query);

    // Nearby distance filter
    let matchesDistance = true;
    if (distanceFilter === "5") {
      matchesDistance = (pet.distanceKm || 99) <= 5;
    } else if (distanceFilter === "10") {
      matchesDistance = (pet.distanceKm || 99) <= 10;
    }

    // Wishlist only filter
    const matchesWishlist = !showWishlistOnly || wishlist.includes(pet.id);

    return matchesSpecies && matchesSearch && matchesDistance && matchesWishlist;
  });

  const nearbyCount = pets.filter((p) => (p.distanceKm || 99) <= 5).length;
  const isFilteringActive =
    searchQuery !== "" ||
    filter !== "all" ||
    distanceFilter !== "all" ||
    showWishlistOnly;

  const handleClearAllFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setDistanceFilter("all");
    setShowWishlistOnly(false);
  };

  return (
    <section className="section adopt-advanced-page" id="adopt">
      <div className="section-head">
        <p className="kicker">Adopt a pet</p>
        <h2>Meet your future best friend</h2>
        <p className="section-lead">
          Find animals waiting for loving homes, check nearby shelter availability,
          save your favorites to your wishlist, or schedule a personal meet-and-greet.
        </p>
      </div>

      {/* Real-time Search Bar */}
      <div className="adopt-search-container">
        <div className="adopt-search-bar">
          <span className="adopt-search-icon">🔍</span>
          <input
            type="text"
            className="adopt-search-input"
            placeholder="Search by pet name, breed, species, personality (e.g. Golden, Friendly, Persian, Milo)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="adopt-search-clear-btn"
              onClick={() => setSearchQuery("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Toolbar */}
      <div className="adopt-filter-toolbar">
        {/* Species Filters */}
        <div className="filter-button-group">
          <span className="filter-group-tag">Species:</span>
          <button
            className={`filter-btn ${filter === "all" && !showWishlistOnly ? "active" : ""}`}
            onClick={() => {
              setFilter("all");
              setShowWishlistOnly(false);
            }}
          >
            All Animals
          </button>
          <button
            className={`filter-btn ${filter === "dog" && !showWishlistOnly ? "active" : ""}`}
            onClick={() => {
              setFilter("dog");
              setShowWishlistOnly(false);
            }}
          >
            🐶 Dogs
          </button>
          <button
            className={`filter-btn ${filter === "cat" && !showWishlistOnly ? "active" : ""}`}
            onClick={() => {
              setFilter("cat");
              setShowWishlistOnly(false);
            }}
          >
            🐱 Cats
          </button>
          <button
            className={`filter-btn ${filter === "other" && !showWishlistOnly ? "active" : ""}`}
            onClick={() => {
              setFilter("other");
              setShowWishlistOnly(false);
            }}
          >
            🐰 Small Pets
          </button>
        </div>

        {/* Nearby Distance Filter */}
        <div className="filter-button-group">
          <span className="filter-group-tag">Nearby:</span>
          <button
            className={`filter-btn ${distanceFilter === "all" ? "active" : ""}`}
            onClick={() => setDistanceFilter("all")}
          >
            All Shelters
          </button>
          <button
            className={`filter-btn ${distanceFilter === "5" ? "active" : ""}`}
            onClick={() => setDistanceFilter(distanceFilter === "5" ? "all" : "5")}
            title="Show pets within 5 km"
          >
            📍 Under 5 km ({nearbyCount})
          </button>
          <button
            className={`filter-btn ${distanceFilter === "10" ? "active" : ""}`}
            onClick={() => setDistanceFilter(distanceFilter === "10" ? "all" : "10")}
          >
            Under 10 km
          </button>
        </div>

        {/* Wishlist Saved Pets Button */}
        <div className="filter-button-group">
          <button
            className={`filter-btn wishlist-filter-btn ${showWishlistOnly ? "active" : ""}`}
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
          >
            ❤️ Wishlist ({wishlist.length})
          </button>
        </div>
      </div>

      {/* Results Status & Active Filter Feedback */}
      <div className="adopt-results-bar">
        <span className="results-count-text">
          Showing <strong>{filteredPets.length}</strong> {filteredPets.length === 1 ? "pet" : "pets"} available for adoption
          {searchQuery && ` matching "${searchQuery}"`}
          {distanceFilter !== "all" && ` within ${distanceFilter} km`}
          {showWishlistOnly && ` in your saved wishlist`}
        </span>

        {isFilteringActive && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={handleClearAllFilters}
          >
            Clear All Filters ↺
          </button>
        )}
      </div>

      {/* Pets Grid */}
      {filteredPets.length > 0 ? (
        <div className="pet-grid">
          {filteredPets.map((pet) => {
            const isFavorited = wishlist.includes(pet.id);

            return (
              <article
                className="pet-card"
                key={pet.id}
                onClick={() => onPetClick && onPetClick(pet)}
              >
                <div className="pet-photo">
                  <span className="pet-tag">
                    {pet.species === "other" ? "Small pet" : pet.species}
                  </span>

                  {/* Wishlist Heart Button with Pop Animation */}
                  <button
                    type="button"
                    className={`card-wishlist-heart ${isFavorited ? "active" : ""} ${poppingPetId === pet.id ? "popping" : ""}`}
                    onClick={(e) => handleToggleWishlist(pet, e)}
                    title={isFavorited ? "Remove from wishlist" : "Save to wishlist"}
                    aria-label={`Save ${pet.name} to wishlist`}
                  >
                    {isFavorited ? "❤️" : "🤍"}
                  </button>

                  {/* Distance & Shelter Tag */}
                  {pet.distanceKm && (
                    <span className="pet-distance-tag">
                      📍 {pet.distanceKm} km · {pet.shelter?.split(" ")[0]}
                    </span>
                  )}

                  {/* Orange "Meet Me" button slides into view on hover */}
                  <button
                    type="button"
                    className="card-meet-me-slide-btn"
                    onClick={(e) => handleOpenMeetModal(pet, e)}
                    title={`Meet ${pet.name}`}
                  >
                    <span>Meet Me</span>
                    <span className="slide-btn-arrow">→</span>
                  </button>

                  <img
                    src={pet.img}
                    alt={`${pet.name}, ${pet.breed}`}
                    loading="lazy"
                  />
                </div>

                <div className="pet-body">
                  <div className="pet-header-row">
                    <h3>{pet.name}</h3>
                    <span className="pet-age-badge">{pet.age}</span>
                  </div>

                  <p className="pet-meta">
                    {pet.breed} · {pet.shelter}
                  </p>

                  {/* Personality Tags */}
                  {pet.personality && pet.personality.length > 0 && (
                    <div className="pet-traits-chips">
                      {pet.personality.slice(0, 2).map((trait, idx) => (
                        <span key={idx} className="trait-chip">
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="pet-desc">{pet.desc}</p>

                  {/* Dual Actions: Meet & Greet and Details */}
                  <div className="pet-card-actions">
                    <button
                      type="button"
                      className="meet-greet-card-btn"
                      onClick={(e) => handleOpenMeetModal(pet, e)}
                      title={`Schedule a meet and greet with ${pet.name}`}
                    >
                      🤝 Meet & Greet
                    </button>

                    <span className="pet-link">
                      Adopt {pet.name} →
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="adopt-empty-state">
          <span className="empty-icon">🐾</span>
          <h3>No matching pets found</h3>
          <p>
            {showWishlistOnly
              ? "You haven't saved any pets to your wishlist yet! Click the ❤️ icon on any pet to save them here."
              : "Try changing your search terms, expanding your distance radius, or clearing filters."}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleClearAllFilters}
          >
            View All Available Pets
          </button>
        </div>
      )}

      {/* Scheduled Meet & Greets Section */}
      {scheduledVisits.length > 0 && (
        <div className="scheduled-visits-section">
          <div className="visits-header">
            <div>
              <h3>📅 Your Scheduled Meet & Greets ({scheduledVisits.length})</h3>
              <p>Confirmed appointments to visit and spend time with pets at partner shelters.</p>
            </div>
          </div>

          <div className="visits-cards-grid">
            {scheduledVisits.map((visit) => (
              <div key={visit.bookingId} className="visit-pass-card">
                <div className="visit-pass-left">
                  <img
                    src={visit.petImg}
                    alt={visit.petName}
                    className="visit-pet-photo"
                  />
                  <div>
                    <span className="visit-badge">✓ Confirmed</span>
                    <h4>{visit.petName} ({visit.petBreed})</h4>
                    <p className="visit-time-line">
                      📅 <strong>{visit.visitDate}</strong> · ⏰ {visit.timeSlot}
                    </p>
                    <p className="visit-shelter-line">
                      🏢 {visit.shelter} ({visit.distanceKm} km away) · Mode: {visit.meetingMode}
                    </p>
                  </div>
                </div>

                <div className="visit-pass-right">
                  <span className="visit-ref-code">{visit.bookingId}</span>
                  <button
                    type="button"
                    className="cancel-visit-btn"
                    onClick={() => handleCancelVisit(visit.bookingId)}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meet & Greet Modal */}
      {selectedPetForMeet && (
        <MeetGreetModal
          pet={selectedPetForMeet}
          onClose={handleCloseMeetModal}
          onBooked={handleMeetBooked}
        />
      )}
    </section>
  );
}

export default Adopt;