import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AdoptPage from "./pages/AdoptPage";
import RescuePage from "./pages/RescuePage";
import MedicalPage from "./pages/MedicalPage";
import PetsPage from "./pages/PetsPage";
import PassportPage from "./pages/PassportPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";


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
            path="/pets"
            element={<PetsPage />}
          />

          <Route
            path="/passport"
            element={<PassportPage />}
          />

          <Route
            path="/about"
            element={<AboutPage />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;