import { haveEquipped, numericModifier } from "kolmafia";
import { $effect, $item, get, have } from "libram";

import Line from "../../../components/Line";
import { haveUnrestricted } from "../../../util/available";

const ZeppelinMob = () => {
  const candyCaneSwordCane = $item`candy cane sword cane`;
  const haveCcsc = haveUnrestricted(candyCaneSwordCane);
  const sleazeProtestorsCleared = Math.max(
    3,
    Math.sqrt(
      numericModifier("sleaze damage") + numericModifier("sleaze spell damage"),
    ),
  );

  return (
    <>
      {have($item`lynyrd musk`) && !have($effect`Musky`) && (
        <Line color={"red"} href="/inventory.php?ftext=lynyrd+musk">
          Use lynyrd musk.
        </Line>
      )}
      {have($item`lynyrd snare`) && (
        <Line href="/inventory.php?ftext=lynyrd+snare">
          Possibly use lynyrd snare. (free combat)
        </Line>
      )}
      {get("zeppelinProtestors") >= 80 ? (
        <Line>Finished. Adventure in the mob of protestors.</Line>
      ) : (
        <>
          {haveCcsc && !haveEquipped(candyCaneSwordCane) && (
            <Line command="equip candy cane sword cane">
              Equip your candy cane sword cane!
            </Line>
          )}
          <Line>{80 - get("zeppelinProtestors")} protestors left.</Line>
          <Line>
            Sleaze damage will clear {sleazeProtestorsCleared.toFixed(1)}{" "}
            protestors
            {haveCcsc &&
              ` (doubled to ${(sleazeProtestorsCleared * 2).toFixed(1)} with CCSC)`}
            .
          </Line>
        </>
      )}
    </>
  );
};

export default ZeppelinMob;
