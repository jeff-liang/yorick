import { Text } from "@chakra-ui/react";
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
import { plural } from "../../../util/text";

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
      node: haveTerminal && skillsNeeded > 0 && (
        <Tile
          header="Source Terminal Skills"
          imageUrl="/images/itemimages/sourceterm.gif"
        >
          <Line>
            Learn {skillsNeeded} skill{skillsNeeded > 1 ? "s" : ""}. Maybe{" "}
            {!activeSkills.includes(SourceTerminal.Skills.Extract) && "Extract"}
            {!activeSkills.includes(SourceTerminal.Skills.Extract) &&
              !activeSkills.includes(SourceTerminal.Skills.Turbo) &&
              " and "}
            {!activeSkills.includes(SourceTerminal.Skills.Turbo) && "Turbo"}.
          </Line>
        </Tile>
      ),
    }),
    [haveTerminal, skillsNeeded, activeSkills],
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
            <Text as="b">familiar.enq:</Text> +5 familiar weight.
          </Line>
          <Line>
            <Text as="b">monsters.enq:</Text> +25 ML.
          </Line>
          <Line>
            <Text as="b">stats.enq:</Text> +100% stats.
          </Line>
        </Tile>
      )}

      {enhancementsRemaining > 0 && (
        <Tile
          header={plural(enhancementsRemaining, "enhancement")}
          id="source-terminal-enhance-resource"
          imageUrl="/images/itemimages/10101.gif"
        >
          <Line>items.enh: +30% item ({turnDuration} turns).</Line>
          <Line>meat.enh: +60% meat ({turnDuration} turns).</Line>
          <Line>init.enh: +50% init ({turnDuration} turns).</Line>
        </Tile>
      )}

      {digitizesLeft > 0 && (
        <Tile
          header={plural(digitizesLeft, "digitization")}
          id="source-terminal-digitize-resource"
          imageUrl="/images/itemimages/watch.gif"
        >
          {targetMonsters.map((monster, i) => (
            <Line key={i}>Could target a {monster}.</Line>
          ))}
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
