import { Text, List } from "@chakra-ui/react";
import { getDwelling, myAscensions, totalFreeRests } from "kolmafia";
import {
  $item,
  BurningLeaves,
  ChateauMantegna,
  CinchoDeMayo as LibramCincho,
  get,
  have,
  haveInCampground,
  MayamCalendar,
  sumNumbers,
} from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { commaAnd, plural } from "../../../util/text";

const CinchoDeMayo = () => {
  const cinchoDeMayo = $item`Cincho de Mayo`;
  if (!haveUnrestricted(cinchoDeMayo)) return null;

  const freeRests = get("timesRested");
  const freeRestsRemaining = totalFreeRests() - freeRests;

  const totalCinch = LibramCincho.totalAvailableCinch();
  const possibleFiestaExits = Math.floor(totalCinch / 60);

  const additionalCinchSources: Record<string, number> = {};
  if (
    haveUnrestricted($item`June cleaver`) &&
    !have($item`mother's necklace`)
  ) {
    additionalCinchSources["mother's necklace"] = 25;
  }
  if (haveUnrestricted($item`Mayam Calendar`)) {
    const chairAvailable =
      MayamCalendar.remainingUses() > 0 && MayamCalendar.available("chair");
    const resetAvailable = get("lastTempleAdventures") < myAscensions();
    if (chairAvailable && resetAvailable) {
      additionalCinchSources["Mayam chair plus reset chair"] = 50;
    } else if (chairAvailable) {
      additionalCinchSources["Mayam chair"] = 25;
    } else if (resetAvailable) {
      additionalCinchSources["Mayam chair after reset"] = 25;
    }
  }
  if (BurningLeaves.have() && !haveInCampground($item`forest canopy bed`)) {
    additionalCinchSources[
      getDwelling() === $item`big rock`
        ? "forest canopy bed (need dwelling)"
        : "forest canopy bed"
    ] = 25;
  }

  const additionalCinch = sumNumbers(Object.values(additionalCinchSources));
  const additionalFiestaExits =
    Math.floor((totalCinch + additionalCinch) / 60) - possibleFiestaExits;

  if (totalCinch === 0) return null;

  const url =
    totalCinch < 60
      ? ChateauMantegna.have()
        ? "/chateau.php"
        : "/campground.php"
      : "/skillz.php";

  return (
    <Tile
      header="Cincho de Mayo"
      imageUrl="/images/itemimages/cincho.gif"
      href={url}
    >
      <Line>
        Use your Cincho de Mayo to cast skills in exchange for cinch; when
        you're out of cinch, take a <Text as="b">free rest!?</Text>
      </Line>
      {totalCinch > 60 && (
        <Line>
          <Text as="b" color="purple.500">
            Fiesta Exit (60%):
          </Text>{" "}
          Force a NC on your next adventure. You have{" "}
          <Text as="b">{possibleFiestaExits}</Text> more possible, with{" "}
          {totalCinch % 60}% cinch left over.
        </Line>
      )}
      <List.Root>
        {totalCinch > 25 && (
          <List.Item>
            <Text as="b">Party Soundtrack (25%):</Text> 30 advs of +5 fam
            weight.
          </List.Item>
        )}
        {totalCinch > 5 && (
          <>
            <List.Item>
              <Text as="b">Confetti Extravaganza (5%):</Text> 2x stats,
              in-combat
            </List.Item>
            <List.Item>
              <Text as="b">Projectile Piñata (5%):</Text> complex candy,
              in-combat
            </List.Item>
          </>
        )}
      </List.Root>
      <Line>
        You have {totalCinch}% more cinch available, accounting for your{" "}
        {plural(freeRestsRemaining, "remaining free rest")}.
      </Line>

      {Object.entries(additionalCinchSources).length > 0 && (
        <Line>
          Possible {additionalCinch}% more cinch from{" "}
          {commaAnd(Object.keys(additionalCinchSources))},
          {additionalFiestaExits > 0 &&
            ` giving ${plural(additionalFiestaExits, "more Party Exit")} and`}{" "}
          leaving {(totalCinch + additionalCinch) % 60}% left over.
        </Line>
      )}
    </Tile>
  );
};

export default CinchoDeMayo;
