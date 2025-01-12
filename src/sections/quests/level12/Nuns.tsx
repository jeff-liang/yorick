import {
  availableAmount,
  effectModifier,
  haveEffect,
  hiddenTempleUnlocked,
  isUnrestricted,
  meatDropModifier,
  myAscensions,
  myLocation,
  myPath,
  numericModifier,
  pullsRemaining,
} from "kolmafia";
import {
  $effect,
  $item,
  $location,
  $path,
  $skill,
  get,
  have,
  SongBoom,
} from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import QuestTile from "../../../components/QuestTile";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { plural } from "../../../util/text";

interface Range {
  low: number;
  high: number;
}

function turnRangeString(range: Range) {
  return range.low === range.high
    ? `${plural(range.low, "turn")} remaining.`
    : `[${range.low} to ${range.high}] turns remaining`;
}

function getPotentialPulls(meatRemaining: number) {
  if (pullsRemaining() > 0 && meatDropModifier() < 1000.0) {
    const limit = meatDropModifier() < 800.0 ? 50 : 100;
    const averageTurnsCurrently =
      meatRemaining / ((meatDropModifier() / 100.0 + 1.0) * 1000.0);

    const possible = [
      $item`frost flower`,
      $item`Mick's IcyVapoHotness Inhaler`,
      $item`sorority brain`,
      $item`tempura cauliflower`,
      $item`bottle of Greedy Dog`,
      $item`The Inquisitor's unidentifiable object`,
      $item`jumping horseradish`,
      $item`sea truffle`,
      $item`dirt julep`,
      $item`Daily Affirmation: Always be Collecting`,
      $item`beggin' cologne`,
      $item`battery (car)`,
      $item`Boris's bread`,
      $item`lodestone`,
      $item`flapper fly`,
    ];
    return possible
      .filter((item) => isUnrestricted(item) && !have(item))
      .map((item) => {
        const effect = effectModifier(item, "Effect");
        const meatDroppedPerTurnWithItem =
          ((meatDropModifier() + numericModifier(effect, "Meat Drop")) / 100.0 +
            1.0) *
          1000.0;
        const turnsSaved =
          averageTurnsCurrently - meatRemaining / meatDroppedPerTurnWithItem;
        if (turnsSaved < 1.0) return null;
        return `${item.name} (${Math.round(numericModifier(effect, "Meat Drop"))}%, ${turnsSaved.toFixed(1)} turns saved)`;
      })
      .filter((x) => x)
      .slice(0, limit);
  }
  return [];
}

export interface NunsProps {
  disabled?: boolean;
}

const Nuns: FC<NunsProps> = ({ disabled }) => {
  const currentPath = myPath();
  const meatGotten = get("currentNunneryMeat");
  const meatRemaining = 100000 - meatGotten;
  const meatDropMultiplier = meatDropModifier() / 100.0 + 1.0;
  const brigandMeatDropRange: Range = {
    low: 800 * meatDropMultiplier,
    high: 1200 * meatDropMultiplier,
  };

  const turnRange = {
    low: Math.ceil(meatRemaining / brigandMeatDropRange.high),
    high: Math.ceil(meatRemaining / brigandMeatDropRange.low),
  };
  const singTurnRange = {
    low: Math.ceil(meatRemaining / (brigandMeatDropRange.high + 25)),
    high: Math.ceil(meatRemaining / (brigandMeatDropRange.low + 25)),
  };

  const potentialPulls = getPotentialPulls(meatRemaining);

  const haveLodestone = have($item`Rufus's shadow lodestone`);
  const haveShadowWaters = have($effect`Shadow Waters`);
  const atNuns = myLocation() === $location`The Themthar Hills`;
  useNag(
    () => ({
      id: "nuns-shadow-waters-nag",
      priority: NagPriority.ERROR,
      imageUrl: "/images/itemimages/shadowvenom.gif",
      node: atNuns && haveLodestone && !haveShadowWaters && (
        <Tile
          header="Get Shadow Waters"
          imageUrl="/images/itemimages/shadowvenom.gif"
          href="/plains.php"
          linkEntireTile
        >
          <Line>Use your lodestone to get Shadow Waters for +meat.</Line>
        </Tile>
      ),
    }),
    [atNuns, haveLodestone, haveShadowWaters],
  );

  return (
    <QuestTile
      header="Island War Nuns"
      imageUrl="/images/adventureimages/bandit.gif"
      href="/bigisland.php?place=nunnery"
      disabled={disabled}
    >
      <Line>{meatRemaining} meat remaining.</Line>
      {SongBoom.have() &&
        (SongBoom.song() === "Total Eclipse of Your Meat" ||
          SongBoom.songChangesLeft() > 0) && (
          <>
            {SongBoom.song() !== "Total Eclipse of Your Meat" && (
              <Line>Change BoomBox song to Total Eclipse of Your Meat.</Line>
            )}
            <Line>Be sure to Sing Along with your BoomBox every turn.</Line>
            <Line>{turnRangeString(singTurnRange)}, if you sing.</Line>
          </>
        )}
      <Line>{turnRangeString(turnRange)}.</Line>
      {turnRange.low === 1 && turnRange.high === 2 && (
        <Line>
          {Math.floor(
            (1.0 -
              (meatRemaining + 1 - brigandMeatDropRange.low) /
                (brigandMeatDropRange.high - brigandMeatDropRange.low)) *
              100,
          )}
          % chance of completing in one turn.
        </Line>
      )}
      {have($item`Rufus's shadow lodestone`) &&
        !have($effect`Shadow Waters`) && (
          <Line href="/plains.php" fontWeight="bold">
            Go to a shadow rift for Shadow Waters!
          </Line>
        )}
      {!have($item`ice nine`) &&
        availableAmount($item`ice harvest`) >= 9 &&
        !have($item`miracle whip`) && (
          <Line>
            Possibly make and equip an ice nine. (+30% meat 1h weapon)
          </Line>
        )}
      {!have($effect`Sinuses For Miles`) &&
        have($item`stone wool`) &&
        get("lastTempleAdventures") < myAscensions() &&
        hiddenTempleUnlocked() &&
        turnRange.high > haveEffect($effect`Sinuses For Miles`) && (
          <Line>
            Potentially use stone wool and visit the hidden temple to extend
            Sinuses for Miles for 3 turns.
          </Line>
        )}
      {currentPath === $path`Heavy Rains` &&
        have($skill`Make it Rain`) &&
        turnRange.high > 1 && (
          <Line>Cast Make it Rain each fight. (+300%? meat)</Line>
        )}
      {have($item`Sneaky Pete's leather jacket (collar popped)`) &&
        turnRange.high > 1 && <Line>Could unpop your collar. (+20% meat)</Line>}
      {potentialPulls.length > 0 && (
        <Line>Could try pulling {potentialPulls.join(", ")}.</Line>
      )}
    </QuestTile>
  );
};

export default Nuns;
