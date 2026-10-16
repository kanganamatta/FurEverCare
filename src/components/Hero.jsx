import { Link } from "react-router-dom";

function Hero({ onOpenChatbot }) {
  return (
    <section className="hero" id="home">

      <div className="hero-inner">

        <div className="hero-copy">

          <p className="kicker">
            Every paw deserves a home
          </p>

          <h1>
            Find a friend
            <br />
            who's already
            <br />
            <span className="ink-underline">
              waiting for you.
            </span>
          </h1>

          <p className="hero-lead">
            FureverCare brings together rescue shelters,
            volunteer vets and adopting families — so every
            stray finds a home and no animal in crisis waits alone.
          </p>

          <div className="hero-actions">

            {/* Adopt Button */}
            <Link
              to="/adopt"
              className="btn btn-primary"
            >
              Adopt a Friend
            </Link>

            {/* Need Help Button - Triggers PawPal AI Assistant */}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                if (onOpenChatbot) {
                  onOpenChatbot("I found this injured dog what to do");
                }
              }}
              style={{ cursor: "pointer" }}
              title="Found an injured dog or animal in distress? Get instant AI rescue guidance!"
            >
              🆘 Need Help? (AI Rescue)
            </button>

          </div>

          <div className="hero-trust">
            <p>
              <strong>3,400+</strong> families matched since 2019
            </p>
          </div>

        </div>

        <div className="hero-visual">

          <img
            className="hero-img hero-img-1"
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=700&auto=format&fit=crop"
            alt="Pet"
          />

          <img
            className="hero-img hero-img-2"
            src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=500&auto=format&fit=crop"
            alt="Cat"
          />

          <div className="hero-card">
            <strong>Milo</strong>
            <p>adopted 2 days ago</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;