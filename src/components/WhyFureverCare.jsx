function WhyFureverCare() {

  const reasons = [
    {
      title: "Verified shelters only",
      text: "Every partner shelter is inspected and re-verified twice a year."
    },
    {
      title: "Post-adoption support",
      text: "A trainer and vet stay on call for 90 days after adoption."
    },
    {
      title: "Rescue-to-recovery pipeline",
      text: "One platform tracks an animal from the street to the vet to a forever home."
    },
    {
      title: "Community funded",
      text: "Medical costs are covered by small monthly donors."
    }
  ];

  return (
    <section className="section" id="why">

      <div className="section-head">

        <p className="kicker">
          Why FureverCare
        </p>

        <h2>
          What makes us different
        </h2>

      </div>

      <div className="why-grid">

        {reasons.map((reason) => (
          <div className="why-item" key={reason.title}>

            <h3>{reason.title}</h3>

            <p>{reason.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default WhyFureverCare;