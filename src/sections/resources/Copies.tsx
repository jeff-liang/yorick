import { availableAmount } from "kolmafia";
import {
  $familiar,
  $item,
  $skill,
  get,
  have,
  totalFamiliarWeight,
} from "libram";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { getHashIfAvailable } from "tome-kolmafia-lib";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { haveUnrestricted } from "../../util/available";
import { inventoryLink } from "../../util/links";
import { renderSourceList } from "../../util/source";
import { plural } from "../../util/text";

function pluralCopies(count: number, description: string) {
  return plural(count, `${description} copy`, `${description} copies`);
}

interface CopySource {
  name: string;
  remaining: () => number;
  render: (props: { remaining: number }) => ReactNode;
}

const Copies: FC = () => {
  const [maxObservedProfWeight, setMaxObservedProfWeight] = useState(20);
  const profWeight = totalFamiliarWeight($familiar`Pocket Professor`, true);

  useEffect(() => {
    if (profWeight > maxObservedProfWeight) {
      setMaxObservedProfWeight(profWeight);
    }
  }, [profWeight, maxObservedProfWeight]);

  const copySources = useMemo(
    (): CopySource[] => [
      {
        name: "Wink",
        remaining: () =>
          // TODO: this doesn't work correctly when all used for the day
          get("_romanticFightsLeft") ||
          (haveUnrestricted($familiar`Reanimated Reanimator`) ||
          (haveUnrestricted($familiar`Obtuse Angel`) &&
            have($item`quake of arrows`))
            ? 3
            : haveUnrestricted($familiar`Obtuse Angel`)
              ? 2
              : 0),
        render: ({ remaining }) => {
          const active = get("_romanticFightsLeft") > 0;
          const descriptor = haveUnrestricted($familiar`Reanimated Reanimator`)
            ? "wink"
            : "romantic arrow";
          return !active ? (
            <Line
              takeFamiliar={
                descriptor === "wink"
                  ? $familiar`Reanimated Reanimator`
                  : $familiar`Obtuse Angel`
              }
            >
              {plural(remaining, `${descriptor} fight`)} left.
            </Line>
          ) : (
            <Line>
              {plural(remaining, `${descriptor} fight`)} (
              {get("romanticTarget")?.identifierString}).
            </Line>
          );
        },
      },
      {
        name: "LOV Enamorang",
        remaining: () =>
          +(haveUnrestricted($item`LOV Enamorang`) && !get("_enamorangs")),
        render: () => <Line>1 LOV Enamorang copy.</Line>,
      },
      {
        name: "Pocket Professor",
        remaining: () =>
          +haveUnrestricted($familiar`Pocket Professor`) &&
          Math.ceil(Math.sqrt(maxObservedProfWeight)) +
            (+haveUnrestricted($item`Pocket Professor memory chip`) && 2) -
            get("_pocketProfessorLectures"),
        render: ({ remaining }) => (
          <Line takeFamiliar={$familiar`Pocket Professor`}>
            {pluralCopies(remaining, "(?) Pocket Professor")} (used{" "}
            {get("_pocketProfessorLectures")}).
          </Line>
        ),
      },
      {
        name: "backup camera",
        remaining: () =>
          +haveUnrestricted($item`backup camera`) && 11 - get("_backUpUses"),
        render: ({ remaining }) => (
          <Line href={inventoryLink($item`backup camera`)}>
            {pluralCopies(remaining, "backup camera")}.
          </Line>
        ),
      },
      {
        name: "Recall Habitat",
        remaining: () =>
          +haveUnrestricted($skill`Recall Facts: Monster Habitats`) &&
          5 * (3 - get("_monsterHabitatsRecalled")) +
            get("_monsterHabitatsFightsLeft"),
        render: ({ remaining }) => (
          <Line>
            {plural(remaining, "Habitat fight")}
            {get("_monsterHabitatsFightsLeft") > 0
              ? ` (current ${get("_monsterHabitatsMonster")})`
              : null}
          </Line>
        ),
      },
      {
        name: "Spooky VHS Tape",
        remaining: () =>
          availableAmount($item`Spooky VHS Tape`) +
          (+!get("_2002MrStoreCreditsCollected") && 3) +
          get("availableMrStore2002Credits"),
        render: ({ remaining }) => (
          <Line
            href={
              !have($item`Spooky VHS Tape`)
                ? `/inv_use.php?whichitem=11257&pwd=${getHashIfAvailable()}`
                : undefined
            }
          >
            {plural(remaining, "Spooky VHS Tape")}
            {have($item`Spooky VHS Tape`) ? null : " (buy some)"}.
          </Line>
        ),
      },
      {
        name: "mimic egg",
        remaining: () =>
          +haveUnrestricted($familiar`Chest Mimic`) &&
          11 - get("_mimicEggsObtained"),
        render: ({ remaining }) => {
          const xp = $familiar`Chest Mimic`.experience;
          return (
            <Line takeFamiliar={$familiar`Chest Mimic`}>
              {pluralCopies(remaining, "Chest Mimic egg")}
              {xp < remaining * 50
                ? ` (${Math.floor(xp / 50)} ready, ${50 - (xp % 50)} xp to next)`
                : null}
              .
            </Line>
          );
        },
      },
    ],
    [maxObservedProfWeight],
  );

  const { total, rendered } = renderSourceList(copySources);
  if (total === 0) return null;

  return (
    <Tile
      header={`${total} monster copies`}
      id="copies-tile"
      imageUrl="/images/itemimages/sputtysheet.gif"
    >
      {rendered}
    </Tile>
  );
};

export default Copies;
