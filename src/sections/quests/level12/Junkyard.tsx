import { Text } from "@chakra-ui/react";
import { getMonsters, isBanished, Location, Monster, myPath } from "kolmafia";
import { $item, $location, $monster, $path, $skill, have } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import { commaSeparate } from "../../../util/text";

interface LocationData {
  location: Location;
  shorthand: string;
  item: string;
}

const LOCATION_DATA: LocationData[] = [
  {
    location: $location`Next to that Barrel with Something Burning in it`,
    shorthand: "Barrel",
    item: "molybdenum hammer",
  },
  {
    location: $location`Near an Abandoned Refrigerator`,
    shorthand: "Refrigerator",
    item: "molybdenum pliers",
  },
  {
    location: $location`Over Where the Old Tires Are`,
    shorthand: "Tires",
    item: "molybdenum crescent wrench",
  },
  {
    location: $location`Out by that Rusted-Out Car`,
    shorthand: "Car",
    item: "molybdenum screwdriver",
  },
];

interface MonsterTextProps {
  monster: string;
  isBanished: boolean;
}

const MonsterText: FC<MonsterTextProps> = ({ monster, isBanished }) => (
  <Text as="span" color={isBanished ? "fg.subtle" : undefined}>
    {monster}
  </Text>
);

function gremlinShortName(monster: Monster) {
  const name = monster.name;
  return `${name.includes("(tool)") ? "tool " : ""}${name.split(" ")[0]}`;
}

const Junkyard: FC = () => {
  const isQuestFinished = false; // Replace with actual quest state check

  const getStasisAdvice = () => {
    if (have($item`dictionary`)) {
      return <Line>Read from the dictionary to stasis gremlins.</Line>;
    } else if (have($item`facsimile dictionary`)) {
      return (
        <Line>Read from the facsimile dictionary to stasis gremlins.</Line>
      );
    } else if (have($item`seal tooth`)) {
      return <Line>Use your seal tooth to stasis gremlins.</Line>;
    } else if (have($skill`Suckerpunch`)) {
      return <Line>Cast suckerpunch to stasis gremlins.</Line>;
    } else if (myPath() !== $path`Zombie Slayer`) {
      return (
        <Line command="coinmaster buy hermit seal tooth">
          Acquire a seal tooth (from hermit) to stasis gremlins.
        </Line>
      );
    } else if (have($item`beehive`)) {
      return <Line>Use your beehive to stasis gremlins.</Line>;
    }
    return null;
  };

  if (isQuestFinished) {
    return null;
  }

  const haveAllItems = LOCATION_DATA.every((location) =>
    have($item`${location.item}`),
  );

  return (
    <QuestTile
      header="Island War Junkyard"
      imageUrl="/images/itemimages/magnet2.gif"
      href="/bigisland.php?place=junkyard"
    >
      {!have($item`molybdenum magnet`) ? (
        <Line>Talk to Yossarian first.</Line>
      ) : (
        <>
          {haveAllItems ? (
            <Line>Talk to Yossarian to complete quest.</Line>
          ) : (
            <>
              {getStasisAdvice()}
              {LOCATION_DATA.filter(({ item }) => !have($item`${item}`)).map(
                ({ location, shorthand }) => (
                  <Line key={location.id}>
                    <Text as="strong">{shorthand}</Text>:{" "}
                    {commaSeparate(
                      getMonsters(location).map((monster) => (
                        <MonsterText
                          monster={gremlinShortName(monster)}
                          isBanished={isBanished(monster)}
                        />
                      )),
                      getMonsters(location).map((monster) => monster.id),
                    )}
                  </Line>
                ),
              )}
              {!isBanished($monster`A.M.C. gremlin`) && (
                <Line>Potentially banish A.M.C. Gremlin.</Line>
              )}
            </>
          )}
        </>
      )}
    </QuestTile>
  );
};

export default Junkyard;
