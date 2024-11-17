import {
  Badge,
  BadgeProps,
  Stack,
  StackProps,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { getWorkshed, haveEffect, totalTurnsPlayed } from "kolmafia";
import {
  $effect,
  $item,
  AutumnAton,
  get,
  getKramcoWandererChance,
  maxBy,
} from "libram";
import { FC, forwardRef } from "react";

import MainLink from "../components/MainLink";
import { haveUnrestricted } from "../util/available";
import { inDevMode } from "../util/env";
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

const ENV_COLORS: Record<string, string> = {
  X: "gray.600",
  U: "red.600",
  I: "blue.600",
  O: "yellow.600",
};

const ENV_RESULTS: Record<string, string> = {
  X: "Fleshazole™",
  U: "Breathitin™",
  I: "Extrovermectin™",
  O: "Homebodyl™",
};

const CMCTimeline: FC = () => {
  const cabinet = $item`cold medicine cabinet`;
  const workshed = getWorkshed();
  const consults = get("_coldMedicineConsults");

  if (workshed !== cabinet || consults >= 5) return null;

  const nextConsult = get("_nextColdMedicineConsult");
  const turnsToConsult = nextConsult - totalTurnsPlayed();

  const environments = [...get("lastCombatEnvironments").toUpperCase()];
  const counts: Record<string, number> = {};
  for (const c of environments) {
    counts[c] = (counts[c] ?? 0) + 1;
  }
  const maxEnvironment = maxBy(Object.keys(ENV_RESULTS), (c) => counts[c] ?? 0);
  const result =
    counts[maxEnvironment] >= 11 ? ENV_RESULTS[maxEnvironment] : ENV_RESULTS.X;

  return (
    <Stack spacing={1} align="flex-start">
      <Stack flexFlow="row wrap" spacing={0.5} align="center">
        {environments.map((c, index) => (
          <Badge
            key={index}
            w="14px"
            px={0}
            textAlign="center"
            fontSize="xs"
            color="white"
            bgColor={ENV_COLORS[c]}
          >
            {c}
          </Badge>
        ))}
      </Stack>
      <Stack flexFlow="row wrap" spacing={1} align="center">
        <Text as="b">
          {turnsToConsult > 0 ? (
            plural(turnsToConsult, "turn")
          ) : (
            <MainLink href="/campground.php?action=workshed">NOW</MainLink>
          )}
          :
        </Text>
        <Badge fontSize="xs" color="white" bgColor={ENV_COLORS[maxEnvironment]}>
          {result}
        </Badge>
      </Stack>
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
    {
      name: "ELRWB",
      turns: haveEffect($effect`Everything Looks Red, White and Blue`),
      color: "purple.600",
      label: (turns) =>
        `${plural(turns, "turn")} of Everything Looks Red, White and Blue.`,
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

  const elementsFiltered = elements.filter(({ turns }) => turns > 0);
  elementsFiltered.sort(
    ({ turns: turnsA }, { turns: turnsB }) => turnsA - turnsB,
  );

  if (elementsFiltered.length === 0) return null;

  return (
    <Stack {...props}>
      <Stack
        flexFlow="row wrap"
        // account for refresh button.
        w={
          inDevMode()
            ? "calc(100% - 30px - 3 * var(--chakra-space-1))"
            : "calc(100% - 15px - 2 * var(--chakra-space-1))"
        }
      >
        {elementsFiltered.map(({ name, turns, color, label }) => (
          <Tooltip key={name} hasArrow label={label(turns)}>
            <Pill bgColor={color}>
              {name} {turns}
            </Pill>
          </Tooltip>
        ))}
      </Stack>
      <CMCTimeline />
    </Stack>
  );
};

export default Timeline;
