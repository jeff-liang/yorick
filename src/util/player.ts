import {
  fullnessLimit,
  inebrietyLimit,
  myFamiliar,
  myFullness,
  myInebriety,
} from "kolmafia";
import { $familiar, $item, clamp, get, have } from "libram";

import { haveUnrestricted } from "./available";

export function canPossiblyDrink() {
  return (
    inebrietyLimit() > 0 &&
    myInebriety() <
      inebrietyLimit() +
        +(myFamiliar() === $familiar`Stooper` && -1) +
        +(
          haveUnrestricted($item`synthetic dog hair pill`) &&
          !get("_syntheticDogHairPillUsed")
        ) +
        +(haveUnrestricted($item`cuppa Sobrie tea`) && !get("_sobrieTeaUsed")) +
        +(have($item`spice melange`) && !get("spiceMelangeUsed") && 3) +
        +(
          have($item`Ultra Mega Sour Ball`) &&
          !get("_ultraMegaSourBallUsed") &&
          3
        ) +
        +(
          haveUnrestricted($item`designer sweatpants`) &&
          clamp(3 - get("_sweatOutSomeBoozeUsed"), 0, 3)
        )
  );
}

export function canPossiblyEat() {
  return (
    fullnessLimit() > 0 &&
    myFullness() <
      fullnessLimit() +
        +(myFamiliar() === $familiar`Stooper` && -1) +
        +(
          haveUnrestricted($item`distention pill`) &&
          !get("_distentionPillUsed")
        ) +
        +(haveUnrestricted($item`cuppa Voraci tea`) && !get("_voraciTeaUsed")) +
        +(have($item`spice melange`) && !get("spiceMelangeUsed") && 3) +
        +(
          have($item`Ultra Mega Sour Ball`) &&
          !get("_ultraMegaSourBallUsed") &&
          3
        )
  );
}
