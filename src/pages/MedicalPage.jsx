import Medical from "../components/Medical";
import Stats from "../components/Stats";

function MedicalPage() {
  return (
    <main>
      <Medical />
      <Stats
        kicker="Medical Relief & Surgery Fund"
        title="Live Medical Progress & Lifesaving Veterinary Aid"
        subtitle="Every surgery sponsored, vaccine administered, and trauma ambulance dispatched directly advances our mission to ensure no animal suffers without medical care."
      />
    </main>
  );
}

export default MedicalPage;
