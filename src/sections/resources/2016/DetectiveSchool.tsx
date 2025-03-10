import { availableAmount, isUnrestricted } from "kolmafia";
import { $item, get, have } from "libram";

import Line from "../../../components/Line";
import LinkBlock from "../../../components/LinkBlock";
import Tile from "../../../components/Tile";
import { canPossiblyDrink, canPossiblyEat } from "../../../util/player";
import { inRun } from "../../../util/quest";
import { plural } from "../../../util/text";

const detectiveBadges = [
  $item`plastic detective badge`,
  $item`bronze detective badge`,
  $item`silver detective badge`,
  $item`gold detective badge`,
];

const detectiveSchoolApplication = $item`detective school application`;
const copDollar = $item`cop dollar`;

const DetectiveSchool = () => {
  if (
    !get("hasDetectiveSchool") ||
    !isUnrestricted(detectiveSchoolApplication)
  ) {
    return null;
  }

  const casesRemaining = Math.max(3 - get("_detectiveCasesCompleted"), 0);
  const haveBadge = detectiveBadges.some((badge) => have(badge));
  const copDollarsHave = availableAmount($item`cop dollar`);

  const buyables: string[] = [];
  const mlTypes: string[] = [];

  if (canPossiblyEat()) mlTypes.push("food");
  if (canPossiblyDrink()) mlTypes.push("drink");

  if (mlTypes.length > 0 && copDollarsHave >= 4) {
    buyables.push(mlTypes.join("/"));
  }

  if (copDollarsHave >= 10) {
    buyables.push("a -combat potion (50 turns)");
  }

  return (
    <Tile
      header="Detective School"
      imageUrl="/images/itemimages/dbadge4.gif"
      href="/place.php?whichplace=town_wrong&action=townwrong_precinct"
    >
      {casesRemaining > 0 && (
        <Line href="/place.php?whichplace=town_wrong&action=townwrong_precinct">
          Solve {plural(casesRemaining, "more case")} for cop dollars.
        </Line>
      )}

      {!haveBadge && (
        <Line href="/place.php?whichplace=town_wrong&action=townwrong_precinct">
          Collect your Precinct badge.
        </Line>
      )}

      {inRun() && copDollarsHave > 0 && buyables.length > 0 && (
        <LinkBlock href="/shop.php?whichshop=detective">
          <Line>You have {plural(copDollarsHave, copDollar)}.</Line>
          {buyables.length > 0 && (
            <Line>
              Buy {buyables.length === 1 ? buyables[0] : buyables.join(" or ")}.
            </Line>
          )}
        </LinkBlock>
      )}
    </Tile>
  );
};

export default DetectiveSchool;
