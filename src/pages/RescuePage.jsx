import Rescue from "../components/Rescue";
import { useOutletContext } from "react-router-dom";

function RescuePage() {

  const { showToast } = useOutletContext();

  return (
    <main>

      <Rescue
        showToast={showToast}
      />

    </main>
  );
}

export default RescuePage;