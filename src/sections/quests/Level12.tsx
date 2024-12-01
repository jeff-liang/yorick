import {
  haveEquipped,
  haveOutfit,
  isWearingOutfit,
  myAscensions,
  myLevel,
} from "kolmafia";
import { $item, get, have, questStep } from "libram";
import { FC } from "react";

import AsyncLink from "../../components/AsyncLink";
import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { turnsToSeeNoncombat } from "../../util/calc";
import { atStep, Step } from "../../util/quest";
import { commaOr, plural } from "../../util/text";

import Arena from "./level12/Arena";
import Farm from "./level12/Farm";
import Junkyard from "./level12/Junkyard";
import Lighthouse from "./level12/Lighthouse";
import Nuns from "./level12/Nuns";
import Orchard from "./level12/Orchard";

const ISLAND_PREWAR_URL = "/island.php";
const ISLAND_WAR_URL = "/bigisland.php";

function pluralEnemyCount(
  count: number,
  description: string | null,
  side: "hippy" | "frat boy",
) {
  return plural(
    count,
    `${description ? `${description} ` : ""}${side}`,
    `${description ? `${description} ` : ""}${side === "frat boy" ? "frat boys" : "hippies"}`,
  );
}

const Level12: FC = () => {
  const islandUnlocked = get("lastIslandUnlock") === myAscensions();
  if (!islandUnlocked) {
    return (
      <QuestTile
        header={
          myLevel() < 12
            ? "End the Island War (level 12)"
            : "End the Island War (unlock island)"
        }
        id="island-war-quest"
        imageUrl="/images/itemimages/fmedbeta.gif"
        disabled={true}
      />
    );
  }

  const ccsc = $item`candy cane sword cane`;
  const haveCcsc = have(ccsc);
  const ccscEquipped = haveEquipped(ccsc);

  const step = questStep("questL12War");
  const hippiesDefeated = get("hippiesDefeated");
  const fratboysDefeated = get("fratboysDefeated");
  const outfits = ["War Hippy Fatigues", "Frat Warrior Fatigues"];
  const haveHippyFatigues = haveOutfit("War Hippy Fatigues");
  const hippyFatiguesEquipped = isWearingOutfit("War Hippy Fatigues");
  const haveFratFatigues = haveOutfit("Frat Warrior Fatigues");
  const fratFatiguesEquipped = isWearingOutfit("Frat Warrior Fatigues");

  const sideQuestNames = [
    "Lighthouse",
    "Junkyard",
    "Arena",
    "Orchard",
    "Nuns",
    "Farm",
  ] as const;
  const sideQuests = sideQuestNames.map((name) => `sidequest${name}Completed`);

  const remainingSidequestNames = sideQuestNames.filter(
    (name) => get(`sidequest${name}Completed`) === "none",
  );
  const completedHippyQuests = sideQuests.filter(
    (quest) => get(quest) === "hippy",
  ).length;
  const completedFratQuests = sideQuests.filter(
    (quest) => get(quest) === "fratboy",
  ).length;

  const hippiesLeft = 1000 - hippiesDefeated;
  const fratboysLeft = 1000 - fratboysDefeated;

  const mySide = (() => {
    if (completedFratQuests > 0) return "frat boy";
    if (completedHippyQuests > 0) return "hippy";
    if (haveFratFatigues) return "frat boy";
    if (haveHippyFatigues) return "hippy";
    return hippiesLeft > fratboysLeft ? "hippy" : "frat boy";
  })();
  const otherSide = mySide === "hippy" ? "frat boy" : "hippy";
  const completedMySideQuests =
    mySide === "hippy" ? completedHippyQuests : completedFratQuests;
  const otherSideLeft = mySide === "hippy" ? fratboysLeft : hippiesLeft;
  const otherSideDefeated = 1000 - otherSideLeft;
  const defeatedPerCombat = 1 << completedMySideQuests;

  const thresholds = [64, 192, 458, 1000] as const;
  const nextThreshold =
    thresholds.findIndex((threshold) => otherSideDefeated < threshold) ?? 3;
  const enemiesToThreshold = thresholds[nextThreshold] - otherSideDefeated;
  const turnsToThreshold = Math.ceil(enemiesToThreshold / defeatedPerCombat);
  const nextQuest =
    nextThreshold === 3
      ? null // past last sidequest.
      : mySide === "hippy"
        ? sideQuestNames[3 - nextThreshold]
        : sideQuestNames[3 + nextThreshold];
  const openQuests =
    mySide === "hippy"
      ? sideQuestNames.slice(3 - nextThreshold)
      : sideQuestNames.slice(0, 3 + nextThreshold);

  if (step === Step.FINISHED) return null;

  return (
    <>
      <QuestTile
        header="End the Island War"
        id="island-war-quest"
        imageUrl="/images/itemimages/fmedbeta.gif"
        href={atStep(step, [
          [Step.UNSTARTED, "/council.php"],
          [Step.STARTED, ISLAND_PREWAR_URL],
          [1, ISLAND_WAR_URL],
        ])}
        linkEntireTile={step === Step.UNSTARTED || step === 1}
        minLevel={12}
      >
        {atStep(step, [
          [Step.UNSTARTED, <Line>Visit the Council to start the quest.</Line>],
          [
            Step.STARTED,
            <>
              {haveCcsc && !ccscEquipped && (
                <Line color="fg.error" command="equip candy cane sword cane">
                  Equip your candy cane sword cane first!
                </Line>
              )}
              {!haveHippyFatigues && !haveFratFatigues ? (
                <Line>
                  Acquire either war hippy fatigues or frat warrior fatigues.
                </Line>
              ) : !hippyFatiguesEquipped && !fratFatiguesEquipped ? (
                <Line color="fg.error">
                  Equip the{" "}
                  {commaOr(
                    outfits.map(
                      (outfit) =>
                        haveOutfit(outfit) && (
                          <AsyncLink command={`outfit ${outfit}`}>
                            {outfit}
                          </AsyncLink>
                        ),
                    ),
                    outfits,
                  )}
                  .
                </Line>
              ) : (
                <Line>
                  {hippyFatiguesEquipped
                    ? "War Hippy Fatigues equipped."
                    : "Frat Warrior Fatigues equipped."}{" "}
                  Start the war!
                </Line>
              )}
              <Line>Run -combat and adventure in the enemy camp.</Line>
              <Line>
                {turnsToSeeNoncombat(85, haveCcsc ? 1 : 3).toFixed(1)} turns
                expected.
              </Line>
            </>,
          ],
          [
            1,
            otherSideDefeated < 1000 ? (
              <>
                <Line>
                  Defeat {pluralEnemyCount(otherSideLeft, "more", otherSide)}. (
                  {plural(Math.ceil(otherSideLeft / defeatedPerCombat), "turn")}{" "}
                  remaining).
                </Line>
                {remainingSidequestNames.length > 0 && (
                  <>
                    <Line>
                      Quests to complete: {remainingSidequestNames.join(", ")}.
                    </Line>
                    {nextQuest && (
                      <Line>
                        {plural(turnsToThreshold, "turn")} (
                        {pluralEnemyCount(enemiesToThreshold, null, otherSide)}){" "}
                        until {nextQuest} opens.
                      </Line>
                    )}
                  </>
                )}
              </>
            ) : (
              <Line>
                Defeat the{" "}
                {hippiesLeft <= 0
                  ? "Big Wisniewski in the Hippy Camp!"
                  : "Man in the Frat House!"}
              </Line>
            ),
          ],
        ])}
      </QuestTile>
      {step === 1 && (
        <>
          {get("sidequestArenaCompleted") === "none" && (
            <Arena disabled={!openQuests.includes("Arena")} />
          )}
          {get("sidequestJunkyardCompleted") === "none" && <Junkyard />}
          {get("sidequestLighthouseCompleted") === "none" && <Lighthouse />}
          {get("sidequestOrchardCompleted") === "none" && <Orchard />}
          {get("sidequestNunsCompleted") === "none" && (
            <Nuns disabled={!openQuests.includes("Nuns")} />
          )}
          {get("sidequestFarmCompleted") === "none" && <Farm />}
        </>
      )}
    </>
  );
};

export default Level12;
