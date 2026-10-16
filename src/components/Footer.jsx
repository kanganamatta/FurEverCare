function Footer() {
  return (
    <footer className="footer" id="contact">

      <div className="footer-top">

        <div className="footer-brand">

          <a href="#home" className="logo">
            <span>🐾</span>
            <span>
              Furever<em>Care</em>
            </span>
          </a>

          <p>
            A home for every paw, and care for every crisis
            in between.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h4>Explore</h4>

            <a href="#adopt">Adopt a pet</a>
            <a href="#rescue">Rescue an animal</a>
            <a href="#medical">Medical assistance</a>
            <a href="#about">About us</a>
          </div>

          <div>
            <h4>Contact</h4>

            <a href="mailto:hello@furevercare.org">
              hello@furevercare.org
            </a>

            <a href="tel:+911234567890">
              +91 12345 67890
            </a>

            <p>142 Shelter Road, Gurugram</p>
          </div>

        </div>

        <form className="footer-form">

          <h4>Ask us anything</h4>

          <input
            type="text"
            placeholder="Your name"
            required
          />

          <input
            type="email"
            placeholder="Your email"
            required
          />

          <textarea
            rows="2"
            placeholder="Your message"
            required
          />

          <button className="btn btn-primary btn-sm btn-block">
            Send message
          </button>

        </form>

      </div>

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} FureverCare.
          Made with care for animals everywhere.
        </p>

        <div className="footer-social">
          <a href="#">IG</a>
          <a href="#">FB</a>
          <a href="#">X</a>
        </div>

      </div>

    </footer>
  );
}

export default Footer;