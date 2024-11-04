import { Text } from "@chakra-ui/react";
import {
  myAdventures,
  myAscensions,
  myLevel,
  myPath,
  myPrimestat,
  mySign,
  mySpleenUse,
  numericModifier,
} from "kolmafia";
import { $path, $skill, get } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inRun } from "../../../util/quest";

const MOON_SIGN_ID_LOOKUP: Record<string, number> = {
  "": 0,
  None: 0,
  Mongoose: 1,
  Wallaby: 2,
  Vole: 3,
  Platypus: 4,
  Opossum: 5,
  Marmot: 6,
  Wombat: 7,
  Blender: 8,
  Packrat: 9,
  "Bad Moon": 10,
};

const calculateNumberologyInputs = (
  desiredDigits: number[],
): { outputs: Record<number, number>; deltas: Record<number, number> } => {
  const outputs: Record<number, number> = {};
  const deltas: Record<number, number> = {};

  if (!(mySign() in MOON_SIGN_ID_LOOKUP)) {
    return { outputs, deltas };
  }

  const moonSignId = MOON_SIGN_ID_LOOKUP[mySign()];
  const b = mySpleenUse() + myLevel();
  const c = (myAscensions() + moonSignId) * b + myAdventures();

  desiredDigits.forEach((digit) => {
    deltas[digit] = 99;
  });

  for (let x = 0; x <= 99; x++) {
    const v = x * b + c;
    const lastTwoDigits = v % 100;

    if (desiredDigits.includes(lastTwoDigits)) {
      outputs[lastTwoDigits] = x;
      delete deltas[lastTwoDigits];
    }

    desiredDigits.forEach((digit) => {
      if (!(digit in outputs)) {
        let delta = digit - lastTwoDigits;
        if (delta <= 0) {
          deltas[digit] = Math.min(deltas[digit], -delta);
        } else {
          delta = digit - (lastTwoDigits + 100);
          if (delta <= 0) {
            deltas[digit] = Math.min(deltas[digit], -delta);
          }
        }
      }
    });
  }

  return { outputs, deltas };
};

const Numberology = () => {
  const calculateSkill = $skill`Calculate the Universe`;
  if (!haveUnrestricted(calculateSkill)) return null;

  const universeCalculated = get("_universeCalculated");
  const skillLevel = get("skillLevel144");
  const limit = inRun() ? Math.min(skillLevel, 3) : skillLevel;

  if (universeCalculated >= limit) return null;

  const usesRemaining = limit - universeCalculated;
  const path = myPath();
  const primestat = myPrimestat();

  const desiredDigits: { digit: number; reason: string }[] = [];

  if (path !== $path`Slow and Steady`) {
    desiredDigits.push({ digit: 69, reason: "+3 adventures" });
  }

  if (inRun()) {
    desiredDigits.push({
      digit: 14,
      reason: "1400 meat (autosell 14 moxie weeds)",
    });

    if (myLevel() < 13) {
      const mainstatGained =
        89.0 *
        (1.0 + numericModifier(`${primestat} Experience Percent`) / 100.0);
      desiredDigits.push({
        digit: 89,
        reason: `${Math.round(mainstatGained)} mainstats`,
      });
    }
  }

  const { outputs, deltas } = calculateNumberologyInputs(
    desiredDigits.map((d) => d.digit),
  );

  return (
    <Tile
      header="Calculate the Universe"
      imageUrl="/images/itemimages/abacus.gif"
    >
      <Line>
        <Text as="b">Enter these values to cast Calculate the Universe:</Text>
      </Line>
      {desiredDigits.map(({ digit, reason }) => (
        <Line key={digit}>
          {digit in outputs ? (
            <>
              Enter <Text as="b">{outputs[digit]}</Text> for {reason}.
            </>
          ) : digit in deltas ? (
            <>
              Wait {deltas[digit]} adventures to calculate for {reason}.
            </>
          ) : (
            <>Cannot currently calculate for {reason}.</>
          )}
        </Line>
      ))}
      {usesRemaining > 1 && (
        <Line>You have {usesRemaining} calculations remaining today.</Line>
      )}
    </Tile>
  );
};

export default Numberology;
