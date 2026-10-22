import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer" id="contact">

      <div className="footer-top">

        <div className="footer-brand">

          <Link to="/" className="logo">
            <span>🐾</span>
            <span>
              Furever<em>Care</em>
            </span>
          </Link>

          <p>
            A home for every paw, and care for every crisis
            in between.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h4>Explore</h4>

            <Link to="/adopt">Adopt a pet</Link>
            <Link to="/rescue">Rescue an animal</Link>
            <Link to="/medical">Medical assistance</Link>
            <Link to="/passport">Pet Health Passport</Link>
            <Link to="/ai-scan">AI Disease Scan 🐾</Link>
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

        <form className="footer-form" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Our rescue care team will contact you shortly."); }}>

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

          <button type="submit" className="btn btn-primary btn-sm btn-block">
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