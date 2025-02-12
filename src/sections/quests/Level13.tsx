import { List, Strong, Text } from "@chakra-ui/react";
import { decode } from "html-entities";
import {
  availableAmount,
  Element,
  elementalResistance,
  ElementType,
  equippedItem,
  Familiar,
  getIngredients,
  haveEquipped,
  initiativeModifier,
  Item,
  itemType,
  myBuffedstat,
  myFamiliar,
  myHp,
  myMaxhp,
  myPath,
  numericModifier,
  toSkill,
} from "kolmafia";
import {
  $effects,
  $familiar,
  $item,
  $items,
  $location,
  $path,
  $skill,
  $slot,
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
import AsyncLink from "../../components/AsyncLink";
import ElementName from "../../components/ElementName";
import Line from "../../components/Line";
import LinkBlock from "../../components/LinkBlock";
import QuestTile from "../../components/QuestTile";
import Tile from "../../components/Tile";
import { haveUnrestricted } from "../../util/available";
import { monsterLevelWithPercent } from "../../util/calc";
import { parentPlaceLink } from "../../util/links";
import { questFinished, Step } from "../../util/quest";
import {
  capitalize,
  commaAnd,
  commaOr,
  plural,
  pluralItem,
  separate,
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
  percent?: boolean;
}

const elements = ["hot", "cold", "spooky", "stench", "sleaze"] as const;
function isElement(name: string): name is ElementType {
  return (elements as readonly string[]).includes(name);
}

const telescope3Map: Record<string, ElementType> = {
  "creepy-looking black bushes on the outskirts of a hedge maze": "spooky",
  "nasty-looking, dripping green bushes on the outskirts of a hedge maze":
    "stench",
  "purplish, greasy-looking hedges": "sleaze",
  "smoldering bushes on the outskirts of a hedge maze": "hot",
  "frost-rimed bushes on the outskirts of a hedge maze": "cold",
};

const telescope4Map: Record<string, ElementType> = {
  "a greasy purple cloud hanging over the center of the maze": "sleaze",
  "smoke rising from deeper within the maze": "hot",
  "a miasma of eldritch vapors rising from deeper within the maze": "spooky",
  "a cloud of green gas hovering over the maze": "stench",
  "wintry mists rising from deeper within the maze": "cold",
};

const telescope5Map: Record<string, ElementType> = {
  "occasionally disgorging a bunch of ice cubes": "cold",
  "that occasionally vomits out a greasy ball of hair": "sleaze",
  "surrounded by creepy black mist": "spooky",
  "disgorging a really surprising amount of sewage": "stench",
  "with lava slowly oozing out of it": "hot",
};

const Race: FC<RaceProps> = ({ name, contestants, value, needed, percent }) =>
  contestants !== 0 && (
    <Line>
      {isElement(name) ? (
        <ElementName element={name}>{capitalize(name)}</ElementName>
      ) : (
        capitalize(name)
      )}{" "}
      Race:{" "}
      {contestants < 0 && (
        <>
          <Text
            as="span"
            color={value >= needed ? "fg.success" : "fg.error"}
            fontWeight={value >= needed ? undefined : "bold"}
          >
            {value.toFixed(0)}/{needed}
            {percent && "%"}
          </Text>
          .
        </>
      )}
      {contestants > 0 && `${plural(contestants, "contestant")} left.`}
    </Line>
  );

const NSTOWER_URL = "/place.php?whichplace=nstower";

function damageEffects() {
  return $effects`Jalapeño Saucesphere, Scarysauce, Spiky Shell, Psalm of Pointiness`;
}

function damageItems() {
  return $items`Hand in Glove, bottle opener belt buckle, Buddy Bjorn, smirking shrunken head, Kremlin's Greatest Briefcase, tiny bowler`;
}

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
  const elementalDamageRaceType = capitalize(get("nsChallenge2"));

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
        statRaceType &&
        (getModifier(statRaceModifier, potion) > 0 ||
          getModifier(
            `${statRaceType.identifierString} Percent` as NumericModifier,
          ) > 0),
    );
    return (
      <QuestTile
        header="Find the Naughty Sorceress"
        id="level-13-quest"
        href={NSTOWER_URL}
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
              percent
            />
            <Race
              name={statRaceModifier ?? "Elemental"}
              contestants={get("nsContestants2")}
              value={statRaceType ? myBuffedstat(statRaceType) : 0}
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
    const elements: ElementType[] = [
      telescope3Map[get("telescope3")],
      telescope4Map[get("telescope4")],
      telescope5Map[get("telescope5")],
    ].filter((e) => e);

    // 90% for first test, 80% second, 70% third.
    // TODO: What if we don't know the elements? Guess our worst three elements.
    const damages = elements.map((element, index): [ElementType, number] => [
      element,
      myMaxhp() *
        (0.9 - 0.1 * index) *
        (1 - elementalResistance(Element.get(element)) / 100),
    ]);
    const totalDamage = sum(damages, ([, d]) => Math.ceil(d));

    return (
      <Tile
        header="Hedge Maze"
        id="level-13-quest"
        href={NSTOWER_URL}
        imageUrl="/images/adventureimages/hedgemaze.gif"
      >
        <LinkBlock href={NSTOWER_URL}>
          <Line>Navigate the Hedge Maze below the tower.</Line>
          <Line>Choose the second option each time.</Line>
          {elements.every((e) => e) && (
            <>
              <Line>
                Elements needed:{" "}
                {commaAnd(
                  elements.map(
                    (element) => element && <ElementName element={element} />,
                  ),
                  elements,
                )}
                .
              </Line>
              <Line>
                Predicted damage:{" "}
                {separate(
                  damages.map(
                    ([element, damage]) =>
                      element && (
                        <ElementName element={element}>
                          {Math.ceil(damage)}
                        </ElementName>
                      ),
                  ),
                  " + ",
                  elements,
                )}{" "}
                = <Strong>{totalDamage}</Strong>.
              </Line>
            </>
          )}
        </LinkBlock>
        {totalDamage > myMaxhp() ? (
          <Line color="red.solid">
            You do not have enough resistance / max HP.
          </Line>
        ) : (
          totalDamage > myHp() && (
            <Line
              color="red.solid"
              command={
                haveUnrestricted($skill`Cannelloni Cocoon`)
                  ? `cast ${Math.ceil((myMaxhp() - myHp()) / 999)} Cannelloni Cocoon`
                  : undefined
              }
            >
              Restore your HP first.
            </Line>
          )
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
        href={NSTOWER_URL}
        linkEntireTile
        imageUrl="/images/itemimages/keya.gif"
      >
        {missingKeys.length > 0 ? (
          <Line>Missing keys: {commaAnd(missingKeys)}.</Line>
        ) : (
          <Line>Open the tower door.</Line>
        )}
      </Tile>
    );
  }

  if (!pastTowerLevel1) {
    const haveBeehive = have($item`beehive`);

    const effectSources = damageEffects().filter((effect) => !have(effect));
    const itemSources = damageItems().filter(
      (item) => have(item) && !haveEquipped(item),
    );

    const familiars: [Familiar, number][] = [
      [$familiar`Mu`, 5],
      [$familiar`Imitation Crab`, 4],
      [$familiar`Sludgepuppy`, 3],
      [$familiar`Mini-Crimbot`, 3],
    ];
    const bestFamiliar = familiars.find(([familiar]) => have(familiar))?.[0];

    const elements = ["Hot", "Cold", "Spooky", "Sleaze", "Stench"];
    const elementalDamage = elements.filter(
      (element) => numericModifier(`${element} Damage`) > 0,
    ).length;

    const buttSkill = have($skill`Headbutt`)
      ? $skill`Headbutt`
      : have($skill`Kneebutt`)
        ? $skill`Kneebutt`
        : have($skill`Shieldbutt`) &&
            itemType(equippedItem($slot`off-hand`)) === "shield"
          ? $skill`Shieldbutt`
          : null;

    const currentDirect =
      1 +
      elementalDamage +
      +(buttSkill !== null) +
      getModifier("Damage Aura") +
      (familiars.find(([familiar]) => familiar === myFamiliar())?.[1] ?? 0);

    const currentThorns = getModifier("Thorns");
    const ml = monsterLevelWithPercent();

    return (
      <Tile
        header="Wall of Skin"
        id="level-13-quest"
        href={NSTOWER_URL}
        linkEntireTile={haveBeehive}
        imageUrl="/images/itemimages/beehive.gif"
      >
        <Line href={haveBeehive ? undefined : NSTOWER_URL}>
          Defeat the Wall of Skin.
        </Line>
        {haveBeehive ? (
          <Line>Use the beehive against it.</Line>
        ) : (
          <>
            <Line href={parentPlaceLink($location`The Black Forest`)}>
              Find the beehive in the Black Forest (-combat), or towerkill.
            </Line>
            {ml > 0 && (
              <Line fontWeight="bold" color="red.solid">
                Remove ML before fighting the Wall of Skin.
              </Line>
            )}
            <Line>
              Current damage per turn: {currentDirect} direct and{" "}
              {currentThorns} thorns.
            </Line>
            {effectSources.length > 0 && (
              <>
                <Line>Get effects:</Line>
                <List.Root>
                  {effectSources.map((effect) => (
                    <AsyncLink
                      key={effect.identifierString}
                      alignSelf="start"
                      command={`cast ${decode(toSkill(effect).identifierString)}`}
                    >
                      <List.Item>{decode(effect.identifierString)}</List.Item>
                    </AsyncLink>
                  ))}
                </List.Root>
              </>
            )}
            {itemSources.length > 0 && (
              <>
                <Line>Equip items:</Line>
                <List.Root>
                  {itemSources.map((item) => (
                    <AsyncLink
                      key={item.identifierString}
                      alignSelf="start"
                      command={`equip ${decode(item.identifierString)}`}
                    >
                      <List.Item>{decode(item.identifierString)}</List.Item>
                    </AsyncLink>
                  ))}
                </List.Root>
              </>
            )}
            {bestFamiliar && myFamiliar() !== bestFamiliar && (
              <Line command={`familiar ${bestFamiliar.identifierString}`}>
                Take your {bestFamiliar.identifierString}.
              </Line>
            )}
          </>
        )}
      </Tile>
    );
  }

  if (!pastTowerLevel2) {
    return (
      <Tile
        header="Defeat the Wall of Meat"
        id="level-13-quest"
        href={NSTOWER_URL}
        linkEntireTile
        imageUrl="/images/itemimages/meat.gif"
      >
        <Line>
          <AdviceTooltipText advice="You need 526% meat drop to guarantee a one-turn kill.">
            {`Current meat drop: ${getModifier("Meat Drop").toFixed(0)}/526%.`}
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

    const badEffects = damageEffects().filter(have);

    return (
      <Tile
        header="Defeat the Wall of Bones"
        id="level-13-quest"
        href={NSTOWER_URL}
        linkEntireTile={
          haveBoningKnife ||
          (badEffects.length === 0 &&
            !(haveCcsc && slashAvailable && !haveCcscEquipped))
        }
        imageUrl="/images/itemimages/elecbone.gif"
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
              <>
                <Line color="red.solid">
                  Remove damaging equipment and effects.
                </Line>
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
              </>
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
                {haveCcsc && slashAvailable ? 1667 : 5000}
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
        header="Consider the Mirror"
        id="level-13-quest"
        href={NSTOWER_URL}
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
        href={NSTOWER_URL}
        linkEntireTile
        imageUrl="/images/adventureimages/shadowsealclubberf.gif"
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
        href={NSTOWER_URL}
        linkEntireTile
        imageUrl="/images/adventureimages/ns.gif"
        disabled={!have($item`Wand of Nagamar`)}
      >
        <Line>Defeat the Naughty Sorceress.</Line>
        <Line>Remember: she will remove all your buffs.</Line>
        <Line>Good luck!</Line>
      </Tile>
    );
  }

  return (
    <Tile
      header="Free King Ralph"
      id="level-13-quest"
      href={NSTOWER_URL}
      linkEntireTile
      imageUrl="/images/otherimages/gash.gif"
    >
      <Line>Free King Ralph from his prism.</Line>
    </Tile>
  );
};

export default Level13;
