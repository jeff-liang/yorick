import { Card, Image, Stack, Text } from "@chakra-ui/react";
import { decode } from "html-entities";
import {
  appearanceRates,
  getMonsters,
  isBanished,
  itemDropsArray,
  Location,
  Monster,
  trackCopyCount,
  trackIgnoreQueue,
} from "kolmafia";
import { $monster, getBanishedMonsters, sum } from "libram";
import { FC } from "react";

import { dropRateModifier } from "../util/item";

import { Tooltip } from "./ui/tooltip";

export interface DetailedMonstersProps {
  location: Location;
}

const importantItems = [
  "Knob Goblin harem pants",
  "Knob Goblin harem veil",
  "evil eye",
  "A-Boo clue",
  "rusty hedge trimmers",
  "bubblin' crude",
  "Mohawk wig",
  "amulet of extreme plot significance",
  "stunt nuts",
  "bird rib",
  "lion oil",
  "killing jar",
  "goat cheese",
  "sonar-in-a-biscuit",
  "bowling ball",
  "book of matches",
  "cigarette lighter",
  "glark cable",
  "blasting soda",
  "bottle of Chateau de Vinegar",
  "tomb ratchet",
  "filthworm hatchling scent gland",
  "filthworm drone scent gland",
  "filthworm royal guard scent gland",
  "star",
  "line",
  "shadow brick",
];

const DetailedMonsters: FC<DetailedMonstersProps> = ({ location }) => {
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
  const monsterFrequency = monsterCopies.map(
    ({ monster, copiesWithQueue }) => ({
      monster,
      frequency: copiesWithQueue / totalCopiesWithQueue,
    }),
  );

  const banishedMonsters = [...getBanishedMonsters().entries()];

  return monsterFrequency.length === 0 ? (
    "No monsters."
  ) : (
    <Stack direction="row" wrap="wrap">
      {monsterFrequency.map(({ monster, frequency }) => {
        const text = (
          <>
            {monster.name} ({queue.includes(monster) ? "Q " : ""}
            {(100 * frequency).toFixed(0)}%)
          </>
        );
        const banisher = banishedMonsters.find(([, m]) => m === monster)?.[0];

        const title = (
          <Card.Title
            fontSize="sm"
            lineHeight="1.2"
            color={banisher ? "fg.subtle" : undefined}
          >
            <Image
              display="inline"
              verticalAlign="baseline"
              w="1em"
              h="1em"
              src={`/images/adventureimages/${monster.image}`}
            />{" "}
            {text}
          </Card.Title>
        );
        return (
          <Card.Root
            w="calc(50% - var(--chakra-spacing-2) / 2)"
            key={monster.id}
          >
            <Card.Body p={2} gap={1}>
              {banisher ? (
                <Tooltip showArrow content={`Banished: ${banisher.name}`}>
                  {title}
                </Tooltip>
              ) : queue.includes(monster) ? (
                <Tooltip
                  showArrow
                  content={`In combat queue, frequency reduced by 75%.`}
                >
                  {title}
                </Tooltip>
              ) : (
                title
              )}
              <Card.Description fontSize="xs">
                {itemDropsArray(monster)
                  .filter(({ type }) => type !== "p" && type !== "a")
                  .map(({ drop, rate }) => (
                    <Text
                      {...(importantItems.includes(drop.name)
                        ? { bg: "cyan.subtle", fontWeight: "bold" }
                        : undefined)}
                    >
                      <Image
                        display="inline"
                        verticalAlign="baseline"
                        h="0.8em"
                        src={`/images/itemimages/${drop.image}`}
                      />{" "}
                      {decode(drop.name)} (
                      {rate === 0
                        ? "?"
                        : Math.min(
                            100,
                            rate * (1 + dropRateModifier(drop) / 100),
                          ).toFixed(0)}
                      %)
                    </Text>
                  ))}
              </Card.Description>
            </Card.Body>
          </Card.Root>
        );
      })}
    </Stack>
  );
};

export default DetailedMonsters;
