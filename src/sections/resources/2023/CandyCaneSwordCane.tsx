import { List, Text } from "@chakra-ui/react";
import {
  canAdventure,
  haveEquipped,
  myAscensions,
  myLocation,
  myPath,
} from "kolmafia";
import { $item, $location, $locations, get, have, questStep } from "libram";

import Line from "../../../components/Line";
import MainLink from "../../../components/MainLink";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";

const CandyCaneSwordCane = () => {
  const candyCaneSwordCane = $item`candy cane sword cane`;
  const haveCcsc = have(candyCaneSwordCane);
  const ccscEquipped = haveEquipped(candyCaneSwordCane);

  const inRun = get("kingLiberated") === false;
  const pathCheck = ![
    "Community Service",
    "Grey Goo",
    "Avatar of Boris",
  ].includes(myPath().name);

  const candyCaneSwordOptions = [
    {
      available: !get("_candyCaneSwordLyle"),
      node: (
        <List.Item key="lyle">
          <MainLink
            href={
              ccscEquipped
                ? "/place.php?whichplace=monorail&action=monorail_lyle"
                : undefined
            }
          >
            Bonus: Lyle's Monorail Buff (+40% init).
          </MainLink>
        </List.Item>
      ),
      location: null,
    },
    {
      available:
        !get("candyCaneSwordBlackForest") && questStep("questL11Black") < 2,
      node: (
        <List.Item key="black">
          Bonus: The Black Forest (+8 exploration).
        </List.Item>
      ),
      location: $location`The Black Forest`,
    },
    {
      available: !get("candyCaneSwordDailyDungeon") && !get("dailyDungeonDone"),
      node: (
        <List.Item key="daily">
          Bonus: Daily Dungeon (+1 fat loot token).
        </List.Item>
      ),
      location: $location`The Daily Dungeon`,
    },
    {
      available:
        !get("candyCaneSwordApartmentBuilding") &&
        get("hiddenApartmentProgress") < 8,
      node: (
        <List.Item key="apartment">
          Bonus: Hidden Apartment (+1 Curse).
        </List.Item>
      ),
      location: $location`The Hidden Apartment Building`,
    },
    {
      available:
        !get("candyCaneSwordBowlingAlley") &&
        get("hiddenBowlingAlleyProgress") < 7,
      node: (
        <List.Item key="bowl">
          Bonus: Hidden Bowling Alley (+1 free bowl).
        </List.Item>
      ),
      location: $location`The Hidden Bowling Alley`,
    },
    {
      available:
        !get("candyCaneSwordShore") && get("lastIslandUnlock") < myAscensions(),
      node: (
        <List.Item key="shore">
          Alternate: Shore (2 scrips for the price of 1).
        </List.Item>
      ),
      location: $location`The Shore, Inc. Travel Agency`,
    },
    {
      available:
        !$locations`Wartime Hippy Camp, Wartime Frat House`.some((l) =>
          canAdventure(l),
        ) && questStep("questL12War") < 1,
      node: (
        <List.Item key="hippy">
          Alternate: Hippy Camp (Redirect to the War Start NC).
        </List.Item>
      ),
      location: $location`Wartime Hippy Camp`,
    },
    {
      available: get("zeppelinProtestors") < 80,
      node: (
        <List.Item key="zeppelin">
          Alternate: Zeppelin Protesters{" "}
          <Text as="span" color="purple.solid">
            (double Sleaze damage!)
          </Text>
          .
        </List.Item>
      ),
      location: $location`A Mob of Zeppelin Protesters`,
    },
  ];

  const availableOptions = candyCaneSwordOptions.filter(
    ({ available }) => available,
  );

  const current = myLocation();
  const displayNag = availableOptions.some(
    ({ location }) => current === location,
  );

  // FIXME: Actually check if we're in a CCSC zone??
  useNag(
    () => ({
      id: "candy-cane-sword-cane-nag",
      priority: NagPriority.ERROR,
      imageUrl: "/images/itemimages/ccsword.gif",
      node: haveCcsc && inRun && pathCheck && displayNag && (
        <Tile header="Wear Your Candy" linkedContent={candyCaneSwordCane}>
          <Line>
            <Text as="span" color="red.solid">
              You're
            </Text>{" "}
            <Text as="span" color="green.solid">
              in a
            </Text>{" "}
            <Text as="span" color="red.solid">
              candy
            </Text>{" "}
            <Text as="span" color="green.solid">
              cane
            </Text>{" "}
            <Text as="span" color="red.solid">
              sword
            </Text>{" "}
            <Text as="span" color="green.solid">
              cane
            </Text>{" "}
            <Text as="span" color="red.solid">
              noncom
            </Text>{" "}
            <Text as="span" color="green.solid">
              zone!
            </Text>
          </Line>
          <Line>
            {ccscEquipped
              ? "Keep your Candy Cane Sword Cane equipped!"
              : "Equip your Candy Cane Sword Cane!"}
          </Line>
        </Tile>
      ),
    }),
    [haveCcsc, inRun, pathCheck, displayNag, candyCaneSwordCane, ccscEquipped],
  );

  if (!inRun || !pathCheck || availableOptions.length === 0) {
    return null;
  }

  return (
    haveCcsc &&
    inRun &&
    pathCheck && (
      <Tile
        header="Candy Cane Sword Cane NCs"
        linkedContent={candyCaneSwordCane}
      >
        {!ccscEquipped ? (
          <Line>Ensure your CCSC is equipped for useful NCs:</Line>
        ) : (
          <Line>CCSC equipped! Useful NCs:</Line>
        )}
        <List.Root>{availableOptions.map(({ node }) => node)}</List.Root>
      </Tile>
    )
  );
};

export default CandyCaneSwordCane;
