import { decodeEntity } from "html-entities";
import { canAdventure, Item, Location, Skill } from "kolmafia";
import { questStep } from "libram";
import { getHashIfAvailable } from "tome-kolmafia-lib";

export const BLACK_MARKET_URL = "/shop.php?whichshop=blackmarket";

export function inventoryLink(filter: string | Item) {
  if (typeof filter !== "string") {
    filter = filter.identifierString;
    filter = filter.replace(/^\[[0-9]+\]/, "");
    filter = decodeEntity(filter);
  }
  return `/inventory.php?ftext=${filter}`;
}

export function skillLink(filter: string | Skill) {
  if (typeof filter !== "string") {
    filter = filter.identifierString;
  }
  return `/skillz.php#:~:text=${encodeURIComponent(filter)}`;
}

const PARENTS = {
  Beach: "/place.php?whichplace=desertbeach",
  Pyramid: "/pyramid.php",
  Woods: "/woods.php",
  Friars: "/friars.php",
  HiddenCity: "/place.php?whichplace=hiddencity",
  Town: "/town.php",
  Manor1: "/place.php?whichplace=manor1",
  Manor2: "/place.php?whichplace=manor2",
  Manor3: "/place.php?whichplace=manor3",
  "Little Canadia": "/place.php?whichplace=canadia",
  Plains: "/place.php?whichplace=plains",
  BatHole: "/place.php?whichplace=bathole",
  "Degrassi Knoll": "/place.php?whichplace=knoll_friendly",
  Beanstalk: "/place.php?whichplace=beanstalk",
  Knob: "/cobbsknob.php",
  Mountains: "/mountains.php",
  "The Red Zeppelin's Mooring": "/place.php?whichplace=zeppelin",
  McLarge: "/place.php?whichplace=mclargehuge",
  Highlands: "/place.php?whichplace=highlands",
  Island: "/island.php",
  IsleWar: "/bigisland.php",
};

export function parentPlaceLink(location: Location): string | undefined {
  if (!canAdventure(location)) return undefined;

  return parentPlaceNameLink(location.identifierString, location.zone);
}

export function parentPlaceNameLink(
  locationName: string,
  zone: string,
): string | undefined {
  const parentLink = PARENTS[zone as keyof typeof PARENTS];
  if (locationName === "The Smut Orc Logging Camp") {
    return "/place.php?whichplace=orc_chasm";
  } else if (locationName.startsWith("The Castle in the Clouds in the Sky")) {
    return "/place.php?whichplace=giantcastle";
  } else if (locationName.endsWith("Unquiet Garves")) {
    return "/place.php?whichplace=cemetery";
  } else if (
    [
      "The Copperhead Club",
      "The Neverending Party",
      "The Tunnel of L.O.V.E.",
    ].includes(locationName)
  ) {
    return "/place.php?whichplace=town_wrong";
  } else if (
    locationName === "The Outskirts of Cobb's Knob" &&
    questStep("questL05Goblin") >= 1
  ) {
    return "/place.php?whichplace=plains";
  } else if (parentLink) {
    return parentLink;
  }
}

export function inventoryActionLink(action: string): string {
  return `/inventory.php?pwd=${getHashIfAvailable()}&action=${action}`;
}
