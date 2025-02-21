import { availableAmount } from "kolmafia";
import { $item, $location, have, questStep } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import { spinStatus } from "../../../questInfo/pyramid";
import { atStep, questFinished, Step } from "../../../util/quest";
import { capitalize, plural, pluralJustDesc } from "../../../util/text";

const PYRAMID_URL = "/place.php?whichplace=pyramid";

interface ChamberProps {
  extraSpinsNeeded: number;
}

const UpperChamber: FC<ChamberProps> = () => {
  const upperChamberTurns = $location`The Upper Chamber`.turnsSpent;
  const turnsRemaining = Math.max(0, 6 - upperChamberTurns);
  return (
    <Line>
      Adventure in the Upper Chamber for {plural(turnsRemaining, "more turn")}{" "}
      to unlock the Middle Chamber. Use -combat and free run skills if
      available.
    </Line>
  );
};

const MiddleChamber: FC<ChamberProps> = ({ extraSpinsNeeded }) => {
  const middleChamberTurns = $location`The Middle Chamber`.turnsSpent;
  const turnsRemaining = Math.max(0, 11 - middleChamberTurns);
  const tangles = availableAmount($item`tangle of rat tails`);
  return (
    <>
      <Line>
        Adventure in the Middle Chamber for{" "}
        {plural(turnsRemaining, "more turn")} to unlock the Control Room. Use
        free runs if available.{" "}
      </Line>
      {extraSpinsNeeded > 0 && (
        <Line>
          Use +400% item drop and olfact tomb rats to get ratchets.
          {tangles > 0 &&
            ` Use ${plural(tangles, "tangle")} of rat tails on tomb rats.`}
        </Line>
      )}
    </>
  );
};

interface ControlRoomProps extends ChamberProps {
  task: string;
  spinsNeeded: number;
}

const ControlRoom: FC<ControlRoomProps> = ({
  task,
  spinsNeeded,
  extraSpinsNeeded,
}) => (
  <>
    {spinsNeeded > 0 ? (
      <Line>
        Spin the pyramid {spinsNeeded} time{spinsNeeded !== 1 ? "s" : ""}, then{" "}
        {task}.
      </Line>
    ) : (
      <Line>{capitalize(task)}.</Line>
    )}
    {extraSpinsNeeded > 0 && (
      <Line>
        Need{" "}
        {`${plural(extraSpinsNeeded, "more ratchet")}/${pluralJustDesc(extraSpinsNeeded, "wheel")}`}
        . Adventure in the Middle Chamber (+400% item) or Upper Chamber
        (-combat) to acquire them.
      </Line>
    )}
  </>
);

const Pyramid: FC = () => {
  const step = questStep("questL11Pyramid");

  if (questFinished("questL11MacGuffin")) return null;

  const haveHeadpiece =
    (have($item`[2180]ancient amulet`) && have($item`[2286]Eye of Ed`)) ||
    have($item`headpiece of the Staff of Ed`);
  const haveStaffOfEd =
    have($item`[2325]Staff of Ed`) ||
    (haveHeadpiece && have($item`[2268]Staff of Fats`));

  const upperChamberTurns = $location`The Upper Chamber`.turnsSpent;
  const middleChamberTurns = $location`The Middle Chamber`.turnsSpent;

  const { task, spinsNeeded, extraSpinsNeeded } = spinStatus();

  return (
    <QuestTile
      header="Descend the Pyramid"
      imageUrl="/images/itemimages/nemes.gif"
      href={atStep(step, [
        [
          Step.UNSTARTED,
          haveStaffOfEd ? "/place.php?whichplace=desertbeach" : undefined,
        ],
        [Step.STARTED, PYRAMID_URL],
        [Step.FINISHED, "/council.php"],
      ])}
      linkEntireTile
      minLevel={11}
      disabled={!haveStaffOfEd && step < Step.STARTED}
    >
      {atStep(step, [
        [
          Step.UNSTARTED,
          !haveStaffOfEd ? (
            <Line>Find the Staff of Ed before starting the Pyramid.</Line>
          ) : (
            <Line>Visit the Pyramid to start the quest.</Line>
          ),
        ],
        [
          Step.STARTED,
          upperChamberTurns < 6 ? (
            <UpperChamber extraSpinsNeeded={extraSpinsNeeded} />
          ) : middleChamberTurns < 11 ? (
            <MiddleChamber extraSpinsNeeded={extraSpinsNeeded} />
          ) : (
            <ControlRoom
              task={task}
              spinsNeeded={spinsNeeded}
              extraSpinsNeeded={extraSpinsNeeded}
            />
          ),
        ],
        [
          Step.FINISHED,
          questStep("questL11MacGuffin") === 2 && (
            <Line>Return the Holy MacGuffin to the Council!</Line>
          ),
        ],
      ])}
    </QuestTile>
  );
};

export default Pyramid;
