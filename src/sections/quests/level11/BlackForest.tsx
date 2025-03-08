import {
  availableAmount,
  combatRateModifier,
  haveEquipped,
  myFamiliar,
  myLocation,
  npcPrice,
} from "kolmafia";
import { $familiar, $item, $location, get, have, questStep } from "libram";
import { FC, ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { atStep, Step } from "../../../util/quest";
import { plural } from "../../../util/text";

const BlackForest: FC = () => {
  const step = questStep("questL11Black");
  const forestProgress = get("blackForestProgress");
  const blackForest = $location`The Black Forest`;

  const familiar = myFamiliar();
  const haveBlackbird = have($familiar`Reassembled Blackbird`);
  const haveBlackbirdEquipped = familiar === $familiar`Reassembled Blackbird`;
  const haveBlackbirdHatchling = have($item`reassembled blackbird`);
  const haveGaloshes = have($item`blackberry galoshes`);
  const haveGaloshesEquipped = haveEquipped($item`blackberry galoshes`);
  const combatRate = combatRateModifier();

  const turnsUntilNC = Math.max(
    0,
    blackForest.forceNoncombat -
      Math.max(0, blackForest.turnsSpent - blackForest.lastNoncombatTurnsSpent),
  );

  useNag(() => {
    const possibleNags: [boolean, ReactNode][] = [
      [
        haveBlackbird && !haveBlackbirdHatchling && !haveBlackbirdEquipped,
        <Line>Take your Reassembled Blackbird.</Line>,
      ],
      [
        haveBlackbirdHatchling && familiar === $familiar`Reassembled Blackbird`,
        <Line>Don't need blackbird anymore - change familiars.</Line>,
      ],
      [
        haveGaloshes && !haveGaloshesEquipped,
        <Line>Equip your blackberry galoshes.</Line>,
      ],
      [combatRate < 5, <Line>Ensure you have +5% combat.</Line>],
      [turnsUntilNC === 0, <Line>Noncombat guaranteed next turn.</Line>],
    ];
    return {
      id: "black-forest-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/documents.gif",
      node:
        possibleNags.every(([show]) => !show) ||
        myLocation() !== blackForest ||
        step >= 2 ? null : (
          <QuestTile
            header="Find the Black Market"
            imageUrl="/images/itemimages/documents.gif"
            href="/woods.php"
          >
            {possibleNags.map(
              ([show, node], index) =>
                show && <Fragment key={index}>{node}</Fragment>,
            )}
          </QuestTile>
        ),
    };
  }, [
    blackForest,
    combatRate,
    familiar,
    haveBlackbird,
    haveBlackbirdEquipped,
    haveBlackbirdHatchling,
    haveGaloshes,
    haveGaloshesEquipped,
    step,
    turnsUntilNC,
  ]);

  if (step === Step.FINISHED) return null;

  return (
    <QuestTile
      header={
        have($item`forged identification documents`)
          ? "Vacation at the Shore"
          : "Find the Black Market"
      }
      id="black-market-quest"
      imageUrl={
        have($item`forged identification documents`)
          ? "/images/itemimages/book2.gif"
          : "/images/itemimages/documents.gif"
      }
      href={atStep(step, [
        [Step.UNSTARTED, "/council.php"],
        [Step.STARTED, "/woods.php"],
        [
          2,
          have($item`forged identification documents`)
            ? "/place.php?whichplace=desertbeach"
            : "/shop.php?whichshop=blackmarket",
        ],
        [3, "/adventure.php?snarfblat=355"],
      ])}
      minLevel={11}
    >
      {atStep(step, [
        [Step.UNSTARTED, <Line>Visit Council to start quest.</Line>],
        [
          Step.STARTED,
          <>
            {blackForest.turnsSpent === 0 && (
              <Line>Intro NC first to get black map.</Line>
            )}
            {blackForest.turnsSpent > 0 &&
              turnsUntilNC > 0 &&
              combatRate < 5 && (
                <Line color="red.solid">Run +5% combat to avoid NC.</Line>
              )}
            {!haveGaloshes &&
              (have($item`blackberry`, 3) ? (
                <Line>
                  Bring 3 blackberries to the cobbler for blackberry galoshes.
                </Line>
              ) : (
                <Line>
                  Get{" "}
                  {plural(
                    3 - availableAmount($item`blackberry`),
                    $item`blackberry`,
                  )}{" "}
                  from blackberry bush.
                </Line>
              ))}
            <Line>Black Forest exploration: ~{forestProgress * 20}%.</Line>
            <Line>
              Noncombat guaranteed{" "}
              {turnsUntilNC === 0
                ? "next turn"
                : `in ${plural(turnsUntilNC, "turn")}`}
              .
            </Line>
          </>,
        ],
        [
          2,
          have($item`forged identification documents`) ? (
            <Line>Take a trip at The Shore, Inc.</Line>
          ) : (
            <>
              <Line>
                Buy the forged identification documents for{" "}
                {npcPrice($item`forged identification documents`)} meat.
              </Line>
              <Line>
                Consider buying a can of black paint for desert exploration.
              </Line>
            </>
          ),
        ],
        [3, <Line>Take a trip at The Shore, Inc.</Line>],
      ])}
    </QuestTile>
  );
};

export default BlackForest;
