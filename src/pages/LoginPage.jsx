// import React, { useState } from "react";
// import "./LoginPage.css";

// function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     alert("Login successful!");
//   };

//   return (
//     <div className="login-page">

//       {/* Left Side - Dog Background */}
//       <div className="login-dog-section">
//         <div className="dog-overlay"></div>

//         <div className="dog-content">
//           <div className="paw-icon">🐾</div>

//           <h1>
//             Every paw deserves
//             <br />
//             a loving home.
//           </h1>

//           <p>
//             Welcome to FureverCare — where every login brings
//             you one step closer to making a difference.
//           </p>

//           <div className="dog-quote">
//             <span>“</span>
//             Until one has loved an animal, a part of one's soul remains unawakened.
//           </div>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="login-form-section">

//         <div className="login-card">

//           {/* Logo */}
//           <div className="login-logo">
//             <span className="login-paw">🐾</span>
//             <span className="logo-dark">Furever</span>
//             <span className="logo-orange">Care</span>
//           </div>

//           <h2>Welcome Back</h2>

//           <p className="login-subtitle">
//             Log in to your account to continue
//             <br />
//             your journey of making a difference.
//           </p>

//           <form onSubmit={handleLogin}>

//             {/* Email */}
//             <div className="input-group">
//               <label>Email Address</label>

//               <div className="input-box">
//                 <span className="input-icon">✉</span>

//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="input-group">
//               <label>Password</label>

//               <div className="input-box">
//                 <span className="input-icon">🔒</span>

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   required
//                 />

//                 <button
//                   type="button"
//                   className="eye-button"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? "🙈" : "👁"}
//                 </button>
//               </div>
//             </div>

//             {/* Remember / Forgot */}
//             <div className="login-options">

//               <label className="remember">
//                 <input type="checkbox" />
//                 <span>Remember me</span>
//               </label>

//               <a href="#" onClick={(e) => e.preventDefault()}>
//                 Forgot password?
//               </a>

//             </div>

//             {/* Login Button */}
//             <button type="submit" className="login-button">
//               Login
//               <span>→</span>
//             </button>

//           </form>

//           {/* Register */}
//           <div className="register-section">

//             <div className="divider">
//               <span></span>
//               <p>Don't have an account?</p>
//               <span></span>
//             </div>

//             <button className="register-button">
//               Register
//             </button>

//           </div>

//         </div>
//       </div>

//     </div>
//   );
// }

// export default LoginPage;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Login button click → Home page
    navigate("/");
  };

  const handleRegister = () => {
    // Register button click
    navigate("/register");
  };

  return (
    <div className="login-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="login-dog-section">

        <div className="dog-overlay"></div>

        <div className="dog-content">

          <div className="paw-icon">
            🐾
          </div>

          <h1>
            Every paw deserves
            <br />
            a loving home.
          </h1>

          <p>
            Welcome to FureverCare — where every login brings
            you one step closer to making a difference.
          </p>

          <div className="dog-quote">
            <span>“</span>
            Until one has loved an animal, a part of one's soul remains unawakened.
          </div>

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="login-form-section">

        <div className="login-card">

          {/* Logo */}

          <div className="login-logo">

            <span className="login-paw">
              🐾
            </span>

            <span className="logo-dark">
              Furever
            </span>

            <span className="logo-orange">
              Care
            </span>

          </div>


          {/* Heading */}

          <h2>
            Welcome Back
          </h2>

          <p className="login-subtitle">
            Log in to your account to continue
            <br />
            your journey of making a difference.
          </p>


          {/* Login Form */}

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-box">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>


            {/* Password */}

            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-box">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* Remember Me / Forgot Password */}

            <div className="login-options">

              <label className="remember">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  alert("Password reset option coming soon!")
                }
              >
                Forgot password?
              </button>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              className="login-button"
            >
              Login
              <span>
                →
              </span>
            </button>

          </form>


          {/* Register */}

          <div className="register-section">

            <div className="divider">

              <span></span>

              <p>
                Don't have an account?
              </p>

              <span></span>

            </div>


            <button
              className="register-button"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;