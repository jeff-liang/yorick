import { Table, Text } from "@chakra-ui/react";
import {
  availableAmount,
  myFamiliar,
  myLevel,
  myPath,
  myPrimestat,
  numericModifier,
} from "kolmafia";
import {
  $familiar,
  $item,
  $path,
  byStat,
  clamp,
  get,
  have,
  questStep,
} from "libram";
import { FC, ReactNode } from "react";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
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
    <Text as="span" color="gray.solid">
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

  if (myLevel() < 13 && get("questL13Final") !== "finished") {
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
          <Text as="span" fontSize="xs" color="gray.solid">
            (spend turns @ the Goatlet)
          </Text>
        </>,
      ]);
    }

    usefulAugustSkills.push([
      30,
      <Text>
        +7 advs rollover accessory{" "}
        <Text as="span" fontSize="xs" color="gray.solid">
          (melting)
        </Text>
      </Text>,
    ]);
  }

  const manorCheck =
    questStep("questL11Manor") < 3 && get("manorDrawerCount") >= 21;
  const blastingAddendum =
    manorCheck && !have($item`blasting soda`) ? (
      <Text as="span" color="gray.solid">
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
        <Text as="span" color="gray.solid">
          (chateau de vinegar!)
        </Text>
      </>,
    ]);
  }

  usefulAugustSkills.push([7, <Text>+50% item, +100% meat{buffString}</Text>]);
  usefulAugustSkills.push([
    2,
    <>
      get{" "}
      <Text as="span" color="green.solid">
        Lucky!
      </Text>
    </>,
  ]);
  usefulAugustSkills.push([24, "3 waffles, for monster replacement"]);
  usefulAugustSkills.push([22, "free fight for teeeeeeeeeeeth"]);

  if (questStep("questL08Trapper") < 2) {
    usefulAugustSkills.push([6, <Text>+10% combat{buffString}</Text>]);
  }
  usefulAugustSkills.push([9, "hold hands for a minor sniff"]);
  usefulAugustSkills.push([
    10,
    <Text>non-free reusable banishes{buffString}</Text>,
  ]);

  const haveSleazeOffhand =
    have($item`deck of lewd playing cards`) || have($item`disturbing fanfic`);
  const protestorsRemaining = clamp(80 - get("zeppelinProtestors"), 0, 80);

  if (
    (haveSleazeOffhand && protestorsRemaining > 10) ||
    haveUnrestricted($item`unbreakable umbrella`)
  ) {
    usefulAugustSkills.push([
      13,
      <Text>
        double offhand enchantments{" "}
        <Text as="span" color="purple.solid">
          (sleaze for protestors)
        </Text>
      </Text>,
    ]);
  }

  if (!have($item`toy Cupid bow`) && myFamiliar() !== $familiar`none`) {
    usefulAugustSkills.push([
      28,
      <Text>
        +10 weight/+1 xp familiar equip{" "}
        <Text as="span" fontSize="xs" color="gray.solid">
          (melting)
        </Text>
      </Text>,
    ]);
  }

  const table = usefulAugustSkills
    .filter(([day]) => !get(`_aug${day}Cast`))
    .sort(([a], [b]) => a - b)
    .map(([day, reason]) => {
      const skillName = `Aug. ${ordinal(day)}: ${ALL_SKILLS.get(day)?.[0]}`;
      return (
        <Table.Row key={day}>
          <Table.Cell px={1} py={0.5}>
            {day}
          </Table.Cell>
          <Table.Cell px={1} py={0.5}>
            {skillName ? (
              <MainLink href={skillLink(skillName)}>{reason}</MainLink>
            ) : (
              reason
            )}
          </Table.Cell>
        </Table.Row>
      );
    });

  const tooltip = (
    <>
      <Text fontWeight="bold" textAlign="center">
        Well, you asked for it!
      </Text>
      <Table.Root size="sm">
        <Table.Body>
          {[...ALL_SKILLS.entries()]
            .sort(([a], [b]) => a - b)
            .map(([skillNumber, [, skillDesc]]) => {
              const lineColor = get(`_aug${skillNumber}Cast`)
                ? "gray.solid"
                : "black";
              return (
                <Table.Row key={skillNumber}>
                  <Table.Cell
                    textAlign="center"
                    fontSize="xs"
                    px={1}
                    py={0}
                    color={lineColor}
                  >
                    {skillNumber}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" px={1} py={0} color={lineColor}>
                    {skillDesc}
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
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
        <Table.Root size="sm" unstyled>
          <Table.Body>{table}</Table.Body>
        </Table.Root>
      )}
      <AdviceTooltipText advice={tooltip}>
        No, YORICK, show me ALL the skills.
      </AdviceTooltipText>
    </Tile>
  );
};

export default AugustScepter;
