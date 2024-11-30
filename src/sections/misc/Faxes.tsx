import { availableAmount, isUnrestricted } from "kolmafia";
import { $familiar, $item, get } from "libram";
import { FC, ReactNode } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { haveUnrestricted } from "../../util/available";
import { inventoryLink } from "../../util/links";
import { renderSourceList } from "../../util/source";
import { plural } from "../../util/text";

interface FaxSource {
  name: string;
  remaining: () => number;
  render: (props: { remaining: number }) => ReactNode;
}

const FAX_SOURCES: FaxSource[] = [
  {
    name: "Photocopy",
    remaining: () =>
      haveUnrestricted($item`Clan VIP Lounge key`) &&
      isUnrestricted($item`deluxe fax machine`)
        ? 1 - +get("_photocopyUsed")
        : 0,
    render: ({ remaining }) => (
      <Line href="/clan_viplounge.php?action=faxmachine&whichfloor=2">
        {remaining} fax machine fax.
      </Line>
    ),
  },
  {
    name: "Chateau Painting",
    remaining: () =>
      haveUnrestricted($item`Chateau Mantegna room key`)
        ? 1 - +get("_chateauMonsterFought")
        : 0,
    render: ({ remaining }) => (
      <Line href="/chateau.php">
        {remaining} chateau painting (currently{" "}
        {get("chateauMonster")?.identifierString}).
      </Line>
    ),
  },
  {
    name: "Time-Spinner",
    remaining: () =>
      +haveUnrestricted($item`Time-Spinner`) &&
      Math.floor((10 - get("_timeSpinnerMinutesUsed")) / 3),
    render: ({ remaining }) => (
      <Line href={inventoryLink($item`Time-Spinner`)}>
        {remaining} Time-Spinner recalls (e.g. drunk pygmies).
      </Line>
    ),
  },
  {
    name: "pocket wish",
    remaining: () =>
      Math.min(
        (+haveUnrestricted($item`genie bottle`) &&
          3 - get("_genieWishesUsed")) + availableAmount($item`pocket wish`),
        3 - get("_genieFightsUsed"),
      ),
    render: ({ remaining }) => (
      <Line href={inventoryLink($item`pocket wish`)}>
        {remaining} pocket wishes.
      </Line>
    ),
  },
  {
    name: "Cargo Shorts",
    remaining: () =>
      +(
        haveUnrestricted($item`Cargo Cultist Shorts`) &&
        !get("_cargoPocketEmptied")
      ),
    render: () => (
      <Line href={inventoryLink($item`Cargo Cultist Shorts`)}>
        1 cargo pocket (limited).
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
        <Line
          href={
            xp >= 100
              ? "/place.php?whichplace=town_right&action=townright_dna"
              : undefined
          }
          takeFamiliar={xp < 100 ? $familiar`Chest Mimic` : undefined}
        >
          {plural(remaining, "Chest Mimic egg")}
          {xp < remaining * 100
            ? ` (${Math.floor(xp / 100)} ready, ${100 - (xp % 100)} xp to next)`
            : null}
        </Line>
      );
    },
  },
];

const Faxes: FC = () => {
  const { total, rendered } = renderSourceList(FAX_SOURCES);
  if (total === 0) return null;

  return (
    <Tile
      header={`${total} faxes`}
      id="fax-tile"
      imageUrl="/images/itemimages/photocopy.gif"
    >
      {rendered}
    </Tile>
  );
};

export default Faxes;
