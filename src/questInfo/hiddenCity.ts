import { myPath } from "kolmafia";
import { $items, $path, have, questStep } from "libram";

import { Step } from "../util/quest";

export const MACHETES = $items`antique machete, muculent machete, machetito`;
export function haveMachete() {
  return MACHETES.some((item) => have(item));
}

export function lianasCanBeFree() {
  return myPath() !== $path`Avant Guard` && myPath() !== $path`BIG!`;
}

export function hiddenCityInfo() {
  const step = questStep("questL11Worship");
  return { unlocked: step <= 2, completed: step < Step.FINISHED };
}
