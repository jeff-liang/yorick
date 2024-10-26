import {
  availableAmount,
  familiarEquippedEquipment,
  familiarWeight,
  initiativeModifier,
  itemDropModifier,
  myFamiliar,
  myHash,
  numericModifier,
} from "kolmafia";
import { $item, get, have, questStep } from "libram";

import Chevrons from "../../../components/Chevrons";
import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import Requirement from "../../../components/Requirement";
import { plural } from "../../../util/text";

const TwinPeak = () => {
  const step = questStep("questL09Topping");
  const res = Math.floor(numericModifier("stench resistance"));
  const jars = availableAmount($item`jar of oil`);
  const init = initiativeModifier();
  const haveTrimmers = have($item`rusty hedge trimmers`);

  const progress = get("twinPeakProgress");
  const stenchDone = (progress & 1) > 0;
  const itemDone = (progress & 2) > 0;
  const jarDone = (progress & 4) > 0;
  const initDone = (progress & 8) > 0;

  const ncsDone = +stenchDone + +itemDone + +jarDone + +initDone;
  const trimmersNeeded =
    4 - ncsDone - availableAmount($item`rusty hedge trimmers`);

  const famWeight =
    familiarWeight(myFamiliar()) + numericModifier("familiar weight");
  const equipWeight = numericModifier(
    familiarEquippedEquipment(myFamiliar()),
    "familiar weight",
  );
  const famItemDrop = numericModifier(
    myFamiliar(),
    "item drop",
    famWeight - equipWeight,
    familiarEquippedEquipment(myFamiliar()),
  );
  const nonFamItemDrop =
    itemDropModifier() - famItemDrop + numericModifier("food drop");

  const stenchMet = res >= 4;
  const itemMet = nonFamItemDrop >= 50;
  const jarMet = jars >= 1;
  const initMet = init >= 40;
  const ncsReady =
    +(stenchMet && !stenchDone) +
    +(itemMet && !itemDone) +
    +(jarMet && !jarDone) +
    +(initMet && !initDone);

  if (initDone) return null;

  return (
    <QuestTile
      header="Light Twin Peak"
      minLevel={9}
      href="/place.php?whichplace=highlands"
      imageUrl="/images/adventureimages/mansion.gif"
      disabled={step < 2}
    >
      {haveTrimmers &&
        (ncsReady > 0 ? (
          <Line href={`/inv_use.php?pwd=${myHash()}&which=3&whichitem=5115`}>
            Use hedge trimmers for next NC.
          </Line>
        ) : (
          <Line>Meet one of the NC requirements, then use hedge trimmers.</Line>
        ))}
      {trimmersNeeded > 0 && (
        <>
          <Line fontStyle="italic">-combat, +item, olfact topiary animal</Line>
          <Line>
            Need {plural(trimmersNeeded, "more hedge trimmer")} from topiary
            animals.
          </Line>
        </>
      )}
      <Line display="flex" flex="row" flexWrap="wrap" gap={1} rowGap={1}>
        <Chevrons ml={2} mr={-1} usesLeft={ncsDone} totalUses={4} />
        {!stenchDone && (
          <Requirement met={stenchMet}>{res}/4 stench res</Requirement>
        )}
        {!itemDone && (
          <Requirement met={itemMet}>
            {nonFamItemDrop.toFixed(0)}/50 non-fam +item/food
          </Requirement>
        )}
        {!jarDone && (
          <Requirement met={jarMet}>{jars}/1 jar of oil</Requirement>
        )}
        {!initDone && (
          <Requirement disabled={ncsDone < 3} met={initMet}>
            {init}/40 +init
          </Requirement>
        )}
      </Line>
    </QuestTile>
  );
};

export default TwinPeak;
