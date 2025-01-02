import { Heading, List, Strong, Text, VStack } from "@chakra-ui/react";
import {
  availableAmount,
  canAdventure,
  inBadMoon,
  isUnrestricted,
  myPath,
  totalTurnsPlayed,
} from "kolmafia";
import {
  $item,
  $location,
  $path,
  AutumnAton,
  get,
  have,
  questStep,
} from "libram";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
import ItemButtons from "../../../components/ItemButtons";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { inventoryUseLink } from "../../../util/links";

const Autumnaton = () => {
  const autumnatonItem = $item`autumn-aton`;
  const haveAutumnatonItem = have(autumnatonItem);
  const hasAutumnaton = get("hasAutumnaton");
  const currentPath = myPath();
  const turncountWhereAutobotReturns = get("autumnatonQuestTurn");
  const autumnatonUpgrades = get("autumnatonUpgrades");
  const autumnatonQuestLocation = get("autumnatonQuestLocation");

  const autobotsReturnTime = AutumnAton.turnsForQuest();

  useNag(
    () => ({
      id: "autumnaton-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/autumnaton.gif",
      node: haveAutumnatonItem && (
        <Tile
          header="Use your autumn-aton"
          imageUrl="/images/itemimages/autumnaton.gif"
          href={inventoryUseLink(autumnatonItem)}
          linkEntireTile
        >
          <Line>
            Next use will take{" "}
            <Strong color="red.solid">{autobotsReturnTime}</Strong> adventures.
          </Line>
        </Tile>
      ),
    }),
    [autobotsReturnTime, haveAutumnatonItem, autumnatonItem],
  );

  if (
    !hasAutumnaton ||
    !isUnrestricted(autumnatonItem) ||
    currentPath === $path`Legacy of Loathing` ||
    currentPath.id === 37 ||
    inBadMoon()
  ) {
    return null;
  }

  const upgradesToGet: string[] = [];
  if (!autumnatonUpgrades.includes("cowcatcher")) {
    upgradesToGet.push(
      "Visit mid underground for +1 autumn item (Cyrpt zone, Daily Dungeon?)",
    );
  }
  if (!autumnatonUpgrades.includes("leftarm1")) {
    upgradesToGet.push("Visit low indoor for +1 item (Haunted Pantry?)");
  }
  if (!autumnatonUpgrades.includes("rightarm1")) {
    upgradesToGet.push(
      "Visit mid outdoor for +1 item (Vanya's Castle, Friars, Shadow Rift?)",
    );
  }
  if (!autumnatonUpgrades.includes("leftleg1")) {
    upgradesToGet.push("Visit low underground for -11 cooldown (Ratbats?)");
  }
  if (!autumnatonUpgrades.includes("rightleg1")) {
    upgradesToGet.push("Visit mid indoor for -11 cooldown (Haunted Library?)");
  }

  const potentialTargets: [string, string][] = [];
  if (get("_inRunBool") && currentPath.id !== 25) {
    if (
      canAdventure($location`Sonofa Beach`) &&
      get("sidequestLighthouseCompleted") === "none" &&
      availableAmount($item`barrel of gunpowder`) < 5
    ) {
      potentialTargets.push(["barrel of gunpowder", "Sonofa Beach"]);
    }
    if (
      !canAdventure($location`Twin Peak`) &&
      get("chasmBridgeProgress") < 30
    ) {
      potentialTargets.push(["bridge parts", "The Smut Orc Logging Camp"]);
    }
    if (
      get("hiddenBowlingAlleyProgress") + availableAmount($item`bowling ball`) <
      6
    ) {
      potentialTargets.push(["bowling balls", "The Hidden Bowling Alley"]);
    }
    if (
      get("twinPeakProgress") < 14 &&
      availableAmount($item`jar of oil`) < 1 &&
      availableAmount($item`bubblin' crude`) < 12
    ) {
      potentialTargets.push(["bubblin' crude", "Oil Peak"]);
    }
    if (
      get("desertExploration") < 100 &&
      availableAmount($item`killing jar`) < 1 &&
      (get("gnasirProgress") & 4) === 0
    ) {
      potentialTargets.push(["killing jar", "The Haunted Library"]);
    }
    if (canAdventure($location`The Oasis`) && get("desertExploration") < 100) {
      potentialTargets.push(["drum machine", "An Oasis"]);
    }
    if (questStep("questL11Ron") < 5) {
      potentialTargets.push(["glark cables", "The Red Zeppelin"]);
    }
  }

  return (
    <Tile
      header="Autumn-aton"
      imageUrl="/images/itemimages/autumnaton.gif"
      href={inventoryUseLink(autumnatonItem)}
      linkEntireTile
    >
      <Line>Grabs items from a zone you've previously visited.</Line>
      {have(autumnatonItem) ? (
        <Line>
          Next use will take{" "}
          <Text as="span" fontWeight="bold" color="red.solid">
            {autobotsReturnTime}
          </Text>{" "}
          adventures.
        </Line>
      ) : (
        <>
          <Line>
            Will return in{" "}
            <Strong color="red.solid">
              {turncountWhereAutobotReturns + 1 - totalTurnsPlayed()}
            </Strong>{" "}
            adventures.
          </Line>
          <Line>
            <Strong>
              Currently exploring: {autumnatonQuestLocation?.identifierString}.
            </Strong>
          </Line>
        </>
      )}
      {upgradesToGet.length > 0 && (
        <List.Root>
          {upgradesToGet.map((text) => (
            <List.Item key={text}>{text}</List.Item>
          ))}
        </List.Root>
      )}
      {potentialTargets.length > 0 && (
        <AdviceTooltipText
          advice={
            <VStack align="start">
              <Heading size="sm">Potential Targets</Heading>
              {potentialTargets.map(([item, location], index) => (
                <Text key={`autumnaton-target-${index}`}>
                  <ItemButtons linkedContent={$item`${item}`} /> ({location})
                </Text>
              ))}
            </VStack>
          }
        >
          Potential Autumnaton Targets
        </AdviceTooltipText>
      )}
    </Tile>
  );
};

export default Autumnaton;
