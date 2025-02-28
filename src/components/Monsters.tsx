import { Strong, Text } from "@chakra-ui/react";
import { Location, Monster } from "kolmafia";
import { getBanishedMonsters } from "libram";
import { FC } from "react";

import { monsterFrequencyAndQueue } from "../util/monsters";
import { separate } from "../util/text";

import { Tooltip } from "./ui/tooltip";

export interface MonstersProps {
  location: Location;
  target?: Monster | Monster[];
}

const Monsters: FC<MonstersProps> = ({ location, target = [] }) => {
  const targets = Array.isArray(target) ? target : [target];

  const { monsterFrequency, queue } = monsterFrequencyAndQueue(location);

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
