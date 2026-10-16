import Hero from "../components/Hero";
import Intro from "../components/Intro";
import FeaturedPets from "../components/FeaturedPets";
import WhyFureverCare from "../components/WhyFureverCare";
import Stats from "../components/Stats";

import { useOutletContext } from "react-router-dom";

function Home() {

  const { openPetModal, openChatbot } = useOutletContext();

  return (
    <main>

      <Hero onOpenChatbot={openChatbot} />

      <Intro />

      <FeaturedPets
        onPetClick={openPetModal}
      />

      <WhyFureverCare />

      <Stats />

    </main>
  );
}

export default Home;