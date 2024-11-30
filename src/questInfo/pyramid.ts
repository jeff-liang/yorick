import { availableAmount } from "kolmafia";
import { $item, get, have } from "libram";

import { questFinished } from "../util/quest";

export function spinStatus() {
  const pyramidPosition = get("pyramidPosition");

  let nextPositionNeeded = -1;
  let additionalTurnsAfterThat = 0;
  let task = "";

  if (questFinished("questL11Pyramid")) {
    nextPositionNeeded = pyramidPosition;
    additionalTurnsAfterThat = 0;
    task = "";
  } else if (have($item`ancient bomb`) || get("pyramidBombUsed")) {
    nextPositionNeeded = 1;
    additionalTurnsAfterThat = 0;
    task = `fight Ed in the lower chambers`;
  } else if (have($item`ancient bronze token`)) {
    nextPositionNeeded = 3;
    additionalTurnsAfterThat = 3;
    task = `acquire ancient bomb in lower chamber`;
  } else {
    nextPositionNeeded = 4;
    additionalTurnsAfterThat = 3 + 4;
    task = "acquire token in lower chamber";
  }

  const spinsNeeded = (nextPositionNeeded - pyramidPosition + 10) % 5;
  const totalSpinsNeeded = spinsNeeded + additionalTurnsAfterThat;
  const spinsAvailable =
    availableAmount($item`tomb ratchet`) +
    availableAmount($item`crumbling wooden wheel`);
  const extraSpinsNeeded = Math.max(0, totalSpinsNeeded - spinsAvailable);
  return { extraSpinsNeeded, task, spinsNeeded };
}
