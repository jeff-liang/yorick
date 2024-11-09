import { Text } from "@chakra-ui/react";
import { isUnrestricted, myPath, myPrimestat } from "kolmafia";
import { $item, $path, $stat, get } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inRun } from "../../../util/quest";
import { plural } from "../../../util/text";

const ClanFortune = () => {
  const clanCarnivalGame = $item`Clan Carnival Game`;
  const usedBuff = get("_clanFortuneBuffUsed");
  const consultUses = get("_clanFortuneConsultUses");
  const path = myPath();
  const isGLover = path === $path`G-Lover`;

  if (
    !haveUnrestricted($item`Clan VIP Lounge key`) ||
    !isUnrestricted(clanCarnivalGame) ||
    (usedBuff && consultUses >= 3)
  ) {
    return null;
  }

  return (
    <Tile
      header="Fortune Teller"
      imageUrl="/images/adventureimages/madamezatara.gif"
      href="/clan_viplounge.php?preaction=lovetester"
    >
      {!usedBuff && (
        <>
          <Line>
            <Text as="b">Susie:</Text> +5 familiar weight, +familiar experience.
          </Line>
          {!isGLover && (
            <>
              <Line>
                <Text as="b">Hagnk:</Text> +50% item/booze/food.
              </Line>
              <Line>
                <Text as="b">Meatsmith:</Text> +100% meat, +50% gear drop.
              </Line>
            </>
          )}
          {inRun() && (
            <>
              {(myPrimestat() === $stat`Muscle` ||
                path === $path`Community Service`) && (
                <Line>
                  <Text as="b">Gunther:</Text> +5 muscle stats/fight, +100%
                  muscle, +50% HP.
                </Line>
              )}
              {(myPrimestat() === $stat`Mysticality` ||
                path === $path`Community Service`) && (
                <Line>
                  <Text as="b">Gorgonzola:</Text> +5 myst stats/fight, +100%
                  myst, +50% MP.
                </Line>
              )}
              {!isGLover && (
                <Line>
                  <Text as="b">Shifty:</Text> +5 moxie stats/fight, +100% moxie,
                  +50% init.
                </Line>
              )}
            </>
          )}
        </>
      )}
      {consultUses < 3 && (
        <Line>
          {plural(3 - consultUses, "fortune clan consult")} remaining.
        </Line>
      )}
    </Tile>
  );
};

export default ClanFortune;
