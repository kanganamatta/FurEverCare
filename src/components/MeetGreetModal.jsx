import { useState } from "react";

const TIME_SLOTS = [
  { id: "slot-1", label: "10:30 AM – Morning Playtime", period: "Morning" },
  { id: "slot-2", label: "02:30 PM – Afternoon Stroll", period: "Afternoon" },
  { id: "slot-3", label: "05:00 PM – Evening Cuddle & Walk", period: "Evening" }
];

function MeetGreetModal({ pet, onClose, onBooked }) {
  const [meetingMode, setMeetingMode] = useState("shelter"); // shelter | foster | video
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0].id);
  const [visitDate, setVisitDate] = useState(() => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split("T")[0];
  });
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [hasPetsAtHome, setHasPetsAtHome] = useState("no");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);
  const [errors, setErrors] = useState({});

  if (!pet) return null;

  const validate = () => {
    const errs = {};
    if (!visitorName.trim()) errs.visitorName = "Please enter your full name";
    if (!visitorPhone.trim()) {
      errs.visitorPhone = "Please enter your phone number";
    } else if (!/^[0-9+ -]{7,15}$/.test(visitorPhone.trim())) {
      errs.visitorPhone = "Please enter a valid 10-digit number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const bookingId = `MG-${pet.name.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const slotObj = TIME_SLOTS.find((s) => s.id === selectedSlot);

      const bookingData = {
        bookingId,
        petId: pet.id,
        petName: pet.name,
        petBreed: pet.breed,
        petImg: pet.img,
        shelter: pet.shelter || "Central Paws Shelter",
        cityArea: pet.cityArea || "Central Sector",
        distanceKm: pet.distanceKm || 2.0,
        meetingMode:
          meetingMode === "shelter"
            ? "Shelter Visit"
            : meetingMode === "foster"
            ? "Foster Home Visit"
            : "Virtual Video Meet",
        visitDate,
        timeSlot: slotObj?.label || "10:30 AM",
        visitorName: visitorName.trim(),
        visitorPhone: visitorPhone.trim(),
        hasPetsAtHome,
        notes: notes.trim(),
        status: "Confirmed",
        bookedAt: new Date().toISOString()
      };

      // Save to localStorage
      try {
        const saved = JSON.parse(
          localStorage.getItem("furevercare_meet_greets") || "[]"
        );
        localStorage.setItem(
          "furevercare_meet_greets",
          JSON.stringify([bookingData, ...saved])
        );
      } catch (err) {
        console.error("Failed saving meet and greet", err);
      }

      setIsSubmitting(false);
      setConfirmedPass(bookingData);
      if (onBooked) {
        onBooked(bookingData);
      }
    }, 600);
  };

  return (
    <div className="modal open" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="meet-greet-dialog">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {!confirmedPass ? (
          <div className="meet-greet-content">
            {/* Modal Header with Pet Snapshot */}
            <div className="meet-pet-snapshot">
              <img src={pet.img} alt={pet.name} className="meet-pet-thumb" />
              <div className="meet-pet-meta">
                <span className="meet-tag-pill">🤝 Meet & Greet Booking</span>
                <h2>Spend Time with {pet.name}</h2>
                <p>
                  {pet.breed} · {pet.age} · 📍 <strong>{pet.shelter}</strong> ({pet.distanceKm} km away)
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="meet-greet-form">
              {/* Meeting Mode Selector */}
              <div className="meet-form-section">
                <label className="meet-section-title">
                  1. Choose How You Would Like to Meet
                </label>
                <div className="meeting-mode-grid">
                  <div
                    className={`mode-card ${meetingMode === "shelter" ? "selected" : ""}`}
                    onClick={() => setMeetingMode("shelter")}
                  >
                    <span className="mode-icon">🏢</span>
                    <strong>Shelter Visit</strong>
                    <p>Play with {pet.name} in the shelter private garden.</p>
                  </div>

                  <div
                    className={`mode-card ${meetingMode === "foster" ? "selected" : ""}`}
                    onClick={() => setMeetingMode("foster")}
                  >
                    <span className="mode-icon">🏡</span>
                    <strong>Foster Home</strong>
                    <p>Meet in a relaxed home setting with the foster parent.</p>
                  </div>

                  <div
                    className={`mode-card ${meetingMode === "video" ? "selected" : ""}`}
                    onClick={() => setMeetingMode("video")}
                  >
                    <span className="mode-icon">📹</span>
                    <strong>Virtual Video Call</strong>
                    <p>15-minute live interactive call via WhatsApp/Google Meet.</p>
                  </div>
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="meet-form-section">
                <label className="meet-section-title">
                  2. Select Date & Preferred Time Slot
                </label>
                <div className="date-slot-row">
                  <div className="date-input-wrap">
                    <label className="sub-field-label">Date of Visit</label>
                    <input
                      type="date"
                      value={visitDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="meet-input"
                      required
                    />
                  </div>

                  <div className="slots-container">
                    <label className="sub-field-label">Available Time Slots</label>
                    <div className="time-slots-list">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          className={`time-slot-btn ${selectedSlot === slot.id ? "active" : ""}`}
                          onClick={() => setSelectedSlot(slot.id)}
                        >
                          {selectedSlot === slot.id ? "✓ " : ""}
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visitor Details */}
              <div className="meet-form-section">
                <label className="meet-section-title">
                  3. Your Contact Details
                </label>

                <div className="form-inline-grid">
                  <div>
                    <label className="sub-field-label">Your Full Name *</label>
                    <input
                      type="text"
                      className={`meet-input ${errors.visitorName ? "has-error" : ""}`}
                      placeholder="e.g., Anjali Sharma"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                    />
                    {errors.visitorName && (
                      <span className="error-hint">{errors.visitorName}</span>
                    )}
                  </div>

                  <div>
                    <label className="sub-field-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`meet-input ${errors.visitorPhone ? "has-error" : ""}`}
                      placeholder="+91 98765 43210"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                    />
                    {errors.visitorPhone && (
                      <span className="error-hint">{errors.visitorPhone}</span>
                    )}
                  </div>
                </div>

                <div className="pet-experience-row">
                  <label className="sub-field-label">
                    Do you currently have any pets at home?
                  </label>
                  <div className="segmented-control">
                    <button
                      type="button"
                      className={hasPetsAtHome === "no" ? "active" : ""}
                      onClick={() => setHasPetsAtHome("no")}
                    >
                      No, this will be my first
                    </button>
                    <button
                      type="button"
                      className={hasPetsAtHome === "yes" ? "active" : ""}
                      onClick={() => setHasPetsAtHome("yes")}
                    >
                      Yes, already have pets
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <label className="sub-field-label">Questions or notes for shelter caretaker (Optional)</label>
                  <input
                    type="text"
                    className="meet-input"
                    placeholder="e.g., Bringing family with kids, want to test compatibility with my dog"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="meet-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="order-spinner" /> Scheduling Meet & Greet...
                  </>
                ) : (
                  <>
                    <span>🤝 Confirm Meet & Greet with {pet.name}</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Pass Screen */
          <div className="meet-confirmation-pass">
            <div className="pass-checkmark">✓</div>
            <span className="pass-status-pill">Meet & Greet Scheduled</span>
            <h2>You're Meeting {confirmedPass.petName}!</h2>
            <p className="pass-subtext">
              We've reserved your slot with the shelter care team. A confirmation SMS will be sent to <strong>{confirmedPass.visitorPhone}</strong>.
            </p>

            <div className="boarding-pass-card">
              <div className="pass-card-top">
                <div className="pass-pet-info">
                  <img
                    src={confirmedPass.petImg}
                    alt={confirmedPass.petName}
                    className="pass-pet-img"
                  />
                  <div>
                    <span className="pass-micro-label">PET TO MEET</span>
                    <h3>{confirmedPass.petName}</h3>
                    <p>{confirmedPass.petBreed}</p>
                  </div>
                </div>
                <div className="pass-ref-col">
                  <span className="pass-micro-label">PASS REF</span>
                  <strong className="pass-ref-code">{confirmedPass.bookingId}</strong>
                </div>
              </div>

              <div className="pass-card-grid">
                <div>
                  <span className="pass-micro-label">MEETING MODE</span>
                  <strong>{confirmedPass.meetingMode}</strong>
                </div>
                <div>
                  <span className="pass-micro-label">DATE & TIME</span>
                  <strong>
                    {confirmedPass.visitDate} @ {confirmedPass.timeSlot}
                  </strong>
                </div>
                <div>
                  <span className="pass-micro-label">SHELTER LOCATION</span>
                  <strong>
                    {confirmedPass.shelter} ({confirmedPass.distanceKm} km away)
                  </strong>
                </div>
                <div>
                  <span className="pass-micro-label">VISITOR</span>
                  <strong>{confirmedPass.visitorName}</strong>
                </div>
              </div>

              <div className="pass-shelter-note">
                <span>📍</span>
                <div>
                  <strong>Shelter Address & Directions:</strong>
                  <p>
                    {confirmedPass.shelter}, {confirmedPass.cityArea}. Staff Caretaker: Dr. Ananya / Amit (+91 12345 67890).
                  </p>
                </div>
              </div>
            </div>

            <div className="pass-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Done & View Wishlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetGreetModal;
