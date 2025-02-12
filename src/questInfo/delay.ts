import { canAdventure, hiddenTempleUnlocked, Item, Location } from "kolmafia";
import { $item, $location, get, have } from "libram";

import { haveUnrestricted } from "../util/available";
import { questFinished, questPastStep } from "../util/quest";

import { remainingSnakes } from "./copperhead";
import { haveMachete, lianasCanBeFree } from "./hiddenCity";

interface ZoneDelay {
  zone: Location;
  length: number;
  needed?: () => boolean;
  available?: () => boolean;
}

// In rough order of priority (does it open other zones?)
export function delayZones(): ZoneDelay[] {
  const snakes = remainingSnakes();
  return [
    {
      zone: $location`The Spooky Forest`,
      length: 5,
      needed: () => !questFinished("questL02Larva") || !hiddenTempleUnlocked(),
    },
    {
      zone: $location`The Haunted Gallery`,
      length: 5,
      needed: () => !questFinished("questM21Dance"),
    },
    {
      zone: $location`The Haunted Bathroom`,
      length: 5,
      needed: () => !questFinished("questM21Dance"),
    },
    {
      zone: $location`The Haunted Bedroom`,
      length: 6,
      needed: () => !questFinished("questM21Dance"),
    },
    {
      zone: $location`The Haunted Ballroom`,
      length: 5,
      needed: () => !questPastStep("questL11Manor", 1),
    },
    {
      zone: $location`The Penultimate Fantasy Airship`,
      length: haveUnrestricted($item`bat wings`) ? 20 : 25,
      needed: () => !questPastStep("questL10Garbage", 7),
    },
    {
      zone: $location`The Hidden Park`,
      length: 6,
      needed: () => !haveMachete() && lianasCanBeFree(),
    },
    {
      zone: $location`The Upper Chamber`,
      length: 5,
      needed: () => !questPastStep("questL11Pyramid", 1),
    },
    {
      zone: $location`The Middle Chamber`,
      length: 10,
      needed: () => !questPastStep("questL11Pyramid", 3),
    },
    {
      zone: $location`The Castle in the Clouds in the Sky (Ground Floor)`,
      length: 10,
      needed: () => !questPastStep("questL10Garbage", 9),
    },
    ...(snakes
      ? snakes.map(({ locations, item }) => ({
          zone: locations[0],
          length: 3,
          needed: () => !have(Item.get(item)),
          available: () => get("shenQuestItem") === item,
        }))
      : []),
    {
      zone: $location`The Copperhead Club`,
      length: 14,
      needed: () => !questFinished("questL11Shen"),
    },
    {
      zone: $location`The Outskirts of Cobb's Knob`,
      length: 10,
      needed: () => !questPastStep("questL05Goblin", 1),
    },
    {
      zone: $location`The Boss Bat's Lair`,
      length: 4,
      needed: () => !questFinished("questL04Bat"),
    },
  ];
}

export function remainingDelay() {
  return delayZones()
    .map(({ zone, length, needed, available }) => ({
      zone,
      remaining:
        needed === undefined || needed() ? length - zone.turnsSpent : 0,
      available: canAdventure(zone) && (available === undefined || available()),
    }))
    .filter(({ remaining }) => remaining > 0);
}
