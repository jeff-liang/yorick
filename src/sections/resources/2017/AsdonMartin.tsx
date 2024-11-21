import { Text } from "@chakra-ui/react";
import {
  canInteract,
  getFuel,
  getWorkshed,
  myPath,
  myTurncount,
} from "kolmafia";
import { $item, $path, get } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { activeBanishes } from "../../../util/banish";
import { plural } from "../../../util/text";

const AsdonMartin = () => {
  const asdonMartinKeyfob = $item`Asdon Martin keyfob (on ring)`;

  const inFamiliarsPath = myPath() === $path`Pocket Familiars`;
  const inGLoverPath = myPath() === $path`G-Lover`;
  const freeRunsUsable = myPath() !== $path`BIG!`;

  const banisherActive = activeBanishes().find(
    (b) => b.banishSource === "Spring-Loaded Front Bumper",
  );
  const currentFuel = getFuel();
  const missileLauncherUsed = get("_missileLauncherUsed");

  const workshedAsdon = getWorkshed() === asdonMartinKeyfob;

  useNag(
    () => ({
      id: "asdon-martin-bumper",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/asdonfob.gif",
      node: workshedAsdon && !banisherActive && (
        <Tile
          header="Cast Spring-Loaded Front Bumper"
          imageUrl="/images/itemimages/asdonfob.gif"
        >
          <Line>
            {currentFuel >= 50 ? (
              `Banish${freeRunsUsable ? "/free run" : ""}, costs 50 fuel.`
            ) : (
              <Text as="span" color="red.solid">
                Need 50 fuel first.
              </Text>
            )}
            {inFamiliarsPath && (
              <Text>
                In FantasyRealm, where you can extract for consumables.
              </Text>
            )}
          </Line>
        </Tile>
      ),
    }),
    [
      workshedAsdon,
      banisherActive,
      currentFuel,
      freeRunsUsable,
      inFamiliarsPath,
    ],
  );

  if (!workshedAsdon) return null;

  return (
    <Tile header="Asdon Martin" imageUrl="/images/itemimages/asdonfob.gif">
      <Line>Current Fuel: {currentFuel}</Line>
      {!canInteract() && <Line>Can create and feed loaf of soda breads.</Line>}

      {!missileLauncherUsed && !inFamiliarsPath && !inGLoverPath && (
        <Line>
          <Text as="span" color={currentFuel >= 100 ? undefined : "red.solid"}>
            Missile Launcher available. Costs 100 fuel, instakill +
            YR-equivalent.
          </Text>
        </Line>
      )}

      {banisherActive && (
        <Line>
          {plural(
            banisherActive.banishTurnLength +
              banisherActive.turnBanished -
              myTurncount(),
            "turn",
          )}{" "}
          until next Asdon bumper (banish/runaway).
        </Line>
      )}
    </Tile>
  );
};

export default AsdonMartin;
