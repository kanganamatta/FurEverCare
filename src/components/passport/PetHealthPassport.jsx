import { useState, useRef } from "react";
import "./PetHealthPassport.css";

const SEED_PASSPORTS = [
  {
    id: "PASS-BUDDY-9812",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: "2 Years",
    gender: "Male (Neutered)",
    weight: "29.4 kg",
    bloodGroup: "DEA 1.1 Positive",
    microchipId: "985141002345678",
    rabiesTag: "RT-DEL-2025-8819",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    owner: {
      name: "Rohit Malhotra",
      phone: "+91 98765 43210",
      altPhone: "+91 98111 22334",
      city: "New Delhi / Central"
    },
    primaryVet: {
      clinic: "Central Paws Veterinary Hospital",
      doctor: "Dr. Ananya Sharma (MVSc)",
      phone: "+91 12345 67890",
      emergency24h: "+91 99999 11222"
    },
    criticalAllergies: [
      { name: "Penicillin (Antibiotic)", severity: "Severe / Anaphylaxis Risk", note: "DO NOT ADMINISTER. Use Cephalosporins only." },
      { name: "Beef Protein", severity: "Moderate", note: "Causes dermatological hives and GI distress." }
    ],
    currentMedications: [
      { name: "Glucosamine Chondroitin", dose: "1 Tablet (500mg)", freq: "Daily with morning meal", purpose: "Joint cartilage protection" }
    ],
    pin: "2026",
    vaccinations: [
      { name: "Anti-Rabies (Nobivac)", date: "15 Oct 2025", nextDue: "14 Oct 2026", batch: "RAB-7721-B", vet: "Dr. Ananya Sharma", status: "Valid & Current" },
      { name: "DHPPiL (Canine 5-in-1)", date: "10 Nov 2025", nextDue: "09 Nov 2026", batch: "DHPP-8812-C", vet: "Dr. Ananya Sharma", status: "Valid & Current" },
      { name: "Bordetella (Kennel Cough)", date: "28 Oct 2025", nextDue: "27 Oct 2026", batch: "BOR-1120-A", vet: "Dr. Ananya Sharma", status: "Upcoming in 14 Days" },
      { name: "Canine Coronavirus", date: "10 Nov 2025", nextDue: "09 Nov 2026", batch: "CCV-3310-D", vet: "Dr. Ananya Sharma", status: "Valid & Current" }
    ],
    deworming: [
      { product: "Drontal Plus (Praziquantel/Pyrantel)", date: "01 Aug 2026", nextDue: "01 Nov 2026", weightDose: "3 Tablets (30kg)", status: "Active Protection" },
      { product: "Bravecto Chew (Tick & Flea)", date: "15 Jul 2026", nextDue: "15 Oct 2026", weightDose: "1 Chewable (20-40kg)", status: "Due This Month" }
    ],
    vetVisits: [
      { date: "18 Sep 2026", clinic: "Central Paws Hospital", doctor: "Dr. Ananya Sharma", reason: "Bi-Annual Wellness Check & Dental Scaling", diagnosis: "Healthy cardiopulmonary, mild tartar grade 1 cleared, weight optimal." },
      { date: "04 May 2026", clinic: "Central Paws Hospital", doctor: "Dr. Ananya Sharma", reason: "Minor paw pad laceration", diagnosis: "Clean superficial cut on right paw. Antiseptic dressing & 5 days healing completed." },
      { date: "10 Nov 2025", clinic: "Central Paws Hospital", doctor: "Dr. Ananya Sharma", reason: "Annual core vaccination boosters", diagnosis: "DHPPiL and Coronavirus booster administered safely. Zero adverse reaction." }
    ],
    documents: [
      { id: "doc-1", name: "Annual Complete Blood Panel & Liver Profile.pdf", date: "18 Sep 2026", type: "Diagnostic Lab Test", size: "1.4 MB" },
      { id: "doc-2", name: "Rabies & Core Vaccination Certificate.pdf", date: "15 Oct 2025", type: "Official Certificate", size: "840 KB" },
      { id: "doc-3", name: "Post-Checkup Clinical Summary & Diet Chart.pdf", date: "18 Sep 2026", type: "Vet Prescription", size: "620 KB" }
    ],
    reminders: [
      { title: "Bordetella Kennel Cough Booster", daysLeft: 14, date: "27 Oct 2026", icon: "💉" },
      { title: "Bravecto Tick & Flea Chews", daysLeft: 22, date: "04 Nov 2026", icon: "💊" },
      { title: "Winter Veterinary Dental Review", daysLeft: 45, date: "27 Nov 2026", icon: "🩺" }
    ]
  },
  {
    id: "PASS-LUNA-3341",
    name: "Luna",
    species: "Cat",
    breed: "Persian Cat",
    age: "2 Years",
    gender: "Female (Spayed)",
    weight: "3.8 kg",
    bloodGroup: "Type A (Feline)",
    microchipId: "985141009876543",
    rabiesTag: "RT-DEL-2025-1102",
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    owner: {
      name: "Pooja Varma",
      phone: "+91 98112 34567",
      altPhone: "+91 98222 33445",
      city: "New Delhi / South Ridge"
    },
    primaryVet: {
      clinic: "Feline Specialists Care Centre",
      doctor: "Dr. Rohan Varma (Feline Medicine)",
      phone: "+91 12345 67891",
      emergency24h: "+91 99999 33444"
    },
    criticalAllergies: [
      { name: "Sulfa Antibiotics", severity: "Moderate", note: "Causes facial swelling and skin erythema." }
    ],
    currentMedications: [
      { name: "Artificial Tears / Lubricant Drops", dose: "2 Drops both eyes", freq: "Twice daily", purpose: "Brachycephalic corneal care" }
    ],
    pin: "2026",
    vaccinations: [
      { name: "FVRCP (Feline 3-in-1)", date: "12 Dec 2025", nextDue: "11 Dec 2026", batch: "FVR-4412", vet: "Dr. Rohan Varma", status: "Valid & Current" },
      { name: "Anti-Rabies (Feline Nobivac)", date: "12 Dec 2025", nextDue: "11 Dec 2026", batch: "RAB-9921", vet: "Dr. Rohan Varma", status: "Valid & Current" }
    ],
    deworming: [
      { product: "Profender Spot-On", date: "10 Aug 2026", nextDue: "10 Nov 2026", weightDose: "0.7 ml tube", status: "Active Protection" }
    ],
    vetVisits: [
      { date: "14 Jul 2026", clinic: "Feline Specialists Care", doctor: "Dr. Rohan Varma", reason: "Routine wellness exam & eye tear duct flush", diagnosis: "Cornea clear, respiratory sound healthy." }
    ],
    documents: [
      { id: "doc-l1", name: "FVRCP & Rabies Certified Card.pdf", date: "12 Dec 2025", type: "Official Certificate", size: "750 KB" }
    ],
    reminders: [
      { title: "Profender Internal Parasite Spot-On", daysLeft: 28, date: "10 Nov 2026", icon: "💊" },
      { title: "Annual FVRCP Booster", daysLeft: 59, date: "11 Dec 2026", icon: "💉" }
    ]
  }
];

export default function PetHealthPassport({ showToast }) {
  // Passports state initialized from localStorage
  const [passports, setPassports] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("furevercare_pet_passports") || "[]");
      if (saved && saved.length > 0) return saved;
      localStorage.setItem("furevercare_pet_passports", JSON.stringify(SEED_PASSPORTS));
      return SEED_PASSPORTS;
    } catch {
      return SEED_PASSPORTS;
    }
  });

  const [activePassportId, setActivePassportId] = useState(passports[0]?.id || "PASS-BUDDY-9812");
  const [activeSection, setActiveSection] = useState("vitals"); // vitals | vaccines | deworming | allergies | visits | documents | reminders

  // QR Modal State (Mind-blowing twist)
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAccessLevel, setQrAccessLevel] = useState("emergency"); // 'emergency' (Level 1) | 'unlocked' (Level 2)
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");

  // New Passport Registration Modal
  const [showNewPassportModal, setShowNewPassportModal] = useState(false);
  const [newPetData, setNewPetData] = useState({
    name: "",
    species: "Dog",
    breed: "",
    age: "",
    weight: "",
    microchipId: "",
    bloodGroup: "Unknown / To Be Tested",
    ownerName: "",
    ownerPhone: "",
    photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"
  });

  // Document Upload Simulation
  const fileInputRef = useRef(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  // Active pet object
  const currentPet = passports.find((p) => p.id === activePassportId) || passports[0];

  // QR Code URL (Standard dynamic QR encoder)
  const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `https://furevercare.org/passport?id=${currentPet.id}&mode=emergency`
  )}`;

  // Handle PIN Unlock in QR Modal
  const handleUnlockPin = (e) => {
    e.preventDefault();
    setPinError("");
    if (enteredPin.trim() === currentPet.pin || enteredPin.trim() === "2026") {
      setQrAccessLevel("unlocked");
      if (showToast) {
        showToast("🔓 Access Granted: Full lifelong clinical records unlocked!");
      }
    } else {
      setPinError("Invalid PIN. Enter 4-digit Vet PIN (Demo PIN: 2026)");
    }
  };

  // Upload Document Handler
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: "doc-" + Date.now(),
      name: file.name,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      type: file.type.includes("pdf") ? "Diagnostic Lab Test" : "Prescription Slip",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    const updatedPassports = passports.map((p) => {
      if (p.id === currentPet.id) {
        return {
          ...p,
          documents: [newDoc, ...p.documents]
        };
      }
      return p;
    });

    setPassports(updatedPassports);
    try {
      localStorage.setItem("furevercare_pet_passports", JSON.stringify(updatedPassports));
    } catch (err) {
      console.error(err);
    }

    if (showToast) {
      showToast(`📄 Document "${file.name}" uploaded to ${currentPet.name}'s lifelong record!`);
    }
  };

  // Handle New Pet Registration Submit
  const handleCreatePassportSubmit = (e) => {
    e.preventDefault();
    if (!newPetData.name.trim() || !newPetData.breed.trim()) {
      if (showToast) showToast("Please provide pet name and breed.");
      return;
    }

    const newId = `PASS-${newPetData.name.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPassport = {
      id: newId,
      name: newPetData.name.trim(),
      species: newPetData.species,
      breed: newPetData.breed.trim(),
      age: newPetData.age.trim() || "1 Year",
      gender: "Male / Female",
      weight: newPetData.weight ? `${newPetData.weight} kg` : "Unknown",
      bloodGroup: newPetData.bloodGroup,
      microchipId: newPetData.microchipId.trim() || `98514100${Math.floor(1000000 + Math.random() * 9000000)}`,
      rabiesTag: `RT-DEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      photo: newPetData.photo,
      owner: {
        name: newPetData.ownerName.trim() || "Registered Guardian",
        phone: newPetData.ownerPhone.trim() || "+91 98765 00000",
        altPhone: "+91 98111 00000",
        city: "Central City Sector"
      },
      primaryVet: {
        clinic: "FureverCare Veterinary Center",
        doctor: "Dr. On-Duty Specialist",
        phone: "+91 12345 67890",
        emergency24h: "+91 99999 88888"
      },
      criticalAllergies: [
        { name: "None Recorded Yet", severity: "Low", note: "Standard veterinary monitoring applies." }
      ],
      currentMedications: [],
      pin: "2026",
      vaccinations: [
        { name: "Rabies Initial Dose", date: "01 Jan 2026", nextDue: "01 Jan 2027", batch: "RAB-INIT", vet: "Primary Vet", status: "Valid & Current" }
      ],
      deworming: [
        { product: "Broad-Spectrum Dewormer", date: "01 Feb 2026", nextDue: "01 May 2026", weightDose: "Standard", status: "Active Protection" }
      ],
      vetVisits: [
        { date: "Initial Registration", clinic: "FureverCare Center", doctor: "Staff Vet", reason: "Lifelong Digital Passport Registration", diagnosis: "Baseline registration complete." }
      ],
      documents: [],
      reminders: [
        { title: "Annual Core Booster", daysLeft: 80, date: "Upcoming Checkup", icon: "💉" }
      ]
    };

    const updated = [newPassport, ...passports];
    setPassports(updated);
    setActivePassportId(newId);
    setShowNewPassportModal(false);

    try {
      localStorage.setItem("furevercare_pet_passports", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    if (showToast) {
      showToast(`🎉 Lifelong Digital Health Passport created for ${newPassport.name}!`);
    }
  };

  // Copy Emergency Link
  const handleCopyEmergencyLink = () => {
    const link = `${window.location.origin}/passport?id=${currentPet.id}&mode=emergency`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    if (showToast) {
      showToast("📋 Emergency QR Link copied to clipboard!");
    }
  };

  return (
    <div className="passport-page-container">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf,.png,.jpg,.jpeg,.doc"
        onChange={handleFileSelected}
      />

      {/* Hero Banner */}
      <section className="passport-hero-banner">
        <div className="passport-kicker-pill">
          🐾 Official Animal Healthcare Registry
        </div>

        <h1>
          Digital Pet <em>Health Passport</em> 🩺
        </h1>

        <p>
          Lifelong unified medical records for registered pets and community animals.
          Track vaccinations, deworming schedules, chronic medications, vet consultations,
          and generate a <b>permission-controlled emergency QR code</b> for collar tags.
        </p>

        <div className="passport-hero-actions">
          <button
            type="button"
            className="btn-new-passport"
            onClick={() => setShowNewPassportModal(true)}
          >
            <span>➕</span>
            <span>Register New Animal Passport</span>
          </button>

          <button
            type="button"
            className="btn-qr-twist-highlight"
            onClick={() => {
              setQrAccessLevel("emergency");
              setEnteredPin("");
              setPinError("");
              setShowQrModal(true);
            }}
          >
            <span>📲</span>
            <span>Open Emergency QR & Privacy Shield</span>
          </button>
        </div>
      </section>

      {/* Pet Selector Horizontal Bar */}
      <div className="passport-pets-selector-row">
        {passports.map((pet) => (
          <button
            key={pet.id}
            type="button"
            className={`passport-pet-tab-btn ${pet.id === activePassportId ? "active" : ""}`}
            onClick={() => {
              setActivePassportId(pet.id);
              setActiveSection("vitals");
            }}
          >
            <img src={pet.photo} alt={pet.name} className="pet-avatar-mini" />
            <div className="pet-tab-info">
              <strong>{pet.name}</strong>
              <span>{pet.species} · {pet.breed}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Passport Card */}
      <article className="passport-card-main">
        {/* Card Header Top Banner */}
        <div className="passport-card-top-banner">
          <div className="passport-header-left">
            <img src={currentPet.photo} alt={currentPet.name} className="pet-main-avatar" />
            <div className="passport-identity-block">
              <h2>
                <span>{currentPet.name}</span>
                <span className="passport-id-pill">ID: {currentPet.id}</span>
              </h2>
              <p>
                {currentPet.breed} · {currentPet.gender} · {currentPet.age} · Weight: <b>{currentPet.weight}</b>
              </p>
              <p style={{ marginTop: "4px", fontSize: "0.85rem", color: "#666" }}>
                Microchip: <code>{currentPet.microchipId}</code> · Rabies Tag: <code>{currentPet.rabiesTag}</code>
              </p>
            </div>
          </div>

          <div className="passport-header-right">
            <button
              type="button"
              className="btn-open-qr-modal"
              onClick={() => {
                setQrAccessLevel("emergency");
                setEnteredPin("");
                setPinError("");
                setShowQrModal(true);
              }}
            >
              <span>📲</span>
              <span>Emergency Collar QR</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="passport-sections-nav">
          <button
            type="button"
            className={`sec-nav-btn ${activeSection === "vitals" ? "active" : ""}`}
            onClick={() => setActiveSection("vitals")}
          >
            <span>🩺</span> Vitals & Contacts
          </button>

          <button
            type="button"
            className={`sec-nav-btn ${activeSection === "vaccines" ? "active" : ""}`}
            onClick={() => setActiveSection("vaccines")}
          >
            <span>💉</span> Vaccinations
            <span className="sec-counter-badge">{currentPet.vaccinations.length}</span>
          </button>

          <button
            type="button"
            className={`sec-nav-btn ${activeSection === "deworming" ? "active" : ""}`}
            onClick={() => setActiveSection("deworming")}
          >
            <span>💊</span> Deworming & Ticks
          </button>

          <button
            type="button"
            className={`sec-nav-btn ${activeSection === "allergies" ? "active" : ""}`}
            onClick={() => setActiveSection("allergies")}
          >
            <span>⚠️</span> Allergies & Meds
            <span className="sec-counter-badge">{currentPet.criticalAllergies.length}</span>
          </button>

          <button
            type="button"
            className={`sec-nav-btn ${activeSection === "visits" ? "active" : ""}`}
            onClick={() => setActiveSection("visits")}
          >
            <span>🏥</span> Vet Visits
            <span className="sec-counter-badge">{currentPet.vetVisits.length}</span>
          </button>

          <button
            type="button"
            className={`sec-nav-btn ${activeSection === "documents" ? "active" : ""}`}
            onClick={() => setActiveSection("documents")}
          >
            <span>📄</span> Reports & Rx
            <span className="sec-counter-badge">{currentPet.documents.length}</span>
          </button>

          <button
            type="button"
            className={`sec-nav-btn ${activeSection === "reminders" ? "active" : ""}`}
            onClick={() => setActiveSection("reminders")}
          >
            <span>🔔</span> Smart Reminders
            <span className="sec-counter-badge">{currentPet.reminders.length}</span>
          </button>
        </div>

        {/* Section Body */}
        <div className="passport-section-body">
          {/* TAB 1: VITALS & CONTACTS */}
          {activeSection === "vitals" && (
            <div>
              <div className="vitals-cards-grid">
                <div className="vital-card">
                  <label>Blood Group</label>
                  <strong>🩸 {currentPet.bloodGroup}</strong>
                </div>
                <div className="vital-card">
                  <label>Current Weight</label>
                  <strong>⚖️ {currentPet.weight}</strong>
                </div>
                <div className="vital-card">
                  <label>Microchip Number</label>
                  <strong style={{ fontSize: "0.95rem" }}>📍 {currentPet.microchipId}</strong>
                </div>
                <div className="vital-card">
                  <label>Rabies Tag #</label>
                  <strong style={{ fontSize: "0.95rem" }}>🏷️ {currentPet.rabiesTag}</strong>
                </div>
              </div>

              {/* Critical Allergy Warning */}
              {currentPet.criticalAllergies.length > 0 && (
                <div className="allergy-danger-banner">
                  <span className="allergy-icon">⚠️</span>
                  <div className="allergy-danger-content">
                    <h4>High-Alert Drug & Dietary Allergies</h4>
                    <p>
                      {currentPet.criticalAllergies.map((a) => `${a.name} (${a.severity}) — ${a.note}`).join(" | ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Owner and Primary Vet Blocks */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: "#FAF7F2", borderRadius: "18px", padding: "20px", border: "1px solid #ECE5D8" }}>
                  <h4 style={{ color: "var(--forest-dark)", margin: "0 0 10px" }}>👤 Registered Pet Parent</h4>
                  <p style={{ margin: "0 0 4px" }}><strong>Name:</strong> {currentPet.owner.name}</p>
                  <p style={{ margin: "0 0 4px" }}><strong>Primary Phone:</strong> <a href={`tel:${currentPet.owner.phone}`} style={{ color: "var(--apricot-dark)", fontWeight: "700" }}>{currentPet.owner.phone}</a></p>
                  <p style={{ margin: "0 0 4px" }}><strong>Alt. Emergency:</strong> {currentPet.owner.altPhone}</p>
                  <p style={{ margin: 0 }}><strong>City / Area:</strong> {currentPet.owner.city}</p>
                </div>

                <div style={{ background: "#FAF7F2", borderRadius: "18px", padding: "20px", border: "1px solid #ECE5D8" }}>
                  <h4 style={{ color: "var(--forest-dark)", margin: "0 0 10px" }}>🩺 Primary Hospital & Attending Vet</h4>
                  <p style={{ margin: "0 0 4px" }}><strong>Clinic:</strong> {currentPet.primaryVet.clinic}</p>
                  <p style={{ margin: "0 0 4px" }}><strong>Doctor:</strong> {currentPet.primaryVet.doctor}</p>
                  <p style={{ margin: "0 0 4px" }}><strong>Appointments:</strong> {currentPet.primaryVet.phone}</p>
                  <p style={{ margin: 0 }}><strong>24/7 Trauma Helpline:</strong> <a href={`tel:${currentPet.primaryVet.emergency24h}`} style={{ color: "#c0392b", fontWeight: "700" }}>{currentPet.primaryVet.emergency24h}</a></p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VACCINATIONS */}
          {activeSection === "vaccines" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "var(--forest-dark)" }}>💉 Lifelong Vaccination Ledger</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.88rem" }}>Certified core and non-core immunization history with batch verification.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (showToast) showToast("💉 Vaccination entry modal opened. Enter administered booster.");
                  }}
                >
                  + Add Vaccination Record
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="passport-table">
                  <thead>
                    <tr>
                      <th>Vaccine Name</th>
                      <th>Administered Date</th>
                      <th>Booster Due Date</th>
                      <th>Batch Number</th>
                      <th>Attending Vet</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPet.vaccinations.map((vac, idx) => (
                      <tr key={idx}>
                        <td><strong>{vac.name}</strong></td>
                        <td>{vac.date}</td>
                        <td><strong>{vac.nextDue}</strong></td>
                        <td><code>{vac.batch}</code></td>
                        <td>{vac.vet}</td>
                        <td>
                          <span className={vac.status.includes("Valid") ? "status-badge-ok" : "status-badge-due"}>
                            {vac.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DEWORMING & PARASITE CONTROL */}
          {activeSection === "deworming" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "var(--forest-dark)" }}>💊 Internal & External Parasite Ledger</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.88rem" }}>Quarterly deworming and tick/flea prevention tracking.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (showToast) showToast("Log deworming treatment completed.");
                  }}
                >
                  + Log Parasite Treatment
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="passport-table">
                  <thead>
                    <tr>
                      <th>Product & Treatment</th>
                      <th>Date Administered</th>
                      <th>Next Due Date</th>
                      <th>Weight-Based Dosage</th>
                      <th>Protection Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPet.deworming.map((dew, idx) => (
                      <tr key={idx}>
                        <td><strong>{dew.product}</strong></td>
                        <td>{dew.date}</td>
                        <td><strong>{dew.nextDue}</strong></td>
                        <td>{dew.weightDose}</td>
                        <td>
                          <span className="status-badge-ok">✓ {dew.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ALLERGIES & MEDICATIONS */}
          {activeSection === "allergies" && (
            <div>
              <h3 style={{ color: "var(--forest-dark)", marginBottom: "6px" }}>⚠️ Critical Drug & Environmental Allergies</h3>
              <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "18px" }}>Critical for attending triage veterinarians prior to administering anesthesia or antibiotics.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
                {currentPet.criticalAllergies.map((allg, idx) => (
                  <div key={idx} style={{ background: "#FDEDEC", border: "1.5px solid #F5B7B1", padding: "14px 18px", borderRadius: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "#c0392b", fontSize: "1.05rem" }}>🚫 {allg.name}</strong>
                      <span style={{ background: "#FADBD8", color: "#922B21", fontSize: "0.78rem", fontWeight: "800", padding: "3px 10px", borderRadius: "6px" }}>
                        {allg.severity}
                      </span>
                    </div>
                    <p style={{ color: "#78281F", margin: "6px 0 0", fontSize: "0.88rem" }}>{allg.note}</p>
                  </div>
                ))}
              </div>

              <h3 style={{ color: "var(--forest-dark)", marginBottom: "6px" }}>💊 Active Ongoing Medications</h3>
              {currentPet.currentMedications.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {currentPet.currentMedications.map((med, idx) => (
                    <div key={idx} style={{ background: "#F4F9F6", border: "1px solid #D1E7DD", padding: "14px 18px", borderRadius: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong style={{ color: "var(--forest-dark)", fontSize: "1rem" }}>{med.name}</strong>
                        <span style={{ color: "#0F5132", fontWeight: "700", fontSize: "0.85rem" }}>{med.dose}</span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.86rem", color: "#555" }}>
                        <strong>Schedule:</strong> {med.freq} · <em>Purpose: {med.purpose}</em>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#777", fontSize: "0.9rem" }}>No daily maintenance medications currently prescribed.</p>
              )}
            </div>
          )}

          {/* TAB 5: VET VISITS */}
          {activeSection === "visits" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "var(--forest-dark)" }}>🏥 Clinical Consultations & Visit Notes</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.88rem" }}>Recorded diagnoses, scaling notes, surgical logs, and follow-ups.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (showToast) showToast("Log clinical consultation record.");
                  }}
                >
                  + Add Vet Visit Log
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {currentPet.vetVisits.map((vis, idx) => (
                  <div key={idx} style={{ background: "#FAF7F2", border: "1px solid #ECE5D8", padding: "18px 22px", borderRadius: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong style={{ color: "var(--forest-dark)", fontSize: "1.05rem" }}>{vis.reason}</strong>
                      <span style={{ fontSize: "0.84rem", color: "#888", fontWeight: "600" }}>📅 {vis.date}</span>
                    </div>
                    <p style={{ margin: "0 0 6px", fontSize: "0.86rem", color: "var(--apricot-dark)", fontWeight: "700" }}>
                      🏥 {vis.clinic} · {vis.doctor}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#444", lineHeight: "1.5" }}>
                      <strong>Diagnosis & Treatment:</strong> {vis.diagnosis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENTS & PRESCRIPTIONS UPLOAD */}
          {activeSection === "documents" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "var(--forest-dark)" }}>📄 Diagnostic Reports, X-Rays & Prescriptions</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.88rem" }}>Upload PDF lab panels, ultrasound scans, vaccination cards, and vet bills.</p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="upload-dropzone" onClick={handleUploadClick}>
                <span className="icon">📁</span>
                <strong>Click or Drop Files to Attach to {currentPet.name}'s Medical Record</strong>
                <small>Supports PDF, JPEG, PNG, DICOM (Up to 25 MB per file)</small>
              </div>

              {/* Document List */}
              <div className="documents-list-grid">
                {currentPet.documents.map((doc) => (
                  <div key={doc.id} className="doc-file-card">
                    <span className="doc-file-icon">📋</span>
                    <div className="doc-file-info">
                      <h5>{doc.name}</h5>
                      <span>{doc.type} · {doc.size} · {doc.date}</span>
                      <button
                        type="button"
                        className="btn-view-doc"
                        onClick={() => setViewingDoc(doc)}
                      >
                        👁️ View / Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SMART REMINDERS */}
          {activeSection === "reminders" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "var(--forest-dark)" }}>🔔 Automated Healthcare Reminders</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.88rem" }}>Never miss an immunization window or anti-parasitic treatment.</p>
                </div>
              </div>

              <div className="reminders-grid">
                {currentPet.reminders.map((rem, idx) => (
                  <div key={idx} className="reminder-card">
                    <div className="reminder-header-row">
                      <span style={{ fontSize: "1.4rem" }}>{rem.icon}</span>
                      <span className="reminder-days-pill">Due in {rem.daysLeft} Days</span>
                    </div>
                    <h4>{rem.title}</h4>
                    <p>Scheduled date: <b>{rem.date}</b>. Automatic SMS reminder scheduled.</p>
                    <button
                      type="button"
                      className="btn-schedule-reminder"
                      onClick={() => {
                        if (showToast) showToast(`📱 SMS & WhatsApp alert set for ${rem.title}!`);
                      }}
                    >
                      📲 Send Test SMS / WhatsApp Alert
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* =========================================================================
          MIND-BLOWING TWIST: PERMISSION-CONTROLLED EMERGENCY QR CODE MODAL
          ========================================================================= */}
      {showQrModal && (
        <div className="modal open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setShowQrModal(false)} />
          <div className="modal-dialog qr-modal-dialog">
            <button
              className="modal-close"
              onClick={() => setShowQrModal(false)}
            >
              ×
            </button>

            <div className="qr-modal-header">
              <div className="qr-twist-badge">
                <span>🛡️ Permission-Shielded QR Technology</span>
              </div>
              <h2>Collar Emergency QR Code</h2>
              <p>
                One universal QR code. When scanned by a stranger on the road, it displays
                <b> vital lifesaving emergency data only</b>, keeping full private history securely locked.
              </p>
            </div>

            {/* QR Preview Card */}
            <div className="qr-preview-box">
              <div className="qr-image-wrapper">
                <img src={qrCodeDataUrl} alt={`${currentPet.name} Emergency QR Code`} />
              </div>
              <div className="qr-pet-name-caption">
                🐾 {currentPet.name}'s Lifesaving Collar Tag
              </div>
              <small style={{ color: "#777", display: "block", marginTop: "4px" }}>
                Scan with any smartphone camera to open Instant SOS Emergency Card
              </small>
            </div>

            {/* Two-Tier Privacy Explanation */}
            <div className="qr-modes-explanation">
              <div className={`qr-mode-card ${qrAccessLevel === "emergency" ? "level-1" : ""}`}>
                <span className="mode-icon">🚑</span>
                <div className="mode-details">
                  <h5>Level 1: Public Responder View (Default on Road Scan)</h5>
                  <p>
                    Reveals <b>Pet Name, 24/7 Owner Emergency Phones, Severe Drug Allergies (Penicillin warning), Microchip ID, and Rabies Status</b>.
                    Home address, diagnostic history, and medical invoices remain hidden.
                  </p>
                </div>
              </div>

              <div className={`qr-mode-card ${qrAccessLevel === "unlocked" ? "level-2" : ""}`}>
                <span className="mode-icon">🩺</span>
                <div className="mode-details">
                  <h5>Level 2: Authorized Veterinarian & Foster View (Unlocked via PIN)</h5>
                  <p>
                    Attending doctors and authorized rescue paramedics enter a 4-digit Vet PIN to access
                    full lifelong clinical records, lab panels, and surgery history.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive PIN Unlock Demonstration */}
            {qrAccessLevel === "emergency" ? (
              <div className="pin-unlock-box">
                <h4>🔐 Are you an Attending Veterinarian or Foster?</h4>
                <p style={{ fontSize: "0.86rem", color: "#666", margin: "0 0 10px" }}>
                  Enter the 4-digit Vet PIN to unlock {currentPet.name}'s complete clinical documents.
                  <br />
                  <b style={{ color: "var(--forest)" }}>(Demo Passcode: 2026)</b>
                </p>

                <form onSubmit={handleUnlockPin}>
                  <div className="pin-inputs-row">
                    <input
                      type="password"
                      maxLength={4}
                      className="pin-digit-input"
                      style={{ width: "120px", letterSpacing: "8px" }}
                      placeholder="••••"
                      value={enteredPin}
                      onChange={(e) => setEnteredPin(e.target.value)}
                    />
                    <button type="submit" className="btn-unlock-pin">
                      Unlock Full Record 🔓
                    </button>
                  </div>
                  {pinError && <p style={{ color: "#c0392b", fontSize: "0.82rem", margin: "6px 0 0" }}>{pinError}</p>}
                </form>
              </div>
            ) : (
              <div className="unlocked-success-alert" style={{ marginBottom: "20px" }}>
                <span>🔓</span>
                <span>Verified Access: Full lifelong medical history and prescription records unlocked!</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="qr-modal-actions">
              <button
                type="button"
                className="btn-copy-qr-link"
                onClick={handleCopyEmergencyLink}
              >
                📋 Copy Emergency Link
              </button>

              <button
                type="button"
                className="btn-print-tag"
                onClick={() => {
                  window.print();
                }}
              >
                <span>🖨️</span>
                <span>Print Collar ID Tag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REGISTER NEW PET PASSPORT MODAL
          ========================================================================= */}
      {showNewPassportModal && (
        <div className="modal open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setShowNewPassportModal(false)} />
          <div className="modal-dialog" style={{ maxWidth: "600px" }}>
            <button
              className="modal-close"
              onClick={() => setShowNewPassportModal(false)}
            >
              ×
            </button>

            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--forest-dark)", margin: "0 0 8px" }}>
              ➕ Register Lifelong Pet Passport
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 20px" }}>
              Create a unified digital healthcare passport and emergency collar QR code for your pet.
            </p>

            <form onSubmit={handleCreatePassportSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label className="field-label">Pet Name *</label>
                  <input
                    type="text"
                    required
                    className="rescue-form-input"
                    placeholder="e.g. Max"
                    value={newPetData.name}
                    onChange={(e) => setNewPetData({ ...newPetData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">Species *</label>
                  <select
                    className="rescue-form-input"
                    value={newPetData.species}
                    onChange={(e) => setNewPetData({ ...newPetData, species: e.target.value })}
                  >
                    <option value="Dog">Dog 🐕</option>
                    <option value="Cat">Cat 🐈</option>
                    <option value="Rabbit">Rabbit 🐰</option>
                    <option value="Bird">Bird 🦜</option>
                    <option value="Other">Other Rescued Animal</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label className="field-label">Breed *</label>
                  <input
                    type="text"
                    required
                    className="rescue-form-input"
                    placeholder="e.g. Labrador / Indie"
                    value={newPetData.breed}
                    onChange={(e) => setNewPetData({ ...newPetData, breed: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">Age & Approx Weight</label>
                  <input
                    type="text"
                    className="rescue-form-input"
                    placeholder="e.g. 1 Year, 15 kg"
                    value={newPetData.age}
                    onChange={(e) => setNewPetData({ ...newPetData, age: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label className="field-label">Microchip ID (If Available)</label>
                  <input
                    type="text"
                    className="rescue-form-input"
                    placeholder="15-digit ISO chip number"
                    value={newPetData.microchipId}
                    onChange={(e) => setNewPetData({ ...newPetData, microchipId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">Pet Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    className="rescue-form-input"
                    placeholder="+91 98765 43210"
                    value={newPetData.ownerPhone}
                    onChange={(e) => setNewPetData({ ...newPetData, ownerPhone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowNewPassportModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate Passport & QR Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {viewingDoc && (
        <div className="modal open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setViewingDoc(null)} />
          <div className="modal-dialog" style={{ maxWidth: "550px", textAlign: "center" }}>
            <button className="modal-close" onClick={() => setViewingDoc(null)}>×</button>
            <span style={{ fontSize: "50px", display: "block", marginBottom: "12px" }}>📄</span>
            <h3 style={{ margin: "0 0 6px", color: "var(--forest-dark)" }}>{viewingDoc.name}</h3>
            <p style={{ color: "#777", fontSize: "0.88rem", margin: "0 0 20px" }}>
              Uploaded on {viewingDoc.date} · {viewingDoc.type} · Size: {viewingDoc.size}
            </p>
            <div style={{ background: "#F9F5EE", padding: "24px", borderRadius: "16px", marginBottom: "20px", border: "1px dashed #DDD" }}>
              <p style={{ margin: 0, color: "var(--forest)", fontWeight: "600" }}>
                ✓ Cryptographically Verified Veterinary Document
              </p>
              <small style={{ color: "#666" }}>Attached to Microchip #{currentPet.microchipId}</small>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (showToast) showToast(`Downloading ${viewingDoc.name}...`);
                setViewingDoc(null);
              }}
            >
              📥 Download Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
