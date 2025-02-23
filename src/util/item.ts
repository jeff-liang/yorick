import {
  haveEquipped,
  Item,
  itemDropModifier,
  itemType,
  numericModifier,
  weaponHands,
} from "kolmafia";
import { $item, get, getModifier } from "libram";

import { capitalize } from "./text";

export function dropRateModifier(item: Item): number {
  let itemModifier = itemDropModifier();

  if (
    haveEquipped($item`Everfull Dart Holster`) &&
    get("everfullDartPerks").includes("Butt awareness")
  ) {
    itemModifier += 30;
  }

  const isWeapon = weaponHands(item) > 0;

  const type = isWeapon ? "weapon" : itemType(item);

  if (item.cookable || type === "food") {
    itemModifier += getModifier("Food Drop");
  }
  if (item.mixable || type === "booze") {
    itemModifier += getModifier("Booze Drop");
  }
  if (item.candy) {
    itemModifier += getModifier("Candy Drop");
  }

  if (type === "spleen item") {
    itemModifier += getModifier("Spleen Drop");
  } else if (type === "potion") {
    itemModifier += getModifier("Potion Drop");
  }

  if (
    ["hat", "weapon", "offhand", "shirt", "pants", "accessory"].includes(type)
  ) {
    itemModifier +=
      numericModifier(`${capitalize(type)} Drop`) + getModifier("Gear Drop");
  }

  return itemModifier;
}
