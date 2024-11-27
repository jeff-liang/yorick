import { Strong } from "@chakra-ui/react";
import { availableAmount, myPath } from "kolmafia";
import {
  $item,
  $path,
  get,
  have,
  haveInCampground,
  SourceTerminal,
} from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { isNormalCampgroundPath } from "../../../util/paths";
import { commaAnd, commaOr, plural } from "../../../util/text";

const TERMINAL_URL = "/campground.php?action=terminal";

const SourceTerminalTile = () => {
  const sourceTerminal = $item`Source terminal`;
  const sourceEssence = $item`Source essence`;

  const haveTerminal =
    (!isNormalCampgroundPath() && myPath() !== $path`Nuclear Autumn`) ||
    haveInCampground(sourceTerminal);

  const extrudes = get("_sourceTerminalExtrudes");
  const enquiry = get("sourceTerminalEnquiry");

  const installedChips = SourceTerminal.getChips();

  const activeSkills = SourceTerminal.getSkills();
  const digitizeActive = activeSkills.includes(SourceTerminal.Skills.Digitize);
  const extractActive = activeSkills.includes(SourceTerminal.Skills.Extract);
  const turboActive = activeSkills.includes(SourceTerminal.Skills.Turbo);

  // Calculate skill limit - DRAM chip allows 2 skills instead of 1
  const skillLimit = installedChips.includes("DRAM") ? 2 : 1;
  const skillsNeeded = skillLimit - activeSkills.length;

  const enhancementsRemaining = SourceTerminal.enhanceUsesRemaining();
  const turnDuration = SourceTerminal.enhanceBuffDuration();

  const digitizesLeft = SourceTerminal.getDigitizeUsesRemaining();

  useNag(
    () => ({
      id: "source-terminal-learn-skills",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/sourceterminal.gif",
      node: haveTerminal && skillsNeeded > 0 && (
        <Tile
          header="Source Terminal Skills"
          imageUrl="/images/itemimages/sourceterminal.gif"
        >
          <Line>
            Learn {skillsNeeded} skill{skillsNeeded > 1 ? "s" : ""}. Maybe{" "}
            {commaAnd([!extractActive && "Extract", !turboActive && "Turbo"])}
          </Line>
        </Tile>
      ),
    }),
    [haveTerminal, skillsNeeded, extractActive, turboActive],
  );

  if (!haveTerminal) return null;

  const targetMonsters = [
    !get("lighthouseFinished") &&
      availableAmount($item`barrel of gunpowder`) < 5 &&
      "lobsterfrogman",
    get("cyrptAlcoveEvilness") > 31 && "modern zmobie",
    !get("mountainClimbed") &&
      !have($item`ninja rope`) &&
      !have($item`ninja carabiner`) &&
      !have($item`ninja crampons`) &&
      "ninja assassin",
    get("_witchessFights") < 5 && "witchess knight/bishop/rook",
  ].filter(Boolean);

  return (
    <>
      {!enquiry && (
        <Tile
          header="Set Source Terminal Enquiry"
          imageUrl="/images/itemimages/sourceterminal.gif"
        >
          <Line>Set an enquiry for rollover buffs.</Line>
          <Line>
            <Strong>familiar.enq:</Strong> +5 familiar weight.
          </Line>
          <Line>
            <Strong>monsters.enq:</Strong> +25 ML.
          </Line>
          <Line>
            <Strong>stats.enq:</Strong> +100% stats.
          </Line>
        </Tile>
      )}

      {enhancementsRemaining > 0 && (
        <Tile
          header={plural(enhancementsRemaining, "enhancement")}
          id="source-terminal-enhance-resource"
          imageUrl="/images/itemimages/10101.gif"
          href={TERMINAL_URL}
          linkEntireTile
        >
          <Line>
            +30% item, +60% meat, or +50% init ({turnDuration} turns).
          </Line>
        </Tile>
      )}

      {digitizesLeft > 0 && (
        <Tile
          header={plural(digitizesLeft, "digitization")}
          id="source-terminal-digitize-resource"
          imageUrl="/images/itemimages/watch.gif"
          href={!digitizeActive ? TERMINAL_URL : undefined}
          linkEntireTile={!digitizeActive}
        >
          {!digitizeActive && (
            <Line fontWeight="bold">Need to learn digitize!</Line>
          )}
          <Line>Could target a {commaOr(targetMonsters)}.</Line>
          {0 < digitizesLeft &&
            SourceTerminal.getDigitizeMonster() !== null && (
              <Line>Could re-digitize to reset the window.</Line>
            )}
        </Tile>
      )}

      {extrudes < 3 && (
        <Tile
          header={plural(3 - extrudes, "extrusion")}
          id="source-terminal-extrude-resource"
          imageUrl="/images/itemimages/browsercookie.gif"
          href={TERMINAL_URL}
          linkEntireTile
        >
          <Line>Food: 4 fullness epic food.</Line>
          <Line>Drink: 4 drunkenness epic booze.</Line>
          {availableAmount(sourceEssence) < 10 * (3 - extrudes) && (
            <Line>Use Extract skill in combat for more essence.</Line>
          )}
        </Tile>
      )}
    </>
  );
};

export default SourceTerminalTile;
