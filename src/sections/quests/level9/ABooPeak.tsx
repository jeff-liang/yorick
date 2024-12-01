import { Em } from "@chakra-ui/react";
import {
  availableAmount,
  Element,
  elementalResistance,
  itemDropModifier,
  myHp,
} from "kolmafia";
import { $element, $item, clamp, get, questStep, sum } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import { binomialAtLeast } from "../../../util/calc";
import { inventoryLink } from "../../../util/links";
import { plural } from "../../../util/text";

// TODO: replace with libram method when it's live
const elementalDamage = (base: number, element: Element) => {
  if (base < 0) return 1;
  const res = elementalResistance(element);
  return Math.max(1, Math.ceil(base - (base * res) / 100));
};

const ABooPeak: FC = () => {
  const step = questStep("questL09Topping");
  const haunt = get("booPeakProgress", 100);
  const lit = get("booPeakLit");
  const clue = $item`A-Boo clue`;
  const clueCount = availableAmount(clue);
  const itemDrop = itemDropModifier();
  const cluePerAdv = Math.min(1, ((100 + itemDrop) * 0.15) / 100);

  const turnsTo90 = Math.ceil((haunt - 90) / 2);
  const p3CluesBefore90 = binomialAtLeast(
    clamp(3 - clueCount, 0, 3),
    Math.max(0, turnsTo90),
    cluePerAdv,
  );

  const damage = [13, 25, 50, 125, 250];
  const spookyDamage = sum(damage, (dmg) =>
    elementalDamage(dmg, $element`spooky`),
  );
  const coldDamage = sum(damage, (dmg) => elementalDamage(dmg, $element`cold`));
  const totalDamage = spookyDamage + coldDamage;

  if (lit) return null;

  return (
    <QuestTile
      header="Light A-Boo Peak"
      minLevel={9}
      href="/place.php?whichplace=highlands"
      imageUrl="/images/itemimages/map.gif"
      disabled={step < 2}
    >
      {haunt === 0 ? (
        <Line>Light the fire!</Line>
      ) : (
        <>
          <Line>
            {haunt}% haunted.
            {clueCount * 30 < haunt && (
              <>
                {" "}
                <Em>+item</Em>
              </>
            )}
          </Line>
          <Line>
            Have {plural(clueCount, "clue")}.{" "}
            {cluePerAdv === 1
              ? `${cluePerAdv} clue`
              : `${cluePerAdv.toFixed(2)} clues`}
            /adv at +{itemDrop.toFixed(0)}% item.
          </Line>
          {haunt > 90 && clueCount < 3 && 3 - clueCount <= turnsTo90 && (
            <Line>
              {plural(turnsTo90, "turn")} until 90% haunted.{" "}
              {(100 * p3CluesBefore90).toFixed(0)}% chance of getting to 3 clues
              first.
            </Line>
          )}
          {clueCount > 0 && (
            <Line href={inventoryLink(clue)}>
              Have{" "}
              {myHp() > 1.5 * totalDamage
                ? "plenty of HP"
                : `${myHp()}/${totalDamage} HP needed`}{" "}
              for {spookyDamage} spooky and {coldDamage} cold dmg to de-haunt by
              30% via clue.
            </Line>
          )}
        </>
      )}
    </QuestTile>
  );
};

export default ABooPeak;
