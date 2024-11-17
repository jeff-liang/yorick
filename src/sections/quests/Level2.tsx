import { $location, questStep } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { turnsToSeeSingleNoncombatCapped } from "../../util/calc";
import { atStep, Step } from "../../util/quest";
import { plural } from "../../util/text";

const Level2: FC = () => {
  const forest = $location`The Spooky Forest`;
  const step = questStep("questL02Larva");

  const progress = Math.max(
    0,
    forest.turnsSpent - forest.lastNoncombatTurnsSpent,
  );
  const expectedTurns =
    progress >= 7
      ? 0
      : 0.5 * turnsToSeeSingleNoncombatCapped(85, 7 - progress) +
        0.5 * turnsToSeeSingleNoncombatCapped(85, 8 - progress);

  if (step === Step.FINISHED) return null;

  return (
    <QuestTile
      header="Spooky Forest"
      imageUrl="/images/adventureimages/forest.gif"
      href={atStep(step, [
        [Step.UNSTARTED, "/council.php"],
        [Step.STARTED, "/woods.php"],
        [1, "/council.php"],
        [Step.FINISHED, undefined],
      ])}
      minLevel={2}
    >
      {atStep(step, [
        [Step.UNSTARTED, <Line>Visit Council to start quest.</Line>],
        [
          Step.STARTED,
          forest.turnsSpent <= 5 ? (
            <Line>
              Burn {plural(5 - forest.turnsSpent, "turn")} of delay in the
              Spooky Forest.
            </Line>
          ) : (
            <>
              <Line>Find NC for mosquito larva.</Line>
              {progress >= 7 ? (
                <Line>NC guaranteed next turn.</Line>
              ) : progress === 6 ? (
                <Line>50% chance of guaranteed NC next turn.</Line>
              ) : (
                <Line>
                  Expected {expectedTurns.toFixed(1)} turns until next NC.
                </Line>
              )}
            </>
          ),
        ],
        [1, <Line>Turn in larva to the Council.</Line>],
      ])}
    </QuestTile>
  );
};

export default Level2;
