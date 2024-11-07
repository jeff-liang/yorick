import { Text } from "@chakra-ui/react";
import { isUnrestricted, myLevel, myPath, myPrimestat } from "kolmafia";
import { $familiar, $item, $stat, TunnelOfLove as TunnelLibram } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inRun } from "../../../util/quest";

const TunnelOfLove = () => {
  const heartShapedCrate = $item`heart-shaped crate`;
  const primestat = myPrimestat();
  const path = myPath();

  if (
    !isUnrestricted(heartShapedCrate) ||
    !TunnelLibram.have() ||
    TunnelLibram.isUsed()
  ) {
    return null;
  }

  return (
    <Tile
      header="Take a Love Trip"
      imageUrl="/images/itemimages/heart.gif"
      href="/place.php?whichplace=town_wrong"
    >
      <Line>
        Three free fights: Attack, spell, and pickpocket respectively for
        elixirs.
      </Line>
      {path.name === "Gelatinous Noob" ? (
        <Line>Equipment choice unimportant.</Line>
      ) : (
        <>
          {path.name !== "Gelatinous Noob" && (
            <>
              <Line>
                <Text
                  as="b"
                  color={
                    primestat === $stat`Muscle` && inRun() && myLevel() < 13
                      ? "green.500"
                      : undefined
                  }
                >
                  Eardigan
                </Text>{" "}
                (+25% muscle exp, +25 ML).
              </Line>
              {path.name !== "G-Lover" && (
                <Line>
                  <Text
                    as="b"
                    color={
                      primestat === $stat`Mysticality` &&
                      inRun() &&
                      myLevel() < 13
                        ? "green.500"
                        : undefined
                    }
                  >
                    Epaulettes
                  </Text>{" "}
                  (+25% myst exp).
                </Line>
              )}
              <Line>
                <Text
                  as="b"
                  color={
                    (primestat === $stat`Moxie` && inRun() && myLevel() < 13) ||
                    !inRun() ||
                    myLevel() >= 13
                      ? "green.500"
                      : undefined
                  }
                >
                  Earrings
                </Text>{" "}
                (+25% moxie exp, +50% meat, +3 all res).
              </Line>
            </>
          )}

          {path.name !== "G-Lover" && <Line>+10 stats/fight.</Line>}
          <Line>+10 familiar weight.</Line>
          <Line>+50% item.</Line>

          {path.name !== "Live. Ascend. Repeat." && (
            <Line>Single-use wandering copier.</Line>
          )}
          <Line>Chat hearts.</Line>
          {path.name !== "Slow and Steady" && path.name !== "G-Lover" && (
            <Line>Chocolate (adventures).</Line>
          )}
          {haveUnrestricted($familiar`Space Jellyfish`) && <Line>Toast.</Line>}
        </>
      )}
    </Tile>
  );
};

export default TunnelOfLove;
