import { Text } from "@chakra-ui/react";
import {
  availableAmount,
  Element,
  elementalResistance,
  itemDropModifier,
  myHp,
} from "kolmafia";
import { $element, $item, get, questStep, sum } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import { binomialAtLeast } from "../../../util/calc";
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
  const clues = availableAmount($item`A-Boo clue`);
  const itemDrop = itemDropModifier();
  const cluePerAdv = Math.min(1, ((100 + itemDrop) * 0.15) / 100);

  const turnsTo90 = Math.ceil((haunt - 90) / 2);
  const p3CluesBefore90 = binomialAtLeast(
    3 - clues,
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
            {clues * 30 < haunt && (
              <>
                {" "}
                <Text as="i">+item</Text>
              </>
            )}
          </Line>
          <Line>
            Have {plural(clues, "clue")}.{" "}
            {cluePerAdv === 1
              ? `${cluePerAdv} clue`
              : `${cluePerAdv.toFixed(2)} clues`}
            /adv at +{itemDrop.toFixed(0)}% item.
          </Line>
          {haunt > 90 && clues < 3 && 3 - clues <= turnsTo90 && (
            <Line>
              {(100 * p3CluesBefore90).toFixed(0)}% chance of getting to 3 clues
              before 90% haunted.
            </Line>
          )}
          <Line>
            Have{" "}
            {myHp() > 1.5 * totalDamage
              ? "plenty of HP"
              : `${myHp()}/${totalDamage} HP needed`}{" "}
            for {spookyDamage} spooky and {coldDamage} cold dmg.
          </Line>
        </>
      )}
    </QuestTile>
  );
};

export default ABooPeak;
