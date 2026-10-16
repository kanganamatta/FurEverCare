import PetHealthPassport from "../components/passport/PetHealthPassport";
import { useOutletContext } from "react-router-dom";

function PassportPage() {
  const context = useOutletContext();
  const showToast = context?.showToast;

  return (
    <main>
      <PetHealthPassport showToast={showToast} />
    </main>
  );
}

export default PassportPage;
