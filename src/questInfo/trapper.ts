import { Item } from "kolmafia";
import { $item, have, questStep } from "libram";

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
