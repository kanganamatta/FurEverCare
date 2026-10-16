function PetModal({
  pet,
  onClose,
  isWishlisted = false,
  onToggleWishlist,
  onScheduleMeet
}) {
  if (!pet) {
    return null;
  }

  return (
    <div className="modal open" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal-dialog pet-modal-dialog">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="modal-image-wrap">
          <img src={pet.img} alt={pet.name} />

          {/* Wishlist Heart Button in Modal */}
          {onToggleWishlist && (
            <button
              type="button"
              className={`modal-wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(pet);
              }}
              title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          )}

          {/* Distance & Shelter Badge */}
          {pet.distanceKm && (
            <span className="modal-distance-badge">
              📍 {pet.distanceKm} km away · {pet.shelter}
            </span>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-title-row">
            <h2>{pet.name}</h2>
            <span className="modal-species-pill">{pet.species}</span>
          </div>

          <p className="modal-meta">
            {pet.breed} · {pet.age} · {pet.cityArea || "Central Area"}
          </p>

          {/* Personality Tags */}
          {pet.personality && pet.personality.length > 0 && (
            <div className="modal-traits-list">
              {pet.personality.map((trait, idx) => (
                <span key={idx} className="modal-trait-pill">
                  ✨ {trait}
                </span>
              ))}
            </div>
          )}

          <p className="modal-desc">{pet.desc}</p>

          <div className="modal-action-buttons">
            <button
              type="button"
              className="btn btn-outline modal-meet-btn"
              onClick={() => {
                if (onScheduleMeet) {
                  onScheduleMeet(pet);
                }
              }}
            >
              🤝 Schedule Meet & Greet
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              Start adopting {pet.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetModal;