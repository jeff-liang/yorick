import { List, Strong } from "@chakra-ui/react";
import {
  haveOutfit,
  myAdventures,
  myAscensions,
  myLevel,
  myPath,
  myPrimestat,
  mySign,
  mySpleenUse,
  numericModifier,
} from "kolmafia";
import { $effect, $item, $path, $skill, get, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inRun, questFinished } from "../../../util/quest";
import { plural } from "../../../util/text";

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
): { outputs: Map<number, number>; deltas: Map<number, number> } => {
  const outputs = new Map<number, number>();
  const deltas = new Map<number, number>();

  if (!(mySign() in MOON_SIGN_ID_LOOKUP)) {
    return { outputs, deltas };
  }

  const moonSignId = MOON_SIGN_ID_LOOKUP[mySign()];
  const b = mySpleenUse() + myLevel();
  const c = (myAscensions() + moonSignId) * b + myAdventures();

  desiredDigits.forEach((digit) => {
    deltas.set(digit, 99);
  });

  for (let x = 0; x <= 99; x++) {
    const v = x * b + c;
    const lastTwoDigits = v % 100;

    if (desiredDigits.includes(lastTwoDigits)) {
      outputs.set(lastTwoDigits, x);
      deltas.delete(lastTwoDigits);
    }

    desiredDigits.forEach((digit) => {
      if (!outputs.has(digit)) {
        let delta = digit - lastTwoDigits;
        if (delta <= 0) {
          deltas.set(digit, Math.min(deltas.get(digit) ?? 99, -delta));
        } else {
          delta = digit - (lastTwoDigits + 100);
          if (delta <= 0) {
            deltas.set(digit, Math.min(deltas.get(digit) ?? 99, -delta));
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

  if (!haveOutfit("Frat Warrior Fatigues") && !questFinished("questL12War")) {
    desiredDigits.push({
      digit: 51,
      reason: "frat warrior outfit (fight 151st infantryman)",
    });
  }

  if (
    !have($item`Knob Goblin perfume`) &&
    !have($effect`Knob Goblin Perfume`) &&
    !questFinished("questL05Goblin")
  ) {
    desiredDigits.push({ digit: 9, reason: "knob goblin perfume" });
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
      header={plural(usesRemaining, "universe calculation")}
      id="calculate-the-universe-resource"
      imageUrl="/images/itemimages/abacus.gif"
    >
      <Line>Enter these values to cast Calculate the Universe:</Line>
      <List.Root>
        {desiredDigits.map(({ digit, reason }) => (
          <List.Item key={digit}>
            {outputs.has(digit) ? (
              <>
                Enter <Strong>{outputs.get(digit)}</Strong> for {digit} ={" "}
                {reason}.
              </>
            ) : deltas.has(digit) ? (
              `Wait ${plural(deltas.get(digit) ?? 0, "turn")} to calculate for ${reason}.`
            ) : (
              `Cannot currently calculate for ${reason}.`
            )}
          </List.Item>
        ))}
      </List.Root>
    </Tile>
  );
};

export default Numberology;
