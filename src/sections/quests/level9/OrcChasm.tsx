import { Em, List, Strong } from "@chakra-ui/react";
import { haveEquipped, myBuffedstat } from "kolmafia";
import { $item, $stat, get, getModifier, questStep } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import { bridgeItemsNeeded } from "../../../questInfo/bridgeItemsNeeded";
import { atStep, Step } from "../../../util/quest";
import { commaAnd, plural, pluralJustDesc } from "../../../util/text";

const OrcChasm: FC = () => {
  const step = questStep("questL09Topping");
  const orcProgress = get("smutOrcNoncombatProgress");
  const { fastenersNeeded, lumberNeeded, needBatWings } = bridgeItemsNeeded();

  const needs = [
    fastenersNeeded > 0 && plural(fastenersNeeded, "fastener"),
    lumberNeeded > 0 && `${lumberNeeded} lumber`,
  ];

  const needMoreItems = lumberNeeded > 0 || fastenersNeeded > 0;

  const musclePieces = Math.min(
    14,
    Math.floor(
      Math.sqrt(
        ((myBuffedstat($stat`Muscle`) + getModifier("Weapon Damage")) / 15) *
          (1 + getModifier("Weapon Damage Percent") / 100),
      ),
    ),
  );
  const mysticalityPieces = Math.min(
    14,
    Math.floor(
      Math.sqrt(
        ((myBuffedstat($stat`Mysticality`) + getModifier("Spell Damage")) /
          15) *
          (1 + getModifier("Spell Damage Percent") / 100),
      ),
    ),
  );
  const moxiePieces = Math.min(
    14,
    Math.floor(
      Math.sqrt(
        (myBuffedstat($stat`Moxie`) / 30) *
          (1 + getModifier("Sleaze Resistance") * 0.69),
      ),
    ),
  );

  if (step >= 1) return null;

  return (
    <QuestTile
      header="Bridge the Orc Chasm"
      imageUrl="/images/itemimages/plank1.gif"
      minLevel={9}
      href={atStep(step, [
        [Step.UNSTARTED, "/council.php"],
        [
          Step.STARTED,
          needMoreItems
            ? "/place.php?whichplace=orc_chasm"
            : "/place.php?whichplace=orc_chasm&action=label1",
        ],
      ])}
      linkEntireTile={
        !(!needMoreItems && needBatWings && !haveEquipped($item`bat wings`))
      }
    >
      {step === Step.UNSTARTED && <Line>Visit Council to start quest.</Line>}
      {step === Step.STARTED &&
        (needMoreItems ? (
          <>
            <Line>
              Build a bridge. <Em>(+item, -ML)</Em>
            </Line>
            {orcProgress < 15 ? (
              <Line>
                Overkill orcs with cold damage: {orcProgress}/15 to NC.
              </Line>
            ) : (
              <>
                <Line>Blech House next turn!</Line>
                <List.Root>
                  <List.Item>
                    <Strong>Muscle/Weapon Dmg:</Strong> {musclePieces}/14{" "}
                    {pluralJustDesc(musclePieces, "piece")}.
                  </List.Item>
                  <List.Item>
                    <Strong>Myst/Spell Dmg:</Strong> {mysticalityPieces}/14{" "}
                    {pluralJustDesc(mysticalityPieces, "piece")}.
                  </List.Item>
                  <List.Item>
                    <Strong>Moxie/Sleaze Res:</Strong> {moxiePieces}/14{" "}
                    {pluralJustDesc(moxiePieces, "piece")}.
                  </List.Item>
                </List.Root>
              </>
            )}
            <Line>{commaAnd(needs)} needed.</Line>
          </>
        ) : needBatWings && !haveEquipped($item`bat wings`) ? (
          <Line command="equip bat wings">
            Equip your bat wings and build the bridge!
          </Line>
        ) : (
          <Line>Build the bridge!</Line>
        ))}
    </QuestTile>
  );
};

export default OrcChasm;
