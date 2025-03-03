import {
  availableAmount,
  haveEquipped,
  mySpleenUse,
  spleenLimit,
} from "kolmafia";
import { $familiar, $item, $skill, CinchoDeMayo, clamp, get } from "libram";

import Line from "../components/Line";
import { haveUnrestricted } from "../util/available";
import { inventoryLink, skillLink } from "../util/links";
import { Source } from "../util/source";
import { plural, truthy } from "../util/text";

const JELLYFISH_PROBABILITY = [1, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 20];

export const FORCE_SOURCES: Source[] = [
  {
    name: "Clara's bell",
    remaining: () =>
      +haveUnrestricted($item`Clara's bell`) && 1 - +get("_claraBellUsed"),
    render: ({ remaining }) => (
      <Line href={inventoryLink($item`Clara's bell`)}>
        {plural(remaining, "Clara's bell ring")}.
      </Line>
    ),
  },
  {
    name: "stench jelly",
    remaining: () =>
      clamp(
        availableAmount($item`stench jelly`) +
          +haveUnrestricted($familiar`Space Jellyfish`) *
            Math.max(0, 3 - get("_spaceJellyfishDrops")),
        0,
        spleenLimit() -
          mySpleenUse() +
          clamp(
            availableAmount($item`mojo filter`),
            0,
            3 - get("currentMojoFilters"),
          ),
      ),
    render: () => {
      const available = availableAmount($item`stench jelly`);
      const probability =
        100 * JELLYFISH_PROBABILITY[Math.min(5, get("_spaceJellyfishDrops"))];
      return (
        <Line href={inventoryLink($item`stench jelly`)}>
          {plural(available, "stench jelly", "stench jellies")} (
          {probability.toFixed(0)}% chance to extract next).
        </Line>
      );
    },
  },
  {
    name: "Sneakisol",
    remaining: () =>
      +haveUnrestricted($item`Eight Days a Week Pill Keeper`) &&
      +!get("_freePillKeeperUsed") +
        Math.floor(
          Math.max(
            0,
            spleenLimit() -
              mySpleenUse() -
              availableAmount($item`stench jelly`),
          ) / 3,
        ),
    render: ({ remaining }) => (
      <Line href={inventoryLink($item`Eight Days a Week Pill Keeper`)}>
        {plural(remaining, "Sneakisol™ force")}.
      </Line>
    ),
  },
  {
    name: "Cincho de Mayo",
    remaining: () =>
      +haveUnrestricted($item`Cincho de Mayo`) &&
      Math.floor(CinchoDeMayo.totalAvailableCinch() / 60),
    render: ({ remaining }) => (
      <Line
        href={
          haveEquipped($item`Cincho de Mayo`)
            ? skillLink($skill`Cincho: Fiesta Exit`)
            : inventoryLink($item`Cincho de Mayo`)
        }
      >
        {plural(remaining, "Cincho de Mayo force")}.
      </Line>
    ),
  },
  {
    name: "Jurassic Parka",
    remaining: () =>
      +haveUnrestricted($item`Jurassic Parka`) &&
      5 - get("_spikolodonSpikeUses"),
    render: ({ remaining }) => {
      const need = truthy([
        get("parkaMode") !== "spikolodon" && "parka spikolodon",
        !haveEquipped($item`Jurassic Parka`) && "equip Jurassic Parka",
      ]);
      return (
        <Line
          color={need.length > 0 ? "gray.solid" : undefined}
          command={need.join("; ")}
        >
          {plural(remaining, "Jurassic Parka force")}.
        </Line>
      );
    },
  },
  {
    name: "Apriling band tuba",
    remaining: () =>
      +(
        (haveUnrestricted($item`Apriling band helmet`) &&
          get("_aprilBandInstruments") < 2) ||
        haveUnrestricted($item`Apriling band tuba`)
      ) && 3 - get("_aprilBandTubaUses"),
    render({ remaining }) {
      const tuba = $item`Apriling band tuba`;
      const helmet = $item`Apriling band helmet`;
      const haveTuba = haveUnrestricted($item`Apriling band tuba`);
      return (
        <Line href={inventoryLink(haveTuba ? tuba : helmet)}>
          {plural(remaining, "Apriling band tuba force")}
          {haveTuba ? null : " (acquire tuba)"}.
        </Line>
      );
    },
  },
  {
    name: "McHugeLarge Avalanche",
    remaining: () =>
      +haveUnrestricted($item`McHugeLarge duffel bag`) &&
      3 - get("_mcHugeLargeAvalancheUses"),
    render({ remaining }) {
      const leftSki = $item`McHugeLarge left ski`;
      const haveSki = haveUnrestricted(leftSki);
      const skiEquipped = haveEquipped(leftSki);
      return (
        <Line
          href={
            !skiEquipped
              ? inventoryLink(haveSki ? leftSki : $item`McHugeLarge duffel bag`)
              : undefined
          }
          color={!skiEquipped ? "gray.solid" : undefined}
        >
          {plural(remaining, "McHugeLarge Avalanche")}.
        </Line>
      );
    },
  },
];
