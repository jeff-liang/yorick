import { getWorkshed, totalTurnsPlayed } from "kolmafia";
import { $item, get } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";

const ColdMedicineCabinet = () => {
  const consults = get("_coldMedicineConsults");
  const nextConsult = get("_nextColdMedicineConsult");

  const turnsToConsult = nextConsult - totalTurnsPlayed();

  const cabinet = $item`cold medicine cabinet`;
  const workshed = getWorkshed();

  if (workshed !== cabinet || consults === 5) return null;

  return (
    <Tile linkedContent={cabinet} href="/campground.php?action=workshed">
      <Line>{5 - consults} consults available.</Line>
      {consults < 5 && (
        <Line>
          Next consult{" "}
          {turnsToConsult <= 0 ? "available now" : `in ${turnsToConsult} turns`}
          .
        </Line>
      )}
    </Tile>
  );
};

export default ColdMedicineCabinet;
