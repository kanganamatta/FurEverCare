import { useState } from "react";

const SERVICE_CONFIG = {
  "Emergency care": {
    badge: "24/7 Emergency",
    packages: [
      {
        id: "emergency-ambulance",
        name: "Critical Ambulance Dispatch",
        desc: "Equipped animal ambulance with oxygen, stretcher, and emergency paramedic.",
        price: 0,
        subsidyText: "100% Free for Strays / Rescues (NGO Covered)"
      },
      {
        id: "emergency-mobile-triage",
        name: "On-Site First Aid & Triage Van",
        desc: "Rapid response van for on-the-spot wound dressing, pain relief, and stabilization.",
        price: 0,
        subsidyText: "Free Community Service"
      },
      {
        id: "emergency-vet-hospital",
        name: "Emergency Clinic Admission Request",
        desc: "Immediate priority admission slot reserved at our partner veterinary trauma center.",
        price: 350,
        subsidyText: "Subsidized Clinic Rate"
      }
    ]
  },
  "Vaccination drives": {
    badge: "Preventive Care",
    packages: [
      {
        id: "vac-rabies",
        name: "Anti-Rabies Drive Token",
        desc: "Single dose certified anti-rabies vaccination with official certificate & collar tag.",
        price: 0,
        subsidyText: "100% Free Drive"
      },
      {
        id: "vac-combo",
        name: "Mega-Vac 9-in-1 / DHPPiL Dose",
        desc: "Protection against Parvovirus, Distemper, Hepatitis, Leptospirosis & Parainfluenza.",
        price: 450,
        subsidyText: "Subsidized Cost Price"
      },
      {
        id: "vac-home-drive",
        name: "Home Vaccination Visit for Street Pack",
        desc: "Mobile vet team visits your neighborhood/colony to vaccinate multiple strays at once.",
        price: 0,
        subsidyText: "Free Community Drive"
      }
    ]
  },
  "Surgery fund": {
    badge: "Life-Saving Aid",
    packages: [
      {
        id: "surg-grant-apply",
        name: "Apply for 100% Surgery Grant",
        desc: "Financial aid for critically injured strays or low-income pet parents (Subject to vet review).",
        price: 0,
        subsidyText: "100% Covered by FureverCare Fund"
      },
      {
        id: "surg-sterilization",
        name: "ABC Spay / Neuter Surgery Slot",
        desc: "Animal Birth Control safe surgery, post-op recovery care, and anti-rabies shot included.",
        price: 600,
        subsidyText: "50% Subsidized by Trust"
      },
      {
        id: "surg-sponsor",
        name: "Sponsor a Stray's Surgery",
        desc: "Directly fund orthopedic, trauma, or tumor surgery for an animal currently under rescue.",
        price: 1500,
        subsidyText: "Direct Donor Contribution (Tax Deductible)"
      }
    ]
  },
  "Foster recovery": {
    badge: "Healing Homes",
    packages: [
      {
        id: "foster-short",
        name: "3-Day Post-Op Recovery Stay",
        desc: "Quiet convalescent foster home with daily wound cleaning and medication administration.",
        price: 0,
        subsidyText: "Free for Critical Rescues"
      },
      {
        id: "foster-medium",
        name: "7-Day Medicated Healing Boarding",
        desc: "Dedicated trained foster parent, customized recovery diet, and bi-weekly vet checkups.",
        price: 0,
        subsidyText: "Sponsored by Foster Network"
      },
      {
        id: "foster-long",
        name: "14-Day Intensive Rehab Stay",
        desc: "Full rehab care for amputees, fracture recoveries, or delicate post-trauma healing.",
        price: 700,
        subsidyText: "Nominal Food & Medical Supplies Fee"
      }
    ]
  }
};

const MEDICAL_ADDONS = [
  {
    id: "addon-firstaid",
    name: "Pet First-Aid Emergency Kit",
    desc: "Sterile gauze, povidone-iodine, cotton, bandage clips & saline.",
    price: 249
  },
  {
    id: "addon-antiseptic",
    name: "Antibiotic Healing Spray (100ml)",
    desc: "Quick-heal herbal antimicrobial spray safe for dogs and cats.",
    price: 129
  },
  {
    id: "addon-cone",
    name: "Post-Surgery Recovery E-Collar",
    desc: "Adjustable protective cone to prevent wound scratching and licking.",
    price: 189
  },
  {
    id: "addon-multivit",
    name: "Immunity Booster & Calcium Drops",
    desc: "Fast recovery dietary supplements recommended by vets.",
    price: 159
  }
];

function MedicalOrderModal({ service, onClose, onOrderPlaced }) {
  const serviceDetails = SERVICE_CONFIG[service?.title] || {
    badge: "Medical Service",
    packages: [
      {
        id: "default-pkg",
        name: service?.title || "Medical Aid Service",
        desc: service?.text || "Comprehensive animal healthcare and medical assistance.",
        price: 0,
        subsidyText: "Free / Subsidized"
      }
    ]
  };

  const [selectedPackageId, setSelectedPackageId] = useState(
    serviceDetails.packages[0]?.id || ""
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [animalType, setAnimalType] = useState("Dog");
  const [animalCategory, setAnimalCategory] = useState("stray");
  const [patientName, setPatientName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState(
    service?.title === "Emergency care" ? "Critical (Immediate Dispatch)" : "Standard"
  );
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  if (!service) return null;

  const currentPackage =
    serviceDetails.packages.find((p) => p.id === selectedPackageId) ||
    serviceDetails.packages[0];

  const handleToggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const item = MEDICAL_ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);

  const basePrice = currentPackage ? currentPackage.price : 0;
  const isStrayFree = animalCategory === "stray" && basePrice > 0;
  const discountAmount = isStrayFree ? basePrice : 0;
  const finalTotal = Math.max(0, basePrice - discountAmount) + addonsTotal;

  const validateForm = () => {
    const errors = {};
    if (!contactName.trim()) {
      errors.contactName = "Please enter your name";
    }
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Please enter a valid phone number";
    } else if (!/^[0-9+ -]{7,15}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = "Enter a valid 10-digit mobile number";
    }
    if (!address.trim()) {
      errors.address = "Please provide pickup/service address & landmark";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `FC-MED-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderData = {
        orderId,
        serviceTitle: service.title,
        serviceIcon: service.icon,
        packageName: currentPackage.name,
        animalType,
        animalCategory,
        patientName: patientName.trim() || (animalCategory === "stray" ? `Community ${animalType}` : `${animalType}`),
        contactName: contactName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        urgency,
        preferredDate: preferredDate || "Earliest Available",
        notes: notes.trim(),
        addons: selectedAddons.map((id) => MEDICAL_ADDONS.find((a) => a.id === id)),
        totalPrice: finalTotal,
        status: service.title === "Emergency care" ? "🚑 Dispatching Response Unit" : "✅ Confirmed & Assigned",
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem("furevercare_medical_orders") || "[]");
        localStorage.setItem("furevercare_medical_orders", JSON.stringify([orderData, ...saved]));
      } catch (err) {
        console.error("Failed to save order to localStorage:", err);
      }

      setIsSubmitting(false);
      setConfirmedOrder(orderData);
      if (onOrderPlaced) {
        onOrderPlaced(orderData);
      }
    }, 700);
  };

  return (
    <div className="modal open" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="medical-order-dialog">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {!confirmedOrder ? (
          <div className="medical-order-content">
            {/* Header */}
            <div className="medical-order-header">
              <div className="medical-order-badge">
                <span>{service.icon}</span> {serviceDetails.badge}
              </div>
              <h2>Order {service.title}</h2>
              <p>{service.text}</p>
            </div>

            <form onSubmit={handleSubmitOrder} className="medical-order-form">
              {/* Section 1: Service Package Selection */}
              <div className="order-field-group">
                <label className="order-group-title">
                  1. Select Service Package / Option
                </label>
                <div className="package-options-grid">
                  {serviceDetails.packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        className={`package-option-card ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedPackageId(pkg.id)}
                      >
                        <div className="package-option-top">
                          <input
                            type="radio"
                            name="servicePackage"
                            checked={isSelected}
                            onChange={() => setSelectedPackageId(pkg.id)}
                            id={`pkg-${pkg.id}`}
                          />
                          <span className="package-name">{pkg.name}</span>
                          <span className="package-price-tag">
                            {pkg.price === 0 ? "FREE" : `₹${pkg.price}`}
                          </span>
                        </div>
                        <p className="package-desc">{pkg.desc}</p>
                        <span className="package-subsidy-tag">
                          ✨ {pkg.subsidyText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Animal Details */}
              <div className="order-field-group">
                <label className="order-group-title">
                  2. Patient / Animal Details
                </label>
                <div className="form-inline-grid">
                  <div className="form-col">
                    <label className="sub-label">Animal Category</label>
                    <div className="segmented-control">
                      <button
                        type="button"
                        className={animalCategory === "stray" ? "active" : ""}
                        onClick={() => setAnimalCategory("stray")}
                      >
                        🐾 Stray / Community
                      </button>
                      <button
                        type="button"
                        className={animalCategory === "owned" ? "active" : ""}
                        onClick={() => setAnimalCategory("owned")}
                      >
                        🏠 Owned Pet
                      </button>
                    </div>
                  </div>

                  <div className="form-col">
                    <label className="sub-label">Species</label>
                    <select
                      value={animalType}
                      onChange={(e) => setAnimalType(e.target.value)}
                      className="order-input"
                    >
                      <option value="Dog">Dog (Canine)</option>
                      <option value="Cat">Cat (Feline)</option>
                      <option value="Puppy/Kitten">Puppy / Kitten</option>
                      <option value="Cow/Calf">Cow / Calf</option>
                      <option value="Bird">Bird</option>
                      <option value="Other">Other Animal</option>
                    </select>
                  </div>
                </div>

                <div className="form-inline-grid" style={{ marginTop: "12px" }}>
                  <div className="form-col">
                    <label className="sub-label">
                      Animal Name / Identification (Optional)
                    </label>
                    <input
                      type="text"
                      className="order-input"
                      placeholder="e.g., Bruno, Brown stray near park, etc."
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>
                  <div className="form-col">
                    <label className="sub-label">Urgency Level</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="order-input"
                    >
                      <option value="Critical (Immediate Dispatch)">
                        🚨 Critical (Immediate Dispatch)
                      </option>
                      <option value="Urgent (Within 1-2 Hours)">
                        ⚡ Urgent (Within 1-2 Hours)
                      </option>
                      <option value="Standard">
                        📅 Standard (Today / Scheduled)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Rescuer & Location Info */}
              <div className="order-field-group">
                <label className="order-group-title">
                  3. Contact & Location Details
                </label>
                <div className="form-inline-grid">
                  <div className="form-col">
                    <label className="sub-label">Your Name *</label>
                    <input
                      type="text"
                      className={`order-input ${formErrors.contactName ? "has-error" : ""}`}
                      placeholder="Enter your full name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                    {formErrors.contactName && (
                      <span className="error-text">{formErrors.contactName}</span>
                    )}
                  </div>

                  <div className="form-col">
                    <label className="sub-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`order-input ${formErrors.phoneNumber ? "has-error" : ""}`}
                      placeholder="+91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    {formErrors.phoneNumber && (
                      <span className="error-text">{formErrors.phoneNumber}</span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label className="sub-label">Address / Landmark for Dispatch or Pickup *</label>
                  <textarea
                    rows={2}
                    className={`order-input ${formErrors.address ? "has-error" : ""}`}
                    placeholder="Enter complete street address, nearby landmark, or GPS coordinates"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {formErrors.address && (
                    <span className="error-text">{formErrors.address}</span>
                  )}
                </div>

                <div className="form-inline-grid" style={{ marginTop: "12px" }}>
                  <div className="form-col">
                    <label className="sub-label">Preferred Date (Optional)</label>
                    <input
                      type="date"
                      className="order-input"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>
                  <div className="form-col">
                    <label className="sub-label">Additional Symptoms / Notes</label>
                    <input
                      type="text"
                      className="order-input"
                      placeholder="e.g., limp on left paw, not eating, fever"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Optional Medical Supplies Add-ons */}
              <div className="order-field-group">
                <label className="order-group-title">
                  4. Add-on Pet Medical Supplies & Kits (Optional)
                </label>
                <div className="addons-list">
                  {MEDICAL_ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        className={`addon-item ${isChecked ? "checked" : ""}`}
                        onClick={() => handleToggleAddon(addon.id)}
                      >
                        <div className="addon-left">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAddon(addon.id)}
                            id={`addon-${addon.id}`}
                          />
                          <div>
                            <strong>{addon.name}</strong>
                            <p>{addon.desc}</p>
                          </div>
                        </div>
                        <span className="addon-price">+₹{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Order Summary & Pricing */}
              <div className="order-summary-box">
                <div className="summary-row">
                  <span>Base Service Fee ({currentPackage?.name}):</span>
                  <span>{basePrice === 0 ? "₹0 (Free)" : `₹${basePrice}`}</span>
                </div>

                {isStrayFree && (
                  <div className="summary-row subsidy-row">
                    <span>🐾 FureverCare Stray Animal 100% Subsidy:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                {selectedAddons.length > 0 && (
                  <div className="summary-row">
                    <span>Medical Supplies Add-ons ({selectedAddons.length}):</span>
                    <span>+₹{addonsTotal}</span>
                  </div>
                )}

                <div className="summary-row total-row">
                  <div>
                    <strong>Total Amount:</strong>
                    <span className="total-hint">
                      {finalTotal === 0
                        ? "100% Free & Sponsored"
                        : "(Payable via Cash / UPI on arrival or online)"}
                    </span>
                  </div>
                  <strong className="total-value">
                    {finalTotal === 0 ? "₹0 (FREE)" : `₹${finalTotal}`}
                  </strong>
                </div>
              </div>

              {/* CTA Orange Button */}
              <button
                type="submit"
                className="medical-order-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="order-spinner" /> Processing Request...
                  </>
                ) : (
                  <>
                    <span>Confirm Order & Request Service</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Receipt View */
          <div className="medical-confirmed-view">
            <div className="confirmed-icon-circle">✓</div>
            <span className="confirmed-badge">Order Placed Successfully</span>
            <h2>Thank You for Reaching Out!</h2>
            <p className="confirmed-subtext">
              Your request for <strong>{confirmedOrder.serviceTitle}</strong> has been registered with priority tracking.
            </p>

            <div className="confirmed-receipt-card">
              <div className="receipt-header">
                <div>
                  <span className="receipt-label">ORDER ID</span>
                  <strong className="receipt-order-id">{confirmedOrder.orderId}</strong>
                </div>
                <span className="receipt-status-pill">
                  {confirmedOrder.status}
                </span>
              </div>

              <div className="receipt-grid">
                <div>
                  <span className="receipt-label">Selected Package</span>
                  <strong>{confirmedOrder.packageName}</strong>
                </div>
                <div>
                  <span className="receipt-label">Animal Patient</span>
                  <strong>
                    {confirmedOrder.patientName} ({confirmedOrder.animalType})
                  </strong>
                </div>
                <div>
                  <span className="receipt-label">Rescuer / Contact</span>
                  <strong>
                    {confirmedOrder.contactName} ({confirmedOrder.phoneNumber})
                  </strong>
                </div>
                <div>
                  <span className="receipt-label">Urgency & Timing</span>
                  <strong>{confirmedOrder.urgency}</strong>
                </div>
                <div className="receipt-full-col">
                  <span className="receipt-label">Dispatch / Service Address</span>
                  <strong>{confirmedOrder.address}</strong>
                </div>
                {confirmedOrder.addons.length > 0 && (
                  <div className="receipt-full-col">
                    <span className="receipt-label">Add-on Supplies</span>
                    <strong>
                      {confirmedOrder.addons.map((a) => a.name).join(", ")}
                    </strong>
                  </div>
                )}
                <div className="receipt-full-col receipt-total-row">
                  <span className="receipt-label">Final Amount</span>
                  <strong className="receipt-final-price">
                    {confirmedOrder.totalPrice === 0
                      ? "₹0 (Free & Subsidized)"
                      : `₹${confirmedOrder.totalPrice}`}
                  </strong>
                </div>
              </div>
            </div>

            <div className="confirmed-alert">
              <span>🚑</span>
              <div>
                <strong>Immediate Help Line Available:</strong>
                <p>
                  Our medical emergency desk has been notified. For real-time updates or priority ambulance guidance, call{" "}
                  <a href="tel:+911234567890">+91 12345 67890</a>.
                </p>
              </div>
            </div>

            <div className="confirmed-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
              >
                Done & Close
              </button>
              <button
                type="button"
                className="medical-order-submit-btn"
                style={{ width: "auto", margin: 0 }}
                onClick={() => {
                  setConfirmedOrder(null);
                  setSelectedAddons([]);
                  setNotes("");
                }}
              >
                Place Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalOrderModal;
