import { Card, Image, Stack, Text } from "@chakra-ui/react";
import { decode } from "html-entities";
import { itemDropsArray, Location } from "kolmafia";
import { getBanishedMonsters } from "libram";
import { FC } from "react";

import { dropRateModifier } from "../util/item";
import { monsterFrequencyAndQueue } from "../util/monsters";

import { Tooltip } from "./ui/tooltip";

export interface DetailedMonstersProps {
  location: Location;
}

const importantItems = [
  "sonar-in-a-biscuit",
  "concentrated cooking",
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
  "forest tears",
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
  const { monsterFrequency, queue } = monsterFrequencyAndQueue(location);

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
            fontSize={["xs", "sm"]}
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
            w="100%"
            sm={{ w: "calc(50% - var(--chakra-spacing-2) / 2)" }}
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
              <Card.Description fontSize={["2xs", "xs"]}>
                {itemDropsArray(monster)
                  .filter(({ type }) => type !== "p" && type !== "a")
                  .map(({ drop, rate }, index) => (
                    <Text
                      key={index} // these arrays shouldn't change.
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
