import { useEffect, useRef, useState } from "react";

// The 4 core impact and donation metrics as specified in requirements:
// - Animals rescued
// - Pets adopted
// - Vaccinations funded
// - Donations collected
const DEFAULT_METRICS = [
  {
    id: "rescues",
    title: "Animals rescued",
    icon: "🐾",
    current: 2840,
    target: 3000,
    prefix: "",
    suffix: "+",
    targetLabel: "3,000 Annual Goal",
    desc: "Critical trauma response, ambulance dispatch, & street emergency care"
  },
  {
    id: "adoptions",
    title: "Pets adopted",
    icon: "🏠",
    current: 3420,
    target: 3500,
    prefix: "",
    suffix: "+",
    targetLabel: "3,500 Families Target",
    desc: "Matched with screened, loving forever homes & companion families"
  },
  {
    id: "vaccines",
    title: "Vaccinations funded",
    icon: "💉",
    current: 9850,
    target: 10000,
    prefix: "",
    suffix: "+",
    targetLabel: "10,000 Free Vaccine Doses",
    desc: "Free anti-rabies, DHPPiL, and feline viral immunization drives"
  },
  {
    id: "donations",
    title: "Donations collected",
    icon: "💖",
    current: 184500,
    target: 200000,
    prefix: "$",
    suffix: "",
    targetLabel: "$200,000 Emergency Grant",
    desc: "Direct surgical fund grants, trauma ICU meds, & foster food supplies"
  }
];

const PLEDGE_TIERS = [
  { amount: 25, label: "$25", impact: "Funds 1 Full Vaccination & Microchip Pack" },
  { amount: 60, label: "$60", impact: "Dispatches 1 Emergency Ambulance Stray Rescue" },
  { amount: 150, label: "$150", impact: "Sponsors 1 Life-Saving Orthopedic Surgery Grant" },
  { amount: 300, label: "$300", impact: "Feeds an Entire Rescue Shelter Wing for 1 Month" }
];

function Stats({
  kicker = "Measurable community impact",
  title = "Every number represents a life transformed",
  subtitle = "With your support, volunteer vets, and compassionate foster families, our live impact continues to rise every single day.",
  id = "impact"
}) {
  const [visible, setVisible] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState(PLEDGE_TIERS[1]);
  const [pledgeToast, setPledgeToast] = useState("");
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePledgeClick = (tier) => {
    setSelectedPledge(tier);
    setPledgeToast(`🎉 Selected ${tier.label} donation pledge (${tier.impact})! Thank you for standing with rescued animals.`);
    setTimeout(() => setPledgeToast(""), 4000);
  };

  return (
    <section className="stats" id={id} ref={sectionRef}>
      <div className="stats-inner-wrap">
        {/* Section Header */}
        <div className="stats-section-head">
          <p className="kicker">{kicker}</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {/* 4 Animated Impact Metric Cards */}
        <div className="stats-grid">
          {DEFAULT_METRICS.map((metric) => (
            <ImpactCard
              key={metric.id}
              metric={metric}
              visible={visible}
            />
          ))}
        </div>

        {/* Interactive Donation & Impact Pledge Tier Calculator */}
        <div className="stats-pledge-toolbar">
          <div className="pledge-prompt">
            <span style={{ fontSize: "2rem" }}>🤝</span>
            <div>
              <h4>Join the Rescue Movement: Make an Impact Today</h4>
              <p>
                {selectedPledge
                  ? `Your ${selectedPledge.label} pledge: ${selectedPledge.impact}`
                  : "Pick a pledge tier to see immediate tangible impact on animals in need."}
              </p>
            </div>
          </div>

          <div className="pledge-tiers-row">
            {PLEDGE_TIERS.map((tier) => (
              <button
                key={tier.amount}
                type="button"
                className={`pledge-tier-btn ${
                  selectedPledge?.amount === tier.amount ? "selected" : ""
                }`}
                onClick={() => handlePledgeClick(tier)}
              >
                {tier.label}
              </button>
            ))}
            <a
              href="#donate"
              className="btn btn-primary"
              style={{ padding: "8px 20px", fontSize: "0.85rem", fontWeight: "700" }}
              onClick={(e) => {
                e.preventDefault();
                alert(`❤️ Thank you! Pledging ${selectedPledge?.label || "$60"}: ${selectedPledge?.impact || "Dispatches 1 Emergency Ambulance Stray Rescue"}. FureverCare 501(c)(3) tax receipt will be issued.`);
              }}
            >
              Donate {selectedPledge?.label || "$60"}
            </a>
          </div>
        </div>

        {pledgeToast && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px 18px",
              borderRadius: "12px",
              background: "rgba(39, 174, 96, 0.2)",
              border: "1px solid #27AE60",
              color: "#A3E635",
              fontSize: "0.88rem",
              fontWeight: "700",
              textAlign: "center"
            }}
          >
            {pledgeToast}
          </div>
        )}
      </div>
    </section>
  );
}

// Individual Impact Card with Animated Number & Animated Progress Bar toward Target
function ImpactCard({ metric, visible }) {
  const [count, setCount] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  const pct = Math.min(
    100,
    Math.round((metric.current / metric.target) * 100)
  );

  const currentVal = metric.current;

  useEffect(() => {
    if (!visible) return;

    // 1. Animate Count-up Number
    const duration = 1800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      // Smooth cubic easing
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setCount(Math.floor(eased * currentVal));

      if (elapsed < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // 2. Animate Progress Bar toward Target
    const timer = setTimeout(() => {
      setProgressWidth(pct);
    }, 150);

    return () => clearTimeout(timer);
  }, [visible, currentVal, pct]);

  return (
    <div className="impact-stat-card">
      <div>
        <div className="stat-card-header">
          <div className="stat-icon-bubble">{metric.icon}</div>
          <span className="stat-pct-badge">{pct}% of Goal</span>
        </div>

        <div className="stat-number-wrap">
          <span className="stat-number">
            {metric.prefix}
            {count.toLocaleString()}
            {metric.suffix}
          </span>
        </div>

        <h3>{metric.title}</h3>
        <p className="stat-desc">{metric.desc}</p>
      </div>

      {/* Animated Progress Bar toward Target */}
      <div className="stat-progress-section">
        <div className="stat-progress-header">
          <span>Target Progress</span>
          <span>{metric.targetLabel}</span>
        </div>
        <div className="stat-progress-rail">
          <div
            className="stat-progress-fill"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Stats;
