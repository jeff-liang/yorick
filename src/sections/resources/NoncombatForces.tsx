import {
  availableAmount,
  haveEquipped,
  mySpleenUse,
  spleenLimit,
} from "kolmafia";
import { $item, $skill, CinchoDeMayo, get } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { NagPriority } from "../../contexts/NagContext";
import useNag from "../../hooks/useNag";
import { haveUnrestricted } from "../../util/available";
import { inventoryLink, skillLink } from "../../util/links";
import { renderSourceList, Source } from "../../util/source";
import { plural, truthy } from "../../util/text";

const JELLYFISH_PROBABILITY = [1, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 20];

const FORCE_SOURCES: Source[] = [
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
      availableAmount($item`stench jelly`) +
      Math.max(0, 3 - get("_spaceJellyfishDrops")),
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
          color={need.length > 0 ? "gray.500" : undefined}
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
    render: ({ remaining }) => {
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
];

const NoncombatForces: FC = () => {
  const active = get("noncombatForcerActive");
  useNag(
    () => ({
      id: "nc-forces-nag",
      priority: NagPriority.HIGH,
      node: active && (
        <Tile
          header="Noncombat Forced"
          imageUrl="/images/itemimages/clarabell.gif"
        >
          <Line>Visit a zone with a key noncombat.</Line>
        </Tile>
      ),
    }),
    [active],
  );

  const { total, rendered } = renderSourceList(FORCE_SOURCES);
  if (total === 0) return null;

  return (
    <Tile
      header={plural(total, "noncombat force")}
      id="nc-forces-tile"
      imageUrl="/images/itemimages/clarabell.gif"
    >
      {rendered}
    </Tile>
  );
};

export default NoncombatForces;
