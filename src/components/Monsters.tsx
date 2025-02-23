import { Strong, Text } from "@chakra-ui/react";
import {
  appearanceRates,
  getMonsters,
  isBanished,
  Location,
  Monster,
  trackCopyCount,
  trackIgnoreQueue,
} from "kolmafia";
import { $monster, getBanishedMonsters, sum } from "libram";
import { FC } from "react";

import { separate } from "../util/text";

import { Tooltip } from "./ui/tooltip";

export interface MonstersProps {
  location: Location;
  target?: Monster | Monster[];
}

const Monsters: FC<MonstersProps> = ({ location, target = [] }) => {
  const targets = Array.isArray(target) ? target : [target];
  const monsters = getMonsters(location);
  const appearingMonsters = monsters.filter(
    (monster) =>
      monster !== $monster`none` && appearanceRates(location)[monster.name] > 0,
  );
  const queue = (location.combatQueue ?? "")
    .split("; ")
    .filter((s) => s)
    .map((name) => Monster.get(name));

  const monsterCopies = appearingMonsters.map((monster) => {
    const copies = isBanished(monster) ? 0 : 1 + trackCopyCount(monster);
    const reject = !trackIgnoreQueue(monster);
    const copiesWithQueue =
      (reject && queue.includes(monster) ? 0.25 : 1) * copies;
    return { monster, copiesWithQueue };
  });

  const totalCopiesWithQueue = sum(monsterCopies, "copiesWithQueue");
  const monsterFrequency = monsterCopies
    .map(({ monster, copiesWithQueue }) => ({
      monster,
      frequency: copiesWithQueue / totalCopiesWithQueue,
    }))
    .sort(({ monster: x }, { monster: y }) =>
      targets.includes(x) ? -1 : targets.includes(y) ? 1 : 0,
    );

  const banishedMonsters = [...getBanishedMonsters().entries()];

  return monsterFrequency.length === 0 ? (
    "No monsters."
  ) : (
    <>
      Monsters:{" "}
      {separate(
        monsterFrequency.map(({ monster, frequency }) => {
          const text = `${monster.name} (${queue.includes(monster) ? "Q " : ""}${(100 * frequency).toFixed(0)}%)`;
          const banisher = banishedMonsters.find(([, m]) => m === monster)?.[0];
          return targets.includes(monster) ? (
            <Strong>{text}</Strong>
          ) : banisher ? (
            <Tooltip showArrow content={`Banished: ${banisher.name}`}>
              <Text as="span" color="fg.subtle">
                {text}
              </Text>
            </Tooltip>
          ) : (
            text
          );
        }),
        ", ",
        monsterFrequency.map(({ monster }) => monster.id),
      )}
      .
    </>
  );
};

export default Monsters;
