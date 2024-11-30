import { Em } from "@chakra-ui/react";
import { get, questStep } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import { bridgeItemsNeeded } from "../../../questInfo/bridgeItemsNeeded";
import { atStep, Step } from "../../../util/quest";
import { commaAnd, plural } from "../../../util/text";

const OrcChasm: FC = () => {
  const step = questStep("questL09Topping");
  const orcProgress = get("smutOrcNoncombatProgress");
  const { fastenersNeeded, lumberNeeded } = bridgeItemsNeeded();

  const needs = [
    fastenersNeeded > 0 && plural(fastenersNeeded, "fastener"),
    lumberNeeded > 0 && plural(lumberNeeded, "piece"),
  ];

  const needMoreItems = lumberNeeded > 0 || fastenersNeeded > 0;

  if (step >= 1) return null;

  return (
    <QuestTile
      header="Bridge the Orc Chasm"
      imageUrl="/images/itemimages/plank1.gif"
      minLevel={9}
      href={atStep(step, [
        [Step.UNSTARTED, "/council.php"],
        [Step.STARTED, "/place.php?whichplace=orc_chasm"],
      ])}
    >
      {atStep(step, [
        [Step.UNSTARTED, <Line>Visit Council to start quest.</Line>],
        [
          Step.STARTED,
          needMoreItems ? (
            <>
              <Line>
                Build a bridge. <Em>(+item, -ML)</Em>
              </Line>
              <Line>
                Overkill orcs with cold damage: {orcProgress}/15 to NC.
              </Line>
              <Line>{commaAnd(needs)} needed.</Line>
            </>
          ) : (
            <Line href="/place.php?whichplace=orc_chasm&action=label1">
              Build the bridge!
            </Line>
          ),
        ],
      ])}
    </QuestTile>
  );
};

export default OrcChasm;
