import { List, Strong } from "@chakra-ui/react";
import { getDwelling, myAscensions, totalFreeRests } from "kolmafia";
import {
  $item,
  $skill,
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
        you're out of cinch, take a <Strong>free rest!?</Strong>
      </Line>
      {totalCinch > 60 && (
        <Line>
          <Strong color="purple.solid">Fiesta Exit (60%):</Strong> Force a NC on
          your next adventure. You have <Strong>{possibleFiestaExits}</Strong>{" "}
          more possible, with {totalCinch % 60}% cinch left over.
        </Line>
      )}
      <List.Root>
        {totalCinch > 25 && (
          <List.Item>
            <Strong>Party Soundtrack (25%):</Strong> 30 advs of +5 fam weight.
          </List.Item>
        )}
        {totalCinch > 5 && (
          <>
            <List.Item>
              <Strong>Confetti Extravaganza (5%):</Strong> 2x stats, in-combat
            </List.Item>
            {haveUnrestricted($skill`Sweet Synthesis`) && (
              <List.Item>
                <Strong>Projectile Piñata (5%):</Strong> complex candy,
                in-combat
              </List.Item>
            )}
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
