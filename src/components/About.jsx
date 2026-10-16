function About() {
  return (
    <section className="section about" id="about">

      <div className="about-wrap">

        <div className="about-visual">

          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=650&auto=format&fit=crop"
            alt="Happy pets"
          />

        </div>

        <div className="about-copy">

          <p className="kicker">
            About FureverCare
          </p>

          <h2>
            Started in one backyard, now in twelve cities
          </h2>

          <p>
            FureverCare began in 2019 when a small group
            of volunteers started fostering strays out of
            a backyard shelter.
          </p>

          <p>
            We believe no animal should be judged by how
            it was found, and no family should be turned
            away for how much they can pay.
          </p>

          <a href="#contact" className="btn btn-outline">
            Get in touch
          </a>

        </div>

      </div>

    </section>
  );
}

export default About;