import { Location } from "kolmafia";
import { $location } from "libram";

import { haveMachete, lianasCanBeFree } from "./hiddenCity";

interface ZoneDelay {
  zone: Location;
  length: number;
  needed?: () => boolean;
}

// In rough order of priority (does it open other zones?)
export const DELAY_ZONES: ZoneDelay[] = [
  {
    zone: $location`The Haunted Gallery`,
    length: 5,
  },
  {
    zone: $location`The Haunted Bathroom`,
    length: 5,
  },
  {
    zone: $location`The Haunted Bedroom`,
    length: 6,
  },
  {
    zone: $location`The Haunted Ballroom`,
    length: 5,
  },
  {
    zone: $location`The Penultimate Fantasy Airship`,
    length: 25,
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
    length: 9,
  },
  {
    zone: $location`The Outskirts of Cobb's Knob`,
    length: 10,
  },
  {
    zone: $location`The Spooky Forest`,
    length: 5,
  },
  {
    zone: $location`The Boss Bat's Lair`,
    length: 5,
  },
  {
    zone: $location`The Castle in the Clouds in the Sky (Ground Floor)`,
    length: 10,
  },
  {
    zone: $location`The Copperhead Club`,
    // Not including NCs themselves here.
    length: 12,
  },
];

export function remainingDelay() {
  return DELAY_ZONES.map(({ zone, length, needed }) => ({
    zone,
    remaining: needed === undefined || needed() ? length - zone.turnsSpent : 0,
  })).filter(({ remaining }) => remaining > 0);
}
