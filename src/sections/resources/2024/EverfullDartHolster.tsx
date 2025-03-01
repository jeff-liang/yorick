import { Text } from "@chakra-ui/react";
import { haveEquipped, myPath } from "kolmafia";
import { $effect, $item, $path, get, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";

const EverfullDartHolster = () => {
  const everfullDartHolster = $item`Everfull Dart Holster`;
  const haveHolster = haveUnrestricted(everfullDartHolster);
  const everythingLooksRed = $effect`Everything Looks Red`;
  const haveELR = have(everythingLooksRed);
  const perks = get("everfullDartPerks");
  const dartCooldown =
    50 -
    (perks.includes("You are less impressed by bullseyes") ? 10 : 0) -
    (perks.includes("Bullseyes do not impress you much") ? 10 : 0);
  const dartSkill = get("dartsThrown");
  const dartsNeededForNextPerk =
    Math.floor(Math.sqrt(dartSkill) + 1) ** 2 - dartSkill;
  const holsterEquipped = haveEquipped(everfullDartHolster);
  const inAvantGuard = myPath() === $path`Avant Guard`;

  useNag(
    () => ({
      id: "everfull-dart-holster-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/dartholster.gif",
      node: !haveELR && haveHolster && !inAvantGuard && (
        <Tile
          header="Throw a bullseye"
          id="bullseye-nag"
          linkedContent={everfullDartHolster}
        >
          {holsterEquipped ? (
            <Line>Shoot a bullseye! ({dartCooldown} turns ELR)</Line>
          ) : (
            <Line color="red.solid">Equip the dart holster first.</Line>
          )}
        </Tile>
      ),
    }),
    [
      haveELR,
      haveHolster,
      inAvantGuard,
      everfullDartHolster,
      holsterEquipped,
      dartCooldown,
    ],
  );

  if (!haveHolster || dartSkill >= 401) return null;

  return (
    <Tile linkedContent={everfullDartHolster}>
      <Line>Current dart skill: {dartSkill}.</Line>
      <Line>
        <Text as="span" color="blue.solid">
          {dartsNeededForNextPerk}
        </Text>{" "}
        darts needed for next Perk.
      </Line>
      {!holsterEquipped && (
        <Line>
          <Text as="span" color="red.solid">
            Equip the dart holster first.
          </Text>
        </Line>
      )}
      {holsterEquipped && (
        <Line>
          <Text as="span" color="blue.solid">
            Dart holster equipped.
          </Text>
        </Line>
      )}
    </Tile>
  );
};

export default EverfullDartHolster;
