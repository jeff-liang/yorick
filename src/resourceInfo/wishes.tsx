import { Text } from "@chakra-ui/react";
import { Effect, Item, myPath } from "kolmafia";
import { $effect, $item, $path, $skill, get, have } from "libram";
import { ReactNode } from "react";

import { haveUnrestricted } from "../util/available";
import { questFinished } from "../util/quest";

export interface WishInfo {
  target: Item | Effect;
  additionalDescription?: ReactNode;
  shouldDisplay: boolean;
  currentlyAccessible: boolean;
}

export function inRunEffectWishes(): (WishInfo & { target: Effect })[] {
  const needDigitalKey =
    !get("nsTowerDoorKeysUsed").includes("digital key") &&
    !have($item`digital key`) &&
    get("8BitScore") < 10000;
  const needNuns =
    myPath() !== $path`Two Crazy Random Summer` &&
    get("sidequestNunsCompleted") === "none" &&
    !questFinished("questL12War");
  return [
    {
      target: $effect`Frosty`,
      additionalDescription: "init/item/meat",
      shouldDisplay: needDigitalKey || needNuns,
      currentlyAccessible: true,
    },
    {
      target: $effect`Staying Frosty`,
      additionalDescription: (
        <Text as="span" color="blue.solid">
          cold damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 && get("nsChallenge2") === "cold",
      currentlyAccessible: true,
    },
    {
      target: $effect`Dragged Through the Coals`,
      additionalDescription: (
        <Text as="span" color="red.solid">
          hot damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 &&
        get("nsChallenge2") === "hot" &&
        !haveUnrestricted($skill`Song of Sauce`),
      currentlyAccessible: true,
    },
    {
      target: $effect`Bored Stiff`,
      additionalDescription: (
        <Text as="span" color="gray.solid">
          spooky damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 && get("nsChallenge2") === "spooky",
      currentlyAccessible: true,
    },
    {
      target: $effect`Sewer-Drenched`,
      additionalDescription: (
        <Text as="span" color="green.solid">
          stench damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 && get("nsChallenge2") === "stench",
      currentlyAccessible: true,
    },
    {
      target: $effect`Fifty Ways to Bereave Your Lover`,
      additionalDescription: (
        <Text as="span" color="purple.solid">
          sleaze damage race / Zeppelin
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 &&
        get("nsChallenge2") === "sleaze" &&
        get("zeppelinProtestors") > 79,
      currentlyAccessible: true,
    },
  ];
}
