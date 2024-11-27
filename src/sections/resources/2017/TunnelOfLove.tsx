import { Strong } from "@chakra-ui/react";
import { isUnrestricted, myLevel, myPath, myPrimestat } from "kolmafia";
import {
  $familiar,
  $item,
  $path,
  $stat,
  TunnelOfLove as TunnelLibram,
} from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inRun } from "../../../util/quest";
import { commaOr } from "../../../util/text";

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
                <Strong
                  color={
                    primestat === $stat`Muscle` && inRun() && myLevel() < 13
                      ? "green.solid"
                      : undefined
                  }
                >
                  Eardigan
                </Strong>{" "}
                (+25% muscle exp, +25 ML).
              </Line>
              {path.name !== "G-Lover" && (
                <Line>
                  <Strong
                    color={
                      primestat === $stat`Mysticality` &&
                      inRun() &&
                      myLevel() < 13
                        ? "green.solid"
                        : undefined
                    }
                  >
                    Epaulettes
                  </Strong>{" "}
                  (+25% myst exp).
                </Line>
              )}
              <Line>
                <Strong
                  color={
                    (primestat === $stat`Moxie` && inRun() && myLevel() < 13) ||
                    !inRun() ||
                    myLevel() >= 13
                      ? "green.solid"
                      : undefined
                  }
                >
                  Earrings
                </Strong>{" "}
                (+25% moxie exp, +50% meat, +3 all res).
              </Line>
            </>
          )}

          <Line>
            <Strong>50-turn buff:</Strong>{" "}
            {commaOr([
              path !== $path`G-Lover` && "+10 stats/fight",
              "+10 familiar weight",
              "+50% item",
            ])}
            .
          </Line>

          <Line>
            <Strong>Useful item:</Strong>{" "}
            {commaOr([
              path !== $path`Live. Ascend. Repeat.` &&
                "enamorang (wandering copier)",
              "chocolate (adventures)",
              haveUnrestricted($familiar`Space Jellyfish`) && "toast (jelly)",
            ])}
            .
          </Line>
        </>
      )}
    </Tile>
  );
};

export default TunnelOfLove;
