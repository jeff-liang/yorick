import { Badge, BadgeProps, Stack, StackProps, Strong } from "@chakra-ui/react";
import {
  getCounter,
  getWorkshed,
  haveEffect,
  haveEquipped,
  myClass,
  totalTurnsPlayed,
} from "kolmafia";
import {
  $class,
  $effect,
  $item,
  AutumnAton,
  get,
  getKramcoWandererChance,
} from "libram";
import { FC, forwardRef } from "react";

import MainLink from "../components/MainLink";
import { Tooltip } from "../components/ui/tooltip";
import { ENV_COLORS, getCMCInfo } from "../resourceInfo/cmc";
import { haveUnrestricted } from "../util/available";
import { plural } from "../util/text";

import Flyers from "./misc/Flyers";

const Pill = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, ...props }, ref) => (
    <Badge
      borderRadius="2px"
      color="white"
      bgColor="gray.solid"
      lineHeight={["12px", "16px"]}
      px={["4px", "6px"]}
      ref={ref}
      {...props}
    >
      {children}
    </Badge>
  ),
);

const CMCTimeline: FC = () => {
  const cmcInfo = getCMCInfo();
  if (!cmcInfo.available) return null;

  return (
    <Stack gap={1} align="flex-start">
      <Stack flexFlow="row wrap" gap={0.5} align="center">
        {cmcInfo.environments.map((c, index) => (
          <Badge
            key={index}
            w="14px"
            px={0}
            fontSize={["2xs", "xs"]}
            color="white"
            bgColor={ENV_COLORS[c]}
            alignItems="center"
            justifyContent="center"
          >
            {c}
          </Badge>
        ))}
      </Stack>
      <MainLink
        href={
          cmcInfo.turnsToConsult <= 0
            ? "/campground.php?action=workshed"
            : undefined
        }
      >
        <Stack flexFlow="row wrap" gap={1} align="center">
          <Strong>
            {cmcInfo.turnsToConsult > 0
              ? plural(cmcInfo.turnsToConsult, "turn")
              : "NOW"}
            :
          </Strong>
          <Badge
            fontSize="xs"
            color="white"
            bgColor={ENV_COLORS[cmcInfo.maxEnvironment]}
          >
            {cmcInfo.result}
          </Badge>
        </Stack>
      </MainLink>
    </Stack>
  );
};

interface TimelineElement {
  name: string;
  turns: number;
  color: string;
  label: (turns: number) => string;
}

const Timeline: FC<StackProps> = (props) => {
  const returnCombats = get("cosmicBowlingBallReturnCombats");
  const elements: Array<TimelineElement> = [
    {
      name: "ELG",
      turns: haveEffect($effect`Everything Looks Green`),
      color: "green.solid",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Green.`,
    },
    {
      name: "ELP",
      turns: haveEffect($effect`Everything Looks Purple`),
      color: "purple.solid",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Purple.`,
    },
    {
      name: "ELR",
      turns: haveEffect($effect`Everything Looks Red`),
      color: "red.solid",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Red.`,
    },
    {
      name: "ELY",
      turns: haveEffect($effect`Everything Looks Yellow`),
      color: "yellow.500",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Yellow.`,
    },
    {
      name: "ELRWB",
      turns: haveEffect($effect`Everything Looks Red, White and Blue`),
      color: "purple.solid",
      label: (turns) =>
        `${plural(turns, "turn")} of Everything Looks Red, White and Blue.`,
    },
    {
      name: "ELBe",
      turns: haveEffect($effect`Everything looks Beige`),
      color: "yellow.fg",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Beige`,
    },
  ];

  if (myClass() === $class`Zootomist` || myClass() === $class`Jazz Agent`) {
    elements.push({
      name: "ELB",
      turns: haveEffect($effect`Everything Looks Blue`),
      color: "blue.solid",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Blue.`,
    });
  }

  if (returnCombats > 0) {
    elements.push({
      name: "CBB",
      turns: returnCombats,
      color: "gray.solid",
      label: (turns) =>
        `${plural(turns, "combat")} until Cosmic Bowling Ball returns.`,
    });
  }

  if (haveUnrestricted($item`Kramco Sausage-o-Matic™`)) {
    const lastTurn = get("_lastSausageMonsterTurn");
    const turnsToNextGuaranteedFight = Math.round(
      (1 / getKramcoWandererChance()) *
        (1 + totalTurnsPlayed() - (lastTurn || totalTurnsPlayed())),
    );
    elements.push({
      name: "KRAM",
      turns: turnsToNextGuaranteedFight,
      color: "purple.solid",
      label: (turns) =>
        `${plural(turns, "turn")} until guaranteed Kramco fight (${(100 * getKramcoWandererChance()).toFixed(0)}% now).`,
    });
  }

  if (AutumnAton.have()) {
    elements.push({
      name: "AA",
      turns: AutumnAton.available() ? 0 : AutumnAton.turnsLeft() + 1,
      color: "orange.solid",
      label: (turns) => `${plural(turns, "turn")} until autumn-aton returns.`,
    });
  }

  if (haveEquipped($item`cursed magnifying glass`)) {
    elements.push({
      name: "CMG",
      turns: 13 - get("cursedMagnifyingGlassCount"),
      color: "gray.solid",
      label: (turns) => `${plural(turns, "combat")} until next void wanderer.`,
    });
  }

  if (getWorkshed() === $item`model train set`) {
    elements.push({
      name: "MTS",
      turns: 40 - (get("trainsetPosition") - get("lastTrainsetConfiguration")),
      color: "orange.solid",
      label: (turns) =>
        `${plural(turns, "combat")} until train set reconfigurable.`,
    });
  }

  if (getCounter("Spooky VHS Tape Monster") > 0) {
    elements.push({
      name: "VHS",
      turns: getCounter("Spooky VHS Tape Monster"),
      color: "gray.solid",
      label: (turns) =>
        `${plural(turns, "turn")} until VHS tape monster appears.`,
    });
  }

  const elementsFiltered = elements.filter(({ turns }) => turns > 0);
  elementsFiltered.sort(
    ({ turns: turnsA }, { turns: turnsB }) => turnsA - turnsB,
  );

  if (elementsFiltered.length === 0) return null;

  return (
    <Stack {...props}>
      <Stack flexFlow="row wrap">
        {elementsFiltered.map(({ name, turns, color, label }) => (
          <Tooltip key={name} content={label(turns)}>
            <Pill bgColor={color}>
              {name} {turns}
            </Pill>
          </Tooltip>
        ))}
      </Stack>
      <CMCTimeline />
      <Flyers />
    </Stack>
  );
};

export default Timeline;
