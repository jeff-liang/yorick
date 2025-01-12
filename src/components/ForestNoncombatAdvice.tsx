import { $location } from "libram";

import { turnsToSeeSingleNoncombatCapped } from "../util/calc";

import Line from "./Line";

const ForestNoncombatAdvice = () => {
  const forest = $location`The Spooky Forest`;
  const progress = Math.max(
    0,
    forest.turnsSpent - forest.lastNoncombatTurnsSpent,
  );
  const expectedTurns =
    progress >= 7
      ? 0
      : 0.5 * turnsToSeeSingleNoncombatCapped(85, 8 - progress) +
        0.5 * turnsToSeeSingleNoncombatCapped(85, 9 - progress);
  return progress >= 8 ? (
    <Line>NC guaranteed next turn.</Line>
  ) : progress === 7 ? (
    <Line>50% chance of guaranteed NC next turn.</Line>
  ) : (
    <Line>Expected {expectedTurns.toFixed(1)} turns until next NC.</Line>
  );
};

export default ForestNoncombatAdvice;
