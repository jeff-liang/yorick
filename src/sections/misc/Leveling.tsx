import { List } from "@chakra-ui/react";
import {
  availableAmount,
  canInteract,
  Effect,
  effectModifier,
  Familiar,
  getWorkshed,
  haveEquipped,
  isUnrestricted,
  Item,
  myBasestat,
  myClass,
  myFamiliar,
  myLevel,
  myPrimestat,
  mySpleenUse,
  numericModifier,
  pullsRemaining,
  Skill,
  spleenLimit,
  toEffect,
} from "kolmafia";
import {
  $class,
  $effect,
  $familiar,
  $item,
  $skill,
  $stat,
  clamp,
  get,
  getModifier,
  have,
  MayamCalendar,
  questStep,
  totalFamiliarWeight,
} from "libram";

import AsyncLink from "../../components/AsyncLink";
import Cold from "../../components/elemental/Cold";
import Line from "../../components/Line";
import LinkBlock from "../../components/LinkBlock";
import MainLink from "../../components/MainLink";
import Tile from "../../components/Tile";
import { haveUnrestricted } from "../../util/available";
import { inventoryLink } from "../../util/links";
import { questStarted, Step } from "../../util/quest";
import { renderSourceList, Source } from "../../util/source";
import { plural } from "../../util/text";

interface ColdResSource {
  thing: Skill | Item | Effect | Familiar | string;
  available: () => boolean;
  value?: () => number;
}

function skill(skill: Skill): ColdResSource {
  const effect = toEffect(skill);
  return {
    thing: effect,
    available: () => !haveUnrestricted(skill) && !have(effect),
  };
}

function equipment(item: Item, itemAvailable = () => true): ColdResSource {
  return {
    thing: item,
    available: () => itemAvailable() && !haveUnrestricted(item),
  };
}

function potion(item: Item, itemAvailable = () => true): ColdResSource {
  const effect = effectModifier(item, "Effect");
  return {
    thing: effect,
    available: () =>
      (itemAvailable() || haveUnrestricted(item)) && !have(effect),
    value: () => numericModifier(effect, "Cold Resistance"),
  };
}

function effect(effect: Effect, effectAvailable = () => true): ColdResSource {
  return {
    thing: effect,
    available: () => effectAvailable() && !have(effect),
  };
}

const Leveling: React.FC = () => {
  if (myLevel() >= 12 || myClass() === $class`Zootomist`) return null;

  const multiplier =
    1 +
    numericModifier(`${myPrimestat().identifierString} Experience Percent`) /
      100;

  const levelingSources: Source[] = [
    {
      name: "Numberology",
      remaining: () =>
        +haveUnrestricted($skill`Calculate the Universe`) &&
        Math.min(3, get("skillLevel144")) - get("_universeCalculated"),
      render: ({ remaining }) => (
        <List.Item>
          {plural(remaining, "numberology use")} ({(multiplier * 89).toFixed(0)}{" "}
          mainstat).
        </List.Item>
      ),
    },
    {
      name: "Bastille",
      remaining: () =>
        +haveUnrestricted($item`Bastille Battalion control rig`) -
        get("_bastilleGames"),
      render: () => (
        <List.Item>
          <MainLink href={inventoryLink($item`Bastille Battalion control rig`)}>
            1 Bastille use ({(multiplier * 250).toFixed(0)} mainstat).
          </MainLink>
        </List.Item>
      ),
    },
    {
      name: "Leaflet",
      remaining: () => +!get("leafletCompleted"),
      render: () => {
        const text = (
          <>
            1 strange leaflet (Quests menu)
            {myLevel() < 9
              ? " (at level 9)"
              : !have($item`strange leaflet`) && " (visit council)"}
            .
          </>
        );
        return (
          <List.Item>
            {myLevel() >= 9 && !have($item`strange leaflet`) ? (
              <MainLink href="/council.php">{text}</MainLink>
            ) : (
              text
            )}
          </List.Item>
        );
      },
    },
    {
      name: "Enchanted Bean",
      remaining: () =>
        +(
          questStep("questL10Garbage") <= Step.STARTED &&
          haveUnrestricted($item`spring shoes`)
        ),
      render: () => {
        const haveBean = have($item`enchanted bean`);
        const verb = haveBean ? "Plant" : "Find and plant";
        const text = `${verb} an enchanted bean${myLevel() >= 10 ? "" : " (at level 10)"}.`;
        return (
          <List.Item>
            {myLevel() >= 10 && haveBean ? (
              haveEquipped($item`spring shoes`) ? (
                <MainLink
                  href={
                    questStarted("questL10Garbage")
                      ? inventoryLink($item`enchanted bean`)
                      : "/council.php"
                  }
                >
                  {text}
                </MainLink>
              ) : (
                <AsyncLink command="equip acc3 spring shoes">
                  Equip spring shoes, then plant enchanted bean.
                </AsyncLink>
              )
            ) : (
              text
            )}
          </List.Item>
        );
      },
    },
  ];

  const { total, rendered } = renderSourceList(levelingSources);

  const coldResSources: ColdResSource[] = [
    // Can't usually get passives, so don't show those.

    skill($skill`Elemental Saucesphere`),
    skill($skill`Scarysauce`),
    skill($skill`Astral Shell`),
    skill($skill`Feel Peaceful`),

    equipment($item`astronaut helmet`, () => get("_photoBoothEquipment") < 3),
    equipment(
      $item`Jurassic Parka`,
      () =>
        haveUnrestricted($item`Jurassic Parka`) &&
        get("parkaMode") !== "kachungasaur",
    ),
    equipment($item`Apriling band tuba`),
    equipment($item`bembershoot`),

    {
      thing: $familiar`Exotic Parrot`,
      available: () =>
        have($familiar`Exotic Parrot`) &&
        myFamiliar() !== $familiar`Exotic Parrot`,
      value: () =>
        Math.floor((totalFamiliarWeight($familiar`Exotic Parrot`) - 5) / 20),
    },

    potion(
      $item`bottle of antifreeze`,
      () => canInteract() || pullsRemaining() > 0,
    ),
    potion(
      $item`Synapse Blaster`,
      () =>
        mySpleenUse() < spleenLimit() &&
        haveUnrestricted($item`server room key`),
    ),
    potion($item`scroll of minor invulnerability`, () =>
      haveUnrestricted($skill`Secret Door Awareness`),
    ),
    potion($item`lotion of hotness`, () =>
      have($skill`Advanced Saucecrafting`),
    ),
    potion($item`lotion of spookiness`, () =>
      have($skill`Advanced Saucecrafting`),
    ),
    potion($item`cold powder`),
    potion($item`cyan seashell`, () => haveUnrestricted($item`Beach Comb`)),

    effect(
      $effect`Walled In`,
      () => MayamCalendar.have() && MayamCalendar.available("wall"),
    ),
    effect(
      $effect`Ready to Survive`,
      () =>
        haveUnrestricted($item`MayDay™ supply package`) ||
        (isUnrestricted($item`MayDay™ supply package`) &&
          get("hasMaydayContract") &&
          !get("_maydayDropped")),
    ),
    effect(
      $effect`Double Hot Soupy Garbage`,
      () => getWorkshed() === $item`model train set`,
    ),
    effect(
      $effect`Hot Soupy Garbage`,
      () => getWorkshed() === $item`model train set`,
    ),
    effect($effect`Imagining Guts`, () =>
      haveUnrestricted($skill`Just the Facts`),
    ),

    {
      thing: "pale horse",
      available: () =>
        get("horseryAvailable") &&
        isUnrestricted($item`Horsery contract`) &&
        get("_horsery") !== "pale horse",
      value: () => 1,
    },
  ];

  const haveSeptEmber = haveUnrestricted($item`Sept-Ember Censer`);
  const mouthwash = $item`Mmm-brr! brand mouthwash`;
  const bembershoot = $item`bembershoot`;
  const septEmbers =
    +haveSeptEmber &&
    7 * +!get("_septEmberBalanceChecked") + get("availableSeptEmbers");
  // Prioritize filling all spots with bembershoots, which is usually better
  // But make sure we end up with an even number of sept-embers.
  const neededBembershoots = clamp(
    3 - availableAmount($item`bembershoot`),
    0,
    septEmbers,
  );
  const embersAfterBembers = septEmbers - neededBembershoots;
  const neededBembershootsEven = neededBembershoots - (embersAfterBembers % 2);
  const potentialMouthwash =
    availableAmount(mouthwash) +
    Math.floor((septEmbers - neededBembershootsEven) / 2);

  const coldRes = numericModifier("Cold Resistance");
  const mouthwashMainstat = Math.round(multiplier * 7 * Math.pow(coldRes, 1.7));

  const statName = myPrimestat().identifierString;
  const substat = $stat`Sub${statName === "none" ? "Muscle" : statName}`;
  const currentSubstat = myBasestat(substat);
  const endingSubstat = currentSubstat + mouthwashMainstat * potentialMouthwash;
  const endingStat = Math.sqrt(endingSubstat);
  const endingLevel = Math.sqrt(endingStat - 4) + 1;

  if (total <= 0 && (!haveSeptEmber || potentialMouthwash <= 0)) return null;

  return (
    <Tile header="Get to Level 12" imageUrl="/images/itemimages/uparrow.gif">
      {haveSeptEmber && potentialMouthwash > 0 && (
        <>
          <LinkBlock
            href={
              availableAmount(mouthwash) < potentialMouthwash ||
              availableAmount(bembershoot) < neededBembershootsEven
                ? "/shop.php?whichshop=september"
                : inventoryLink(mouthwash)
            }
          >
            <Line>
              Use {plural(potentialMouthwash, $item`Mmm-brr! brand mouthwash`)}{" "}
              with <Cold>cold res</Cold> for lots of stats.
            </Line>
            <Line>
              Current: {coldRes} cold res for {mouthwashMainstat.toFixed(0)}{" "}
              mainstat per mouthwash.
            </Line>
            <Line>Will reach level {endingLevel.toFixed(1)}.</Line>
            {neededBembershootsEven > 0 && (
              <Line>
                Get {plural(neededBembershootsEven, $item`bembershoot`)} first.
              </Line>
            )}
          </LinkBlock>
          <Line>Can get more cold res from:</Line>
          <List.Root>
            {coldResSources
              .filter(({ available }) => available())
              .map(({ thing, value }) => {
                const identifier =
                  typeof thing === "string" ? thing : thing.identifierString;
                return (
                  <List.Item key={identifier}>
                    {identifier}{" "}
                    <Cold>
                      (+
                      {value ? value() : getModifier("Cold Resistance", thing)})
                    </Cold>
                  </List.Item>
                );
              })}
          </List.Root>
        </>
      )}
      {total > 0 && (
        <>
          <Line>Additional stat sources:</Line>
          <List.Root>{rendered}</List.Root>
        </>
      )}
    </Tile>
  );
};

export default Leveling;
