// import { useState } from "react";
// import { Link } from "react-router-dom";

// function Navbar() {

//   const [menuOpen, setMenuOpen] = useState(false);

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   return (
//     <header className="navbar" id="navbar">

//       <div className="nav-inner">

//         {/* LOGO */}

//         <Link
//           to="/"
//           className="logo"
//           onClick={closeMenu}
//         >
//           <span>🐾</span>

//           <span>
//             Furever<em>Care</em>
//           </span>
//         </Link>


//         {/* NAVIGATION */}

//         <nav
//           className={`nav-links ${
//             menuOpen ? "open" : ""
//           }`}
//         >

//           <Link
//             to="/"
//             onClick={closeMenu}
//           >
//             Home
//           </Link>

//           <Link
//             to="/adopt"
//             onClick={closeMenu}
//           >
//             Adopt
//           </Link>

//           <Link
//             to="/rescue"
//             onClick={closeMenu}
//           >
//             Rescue
//           </Link>

//           <Link
//             to="/medical"
//             onClick={closeMenu}
//           >
//             Medical Aid
//           </Link>

//           <Link
//             to="/pets"
//             onClick={closeMenu}
//           >
//             Pets
//           </Link>

//           <Link
//             to="/about"
//             onClick={closeMenu}
//           >
//             About
//           </Link>

//           <Link
//             to="/contact"
//             onClick={closeMenu}
//           >
//             Contact
//           </Link>

//         </nav>


//         {/* BUTTONS */}

//         <div className="nav-actions">

//           <Link
//             to="/adopt"
//             className="btn btn-primary btn-sm"
//             onClick={closeMenu}
//           >
//             Adopt a Friend
//           </Link>

//           <button
//             className={`hamburger ${
//               menuOpen ? "open" : ""
//             }`}
//             onClick={() =>
//               setMenuOpen(!menuOpen)
//             }
//             aria-expanded={menuOpen}
//           >
//             ☰
//           </button>

//         </div>

//       </div>

//     </header>
//   );
// }

// export default Navbar;


// import { useState } from "react";
// import { Link, NavLink } from "react-router-dom";

// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   // Close mobile menu after clicking a link
//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   return (
//     <header className="navbar" id="navbar">
//       <div className="nav-inner">

//         {/* ================= LOGO ================= */}

//         <Link
//           to="/"
//           className="logo"
//           onClick={closeMenu}
//         >
//           <span>🐾</span>

//           <span>
//             Furever<em>Care</em>
//           </span>
//         </Link>


//         {/* ================= NAVIGATION ================= */}

//         <nav
//           className={`nav-links ${
//             menuOpen ? "open" : ""
//           }`}
//           id="navLinks"
//         >

//           <NavLink
//             to="/"
//             onClick={closeMenu}
//             className={({ isActive }) =>
//               isActive ? "active" : ""
//             }
//           >
//             Home
//           </NavLink>

//           <NavLink
//             to="/adopt"
//             onClick={closeMenu}
//             className={({ isActive }) =>
//               isActive ? "active" : ""
//             }
//           >
//             Adopt
//           </NavLink>

//           <NavLink
//             to="/rescue"
//             onClick={closeMenu}
//             className={({ isActive }) =>
//               isActive ? "active" : ""
//             }
//           >
//             Rescue
//           </NavLink>

//           <NavLink
//             to="/medical"
//             onClick={closeMenu}
//             className={({ isActive }) =>
//               isActive ? "active" : ""
//             }
//           >
//             Medical Aid
//           </NavLink>

//           <NavLink
//             to="/pets"
//             onClick={closeMenu}
//             className={({ isActive }) =>
//               isActive ? "active" : ""
//             }
//           >
//             Pets
//           </NavLink>

//           <NavLink
//             to="/about"
//             onClick={closeMenu}
//             className={({ isActive }) =>
//               isActive ? "active" : ""
//             }
//           >
//             About
//           </NavLink>

//           <NavLink
//             to="/contact"
//             onClick={closeMenu}
//             className={({ isActive }) =>
//               isActive ? "active" : ""
//             }
//           >
//             Contact
//           </NavLink>

//         </nav>


//         {/* ================= RIGHT SIDE ================= */}

//         <div className="nav-actions">

//           {/* Adopt Button */}

//           <Link
//             to="/adopt"
//             className="btn btn-primary btn-sm"
//             onClick={closeMenu}
//           >
//             Adopt a Friend
//           </Link>


//           {/* Mobile Hamburger */}

//           <button
//             className={`hamburger ${
//               menuOpen ? "open" : ""
//             }`}
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle navigation menu"
//             aria-expanded={menuOpen}
//           >
//             ☰
//           </button>

//         </div>

//       </div>
//     </header>
//   );
// }

// export default Navbar;
 



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
            to="/pets"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Pets
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

          <NavLink
            to="/about"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Contact
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