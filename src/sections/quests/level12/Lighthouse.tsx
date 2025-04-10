import { availableAmount, combatRateModifier, haveEquipped } from "kolmafia";
import { $item, $location, $skill, AutumnAton, get, have } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import { commaOr, plural, truthy } from "../../../util/text";

const Lighthouse: FC = () => {
  const sonofaBeach = $location`Sonofa Beach`;
  const lighthouseFinished = get("lighthouseQuestState") === "finished";
  const gunpowderCount = availableAmount($item`barrel of gunpowder`);
  const gunpowderNeeded = Math.max(0, 5 - gunpowderCount);
  const combatRate = combatRateModifier();

  const effectiveCombatRate =
    (11 / 12) * Math.max(0.1 + combatRate / 100, 0) + 1 / 12;
  const turnsPerLobster =
    effectiveCombatRate !== 0 ? 1 / effectiveCombatRate : -1;
  const turnsToComplete = gunpowderNeeded * turnsPerLobster;

  const canUseMacrometeorite =
    have($skill`Macrometeorite`) && get("_macrometeoriteUses") < 10;
  const canUseReplaceEnemy =
    have($item`Powerful Glove`) &&
    100 - get("_powerfulGloveBatteryPowerUsed") >= 10;
  const switchOptions = truthy([
    have($item`Powerful Glove`) && $skill`CHEAT CODE: Replace Enemy`,
    have($skill`Macrometeorite`) && $skill`Macrometeorite`,
  ]);

  const sabersOwned =
    availableAmount($item`Fourth of May Cosplay Saber`) +
    availableAmount($item`replica Fourth of May Cosplay Saber`);
  const canUseSaber =
    sabersOwned > 0 && get("_saberForceUses") < 5 && gunpowderNeeded > 1;

  if (lighthouseFinished) return null;

  return (
    <QuestTile
      header="Island War Lighthouse"
      imageUrl="/images/adventureimages/lobsterman.gif"
      href="/bigisland.php?place=lighthouse"
    >
      {gunpowderNeeded > 0 ? (
        <>
          <Line>
            Need {plural(gunpowderNeeded, "more barrel", "more barrels")} of
            gunpowder.
          </Line>
          {AutumnAton.have() &&
            AutumnAton.currentlyIn() === sonofaBeach &&
            AutumnAton.zoneItems() + gunpowderCount >= 5 && (
              <Line>
                Autumn-aton will finish quest. Wait{" "}
                {plural(AutumnAton.turnsLeft(), "turn")}.
              </Line>
            )}
          <Line>
            ~{turnsToComplete.toFixed(1)} turns to complete quest at{" "}
            {Math.floor(combatRate)}% combat. {turnsPerLobster.toFixed(1)} turns
            per lobster.
          </Line>
          {AutumnAton.have() &&
            AutumnAton.currentlyIn() !== sonofaBeach &&
            (sonofaBeach.turnsSpent > 0 ? (
              <Line>
                Send autumn-aton in {plural(AutumnAton.turnsLeft(), "turn")} for{" "}
                {plural(AutumnAton.zoneItems(), "barrel")} per send.
              </Line>
            ) : (
              <Line>
                Spend a turn (maybe wanderer) in Sonofa Beach, then send
                autumn-aton.
              </Line>
            ))}
          {(canUseReplaceEnemy || canUseMacrometeorite) && (
            <>
              <Line>
                Could use {commaOr(switchOptions)} on a wanderer to guarantee an
                LFM.
              </Line>
              {canUseReplaceEnemy && !haveEquipped($item`Powerful Glove`) && (
                <Line>Equip the Powerful Glove, first.</Line>
              )}
            </>
          )}
          {canUseSaber && (
            <>
              <Line>
                Could Use the Force (friends) on a LFM to guarantee two more.
              </Line>
              {!have($item`Fourth of May Cosplay Saber`) && (
                <Line>Equip the Fourth of May saber, first.</Line>
              )}
            </>
          )}
        </>
      ) : (
        <Line>Talk to the lighthouse keeper to finish quest.</Line>
      )}
    </QuestTile>
  );
};

export default Lighthouse;
