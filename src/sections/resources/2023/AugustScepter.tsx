import { Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import {
  availableAmount,
  myLevel,
  myPath,
  myPrimestat,
  numericModifier,
} from "kolmafia";
import {
  $familiar,
  $item,
  $path,
  $skill,
  byStat,
  get,
  have,
  questStep,
} from "libram";
import { FC, ReactNode } from "react";

import AdviceTooltip from "../../../components/AdviceTooltip";
import Line from "../../../components/Line";
import MainLink from "../../../components/MainLink";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { skillLink } from "../../../util/links";
import { ordinal, plural } from "../../../util/text";

const ALL_SKILLS = new Map<number, [string, string]>([
  [1, ["Mountain Climbing Day!", "a +adv buff"]],
  [2, ["Find an Eleven-Leaf Clover Day", "lucky!"]],
  [3, ["Watermelon Day!", "a watermelon"]],
  [4, ["Water Balloon Day!", "three water balloons"]],
  [5, ["Oyster Day!", "some oyster eggs"]],
  [6, ["Fresh Breath Day!", "a +com buff"]],
  [7, ["Lighthouse Day!", "an item/meat buff"]],
  [8, ["Cat Day!", "a catfight, meow"]],
  [9, ["Hand Holding Day!", "a foe's hand held"]],
  [10, ["World Lion Day!", "roars like a lion"]],
  [11, ["Presidential Joke Day!", "myst stats"]],
  [12, ["Elephant Day!", "mus stats"]],
  [13, ["Left/Off Hander's Day!", "double offhands"]],
  [14, ["Financial Awareness Day!", "bad meatgain"]],
  [15, ["Relaxation Day!", "a full heal"]],
  [16, ["Roller Coaster Day!", "-full & +food%"]],
  [17, ["Thriftshop Day!", "a 1000 meat coupon"]],
  [18, ["Serendipity Day!", "a bunch of items"]],
  [19, ["Honey Bee Awareness Day!", "stalked by bees"]],
  [20, ["Mosquito Day!", "HP regen"]],
  [21, ["Spumoni Day!", "stats of all kinds"]],
  [22, ["Tooth Fairy Day!", "a free tooth monster"]],
  [23, ["Ride the Wind Day!", "mox stats"]],
  [24, ["Waffle Day!", "three waffles"]],
  [25, ["Banana Split Day!", "a banana split"]],
  [26, ["Toilet Paper Day!", "some toilet paper"]],
  [27, ["Just Because Day!", "three random effects"]],
  [28, ["Race Your Mouse Day!", "a melting fam equip"]],
  [29, ["More Herbs, Less Salt Day!", "a food stat enhancer"]],
  [30, ["Beach Day!", "a +7 adv accessory"]],
  [31, ["Cabernet Sauvignon Day!", "two bottles of +booze% wine"]],
]);

const AugustScepter: FC = () => {
  const augustScepter = $item`august scepter`;
  const skillsAvailable = 5 - get("_augSkillsCast");
  if (!have(augustScepter) || skillsAvailable < 1) return null;

  const buffString = (
    <Text as="span" color="gray.500">
      {" "}
      (buff)
    </Text>
  );

  const mainstatAugustSkill = byStat({
    Muscle: 12,
    Mysticality: 11,
    Moxie: 23,
  });

  const usefulAugustSkills: [number, ReactNode][] = [];

  if (get("questL13Final") !== "finished") {
    const statsGained = Math.floor(
      50 *
        myLevel() *
        (1.0 + numericModifier(`${myPrimestat()} Experience Percent`) / 100.0),
    );
    usefulAugustSkills.push([mainstatAugustSkill, `+${statsGained} mainstat`]);
  }

  if (myPath() !== $path`Slow and Steady`) {
    if (
      availableAmount($item`goat cheese`) <= 2 &&
      !haveUnrestricted($item`Mayam Calendar`) &&
      questStep("questL08Trapper") < 2
    ) {
      usefulAugustSkills.push([
        1,
        <>
          +2-5 turns{" "}
          <Text as="span" size="xs" color="gray.500">
            (spend turns @ the Goatlet)
          </Text>
        </>,
      ]);
    }

    usefulAugustSkills.push([
      30,
      <>
        +7 advs rollover accessory{" "}
        <Text as="span" color="gray.500">
          (melting)
        </Text>
      </>,
    ]);
  }

  const manorCheck =
    questStep("questL11Manor") < 3 && get("manorDrawerCount") >= 21;
  const blastingAddendum =
    manorCheck && !have($item`blasting soda`) ? (
      <Text as="span" color="gray.500">
        {" "}
        (blasting soda!)
      </Text>
    ) : null;

  usefulAugustSkills.push([
    16,
    <>-1 fullness, +100% food drop{blastingAddendum}</>,
  ]);

  if (manorCheck && !have($item`bottle of Chateau de Vinegar`)) {
    usefulAugustSkills.push([
      31,
      <>
        +100% booze drop wine{" "}
        <Text as="span" color="gray.500">
          (chateau de vinegar!)
        </Text>
      </>,
    ]);
  }

  usefulAugustSkills.push([7, <>+50% item, +100% meat{buffString}</>]);
  usefulAugustSkills.push([
    2,
    <>
      get{" "}
      <Text as="span" color="green.500">
        Lucky!
      </Text>
    </>,
  ]);
  usefulAugustSkills.push([24, "3 waffles, for monster replacement"]);
  usefulAugustSkills.push([22, "free fight for teeeeeeeeeeeth"]);

  if (questStep("questL08Trapper") < 2) {
    usefulAugustSkills.push([6, <>+10% combat{buffString}</>]);
  }
  usefulAugustSkills.push([9, "hold hands for a minor sniff"]);
  usefulAugustSkills.push([10, <>non-free reusable banishes{buffString}</>]);

  const usefulOffhands = have($item`deck of lewd playing cards`);
  const protestorsRemaining = Math.max(
    0,
    Math.min(80, 80 - get("zeppelinProtestors")),
  );

  if (usefulOffhands && protestorsRemaining > 10) {
    usefulAugustSkills.push([
      13,
      <>
        double offhand enchantments{" "}
        <Text as="span" color="purple.500">
          (sleaze for protestors)
        </Text>
      </>,
    ]);
  }

  if (
    have($skill`Transcendent Olfaction`) &&
    (have($familiar`Pair of Stomping Boots`) ||
      (have($skill`The Ode to Booze`) &&
        have($familiar`Frumious Bandersnatch`)))
  ) {
    if (!have($item`astral pet sweater`)) {
      usefulAugustSkills.push([
        28,
        <>
          +10 weight familiar equipment{" "}
          <Text as="span" size="xs" color="gray.500">
            (melting)
          </Text>
        </>,
      ]);
    }
  }

  const table = usefulAugustSkills
    .sort(([a], [b]) => a - b)
    .map(([day, reason]) => {
      const skillName = `Aug. ${ordinal(day)}: ${ALL_SKILLS.get(day)?.[0]}`;
      return (
        <Tr key={day}>
          <Td px={1} py={0.5}>
            {day}
          </Td>
          <Td px={1} py={0.5}>
            {skillName ? (
              <MainLink href={skillLink(skillName)}>{reason}</MainLink>
            ) : (
              reason
            )}
          </Td>
        </Tr>
      );
    });

  const tooltip = (
    <>
      <Text fontWeight="bold" textAlign="center">
        Well, you asked for it!
      </Text>
      <Table size="sm">
        <Tbody>
          {[...ALL_SKILLS.entries()]
            .sort(([a], [b]) => a - b)
            .map(([skillNumber, [, skillDesc]]) => {
              const lineColor = get(`_aug${skillNumber}Cast`)
                ? "gray.500"
                : "black";
              return (
                <Tr key={skillNumber}>
                  <Td
                    textAlign="center"
                    fontSize="xs"
                    px={1}
                    py={0}
                    color={lineColor}
                  >
                    {skillNumber}
                  </Td>
                  <Td fontSize="xs" px={1} py={0} color={lineColor}>
                    {skillDesc}
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </>
  );

  return (
    <Tile
      header={`Cast ${plural(skillsAvailable, "August Scepter skill")}`}
      id="august-scepter-resource"
      imageUrl="/images/itemimages/scepter.gif"
    >
      <Line>
        Celebrate August tidings; cast skills corresponding to the given day to
        get valuable benefits.
      </Line>
      {table.length > 0 && (
        <Table size="sm" variant="unstyled">
          <Tbody>{table}</Tbody>
        </Table>
      )}
      <AdviceTooltip
        label="No, YORICK, show me ALL the skills."
        text={tooltip}
      />
    </Tile>
  );
};

export default AugustScepter;
