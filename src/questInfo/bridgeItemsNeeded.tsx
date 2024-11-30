import { availableAmount, Item } from "kolmafia";
import { $item, $items, get, have } from "libram";

function countItems(items: Item[], multiplier = 1) {
  return items
    .map((item) => availableAmount(item) * multiplier)
    .reduce((prev, current) => prev + current);
}

export function bridgeItemsNeeded() {
  const bridgeNeeded = have($item`bat wings`) ? 25 : 30;
  const bridgeProgress = get("chasmBridgeProgress");

  const numExtras = countItems($items`smut orc keepsake box, snow boards`, 5);

  const numFasteners = countItems(
    $items`thick caulk, long hard screw, messy butt joint`,
  );
  const fastenersNeeded = Math.max(
    0,
    bridgeNeeded - bridgeProgress - numFasteners - numExtras,
  );

  const numLumber = countItems(
    $items`morningwood plank, raging hardwood plank, weirdwood plank`,
  );

  const lumberNeeded = Math.max(
    0,
    bridgeNeeded - bridgeProgress - numLumber - numExtras,
  );
  return { fastenersNeeded, lumberNeeded };
}
