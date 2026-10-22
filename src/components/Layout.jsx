import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import PetModal from "./PetModal";
import RescueAIChatbot from "./RescueAIChatbot";
import FloatingPawBackground from "./FloatingPawBackground";

function Layout() {
  const [selectedPet, setSelectedPet] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: ""
  });

  const [chatbotTrigger, setChatbotTrigger] = useState(null);

  const openPetModal = (pet) => {
    setSelectedPet(pet);
    document.body.style.overflow = "hidden";
  };

  const closePetModal = () => {
    setSelectedPet(null);
    document.body.style.overflow = "";
  };

  const openChatbot = (prompt = "") => {
    setChatbotTrigger({
      timestamp: Date.now(),
      prompt
    });
  };

  const showToast = (message) => {
    setToast({
      show: true,
      message
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: ""
      });
    }, 3200);
  };

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closePetModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Sticky navbar
  useEffect(() => {
    const navbar = document.getElementById("navbar");

    const handleScroll = () => {
      if (!navbar) return;

      navbar.classList.toggle(
        "scrolled",
        window.scrollY > 12
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <FloatingPawBackground />
      <Navbar />

      <Outlet
        context={{
          openPetModal,
          closePetModal,
          showToast,
          openChatbot
        }}
      />

      <Footer showToast={showToast} />

      <PetModal
        pet={selectedPet}
        onClose={closePetModal}
      />

      <div
        className={`toast ${toast.show ? "show" : ""}`}
        id="toast"
      >
        {toast.message}
      </div>

      {/* 24/7 PawPal AI Rescue & Pet Care Assistant */}
      <RescueAIChatbot externalTrigger={chatbotTrigger} />
    </>
  );
}

export default Layout;