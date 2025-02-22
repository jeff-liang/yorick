import { Location, Monster } from "kolmafia";
import { $location, $monster, get, questStep } from "libram";

export type Snake = {
  monster: Monster;
  locations: Location[];
  item: string;
};

const BATSNAKE = {
  monster: $monster`Batsnake`,
  locations: [$location`The Batrat and Ratbat Burrow`],
  item: "The Stankara Stone",
};
const FROZEN_SOLID_SNAKE = {
  monster: $monster`Frozen Solid Snake`,
  locations: [$location`Lair of the Ninja Snowmen`],
  item: "The First Pizza",
};
const BURNING_SNAKE_OF_FIRE = {
  monster: $monster`Burning Snake of Fire`,
  locations: [$location`The Castle in the Clouds in the Sky (Top Floor)`],
  item: "Murphy's Rancid Black Flag",
};
const SNAKE_WITH_LIKE_TEN_HEADS = {
  monster: $monster`The Snake With Like Ten Heads`,
  locations: [$location`The Hole in the Sky`],
  item: "The Eye of the Stars",
};
const FRATTLESNAKE = {
  monster: $monster`The Frattlesnake`,
  locations: [$location`The Smut Orc Logging Camp`],
  item: "The Lacrosse Stick of Lacoronado",
};
const SNAKELETON = {
  monster: $monster`Snakeleton`,
  locations: [
    $location`The Unquiet Garves`,
    $location`The VERY Unquiet Garves`,
  ],
  item: "The Shield of Brook",
};

export const SHEN_DAYS: [Snake, Snake, Snake][] = [
  [BATSNAKE, FROZEN_SOLID_SNAKE, BURNING_SNAKE_OF_FIRE],
  [FRATTLESNAKE, SNAKELETON, SNAKE_WITH_LIKE_TEN_HEADS],
  [FROZEN_SOLID_SNAKE, BATSNAKE, SNAKELETON],
  [FRATTLESNAKE, BATSNAKE, SNAKELETON],
  [BURNING_SNAKE_OF_FIRE, FRATTLESNAKE, SNAKE_WITH_LIKE_TEN_HEADS],
  [BURNING_SNAKE_OF_FIRE, BATSNAKE, SNAKE_WITH_LIKE_TEN_HEADS],
  [FRATTLESNAKE, SNAKELETON, SNAKE_WITH_LIKE_TEN_HEADS],
  [SNAKELETON, BURNING_SNAKE_OF_FIRE, FRATTLESNAKE],
  [SNAKELETON, FRATTLESNAKE, SNAKE_WITH_LIKE_TEN_HEADS],
  [SNAKE_WITH_LIKE_TEN_HEADS, BATSNAKE, BURNING_SNAKE_OF_FIRE],
  [FROZEN_SOLID_SNAKE, BATSNAKE, BURNING_SNAKE_OF_FIRE],
];

export function shenDay(): [Snake, Snake, Snake] | undefined {
  if (questStep("questL11Shen") < 1) return;
  const initiationDay = get("shenInitiationDay");
  return SHEN_DAYS[(initiationDay - 1) % SHEN_DAYS.length];
}

export function remainingSnakes(): Snake[] | undefined {
  const day = shenDay();
  if (day === undefined) return;
  const questItem = get("shenQuestItem");
  const index = day.findIndex((s) => s.item === questItem?.identifierString);
  if (index < 0) return;
  return day.slice(index);
}

export function currentSnake(): Snake | undefined {
  return remainingSnakes()?.[0];
}
