import Adopt from "../components/Adopt";
import { useOutletContext } from "react-router-dom";

function AdoptPage() {
  const context = useOutletContext();
  const openPetModal = context?.openPetModal;
  const showToast = context?.showToast;

  return (
    <main>
      <Adopt
        onPetClick={openPetModal}
        showToast={showToast}
      />
    </main>
  );
}

export default AdoptPage;