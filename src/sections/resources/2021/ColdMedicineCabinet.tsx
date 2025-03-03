import { List } from "@chakra-ui/react";
import { canAdventure, Location, myAscensions } from "kolmafia";
import { $item, $location, $skill, get, have, questStep, sum } from "libram";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
import Line from "../../../components/Line";
import MainLink from "../../../components/MainLink";
import Tile from "../../../components/Tile";
import { haveMachete } from "../../../questInfo/hiddenCity";
import { hiddenTempleInfo } from "../../../questInfo/hiddenTemple";
import { pastNinjaSnowmen, yetiCount } from "../../../questInfo/trapper";
import { getCMCInfo } from "../../../resourceInfo/cmc";
import { FORCE_SOURCES } from "../../../resourceInfo/noncombatForces";
import { haveUnrestricted } from "../../../util/available";
import { parentPlaceLink } from "../../../util/links";
import { Step } from "../../../util/quest";
import { plural } from "../../../util/text";

interface PushTurn {
  name: string;
  location?: Location;
  available?: boolean;
  remaining: number;
}

const ColdMedicineCabinet = () => {
  const cmcInfo = getCMCInfo();
  if (!cmcInfo.available) return null;

  const needPoolCue =
    !haveUnrestricted($skill`Comprehensive Cartography`) &&
    questStep("questM20Necklace") < 2;
  const pushTurns: PushTurn[] = [
    {
      name: "Billiards Room NC",
      location: $location`The Haunted Billiards Room`,
      available: canAdventure($location`The Haunted Billiards Room`),
      remaining: +needPoolCue && +!have($item`[7302]Spookyraven library key`),
    },
    {
      name: "Cobb's Knob unlock NC",
      location: $location`The Outskirts of Cobb's Knob`,
      available: questStep("questL05Goblin") === Step.STARTED,
      remaining: +(questStep("questL05Goblin") < 1),
    },
    {
      name: "Yeti fight",
      location: $location`Mist-Shrouded Peak`,
      available: pastNinjaSnowmen(),
      remaining: Math.max(0, 4 - yetiCount()),
    },
    {
      name: "Hidden Temple unlock NC",
      location: $location`The Spooky Forest`,
      available: canAdventure($location`The Spooky Forest`),
      remaining: hiddenTempleInfo().ncsNeeded,
    },
    {
      name: "Hidden City nostril NC",
      location: $location`The Hidden Temple`,
      available: canAdventure($location`The Hidden Temple`),
      remaining: +!have($item`the Nostril of the Serpent`),
    },
    {
      name: "Hidden City unlock turn",
      location: $location`The Hidden Temple`,
      available:
        canAdventure($location`The Hidden Temple`) &&
        have($item`the Nostril of the Serpent`),
      remaining: questStep("questL11Worship") <= 2 ? 3 : 0,
    },
    {
      name: "Hidden City zone unlock",
      location: $location`The Hidden Hospital`,
      available: questStep("questL11Worship") === 3 && haveMachete(),
      remaining: sum(
        [
          "questL11Curses",
          "questL11Business",
          "questL11Doctor",
          "questL11Spare",
        ],
        (pref) => +(questStep(pref) === Step.UNSTARTED),
      ),
    },
    {
      name: "Zeppelin Mob clover NC",
      location: $location`A Mob of Zeppelin Protesters`,
      available: questStep("questL11Ron") >= Step.STARTED,
      remaining: Math.ceil(
        get("zeppelinProtestors") /
          (have($item`candy cane sword cane`) ? 40 : 20),
      ),
    },
    {
      name: "War unlock NC",
      location: $location`Wartime Hippy Camp`,
      available:
        questStep("questL12War") === Step.STARTED &&
        get("lastIslandUnlock") >= myAscensions(),
      remaining: +(questStep("questL12War") <= Step.STARTED),
    },
    {
      name: "Daily Dungeon chest",
      location: $location`The Daily Dungeon`,
      available: get("_lastDailyDungeonRoom") >= 14,
      remaining: +!get("dailyDungeonDone"),
    },
    {
      name: "NC force",
      remaining: sum(FORCE_SOURCES, ({ remaining }) => remaining()),
    },
  ];

  const pushTurnsRemaining = pushTurns
    .map(({ name, location, available, remaining }) => {
      return {
        name,
        available: available === undefined || available,
        remaining,
        rendered: location ? (
          <MainLink href={parentPlaceLink(location)}>
            {plural(remaining, name)}
          </MainLink>
        ) : (
          plural(remaining, name)
        ),
      };
    })
    .filter(({ remaining }) => remaining > 0);
  const pushTurnsAvailable = pushTurnsRemaining.filter(
    ({ available }) => available,
  );
  const countPushTurnsAvailable = sum(
    pushTurnsAvailable,
    ({ remaining }) => remaining,
  );
  const pushTurnsLater = pushTurnsRemaining.filter(
    ({ available }) => !available,
  );
  const countPushTurnsLater = sum(pushTurnsLater, ({ remaining }) => remaining);

  const cabinet = $item`cold medicine cabinet`;

  return (
    <Tile linkedContent={cabinet} href="/campground.php?action=workshed">
      <Line>{5 - cmcInfo.consults} consults available.</Line>
      <Line>
        Next consult{" "}
        {cmcInfo.turnsToConsult <= 0
          ? "available now"
          : `in ${plural(cmcInfo.turnsToConsult, "turn")}`}
        .
      </Line>
      <Line>Current environments: {cmcInfo.environments.join("")}.</Line>
      <Line>Next drop: {cmcInfo.result}.</Line>
      {countPushTurnsAvailable > 0 && (
        <>
          <Line>{plural(countPushTurnsAvailable, "push turn")} available.</Line>
          <List.Root>
            {pushTurnsAvailable.map(({ name, rendered }) => (
              <List.Item key={name}>{rendered}.</List.Item>
            ))}
          </List.Root>
        </>
      )}
      {countPushTurnsLater > 0 && (
        <Line>
          <AdviceTooltipText
            advice={
              <List.Root>
                {pushTurnsLater.map(({ name, rendered }) => (
                  <List.Item key={name}>{rendered}.</List.Item>
                ))}
              </List.Root>
            }
          >
            {plural(countPushTurnsLater, "push turn")} later.
          </AdviceTooltipText>
        </Line>
      )}
    </Tile>
  );
};

export default ColdMedicineCabinet;
