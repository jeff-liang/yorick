import { Item, myPath } from "kolmafia";
import { $item, $location, $path, have, questStep } from "libram";

export function pastNinjaSnowmen(): boolean {
  return questStep("questL08Trapper") >= 3;
}

export function neededNinjaItems(): Item[] {
  if (pastNinjaSnowmen()) return [];

  const rope = $item`ninja rope`;
  const crampons = $item`ninja crampons`;
  const carabiner = $item`ninja carabiner`;
  return [rope, crampons, carabiner].filter((item) => !have(item));
}

export function yetiCount() {
  return Math.floor(
    $location`Mist-Shrouded Peak`.turnsSpent /
      (myPath() === $path`Avant Guard` ? 2 : 1),
  );
}
