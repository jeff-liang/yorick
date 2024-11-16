import { Text } from "@chakra-ui/react";
import {
  availableAmount,
  haveEquipped,
  myPath,
  totalTurnsPlayed,
} from "kolmafia";
import { $item, $path, get, getKramcoWandererChance, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { inventoryActionLink } from "../../../util/links";
import { ordinal, plural } from "../../../util/text";

const KramcoSausageOMatic = () => {
  const replicaKramcoSausageOMatic = $item`replica Kramco Sausage-o-Matic™`;
  const kramcoSausageOMatic = have(replicaKramcoSausageOMatic)
    ? replicaKramcoSausageOMatic
    : $item`Kramco Sausage-o-Matic™`;
  const haveKramco = haveUnrestricted(kramcoSausageOMatic);
  const magicalSausageCasing = $item`magical sausage casing`;
  const magicalSausage = $item`magical sausage`;
  const path = myPath();

  const probabilityOfSausageFight = getKramcoWandererChance();
  const lastTurn = get("_lastSausageMonsterTurn");
  const turnsToNextGuaranteedFight = Math.round(
    (1 / probabilityOfSausageFight) *
      (1 + totalTurnsPlayed() - (lastTurn || totalTurnsPlayed())),
  );
  const kramcosEquipped = haveEquipped(kramcoSausageOMatic);

  const fightsToday = get("_sausageFights");
  const sausageCasings = availableAmount(magicalSausageCasing);
  const sausagesEaten = get("_sausagesEaten");
  const sausagesAvailable = availableAmount(magicalSausage);
  const possibleSausages = sausagesAvailable + sausageCasings;
  const sausagesMade = get("_sausagesMade");
  const meatCost = 111 * (sausagesMade + 1);

  useNag(
    () => ({
      id: "kramco-sausage-goblin-nag",
      priority: NagPriority.HIGH,
      imageUrl: "/images/itemimages/saugrinder.gif",
      node: haveKramco &&
        path !== $path`Live. Ascend. Repeat.` &&
        probabilityOfSausageFight >= 1.0 && (
          <Tile
            header={`Fight ${ordinal(fightsToday + 1)} sausage goblin`}
            id="kramco-sausage-goblin-nag"
            linkedContent={kramcoSausageOMatic}
          >
            {!kramcosEquipped && (
              <Line color="red.500">
                Equip the Kramco Sausage-o-Matic™ first.
              </Line>
            )}
            <Line>Free fight that burns delay.</Line>
            {/* TODO: Add delay suggestions. */}
          </Tile>
        ),
    }),
    [
      haveKramco,
      path,
      probabilityOfSausageFight,
      fightsToday,
      kramcoSausageOMatic,
      kramcosEquipped,
    ],
  );

  if (!haveKramco || path === $path`Live. Ascend. Repeat.`) {
    return null;
  }

  return (
    <Tile
      header={
        probabilityOfSausageFight >= 1.0
          ? "Sausage goblin fight now"
          : `${Math.round(probabilityOfSausageFight * 100)}% chance of Kramco fight`
      }
      linkedContent={kramcoSausageOMatic}
      href={inventoryActionLink("grind")}
    >
      {!kramcosEquipped && (
        <Line>
          <Text as="span" color="red.500">
            Equip the Kramco Sausage-o-Matic™ first.
          </Text>
        </Line>
      )}
      {turnsToNextGuaranteedFight > 0 && (
        <Line>
          {plural(turnsToNextGuaranteedFight, "turn")} until next guaranteed
          goblin fight.
        </Line>
      )}
      <Line>Does not cost a turn; burns delay.</Line>
      {fightsToday > 0 && (
        <Line>Fought {plural(fightsToday, "goblin")} so far.</Line>
      )}

      {possibleSausages > 0 && sausagesEaten < 23 && (
        <>
          <Text as="b">
            {plural(
              Math.min(sausagesAvailable, 23 - sausagesEaten),
              "magical sausage",
            )}{" "}
            edible.
          </Text>
          <Line>+1 adventure and +999 MP each.</Line>
          <Line>
            <Text as="b">{sausageCasings}</Text> casings available,{" "}
            <Text as="b">{sausagesEaten}/23</Text> eaten today.
          </Line>
          {sausagesMade > 22 ? (
            <Line>
              <Text color="purple.500">
                {sausagesMade} sausages made today.
              </Text>
            </Line>
          ) : (
            <Line>
              {plural(sausagesMade, "sausage")} made; next costs {meatCost}{" "}
              meat.
            </Line>
          )}
        </>
      )}
    </Tile>
  );
};

export default KramcoSausageOMatic;
