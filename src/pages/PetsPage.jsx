import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { pets } from "../pets";
import MeetGreetModal from "../components/MeetGreetModal";
import "./PetsPage.css";

function PetsPage() {
  const context = useOutletContext();
  const showToast = context?.showToast;
  const openChatbot = context?.openChatbot;

  // Search & Basic Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all"); // 'all', 'Dog', 'Cat', 'Rabbit', 'urgent', 'staff_pick', 'saved'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced Filters
  const [filterAgeGroup, setFilterAgeGroup] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [filterEnergy, setFilterEnergy] = useState("all");
  const [filterDistance, setFilterDistance] = useState("all"); // 'all', 3, 5, 10
  const [onlyKidsSafe, setOnlyKidsSafe] = useState(false);
  const [onlyPetsSafe, setOnlyPetsSafe] = useState(false);
  const [onlyVaccinated, setOnlyVaccinated] = useState(false);
  const [onlyFreeFee, setOnlyFreeFee] = useState(false);

  // Sorting & View Mode
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended', 'age_asc', 'age_desc', 'distance', 'name'
  const [viewMode, setViewMode] = useState("grid"); // 'grid', 'list'

  // Modals & Drawers
  const [selectedPetForDetail, setSelectedPetForDetail] = useState(null);
  const [selectedPetForMeet, setSelectedPetForMeet] = useState(null);
  const [petForAdoptionApp, setPetForAdoptionApp] = useState(null);
  const [adoptionSubmitted, setAdoptionSubmitted] = useState(false);
  const [adoptionAppRef, setAdoptionAppRef] = useState("");

  // Adoption Form State
  const [appFormData, setAppFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    housing: "own",
    experience: "experienced",
    notes: ""
  });

  // Compare System
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Wishlist / Liked Pets (Synced with localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("furevercare_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  // Smart Pet Matcher (Quiz)
  const [showMatcherQuiz, setShowMatcherQuiz] = useState(false);
  const [matcherAnswers, setMatcherAnswers] = useState({
    space: "apartment", // 'apartment', 'house_yard', 'farm'
    activity: "moderate", // 'calm', 'moderate', 'active'
    household: "adults" // 'kids', 'other_pets', 'adults'
  });
  const [hasCalculatedMatches, setHasCalculatedMatches] = useState(false);

  // Handle Wishlist Toggle
  const toggleWishlist = (pet, e) => {
    if (e) e.stopPropagation();

    setWishlist((prev) => {
      const isFavorited = prev.includes(pet.id);
      let updated;
      if (isFavorited) {
        updated = prev.filter((id) => id !== pet.id);
        if (showToast) showToast(`Removed ${pet.name} from Wishlist`);
      } else {
        updated = [...prev, pet.id];
        if (showToast) showToast(`❤️ Saved ${pet.name} to Wishlist!`);
      }
      try {
        localStorage.setItem("furevercare_wishlist", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Handle Compare Toggle
  const toggleCompare = (pet, e) => {
    if (e) e.stopPropagation();
    setCompareList((prev) => {
      if (prev.includes(pet.id)) {
        return prev.filter((id) => id !== pet.id);
      }
      if (prev.length >= 3) {
        if (showToast) showToast("You can compare up to 3 pets at a time");
        return prev;
      }
      if (showToast) showToast(`Added ${pet.name} to comparison`);
      return [...prev, pet.id];
    });
  };

  // Copy Pet Share Link
  const handleSharePet = (pet, e) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/pets?pet=${pet.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        if (showToast) showToast(`🔗 Link for ${pet.name} copied to clipboard!`);
      }).catch(() => {
        if (showToast) showToast(`Profile link: ${url}`);
      });
    } else {
      if (showToast) showToast(`Profile link: ${url}`);
    }
  };

  // Calculate Match Score for Quiz
  const getPetMatchScore = useMemo(() => {
    return (pet) => {
      if (!hasCalculatedMatches) return 0;
      let score = 70;

      // Activity vs Energy
      if (matcherAnswers.activity === "active" && pet.energyLevel === "High") score += 15;
      if (matcherAnswers.activity === "calm" && pet.energyLevel === "Calm") score += 15;
      if (matcherAnswers.activity === "moderate" && pet.energyLevel === "Medium") score += 15;

      // Space vs Size & Species
      if (matcherAnswers.space === "apartment") {
        if (pet.size === "Small" || pet.category === "Cat" || pet.category === "Rabbit") score += 10;
        if (pet.size === "Large" && pet.energyLevel === "High") score -= 15;
      } else if (matcherAnswers.space === "house_yard" || matcherAnswers.space === "farm") {
        if (pet.category === "Dog") score += 10;
      }

      // Household
      if (matcherAnswers.household === "kids" && pet.goodWith?.kids) score += 10;
      if (matcherAnswers.household === "other_pets" && (pet.goodWith?.dogs || pet.goodWith?.cats)) score += 10;

      return Math.min(score, 99);
    };
  }, [hasCalculatedMatches, matcherAnswers]);

  // Count by categories
  const dogCount = useMemo(() => pets.filter((p) => p.category === "Dog").length, []);
  const catCount = useMemo(() => pets.filter((p) => p.category === "Cat").length, []);
  const otherCount = useMemo(() => pets.filter((p) => p.category !== "Dog" && p.category !== "Cat").length, []);

  // Filter and Search Pipeline
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = pet.name.toLowerCase().includes(q);
        const matchBreed = pet.breed.toLowerCase().includes(q);
        const matchCategory = pet.category.toLowerCase().includes(q);
        const matchCity = pet.cityArea.toLowerCase().includes(q);
        const matchShelter = pet.shelter.toLowerCase().includes(q);
        const matchPersonality = pet.personality?.some((t) => t.toLowerCase().includes(q));
        const matchTags = pet.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchBreed && !matchCategory && !matchCity && !matchShelter && !matchPersonality && !matchTags) {
          return false;
        }
      }

      // 2. Category Tab
      if (activeCategory === "Dog" && pet.category !== "Dog") return false;
      if (activeCategory === "Cat" && pet.category !== "Cat") return false;
      if (activeCategory === "Rabbit" && (pet.category === "Dog" || pet.category === "Cat")) return false;
      if (activeCategory === "urgent" && !pet.badge?.toLowerCase().includes("urgent")) return false;
      if (activeCategory === "staff_pick" && !pet.badge?.toLowerCase().includes("staff")) return false;
      if (activeCategory === "saved" && !wishlist.includes(pet.id)) return false;

      // 3. Advanced Filters
      if (filterAgeGroup !== "all" && pet.ageGroup !== filterAgeGroup) return false;
      if (filterGender !== "all" && pet.gender !== filterGender) return false;
      if (filterSize !== "all" && pet.size !== filterSize) return false;
      if (filterEnergy !== "all" && pet.energyLevel !== filterEnergy) return false;

      if (filterDistance !== "all") {
        const maxDist = Number(filterDistance);
        if (pet.distanceKm > maxDist) return false;
      }

      if (onlyKidsSafe && !pet.goodWith?.kids) return false;
      if (onlyPetsSafe && !(pet.goodWith?.dogs || pet.goodWith?.cats)) return false;
      if (onlyVaccinated && !pet.health?.vaccinated) return false;
      if (onlyFreeFee && !pet.adoptionFee?.toLowerCase().includes("free") && !pet.adoptionFee?.toLowerCase().includes("$0")) return false;

      return true;
    });
  }, [
    searchQuery,
    activeCategory,
    wishlist,
    filterAgeGroup,
    filterGender,
    filterSize,
    filterEnergy,
    filterDistance,
    onlyKidsSafe,
    onlyPetsSafe,
    onlyVaccinated,
    onlyFreeFee
  ]);

  // Sorted Results
  const sortedPets = useMemo(() => {
    const list = [...filteredPets];
    if (hasCalculatedMatches) {
      return list.sort((a, b) => getPetMatchScore(b) - getPetMatchScore(a));
    }

    switch (sortBy) {
      case "age_asc":
        return list.sort((a, b) => (parseInt(a.age) || 0) - (parseInt(b.age) || 0));
      case "age_desc":
        return list.sort((a, b) => (parseInt(b.age) || 0) - (parseInt(a.age) || 0));
      case "distance":
        return list.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "recommended":
      default:
        return list;
    }
  }, [filteredPets, sortBy, hasCalculatedMatches, getPetMatchScore]);

  // Active filter count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterAgeGroup !== "all") count++;
    if (filterGender !== "all") count++;
    if (filterSize !== "all") count++;
    if (filterEnergy !== "all") count++;
    if (filterDistance !== "all") count++;
    if (onlyKidsSafe) count++;
    if (onlyPetsSafe) count++;
    if (onlyVaccinated) count++;
    if (onlyFreeFee) count++;
    return count;
  }, [filterAgeGroup, filterGender, filterSize, filterEnergy, filterDistance, onlyKidsSafe, onlyPetsSafe, onlyVaccinated, onlyFreeFee]);

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setFilterAgeGroup("all");
    setFilterGender("all");
    setFilterSize("all");
    setFilterEnergy("all");
    setFilterDistance("all");
    setOnlyKidsSafe(false);
    setOnlyPetsSafe(false);
    setOnlyVaccinated(false);
    setOnlyFreeFee(false);
    setSortBy("recommended");
    setHasCalculatedMatches(false);
  };

  // Open Meet & Greet Modal
  const handleOpenMeet = (pet, e) => {
    if (e) e.stopPropagation();
    setSelectedPetForMeet(pet);
    document.body.style.overflow = "hidden";
  };

  const handleCloseMeet = () => {
    setSelectedPetForMeet(null);
    document.body.style.overflow = "";
  };

  // Open Pet Profile Modal
  const handleOpenDetail = (pet) => {
    setSelectedPetForDetail(pet);
    document.body.style.overflow = "hidden";
  };

  const handleCloseDetail = () => {
    setSelectedPetForDetail(null);
    document.body.style.overflow = "";
  };

  // Adoption Application Submit
  const handleOpenAdoptionApp = (pet, e) => {
    if (e) e.stopPropagation();
    setPetForAdoptionApp(pet);
    setAdoptionSubmitted(false);
    document.body.style.overflow = "hidden";
  };

  const handleCloseAdoptionApp = () => {
    setPetForAdoptionApp(null);
    setAdoptionSubmitted(false);
    document.body.style.overflow = "";
  };

  const handleAppFormSubmit = (e) => {
    e.preventDefault();
    if (!appFormData.fullName || !appFormData.phone) {
      if (showToast) showToast("Please fill in your name and contact phone number");
      return;
    }

    const refId = `APP-${petForAdoptionApp.name.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setAdoptionAppRef(refId);
    setAdoptionSubmitted(true);

    try {
      const existing = JSON.parse(localStorage.getItem("furevercare_applications") || "[]");
      const record = {
        refId,
        petId: petForAdoptionApp.id,
        petName: petForAdoptionApp.name,
        petBreed: petForAdoptionApp.breed,
        ...appFormData,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem("furevercare_applications", JSON.stringify([record, ...existing]));
    } catch (err) {
      console.error(err);
    }

    if (showToast) showToast(`🎉 Adoption Application ${refId} submitted successfully!`);
  };

  // Clean body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="pets-advanced-page">

      {/* =========================================================================
          HERO & LIVE STATS BANNER
          ========================================================================= */}
      <section className="pets-hero-wrapper">
        <div className="pets-hero-banner">
          <div className="pets-hero-kicker-pill">
            🐾 Meet Our Rescue Residents
          </div>

          <h1 className="pets-hero-title">
            Every companion deserves a <em>loving forever home.</em>
          </h1>

          <p className="pets-hero-subtitle">
            Explore verified rescue pets ready for adoption. Filter by your lifestyle,
            schedule in-person or video visits, or try our intelligent 3-question Pet Matcher.
          </p>

          {/* Stat Pills */}
          <div className="pets-stats-pills-row">
            <div className="pet-stat-pill">
              🐕 Dogs: <b>{dogCount} Available</b>
            </div>
            <div className="pet-stat-pill">
              🐈 Cats: <b>{catCount} Available</b>
            </div>
            <div className="pet-stat-pill">
              🐰 Small Friends & Birds: <b>{otherCount} Available</b>
            </div>
            <div className="pet-stat-pill">
              🩺 Health Checked: <b>100% Vetted</b>
            </div>
            <div className="pet-stat-pill">
              🤝 Zero-Hassle Meet & Greets
            </div>
          </div>

          {/* Hero Actions */}
          <div className="pets-hero-actions-row">
            <button
              className="btn-hero-quiz"
              onClick={() => setShowMatcherQuiz(!showMatcherQuiz)}
            >
              <span>✨</span>
              {showMatcherQuiz ? "Close Smart Matcher" : "Take 30-Sec Pet Match Quiz"}
            </button>

            <button
              className={`btn-hero-saved ${activeCategory === "saved" ? "active" : ""}`}
              onClick={() => setActiveCategory(activeCategory === "saved" ? "all" : "saved")}
            >
              <span>❤️</span>
              <span>Saved Companions ({wishlist.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SMART PET MATCHER (QUIZ CARD)
          ========================================================================= */}
      {showMatcherQuiz && (
        <section className="pet-matcher-card">
          <div className="matcher-header">
            <div className="matcher-header-left">
              <h3>🎯 Quick Compatibility Matcher</h3>
              <p>Answer 3 quick questions and we'll highlight the companions best suited to your routine.</p>
            </div>
            <button
              className="btn-close-matcher"
              onClick={() => setShowMatcherQuiz(false)}
              aria-label="Close Quiz"
            >
              ✕
            </button>
          </div>

          <div className="matcher-questions-grid">
            {/* Question 1: Space */}
            <div className="matcher-q-group">
              <label>1. Your Living Space</label>
              <div className="matcher-options-list">
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.space === "apartment" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, space: "apartment" })}
                >
                  🏢 Apartment / Flat
                </button>
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.space === "house_yard" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, space: "house_yard" })}
                >
                  🏡 House with Fenced Yard
                </button>
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.space === "farm" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, space: "farm" })}
                >
                  🌳 Spacious / Farm
                </button>
              </div>
            </div>

            {/* Question 2: Activity */}
            <div className="matcher-q-group">
              <label>2. Your Daily Activity Level</label>
              <div className="matcher-options-list">
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.activity === "calm" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, activity: "calm" })}
                >
                  🛋️ Relaxed & Cozy Cuddles
                </button>
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.activity === "moderate" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, activity: "moderate" })}
                >
                  🚶 Moderate Daily Walks
                </button>
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.activity === "active" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, activity: "active" })}
                >
                  🏃 High Energy / Running
                </button>
              </div>
            </div>

            {/* Question 3: Household */}
            <div className="matcher-q-group">
              <label>3. Household Members</label>
              <div className="matcher-options-list">
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.household === "kids" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, household: "kids" })}
                >
                  👶 Young Children
                </button>
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.household === "other_pets" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, household: "other_pets" })}
                >
                  🐾 Other Dogs or Cats
                </button>
                <button
                  type="button"
                  className={`matcher-option-btn ${matcherAnswers.household === "adults" ? "selected" : ""}`}
                  onClick={() => setMatcherAnswers({ ...matcherAnswers, household: "adults" })}
                >
                  🧑 Adults Only
                </button>
              </div>
            </div>
          </div>

          <div className="matcher-actions-bar">
            <span className="matcher-result-text">
              {hasCalculatedMatches
                ? "✨ Compatibility calculated! Matched pets are sorted with match badges."
                : "Select your lifestyle to see personalized compatibility scores."}
            </span>

            <div className="matcher-buttons-right">
              {hasCalculatedMatches && (
                <button
                  className="btn-reset-matcher"
                  onClick={() => setHasCalculatedMatches(false)}
                >
                  Reset Matcher
                </button>
              )}
              <button
                className="btn-apply-matcher"
                onClick={() => {
                  setHasCalculatedMatches(true);
                  if (showToast) showToast("🎯 Compatibility matched! High matches shown first.");
                }}
              >
                <span>🎯</span> View Best Matches
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CONTROLS SECTION: SEARCH, CATEGORY TABS & FILTER DRAWER
          ========================================================================= */}
      <section className="pets-controls-container">
        {/* Search Bar & Filter Toggle */}
        <div className="pets-search-row">
          <div className="pets-search-box">
            <span className="search-input-icon">🔍</span>
            <input
              type="text"
              className="pets-search-input"
              placeholder="Search by pet name, breed, location, or trait (e.g. Golden, playful, calm)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <button
            className={`btn-toggle-filters ${showAdvancedFilters ? "active" : ""}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <span>⚙️</span>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge-counter">{activeFiltersCount}</span>
            )}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="pets-categories-row">
          <button
            className={`category-pill-btn ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            🐾 All Companions
            <span className="category-count">{pets.length}</span>
          </button>

          <button
            className={`category-pill-btn ${activeCategory === "Dog" ? "active" : ""}`}
            onClick={() => setActiveCategory("Dog")}
          >
            🐕 Dogs
            <span className="category-count">{dogCount}</span>
          </button>

          <button
            className={`category-pill-btn ${activeCategory === "Cat" ? "active" : ""}`}
            onClick={() => setActiveCategory("Cat")}
          >
            🐈 Cats
            <span className="category-count">{catCount}</span>
          </button>

          <button
            className={`category-pill-btn ${activeCategory === "Rabbit" ? "active" : ""}`}
            onClick={() => setActiveCategory("Rabbit")}
          >
            🐰 Small Friends
            <span className="category-count">{otherCount}</span>
          </button>

          <button
            className={`category-pill-btn ${activeCategory === "urgent" ? "active" : ""}`}
            onClick={() => setActiveCategory("urgent")}
          >
            🔥 Urgent Foster
          </button>

          <button
            className={`category-pill-btn ${activeCategory === "staff_pick" ? "active" : ""}`}
            onClick={() => setActiveCategory("staff_pick")}
          >
            ⭐ Staff Favorites
          </button>

          <button
            className={`category-pill-btn ${activeCategory === "saved" ? "active" : ""}`}
            onClick={() => setActiveCategory("saved")}
          >
            ❤️ Saved ({wishlist.length})
          </button>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pets-filter-drawer">
            <div className="filter-drawer-grid">
              {/* Age Group */}
              <div className="filter-item">
                <label>Age Group</label>
                <select
                  value={filterAgeGroup}
                  onChange={(e) => setFilterAgeGroup(e.target.value)}
                >
                  <option value="all">All Ages</option>
                  <option value="Baby">Baby / Kitten / Puppy (&lt; 1 yr)</option>
                  <option value="Young">Young (1 – 3 yrs)</option>
                  <option value="Adult">Adult (3 – 6 yrs)</option>
                  <option value="Senior">Senior (7+ yrs)</option>
                </select>
              </div>

              {/* Gender */}
              <div className="filter-item">
                <label>Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male ♂</option>
                  <option value="Female">Female ♀</option>
                </select>
              </div>

              {/* Size */}
              <div className="filter-item">
                <label>Pet Size</label>
                <select
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                >
                  <option value="all">All Sizes</option>
                  <option value="Small">Small (&lt; 10 kg)</option>
                  <option value="Medium">Medium (10 – 25 kg)</option>
                  <option value="Large">Large (25+ kg)</option>
                </select>
              </div>

              {/* Energy Level */}
              <div className="filter-item">
                <label>Energy Level</label>
                <select
                  value={filterEnergy}
                  onChange={(e) => setFilterEnergy(e.target.value)}
                >
                  <option value="all">Any Energy</option>
                  <option value="Calm">Calm & Cozy</option>
                  <option value="Medium">Moderate Energy</option>
                  <option value="High">Active & Energetic</option>
                </select>
              </div>

              {/* Distance Radius */}
              <div className="filter-item">
                <label>Max Distance</label>
                <select
                  value={filterDistance}
                  onChange={(e) => setFilterDistance(e.target.value)}
                >
                  <option value="all">Any Distance</option>
                  <option value="3">Within 3 km</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                </select>
              </div>
            </div>

            {/* Checkbox Options Row */}
            <div className="filter-checkboxes-row">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyKidsSafe}
                  onChange={(e) => setOnlyKidsSafe(e.target.checked)}
                />
                👶 Good with Children
              </label>

              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyPetsSafe}
                  onChange={(e) => setOnlyPetsSafe(e.target.checked)}
                />
                🐕 Good with Other Pets
              </label>

              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyVaccinated}
                  onChange={(e) => setOnlyVaccinated(e.target.checked)}
                />
                💉 Fully Vaccinated
              </label>

              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyFreeFee}
                  onChange={(e) => setOnlyFreeFee(e.target.checked)}
                />
                🎁 Free / Sponsored Adoption
              </label>

              <div className="filter-reset-action">
                <button
                  className="btn-clear-all-filters"
                  onClick={resetAllFilters}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          TOOLBAR: RESULTS COUNT, SORT, VIEW MODE TOGGLE
          ========================================================================= */}
      <section className="pets-toolbar-row">
        <div className="pets-results-count">
          Showing <b>{sortedPets.length}</b> of {pets.length} companion{pets.length === 1 ? "" : "s"}
          {searchQuery && <span> matching "<b>{searchQuery}</b>"</span>}
        </div>

        <div className="pets-toolbar-right">
          {/* Sort By Dropdown */}
          <div className="sort-select-wrap">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Featured / Recommended</option>
              <option value="age_asc">Age: Youngest First</option>
              <option value="age_desc">Age: Oldest First</option>
              <option value="distance">Nearest Distance</option>
              <option value="name">Name (A – Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle-wrap">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              ⊞ Grid
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="Detailed List View"
            >
              ☰ List
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN PETS PRESENTATION (GRID OR LIST)
          ========================================================================= */}
      {sortedPets.length === 0 ? (
        /* Empty State */
        <div className="pets-empty-state">
          <span className="empty-icon">🐾🔍</span>
          <h3>No furry companions found</h3>
          <p>
            We couldn't find any pets matching your current filters. Try relaxing your search terms or resetting filters.
          </p>
          <button className="btn btn-primary" onClick={resetAllFilters}>
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="pets-grid-view">
          {sortedPets.map((pet) => {
            const isWishlisted = wishlist.includes(pet.id);
            const isComparing = compareList.includes(pet.id);
            const matchScore = hasCalculatedMatches ? getPetMatchScore(pet) : 0;

            return (
              <article
                key={pet.id}
                className="pet-card-enhanced"
                onClick={() => handleOpenDetail(pet)}
              >
                {/* Photo & Top Overlay Badges */}
                <div className="pet-card-img-wrap">
                  <span className="pet-species-pill">
                    {pet.category === "Dog" ? "🐕" : pet.category === "Cat" ? "🐈" : "🐰"} {pet.category}
                  </span>

                  {hasCalculatedMatches ? (
                    <span className="pet-status-pill match-score">
                      🎯 {matchScore}% Match
                    </span>
                  ) : (
                    pet.badge && (
                      <span className={`pet-status-pill ${pet.badge.includes("Urgent") ? "urgent" : ""}`}>
                        {pet.badge}
                      </span>
                    )
                  )}

                  {/* Top Right Quick Actions */}
                  <div className="pet-card-top-actions">
                    <button
                      type="button"
                      className={`pet-icon-btn ${isWishlisted ? "wishlisted" : ""}`}
                      onClick={(e) => toggleWishlist(pet, e)}
                      title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                      aria-label="Save to wishlist"
                    >
                      {isWishlisted ? "❤️" : "🤍"}
                    </button>

                    <button
                      type="button"
                      className="pet-icon-btn"
                      onClick={(e) => handleSharePet(pet, e)}
                      title="Share pet profile"
                      aria-label="Share"
                    >
                      🔗
                    </button>
                  </div>

                  <img src={pet.img} alt={pet.name} loading="lazy" />
                </div>

                {/* Card Body */}
                <div className="pet-card-body-enhanced">
                  <div className="pet-card-title-row">
                    <h3>
                      {pet.name}
                      <span className={`pet-gender-sym ${pet.gender === "Male" ? "male" : "female"}`}>
                        {pet.gender === "Male" ? "♂" : "♀"}
                      </span>
                    </h3>

                    <span className="pet-fee-badge">
                      {pet.adoptionFee || "Free Adoption"}
                    </span>
                  </div>

                  <p className="pet-card-meta">
                    {pet.breed} · {pet.age}
                  </p>

                  <p className="pet-card-location">
                    📍 {pet.distanceKm} km away · {pet.shelter}
                  </p>

                  <p className="pet-card-desc-short">
                    {pet.desc}
                  </p>

                  {/* Tags Cloud */}
                  <div className="pet-tags-cloud">
                    {pet.personality?.slice(0, 2).map((t, i) => (
                      <span key={i} className="trait-chip">✨ {t}</span>
                    ))}
                    {pet.health?.vaccinated && (
                      <span className="health-micro-tag">✓ Vaccinated</span>
                    )}
                    {pet.health?.neutered && (
                      <span className="health-micro-tag">✓ Neutered</span>
                    )}
                  </div>

                  {/* Bottom Actions Bar */}
                  <div className="pet-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-card-meet"
                      onClick={() => handleOpenDetail(pet)}
                    >
                      Meet {pet.name} →
                    </button>

                    <button
                      type="button"
                      className="btn-card-schedule"
                      onClick={(e) => handleOpenMeet(pet, e)}
                      title="Schedule in-person or video visit"
                    >
                      🤝 Visit
                    </button>

                    <button
                      type="button"
                      className={`btn-card-compare ${isComparing ? "active" : ""}`}
                      onClick={(e) => toggleCompare(pet, e)}
                      title="Add to side-by-side comparison"
                    >
                      {isComparing ? "✓" : "+"} Compare
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* DETAILED LIST VIEW */
        <div className="pets-list-view">
          {sortedPets.map((pet) => {
            const isWishlisted = wishlist.includes(pet.id);
            const isComparing = compareList.includes(pet.id);
            const matchScore = hasCalculatedMatches ? getPetMatchScore(pet) : 0;

            return (
              <article
                key={pet.id}
                className="pet-card-list-view"
                onClick={() => handleOpenDetail(pet)}
              >
                <div className="pet-list-img-wrap">
                  <span className="pet-species-pill">
                    {pet.category === "Dog" ? "🐕" : pet.category === "Cat" ? "🐈" : "🐰"} {pet.category}
                  </span>
                  <img src={pet.img} alt={pet.name} loading="lazy" />
                </div>

                <div className="pet-list-content">
                  <div className="pet-list-header">
                    <div>
                      <h3>
                        {pet.name}
                        <span className={`pet-gender-sym ${pet.gender === "Male" ? "male" : "female"}`}>
                          {pet.gender === "Male" ? "♂" : "♀"}
                        </span>
                      </h3>
                      <p className="pet-card-meta">
                        {pet.breed} · {pet.age} · {pet.size} Size · {pet.energyLevel} Energy
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {hasCalculatedMatches && (
                        <span className="pet-status-pill match-score" style={{ position: "static" }}>
                          🎯 {matchScore}% Match
                        </span>
                      )}
                      <span className="pet-fee-badge">
                        {pet.adoptionFee || "Free Adoption"}
                      </span>
                      <button
                        type="button"
                        className={`pet-icon-btn ${isWishlisted ? "wishlisted" : ""}`}
                        style={{ position: "static" }}
                        onClick={(e) => toggleWishlist(pet, e)}
                        title="Wishlist"
                      >
                        {isWishlisted ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>

                  <p className="pet-card-location">
                    📍 {pet.distanceKm} km away · {pet.shelter} ({pet.cityArea})
                  </p>

                  <p className="pet-card-desc-short" style={{ WebkitLineClamp: 3 }}>
                    {pet.longStory || pet.desc}
                  </p>

                  <div className="pet-tags-cloud">
                    {pet.personality?.map((t, i) => (
                      <span key={i} className="trait-chip">✨ {t}</span>
                    ))}
                    {pet.goodWith?.kids && <span className="trait-chip">👶 Good with Kids</span>}
                    {pet.goodWith?.dogs && <span className="trait-chip">🐕 Dog Friendly</span>}
                    {pet.health?.vaccinated && <span className="health-micro-tag">✓ Vaccinated</span>}
                    {pet.health?.neutered && <span className="health-micro-tag">✓ Spayed / Neutered</span>}
                    {pet.health?.microchipped && <span className="health-micro-tag">✓ Microchipped</span>}
                  </div>

                  <div className="pet-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-card-meet"
                      onClick={() => handleOpenDetail(pet)}
                    >
                      View Full Profile & Adoption Steps →
                    </button>

                    <button
                      type="button"
                      className="btn-card-schedule"
                      onClick={(e) => handleOpenMeet(pet, e)}
                    >
                      🤝 Schedule Meet & Greet
                    </button>

                    <button
                      type="button"
                      className={`btn-card-compare ${isComparing ? "active" : ""}`}
                      onClick={(e) => toggleCompare(pet, e)}
                    >
                      {isComparing ? "✓ In Comparison" : "+ Compare"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          FLOATING COMPARISON DOCK
          ========================================================================= */}
      {compareList.length > 0 && (
        <div className="compare-floating-dock">
          <div className="compare-dock-avatars">
            {compareList.map((id) => {
              const p = pets.find((item) => item.id === id);
              if (!p) return null;
              return (
                <img
                  key={id}
                  src={p.img}
                  alt={p.name}
                  className="compare-mini-thumb"
                  title={p.name}
                />
              );
            })}
          </div>

          <span className="compare-dock-title">
            Comparing {compareList.length} Companion{compareList.length > 1 ? "s" : ""}
          </span>

          <button
            className="btn-open-compare"
            onClick={() => setShowCompareModal(true)}
          >
            Compare Side-by-Side ⚖️
          </button>

          <button
            className="btn-clear-compare"
            onClick={() => setCompareList([])}
          >
            Clear
          </button>
        </div>
      )}

      {/* =========================================================================
          COMPARISON MODAL (SIDE BY SIDE TABLE)
          ========================================================================= */}
      {showCompareModal && (
        <div className="modal open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setShowCompareModal(false)} />
          <div className="modal-dialog compare-modal-dialog">
            <button
              className="modal-close"
              onClick={() => setShowCompareModal(false)}
            >
              ×
            </button>

            <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 8px', color: 'var(--forest-dark)' }}>
              ⚖️ Side-by-Side Comparison
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 16px' }}>
              Compare characteristics, energy requirements, and shelter distances to find your ideal match.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table className="compare-table">
                <tbody>
                  <tr>
                    <th>Companion</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return (
                        <td key={id} style={{ textAlign: "center" }}>
                          <img src={p.img} alt={p.name} />
                          <h4 style={{ margin: "4px 0", fontSize: "1.2rem", color: "var(--forest-dark)" }}>{p.name}</h4>
                          <span style={{ fontSize: "0.8rem", color: "#888" }}>{p.category} · {p.breed}</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <th>Age & Gender</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return <td key={id}>{p.age} · {p.gender}</td>;
                    })}
                  </tr>
                  <tr>
                    <th>Size & Weight</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return <td key={id}>{p.size} Size</td>;
                    })}
                  </tr>
                  <tr>
                    <th>Energy Level</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return <td key={id}>⚡ {p.energyLevel}</td>;
                    })}
                  </tr>
                  <tr>
                    <th>Good With Kids</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return <td key={id}>{p.goodWith?.kids ? "✅ Yes, great with kids" : "⚠️ Adults / quiet preferred"}</td>;
                    })}
                  </tr>
                  <tr>
                    <th>Good With Other Pets</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return <td key={id}>{p.goodWith?.dogs || p.goodWith?.cats ? "✅ Friendly with other animals" : "⚠️ Needs to be the only pet"}</td>;
                    })}
                  </tr>
                  <tr>
                    <th>Health & Vet Check</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return <td key={id}>{p.health?.vaccinated ? "💉 Vaccinated & Vet-Cleared" : "🩺 In veterinary check"}</td>;
                    })}
                  </tr>
                  <tr>
                    <th>Shelter Distance</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return <td key={id}>📍 {p.distanceKm} km ({p.shelter})</td>;
                    })}
                  </tr>
                  <tr>
                    <th>Adoption Fee</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return <td key={id} style={{ fontWeight: "700", color: "#27ae60" }}>{p.adoptionFee}</td>;
                    })}
                  </tr>
                  <tr>
                    <th>Next Step</th>
                    {compareList.map((id) => {
                      const p = pets.find((item) => item.id === id);
                      return (
                        <td key={id} style={{ textAlign: "center" }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ width: "100%", padding: "8px 12px", fontSize: "0.85rem" }}
                            onClick={() => {
                              setShowCompareModal(false);
                              handleOpenDetail(p);
                            }}
                          >
                            Adopt {p.name}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ENHANCED PET DETAILS PROFILE MODAL
          ========================================================================= */}
      {selectedPetForDetail && (
        <div className="modal open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={handleCloseDetail} />
          <div className="enhanced-pet-modal-dialog">
            <button
              className="modal-close"
              onClick={handleCloseDetail}
              style={{ zIndex: 10, background: "rgba(0,0,0,0.5)", color: "#fff" }}
            >
              ×
            </button>

            {/* Header Image with Overlay */}
            <div className="enhanced-modal-header">
              <img src={selectedPetForDetail.img} alt={selectedPetForDetail.name} />
              <div className="enhanced-modal-header-gradient" />

              <div className="enhanced-modal-top-badges">
                <span className="pet-species-pill">
                  {selectedPetForDetail.category === "Dog" ? "🐕" : selectedPetForDetail.category === "Cat" ? "🐈" : "🐰"} {selectedPetForDetail.category}
                </span>
                {selectedPetForDetail.badge && (
                  <span className="pet-status-pill">{selectedPetForDetail.badge}</span>
                )}
              </div>

              <div className="enhanced-modal-header-info">
                <h2>{selectedPetForDetail.name}</h2>
                <p className="enhanced-modal-meta-line">
                  {selectedPetForDetail.breed} · {selectedPetForDetail.age} · {selectedPetForDetail.gender} · {selectedPetForDetail.cityArea}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="enhanced-modal-body-scroll">
              {/* Quick Facts Grid */}
              <div className="enhanced-facts-grid">
                <div className="fact-item">
                  <span>Age Group</span>
                  <span>{selectedPetForDetail.ageGroup || "Young"}</span>
                </div>
                <div className="fact-item">
                  <span>Size & Build</span>
                  <span>{selectedPetForDetail.size}</span>
                </div>
                <div className="fact-item">
                  <span>Energy Level</span>
                  <span>{selectedPetForDetail.energyLevel}</span>
                </div>
                <div className="fact-item">
                  <span>Shelter Distance</span>
                  <span>{selectedPetForDetail.distanceKm} km</span>
                </div>
              </div>

              {/* Personality Traits Cloud */}
              <div style={{ marginBottom: "20px" }}>
                <h4 className="enhanced-section-title">✨ Personality & Traits</h4>
                <div className="pet-tags-cloud">
                  {selectedPetForDetail.personality?.map((t, idx) => (
                    <span key={idx} className="trait-chip" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
                      ✨ {t}
                    </span>
                  ))}
                  {selectedPetForDetail.tags?.map((t, idx) => (
                    <span key={`tag-${idx}`} className="trait-chip" style={{ background: "#EAE3D5", fontSize: "0.85rem", padding: "6px 12px" }}>
                      🏷️ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backstory */}
              <div>
                <h4 className="enhanced-section-title">📖 Rescue Story & About {selectedPetForDetail.name}</h4>
                <p className="enhanced-story-p">
                  {selectedPetForDetail.longStory || selectedPetForDetail.desc}
                </p>
              </div>

              {/* Health & Veterinary Passport */}
              <div>
                <h4 className="enhanced-section-title">🩺 Health & Veterinary Record</h4>
                <div className="health-checklist-grid">
                  <div className="health-check-card">
                    <span>✅</span>
                    <span>Core Vaccinations Up to Date</span>
                  </div>
                  <div className="health-check-card">
                    <span>✅</span>
                    <span>{selectedPetForDetail.health?.neutered ? "Spayed / Neutered" : "Pre-Adoption Spay Voucher Included"}</span>
                  </div>
                  <div className="health-check-card">
                    <span>✅</span>
                    <span>Dewormed & Parasite Checked</span>
                  </div>
                  <div className="health-check-card">
                    <span>✅</span>
                    <span>Microchip ID Registered</span>
                  </div>
                </div>
              </div>

              {/* Adoption Package Notice */}
              <div style={{ background: "#FFF9F4", border: "1.5px solid #FADBC8", borderRadius: "16px", padding: "16px 20px", marginBottom: "10px" }}>
                <h5 style={{ margin: "0 0 6px", color: "var(--apricot-dark)", fontSize: "0.95rem" }}>
                  🎁 Free FureverCare Adoption Welcome Kit
                </h5>
                <p style={{ margin: 0, fontSize: "0.86rem", color: "#666" }}>
                  Adopting {selectedPetForDetail.name} includes free 30-day health helpline access, initial supply of premium starter food, collar & ID tag, and complete transfer of medical history.
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="enhanced-modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                style={{ borderRadius: "999px", padding: "10px 18px", fontSize: "0.88rem" }}
                onClick={() => {
                  handleCloseDetail();
                  handleOpenMeet(selectedPetForDetail);
                }}
              >
                🤝 Schedule Visit
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                {openChatbot && (
                  <button
                    type="button"
                    className="btn"
                    style={{ background: "#E8F0EC", color: "var(--forest)", border: "none", borderRadius: "999px", padding: "10px 18px", fontSize: "0.88rem", fontWeight: "700" }}
                    onClick={() => {
                      handleCloseDetail();
                      openChatbot(`I'm interested in adopting ${selectedPetForDetail.name} (${selectedPetForDetail.breed}). Can you guide me through what they need?`);
                    }}
                  >
                    💬 Ask PawPal AI
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ borderRadius: "999px", padding: "10px 24px", fontSize: "0.92rem", fontWeight: "700" }}
                  onClick={(e) => {
                    handleCloseDetail();
                    handleOpenAdoptionApp(selectedPetForDetail, e);
                  }}
                >
                  Apply to Adopt {selectedPetForDetail.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADOPTION APPLICATION MODAL
          ========================================================================= */}
      {petForAdoptionApp && (
        <div className="modal open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={handleCloseAdoptionApp} />
          <div className="adoption-app-dialog">
            <button
              className="modal-close"
              onClick={handleCloseAdoptionApp}
            >
              ×
            </button>

            {!adoptionSubmitted ? (
              <form onSubmit={handleAppFormSubmit}>
                <h2>Adoption Application for {petForAdoptionApp.name}</h2>
                <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 20px" }}>
                  Please share a few details to get your adoption process underway with {petForAdoptionApp.shelter}.
                </p>

                <div className="adoption-form-field">
                  <label>Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={appFormData.fullName}
                    onChange={(e) => setAppFormData({ ...appFormData, fullName: e.target.value })}
                  />
                </div>

                <div className="adoption-form-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={appFormData.email}
                    onChange={(e) => setAppFormData({ ...appFormData, email: e.target.value })}
                  />
                </div>

                <div className="adoption-form-field">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={appFormData.phone}
                    onChange={(e) => setAppFormData({ ...appFormData, phone: e.target.value })}
                  />
                </div>

                <div className="adoption-form-field">
                  <label>Housing Type</label>
                  <select
                    value={appFormData.housing}
                    onChange={(e) => setAppFormData({ ...appFormData, housing: e.target.value })}
                  >
                    <option value="own">Own Independent House / Villa</option>
                    <option value="apartment">Apartment (Pets Allowed by HOA)</option>
                    <option value="rent">Rented House (Landlord Permission Granted)</option>
                  </select>
                </div>

                <div className="adoption-form-field">
                  <label>Experience with Pets</label>
                  <select
                    value={appFormData.experience}
                    onChange={(e) => setAppFormData({ ...appFormData, experience: e.target.value })}
                  >
                    <option value="experienced">Experienced Pet Parent</option>
                    <option value="first_time">First-time Pet Parent (Eager to learn!)</option>
                    <option value="current_owner">Currently have other pets</option>
                  </select>
                </div>

                <div className="adoption-form-field">
                  <label>Message or Special Questions</label>
                  <textarea
                    rows="3"
                    placeholder="Tell us about your home schedule, daily routine, or any questions..."
                    value={appFormData.notes}
                    onChange={(e) => setAppFormData({ ...appFormData, notes: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCloseAdoptionApp}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            ) : (
              <div className="app-success-card">
                <span className="app-success-icon">🎉🐾</span>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--forest-dark)", margin: "0 0 8px" }}>
                  Application Received!
                </h3>
                <p style={{ color: "#666", fontSize: "0.92rem", margin: "0 0 12px" }}>
                  Thank you for opening your heart to <b>{petForAdoptionApp.name}</b>. The team at {petForAdoptionApp.shelter} will review your application and reach out within 24 business hours.
                </p>

                <div className="app-ref-pill">
                  Reference Code: {adoptionAppRef}
                </div>

                <div style={{ marginTop: "20px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleCloseAdoptionApp}
                  >
                    Back to Pet Directory
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SCHEDULE MEET & GREET MODAL
          ========================================================================= */}
      {selectedPetForMeet && (
        <MeetGreetModal
          pet={selectedPetForMeet}
          onClose={handleCloseMeet}
          onBooked={(booking) => {
            if (showToast) {
              showToast(`🤝 Visit scheduled with ${booking.petName} on ${booking.visitDate}!`);
            }
          }}
        />
      )}

    </div>
  );
}

export default PetsPage;