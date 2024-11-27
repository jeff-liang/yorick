import { availableAmount } from "kolmafia";
import { $effect, $familiar, $item, get, totalFamiliarWeight } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

const PeaceTurkey = () => {
  const turkey = $familiar`Peace Turkey`;
  const combatRate = -Math.min(10, Math.floor(totalFamiliarWeight(turkey) / 5));
  const banishes = availableAmount($item`handful of split pea soup`);
  const potentialBanishes = Math.floor(
    availableAmount($item`whirled peas`) / 2,
  );

  const drops = [
    $item`whirled peas`,
    "olive (or jumbo)",
    "HP/MP",
    $effect`Helping Fingers`,
    $item`whirled peas`,
    $item`piece of cake`,
    "random AC booze",
    $item`peace shooter`,
  ];
  const nextDrop = drops[get("peaceTurkeyIndex")];
  const nextDropName =
    typeof nextDrop === "string" ? nextDrop : nextDrop.identifierString;
  const dropsUntilWhirledPeas = 4 - (get("peaceTurkeyIndex") % 4);

  if (!haveUnrestricted(turkey)) return null;

  return (
    <Tile linkedContent={turkey}>
      <Line>
        Provides {combatRate}% combat and a free run banish every 8 drops.
      </Line>
      {banishes === 0 && potentialBanishes > 0 && (
        <Line command={`create ${potentialBanishes} handful of split pea soup`}>
          Make {potentialBanishes} banishes from whirled peas.
        </Line>
      )}
      <Line>
        Next drop: {nextDropName}.
        {nextDrop !== $item`whirled peas` &&
          ` ${plural(dropsUntilWhirledPeas, "drop")} until next whirled peas.`}
      </Line>
    </Tile>
  );
};

export default PeaceTurkey;
