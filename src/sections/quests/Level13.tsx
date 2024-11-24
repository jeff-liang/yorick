import { Text } from "@chakra-ui/react";
import {
  availableAmount,
  ElementType,
  getIngredients,
  haveEquipped,
  initiativeModifier,
  Item,
  myBuffedstat,
  myPath,
  numericModifier,
} from "kolmafia";
import {
  $effects,
  $item,
  $items,
  $path,
  $skill,
  $stat,
  freeCrafts,
  get,
  getModifier,
  have,
  NumericModifier,
  questStep,
  sum,
} from "libram";
import { FC } from "react";

import AdviceTooltipIcon from "../../components/AdviceTooltipIcon";
import AdviceTooltipText from "../../components/AdviceTooltipText";
import ElementName from "../../components/ElementName";
import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import Tile from "../../components/Tile";
import { haveUnrestricted } from "../../util/available";
import { questFinished, Step } from "../../util/quest";
import {
  capitalize,
  commaAnd,
  commaOr,
  plural,
  pluralItem,
} from "../../util/text";

const OTHER_QUESTS = [
  "questM05Toot",
  "questL02Larva",
  "questL03Rat",
  "questL04Bat",
  "questL05Goblin",
  "questL06Friar",
  "questL07Cyrptic",
  "questL08Trapper",
  "questL09Topping",
  "questL10Garbage",
  "questL11MacGuffin",
  "questL12War",
] as const;

interface RaceProps {
  name: string;
  contestants: number;
  value: number;
  needed: number;
}

const elements = ["hot", "cold", "spooky", "stench", "sleaze"] as const;
function isElement(name: string): name is ElementType {
  return (elements as readonly string[]).includes(name);
}

const Race: FC<RaceProps> = ({ name, contestants, value, needed }) =>
  contestants !== 0 && (
    <Line>
      {isElement(name) ? (
        <ElementName element={name}>{capitalize(name)}</ElementName>
      ) : (
        capitalize(name)
      )}{" "}
      Race:{" "}
      {contestants < 0 && (
        <Text
          as="span"
          color={value >= needed ? "fg.success" : "fg.error"}
          fontWeight={value >= needed ? undefined : "bold"}
        >
          {value.toFixed(0)}/400
        </Text>
      )}
      {contestants > 0 && `${plural(contestants, "contestant")} left.`}
    </Line>
  );

const Level13: FC = () => {
  const step = questStep("questL13Final");
  const inActuallyEdTheUndying = myPath() === $path`Actually Ed the Undying`;

  if (step === Step.UNSTARTED && inActuallyEdTheUndying) {
    return null;
  }

  const statRaceType = get("nsChallenge1");
  const statRaceModifier = statRaceType?.identifierString as
    | NumericModifier
    | undefined;
  const elementalDamageRaceType = get("nsChallenge2");
  const hedgeMazeElements = [
    get("telescope3"),
    get("telescope4"),
    get("telescope5"),
  ].filter(Boolean);

  const pastRaces = step >= 4;
  const pastHedgeMaze = step >= 5;
  const pastKeys = step >= 6;
  const pastTowerLevel1 = step >= 7;
  const pastTowerLevel2 = step >= 8;
  const pastTowerLevel3 = step >= 9;
  const pastTowerLevel4 = step >= 10;
  const pastTowerLevel5 = step >= 11;
  const kingWaitingToBeFreed = step >= 13;

  const keysUsed = get("nsTowerDoorKeysUsed").split(",");

  if (!pastRaces) {
    const potions = $items`tomato juice of powerful power, philter of phorce, ointment of the occult, serum of sarcasm`;
    const availablePotions = potions.filter(
      (potion) =>
        Object.entries(getIngredients(potion)).every(([name, count]) =>
          have(Item.get(name), count),
        ) &&
        statRaceModifier &&
        getModifier(statRaceModifier, potion) > 0,
    );
    return (
      <QuestTile
        header="Find the Naughty Sorceress"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile
        imageUrl="/images/adventureimages/regdesk.gif"
        minLevel={13}
        disabled={OTHER_QUESTS.some((quest) => !questFinished(quest))}
      >
        {step <= 1 && (
          <>
            {step === Step.STARTED && (
              <Line>Register for the races at the registration desk.</Line>
            )}
            {step === 1 && (
              <Line>Defeat the race contestants at the base of the tower.</Line>
            )}
            <Race
              name="Initiative"
              contestants={get("nsContestants1")}
              value={getModifier("Initiative")}
              needed={400}
            />
            <Race
              name={statRaceModifier ?? "Elemental"}
              contestants={get("nsContestants2")}
              value={statRaceModifier ? getModifier(statRaceModifier) : 0}
              needed={600}
            />
            {statRaceModifier &&
              getModifier(statRaceModifier) < 600 &&
              availablePotions.length > 0 &&
              freeCrafts("food") > 0 && (
                <Line>
                  Could make {commaOr(availablePotions)} to boost{" "}
                  {statRaceModifier}.
                </Line>
              )}
            <Race
              name={elementalDamageRaceType || "Stat"}
              contestants={get("nsContestants3")}
              value={
                getModifier(
                  `${elementalDamageRaceType} Damage` as NumericModifier,
                ) +
                getModifier(
                  `${elementalDamageRaceType} Spell Damage` as NumericModifier,
                )
              }
              needed={100}
            />
          </>
        )}
        {step === 2 && (
          // TODO: Link directly to registration desk.
          <Line>Return to the registration desk and claim your prize!</Line>
        )}
        {step === 3 && (
          // TODO: Link directly to courtyard.
          <Line>Attend your coronation in the courtyard.</Line>
        )}
      </QuestTile>
    );
  }

  if (!pastHedgeMaze) {
    return (
      <Tile
        header="Hedge Maze"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile
        imageUrl="/images/adventureimages/hedgemaze.gif"
      >
        <Line>Navigate the Hedge Maze in the Naughty Sorceress' Tower.</Line>
        {hedgeMazeElements.length > 0 && (
          <Line>Elements needed: {hedgeMazeElements.join(", ")}</Line>
        )}
      </Tile>
    );
  }

  if (!pastKeys) {
    const missingKeys = [
      "Boris's key",
      "Jarlsberg's key",
      "Sneaky Pete's key",
      "skeleton key",
      "Richard's star key",
      "digital key",
    ].filter((key) => !keysUsed.includes(key));
    return (
      <Tile
        header="Tower Door"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile
        imageUrl="/images/adventureimages/nstower_door.gif"
      >
        <Line>Open the tower door.</Line>
        {missingKeys.length > 0 && (
          <Line>Missing keys: {missingKeys.join(", ")}</Line>
        )}
      </Tile>
    );
  }

  if (!pastTowerLevel1) {
    // TODO: Provide tower-killing instruction.
    return (
      <Tile
        header="Wall of Skin"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile
        imageUrl="/images/adventureimages/ns_wall1.gif"
      >
        <Line>Defeat the Wall of Skin.</Line>
        {have($item`beehive`) ? (
          <Line>Use the beehive against it.</Line>
        ) : (
          <Line>
            Find the beehive in the Black Forest (-combat), or towerkill.
          </Line>
        )}
      </Tile>
    );
  }

  if (!pastTowerLevel2) {
    return (
      <Tile
        header="Wall of Meat"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile
        imageUrl="/images/adventureimages/ns_wall2.gif"
      >
        <Line>Defeat the Wall of Meat.</Line>
        <Line>
          <AdviceTooltipText advice="You need 526% meat drop to guarantee a one-turn kill.">
            {`Current meat drop: ${getModifier("Meat Drop").toFixed(0)}`}
          </AdviceTooltipText>
        </Line>
      </Tile>
    );
  }

  if (!pastTowerLevel3) {
    const haveBoningKnife = have($item`electric boning knife`);

    const candyCaneSwordCane = $item`candy cane sword cane`;
    const haveCcsc = haveUnrestricted(candyCaneSwordCane);
    const haveCcscEquipped = haveEquipped(candyCaneSwordCane);
    const slashAvailable = get("_surprisinglySweetSlashUsed") < 11;

    const haveSaucegeyser = have($skill`Saucegeyser`);
    const mlModifier = Math.max(
      0.5,
      1 - numericModifier("Monster Level") / 250,
    );
    const saucegeyserDamage =
      3 *
      mlModifier *
      ((numericModifier("Spell Damage Percent") / 100) *
        (60 + 0.4 * myBuffedstat($stat`Mysticality`)) +
        numericModifier("Spell Damage"));

    const badEffects =
      $effects`Jalapeño Saucesphere, Scarysauce, Spiky Shell, Psalm of Pointiness`.filter(
        (effect) => have(effect),
      );

    return (
      <Tile
        header="Defeat the Wall of Bones"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile={
          haveBoningKnife ||
          (badEffects.length === 0 &&
            !(haveCcsc && slashAvailable && !haveCcscEquipped))
        }
        imageUrl="/images/adventureimages/ns_wall3.gif"
      >
        {haveBoningKnife ? (
          <Line>Use the electric boning knife against it.</Line>
        ) : (
          <>
            <Line>
              Find the electric boning knife on the ground floor of the Castle
              in the Clouds in the Sky (-combat), or towerkill.
            </Line>
            {getModifier("Thorns") +
              getModifier("Sporadic Thorns") +
              getModifier("Damage Aura") >
              0 && (
              <Line color="red.solid">
                Remove damaging equipment and effects.
              </Line>
            )}
            {badEffects.length > 0 && (
              <Line
                command={badEffects
                  .map((effect) => `shrug ${effect.name}`)
                  .join("; ")}
                color="red.solid"
              >
                Remove thorns effects: {commaAnd(badEffects)}.
              </Line>
            )}
            {haveCcsc && slashAvailable && (
              <>
                {!haveCcscEquipped && (
                  <Line command="equip candy cane sword cane" color="red.solid">
                    Equip the candy cane sword.
                  </Line>
                )}
                <Line>Use Surprisingly Sweet Slash to reduce HP by 75%.</Line>
              </>
            )}
            {haveSaucegeyser && (
              <Line>
                Minimum Saucegeyser damage: {saucegeyserDamage.toFixed(0)}/
                {haveCcsc ? 1667 : 5000}
              </Line>
            )}
          </>
        )}
      </Tile>
    );
  }

  if (!pastTowerLevel4) {
    return (
      <Tile
        header="Mirror"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile
        imageUrl="/images/adventureimages/mirror.gif"
      >
        <Line>Face the looking glass.</Line>
        <Line>
          Gazing upon the looking glass will cost a turn, but makes the Naughty
          Sorceress much easier.
        </Line>
        <Line>
          Breaking the mirror will save a turn, but makes the NS fight much more
          difficult.
        </Line>
      </Tile>
    );
  }

  if (!pastTowerLevel5) {
    const items = $items`gauze garter, filthy poultice, scented massage oil, red pixel potion`;
    const available = items.filter(have);
    return (
      <Tile
        header="Your Shadow"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile
        imageUrl="/images/adventureimages/shadow.gif"
      >
        <Line>Fight your shadow.</Line>
        {available.length > 0 && (
          <Line>
            Healing items: {commaAnd(available.map((item) => pluralItem(item)))}
          </Line>
        )}
        {sum(available, (item) => availableAmount(item)) < 4 && (
          <Line color="red.solid">
            Need more healing items. Get scented massage oil or red pixel
            potion.
          </Line>
        )}
        <Line>
          Current initiative: {initiativeModifier().toFixed(0)}.{" "}
          <AdviceTooltipIcon advice="You want enough initiative to go first against Your Shadow." />
        </Line>
      </Tile>
    );
  }

  if (!kingWaitingToBeFreed) {
    return (
      <Tile
        header="Naughty Sorceress"
        id="level-13-quest"
        href="/place.php?whichplace=nstower"
        linkEntireTile
        imageUrl="/images/adventureimages/ns.gif"
        disabled={!have($item`Wand of Nagamar`)}
      >
        <Line>Defeat the Naughty Sorceress.</Line>
        <Line>Good luck!</Line>
      </Tile>
    );
  }

  return (
    <Tile
      header="Free King Ralph"
      id="level-13-quest"
      href="/place.php?whichplace=nstower"
      linkEntireTile
      imageUrl="/images/otherimages/gash.gif"
    >
      <Line>Free King Ralph from his prism.</Line>
    </Tile>
  );
};

export default Level13;
