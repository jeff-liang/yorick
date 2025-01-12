import { hiddenTempleUnlocked, Location } from "kolmafia";
import { $item, $location, questStep } from "libram";

import { haveUnrestricted } from "../util/available";
import { questFinished } from "../util/quest";

import { remainingSnakes } from "./copperhead";
import { haveMachete, lianasCanBeFree } from "./hiddenCity";

interface ZoneDelay {
  zone: Location;
  length: number;
  needed?: () => boolean;
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
      needed: () => questStep("questL11Manor") < 1,
    },
    {
      zone: $location`The Penultimate Fantasy Airship`,
      length: haveUnrestricted($item`bat wings`) ? 20 : 25,
      needed: () => questStep("questL10Garbage") < 8,
    },
    {
      zone: $location`The Hidden Park`,
      length: 6,
      needed: () => !haveMachete() && lianasCanBeFree(),
    },
    {
      zone: $location`The Upper Chamber`,
      length: 5,
    },
    {
      zone: $location`The Middle Chamber`,
      length: 10,
    },
    {
      zone: $location`The Castle in the Clouds in the Sky (Ground Floor)`,
      length: 10,
    },
    ...(snakes
      ? snakes.map(({ locations }) => ({ zone: locations[0], length: 5 }))
      : []),
    {
      zone: $location`The Copperhead Club`,
      length: 14,
    },
    {
      zone: $location`The Outskirts of Cobb's Knob`,
      length: 10,
    },
    {
      zone: $location`The Boss Bat's Lair`,
      length: 5,
    },
  ];
}

export function remainingDelay() {
  return delayZones()
    .map(({ zone, length, needed }) => ({
      zone,
      remaining:
        needed === undefined || needed() ? length - zone.turnsSpent : 0,
    }))
    .filter(({ remaining }) => remaining > 0);
}
