import { canEquip, haveEquipped, myFamiliar, myPath } from "kolmafia";
import { $effect, $familiar, $item, $path, get, have } from "libram";

import { haveUnrestricted } from "../util/available";

export function currentExplorationPerTurn(): number {
  let exploration = 1;
  if (haveEquipped($item`ornate dowsing rod`)) {
    exploration += 2;
  }
  if (haveEquipped($item`UV-resistant compass`)) {
    exploration += 1;
  }
  if (myPath() === $path`License to Adventure` && get("bondDesert")) {
    exploration += 2;
  }
  if (
    myPath() === $path`Avatar of Sneaky Pete` &&
    get("peteMotorbikeHeadlight") === "Blacklight Bulb"
  ) {
    exploration += 2;
  }
  if (haveEquipped($item`survival knife`) && have($effect`Ultrahydrated`)) {
    exploration += 2;
  }
  if (myFamiliar() === $familiar`Melodramedary`) {
    exploration += 1;
  }
  return exploration;
}
export function possibleExplorationPerTurn(): number {
  let exploration = 1;
  if (have($item`ornate dowsing rod`)) {
    exploration += 2;
  }
  if (
    have($item`UV-resistant compass`) &&
    (!have($item`ornate dowsing rod`) ||
      haveUnrestricted($familiar`Left-Hand Man`))
  ) {
    exploration += 1;
  }
  if (myPath() === $path`License to Adventure` && get("bondDesert")) {
    exploration += 2;
  }
  if (
    myPath() === $path`Avatar of Sneaky Pete` &&
    get("peteMotorbikeHeadlight") === "Blacklight Bulb"
  ) {
    exploration += 2;
  }
  if (have($item`survival knife`)) {
    exploration += 2;
  }
  if (
    haveUnrestricted($familiar`Melodramedary`) &&
    canEquip($familiar`Melodramedary`)
  ) {
    exploration += 1;
  }
  return exploration;
}
