import { useOutletContext } from "react-router-dom";
import PetAIScanner from "../components/aiscan/PetAIScanner";

function AIScanPage() {
  const context = useOutletContext();
  const showToast = context?.showToast;
  const openChatbot = context?.openChatbot;

  return (
    <main className="ai-scan-page-main">
      <PetAIScanner
        showToast={showToast}
        openChatbot={openChatbot}
      />
    </main>
  );
}

export default AIScanPage;
