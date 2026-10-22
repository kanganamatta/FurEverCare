import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu after clicking a link
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar" id="navbar">
      <div className="nav-inner">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <span>🐾</span>
          <span>
            Furever<em>Care</em>
          </span>
        </Link>

        {/* ================= NAVIGATION ================= */}
        <nav
          className={`nav-links ${
            menuOpen ? "open" : ""
          }`}
          id="navLinks"
        >
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/adopt"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Adopt
          </NavLink>

          <NavLink
            to="/rescue"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Rescue
          </NavLink>

          <NavLink
            to="/medical"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Medical Aid
          </NavLink>


          <NavLink
            to="/passport"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Health Passport
          </NavLink>

          {/* NEW AI SCAN PAGE */}
          <NavLink
            to="/ai-scan"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active nav-ai-scan-link" : "nav-ai-scan-link"
            }
          >
            <span className="nav-ai-sparkle"></span> AI Scan
            <span className="nav-ai-badge"></span>
          </NavLink>
        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="nav-actions">
          {/* Login Button */}
          <Link
            to="/login"
            className="login-nav-btn"
            onClick={closeMenu}
          >
            Login
          </Link>

          {/* Adopt Button */}
          <Link
            to="/adopt"
            className="btn btn-primary btn-sm"
            onClick={closeMenu}
          >
            Adopt a Friend
          </Link>

          {/* Mobile Hamburger */}
          <button
            className={`hamburger ${
              menuOpen ? "open" : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;