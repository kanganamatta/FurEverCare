import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import MedicalOrderModal from "./MedicalOrderModal";

function Medical() {
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState(null);
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("furevercare_medical_orders") || "[]"
      );
    } catch {
      return [];
    }
  });
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Manage body scroll when modal is open
  useEffect(() => {
    if (selectedServiceForOrder || trackingOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedServiceForOrder, trackingOrder]);

  const handleOpenOrder = (service) => {
    setSelectedServiceForOrder(service);
  };

  const handleCloseOrder = () => {
    setSelectedServiceForOrder(null);
  };

  const handleOrderPlaced = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    if (showToast) {
      showToast(`🎉 Order ${newOrder.orderId} placed successfully!`);
    }
  };

  const handleCancelOrder = (orderId) => {
    const updated = orders.filter((o) => o.orderId !== orderId);
    setOrders(updated);
    try {
      localStorage.setItem("furevercare_medical_orders", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (showToast) {
      showToast(`Order ${orderId} has been removed.`);
    }
  };

  const services = [
    {
      icon: "🚑",
      title: "Emergency care",
      text: "24/7 triage for injured strays and rescued animals.",
      tag: "⚡ 24/7 Response",
      buttonText: "Request Emergency 🚨",
      features: [
        "Equipped animal ambulance with oxygen",
        "On-spot stabilization & pain relief",
        "100% Free emergency response for strays"
      ]
    },
    {
      icon: "💉",
      title: "Vaccination drives",
      text: "Free monthly rabies and parvo vaccination camps.",
      tag: "💉 100% Free Drives",
      buttonText: "Book Vaccine Slot 💉",
      features: [
        "Certified Anti-Rabies & DHPPiL shots",
        "Digital health & vaccination card",
        "Community pack & home drive available"
      ]
    },
    {
      icon: "🩺",
      title: "Surgery fund",
      text: "Sponsors cover the cost of important animal surgeries.",
      tag: "🩺 Full Subsidy Grant",
      buttonText: "Apply / Sponsor Surgery 🩺",
      features: [
        "Critical orthopedic & trauma repair",
        "Safe ABC spay & neuter program",
        "Apply for 100% grant or sponsor a stray"
      ]
    },
    {
      icon: "🏥",
      title: "Foster recovery",
      text: "Post-op animals are placed with trained foster homes.",
      tag: "🏡 Post-Op Care",
      buttonText: "Book Foster Care 🏥",
      features: [
        "Vetted and experienced foster parents",
        "Daily wound dressing & medicated diet",
        "Periodic vet follow-ups included"
      ]
    }
  ];

  return (
    <section className="section" id="medical">
      <div className="section-head">
        <p className="kicker">Medical assistance</p>
        <h2>Care no animal has to go without</h2>
        <p className="section-lead">
          Access round-the-clock emergency dispatch, free vaccination drives,
          surgical grants, and post-operative foster boarding for stray and companion animals.
        </p>
      </div>

      {/* Digital Pet Health Passport Featured Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #143530 0%, #1F4B43 65%, #23584F 100%)",
          borderRadius: "24px",
          padding: "26px 32px",
          marginBottom: "36px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px",
          boxShadow: "0 12px 30px rgba(20, 53, 48, 0.2)"
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          <span
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "var(--gold)",
              fontSize: "0.8rem",
              fontWeight: "800",
              padding: "4px 12px",
              borderRadius: "999px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              display: "inline-block",
              marginBottom: "8px"
            }}
          >
            🩺 Lifelong Medical Registry & Emergency QR
          </span>
          <h3 style={{ color: "#ffffff", fontSize: "1.45rem", margin: "0 0 6px", fontFamily: "var(--font-display)" }}>
            Digital Pet Health Passport
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.88)", margin: 0, fontSize: "0.92rem", lineHeight: "1.5" }}>
            Track lifelong vaccinations, deworming, allergies, medications, and generate a <b>permission-controlled emergency QR code</b> that protects sensitive clinical records on collar tags.
          </p>
        </div>
        <Link
          to="/passport"
          className="btn btn-primary"
          style={{
            background: "var(--apricot)",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "999px",
            fontWeight: "700",
            fontSize: "0.92rem",
            whiteSpace: "nowrap"
          }}
        >
          Open Health Passport 🩺
        </Link>
      </div>

      {/* Services Grid with Orange Clickable Buttons */}
      <div className="medical-grid">
        {services.map((service) => (
          <article className="medical-card" key={service.title}>
            <div className="medical-card-header">
              <div className="medical-icon">{service.icon}</div>
              <span className="medical-pill-badge">{service.tag}</span>
            </div>

            <div className="medical-card-body">
              <h3>{service.title}</h3>
              <p>{service.text}</p>

              {/* Service Feature Highlights */}
              <ul className="medical-feature-list">
                {service.features.map((feat, idx) => (
                  <li key={idx}>
                    <span className="feat-check">✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Clickable Orange Button */}
            <div className="medical-card-action">
              <button
                type="button"
                className="medical-order-btn"
                onClick={() => handleOpenOrder(service)}
                aria-label={`Order or book ${service.title}`}
              >
                <span>{service.buttonText}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Active Orders Tracker Section */}
      {orders.length > 0 && (
        <div className="medical-active-orders">
          <div className="orders-header">
            <div>
              <h3>📦 Your Active Medical Orders & Requests ({orders.length})</h3>
              <p>Track live ambulance dispatch, token numbers, and scheduled care.</p>
            </div>
            <button
              type="button"
              className="clear-orders-btn"
              onClick={() => {
                if (window.confirm("Clear all recorded medical orders?")) {
                  setOrders([]);
                  localStorage.removeItem("furevercare_medical_orders");
                }
              }}
            >
              Clear History
            </button>
          </div>

          <div className="orders-list-grid">
            {orders.map((ord) => (
              <div key={ord.orderId} className="active-order-card">
                <div className="order-top-row">
                  <span className="order-service-name">
                    {ord.serviceIcon} {ord.serviceTitle}
                  </span>
                  <span className="order-status-badge">{ord.status}</span>
                </div>

                <div className="order-main-info">
                  <strong>ID: {ord.orderId}</strong>
                  <p>
                    <strong>Patient:</strong> {ord.patientName} ({ord.animalType})
                  </p>
                  <p>
                    <strong>Package:</strong> {ord.packageName}
                  </p>
                  <p>
                    <strong>Location:</strong> {ord.address}
                  </p>
                  {ord.addons && ord.addons.length > 0 && (
                    <p className="order-addons-text">
                      <strong>Supplies:</strong>{" "}
                      {ord.addons.map((a) => a.name).join(", ")}
                    </p>
                  )}
                </div>

                <div className="order-bottom-row">
                  <span className="order-price-pill">
                    {ord.totalPrice === 0 ? "FREE (Covered)" : `₹${ord.totalPrice}`}
                  </span>
                  <div className="order-btn-group">
                    <button
                      type="button"
                      className="track-detail-btn"
                      onClick={() => setTrackingOrder(ord)}
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(ord.orderId)}
                      title="Cancel Request"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency CTA Helpline Banner */}
      <div className="medical-cta">
        <div>
          <h3>Need urgent medical help for an animal?</h3>
          <p>Our 24/7 rescue helpline is ready for hit-and-run, trauma, or critical poisoning emergencies.</p>
        </div>

        <a href="tel:+911234567890" className="btn btn-primary">
          Call Helpline: +91 12345 67890
        </a>
      </div>

      {/* Interactive Order Modal */}
      {selectedServiceForOrder && (
        <MedicalOrderModal
          service={selectedServiceForOrder}
          onClose={handleCloseOrder}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {/* Order Details Quick Modal */}
      {trackingOrder && (
        <div className="modal open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setTrackingOrder(null)} />
          <div className="medical-order-dialog">
            <button
              className="modal-close"
              onClick={() => setTrackingOrder(null)}
            >
              ×
            </button>
            <div className="medical-confirmed-view">
              <span className="confirmed-badge">Order Details</span>
              <h2>{trackingOrder.serviceTitle}</h2>
              <div className="confirmed-receipt-card" style={{ marginTop: "16px" }}>
                <div className="receipt-header">
                  <div>
                    <span className="receipt-label">ORDER ID</span>
                    <strong className="receipt-order-id">{trackingOrder.orderId}</strong>
                  </div>
                  <span className="receipt-status-pill">{trackingOrder.status}</span>
                </div>
                <div className="receipt-grid">
                  <div>
                    <span className="receipt-label">Package</span>
                    <strong>{trackingOrder.packageName}</strong>
                  </div>
                  <div>
                    <span className="receipt-label">Patient</span>
                    <strong>{trackingOrder.patientName} ({trackingOrder.animalType})</strong>
                  </div>
                  <div>
                    <span className="receipt-label">Contact</span>
                    <strong>{trackingOrder.contactName} ({trackingOrder.phoneNumber})</strong>
                  </div>
                  <div>
                    <span className="receipt-label">Urgency</span>
                    <strong>{trackingOrder.urgency}</strong>
                  </div>
                  <div className="receipt-full-col">
                    <span className="receipt-label">Address</span>
                    <strong>{trackingOrder.address}</strong>
                  </div>
                  {trackingOrder.notes && (
                    <div className="receipt-full-col">
                      <span className="receipt-label">Notes / Symptoms</span>
                      <strong>{trackingOrder.notes}</strong>
                    </div>
                  )}
                  <div className="receipt-full-col receipt-total-row">
                    <span className="receipt-label">Total Amount</span>
                    <strong className="receipt-final-price">
                      {trackingOrder.totalPrice === 0 ? "₹0 (Free / Subsidized)" : `₹${trackingOrder.totalPrice}`}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setTrackingOrder(null)}
                >
                  Close Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Medical;
