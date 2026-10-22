import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AdoptPage from "./pages/AdoptPage";
import RescuePage from "./pages/RescuePage";
import MedicalPage from "./pages/MedicalPage";
import PassportPage from "./pages/PassportPage";
import AIScanPage from "./pages/AIScanPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login - Separate Page */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Main Website */}
        <Route element={<Layout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/adopt"
            element={<AdoptPage />}
          />

          <Route
            path="/rescue"
            element={<RescuePage />}
          />

          <Route
            path="/medical"
            element={<MedicalPage />}
          />

          <Route
            path="/passport"
            element={<PassportPage />}
          />

          <Route
            path="/ai-scan"
            element={<AIScanPage />}
          />

          <Route
            path="/scan"
            element={<Navigate to="/ai-scan" replace />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;