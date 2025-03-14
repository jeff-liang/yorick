import {
  availableAmount,
  canAdventure,
  equippedAmount,
  getCounter,
  isUnrestricted,
  totalTurnsPlayed,
} from "kolmafia";
import { $item, $location, $skill, get, have } from "libram";

import AdviceTooltipIcon from "../../../components/AdviceTooltipIcon";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

const VotingBooth = () => {
  const iVotedSticker = $item`"I Voted!" sticker`;
  const canVote =
    isUnrestricted(iVotedSticker) && (get("voteAlways") || get("_voteToday"));
  const haveSticker = haveUnrestricted(iVotedSticker);

  const votingMonster = get("_voteMonster");
  const voteFreeFights = get("_voteFreeFights");
  const voteFreeFightsLeft = 3 - voteFreeFights;
  const currentTurns = totalTurnsPlayed();
  const turnsBeforeVoteFight = 11 - (((currentTurns % 11) - 1 + 11) % 11);
  const voteFightNow =
    currentTurns % 11 === 1 && get("lastVoteMonsterTurn") < currentTurns;

  // For LFM special case
  const macrometeoriteUses = get("_macrometeoriteUses");
  const barrelOfGunpowder = $item`barrel of gunpowder`;
  const lighthouseComplete =
    get("questL12War") === "finished" ||
    get("sidequestLighthouseCompleted") !== "none";
  const canDoLFMTrick =
    haveSticker &&
    !lighthouseComplete &&
    availableAmount(barrelOfGunpowder) < 5 &&
    voteFreeFightsLeft <= 0 &&
    voteFightNow &&
    have($skill`Meteor Lore`) &&
    macrometeoriteUses < 10 &&
    getCounter("portscan.edu") !== 0 &&
    canAdventure($location`Sonofa Beach`);

  // Vote monster available now nag
  useNag(
    () => ({
      id: "voting-monster-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: `/images/adventureimages/${votingMonster?.image ?? ""}`,
      node: haveSticker &&
        votingMonster &&
        voteFreeFightsLeft > 0 &&
        voteFightNow && (
          <Tile
            header={`Fight ${votingMonster.name}`}
            imageUrl={`/images/adventureimages/${votingMonster.image}`}
            href={
              equippedAmount(iVotedSticker) === 0
                ? "inventory.php?ftext=i+voted!"
                : undefined
            }
          >
            {equippedAmount(iVotedSticker) === 0 && (
              <Line color="red.solid">Equip the I Voted! sticker first.</Line>
            )}
            <Line>
              Free fight that burns delay. {plural(voteFreeFightsLeft, "fight")}{" "}
              left.
            </Line>
          </Tile>
        ),
    }),
    [
      votingMonster,
      haveSticker,
      voteFreeFightsLeft,
      voteFightNow,
      iVotedSticker,
    ],
  );

  // LFM trick nag
  useNag(
    () => ({
      id: "voting-lfm-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/vrform.gif",
      node: canDoLFMTrick && votingMonster && (
        <Tile
          header="Lobsterfrogman Voting Macrometeorite Trick"
          imageUrl="/images/itemimages/vrform.gif"
          href={
            equippedAmount(iVotedSticker) === 0
              ? "inventory.php?ftext=i+voted!"
              : undefined
          }
        >
          {equippedAmount(iVotedSticker) === 0 && (
            <Line color="red.solid">Equip the I Voted! sticker first.</Line>
          )}
          <Line>
            Adventure in the Sonofa Beach, macrometeorite the{" "}
            {votingMonster.name}, and you'll get a Lobsterfrogman.
          </Line>
        </Tile>
      ),
    }),
    [canDoLFMTrick, iVotedSticker, votingMonster],
  );

  if (!canVote && !haveSticker) return null;
  if (haveSticker && voteFreeFightsLeft === 0) return null;

  return (
    <Tile
      header="Voting Booth"
      imageUrl="/images/itemimages/vrform.gif"
      linkedContent={haveSticker ? iVotedSticker : undefined}
      href={
        !haveSticker
          ? "/place.php?whichplace=town_right&action=townright_vote"
          : undefined
      }
    >
      {!haveSticker && (
        <Line>
          Vote! Gives special modifiers, and unlocks three free fights to burn
          delay.
        </Line>
      )}
      {voteFreeFightsLeft > 0 && (
        <Line>
          Voting monster appears in {plural(turnsBeforeVoteFight, "turn")}.{" "}
          <AdviceTooltipIcon
            advice={`${plural(voteFreeFightsLeft, "free fight")} remaining.`}
          />
        </Line>
      )}
    </Tile>
  );
};

export default VotingBooth;
