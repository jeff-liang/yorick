import {
  Badge,
  BadgeProps,
  Stack,
  StackProps,
  Tooltip,
} from "@chakra-ui/react";
import { haveEffect, totalTurnsPlayed } from "kolmafia";
import {
  $effect,
  $item,
  AutumnAton,
  get,
  getKramcoWandererChance,
} from "libram";
import { FC, forwardRef } from "react";

import { haveUnrestricted } from "../util/available";
import { plural } from "../util/text";

const Pill: FC<BadgeProps> = forwardRef(({ children, ...props }, ref) => (
  <Badge
    borderRadius="2px"
    color="white"
    bgColor="gray.600"
    ref={ref}
    {...props}
  >
    {children}
  </Badge>
));

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
      color: "green.600",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Green.`,
    },
    {
      name: "ELP",
      turns: haveEffect($effect`Everything Looks Purple`),
      color: "purple.600",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Purple.`,
    },
    {
      name: "ELR",
      turns: haveEffect($effect`Everything Looks Red`),
      color: "red.600",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Red.`,
    },
    {
      name: "ELY",
      turns: haveEffect($effect`Everything Looks Yellow`),
      color: "yellow.600",
      label: (turns) => `${plural(turns, "turn")} of Everything Looks Yellow.`,
    },
  ];

  if (returnCombats > 0) {
    elements.push({
      name: "CBB",
      turns: returnCombats,
      color: "gray.600",
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
      name: "Kram",
      turns: turnsToNextGuaranteedFight,
      color: "purple.600",
      label: (turns) =>
        `${plural(turns, "turn")} until guaranteed Kramco fight.`,
    });
  }

  if (AutumnAton.have()) {
    elements.push({
      name: "AA",
      turns: AutumnAton.turnsLeft(),
      color: "orange.600",
      label: (turns) => `${plural(turns, "turn")} until autumn-aton returns.`,
    });
  }

  const elementsFiltered = elements; // .filter(([, turns]) => turns > 0);
  elementsFiltered.sort(
    ({ turns: turnsA }, { turns: turnsB }) => turnsA - turnsB,
  );

  if (elementsFiltered.length === 0) return null;

  return (
    <Stack flexFlow="row wrap" {...props}>
      {elementsFiltered.map(({ name, turns, color, label }) => (
        <Tooltip hasArrow label={label(turns)}>
          <Pill key={name} bgColor={color}>
            {name} {turns}
          </Pill>
        </Tooltip>
      ))}
    </Stack>
  );
};

export default Timeline;
