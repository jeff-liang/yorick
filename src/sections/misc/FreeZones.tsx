import { haveEffect, myFamiliar, myPath } from "kolmafia";
import { $effect, $familiar, $item, $path, get, have } from "libram";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { haveUnrestricted } from "../../util/available";
import { inventoryLink } from "../../util/links";
import { renderSourceList, Source } from "../../util/source";
import { plural } from "../../util/text";

const FREE_ZONES: Source[] = [
  {
    name: "DMT",
    remaining: () =>
      +haveUnrestricted($familiar`Machine Elf`) &&
      5 - get("_machineTunnelsAdv"),
    render: ({ remaining }) => (
      <Line
        {...(myFamiliar() === $familiar`Machine Elf`
          ? { href: "/place.php?whichplace=dmt" }
          : { command: "familiar Machine Elf" })}
      >
        {plural(remaining, "Machine Tunnels fight")} (backups/wanderers).
      </Line>
    ),
  },
  {
    name: "Speakeasy",
    remaining: () => +get("ownsSpeakeasy") && 3 - get("_speakeasyFreeFights"),
    render: ({ remaining }) => (
      <Line href="/place.php?whichplace=speakeasy">
        {plural(remaining, "Speakeasy fight")} (wanderers).
      </Line>
    ),
  },
  {
    name: "Shadow Affinity",
    remaining: () =>
      +haveEffect($effect`Shadow Affinity`) ||
      (+(
        haveUnrestricted($item`closed-circuit pay phone`) &&
        !get("_shadowAffinityToday")
      ) &&
        11),
    render: ({ remaining }) => (
      <Line
        href={
          have($effect`Shadow Affinity`)
            ? "/place.php?whichplace=cemetery"
            : inventoryLink($item`closed-circuit pay phone`)
        }
      >
        {plural(remaining, "Shadow Affinity fight")} (backups/wanderers).
      </Line>
    ),
  },
];

const FreeZones = () => {
  if (myPath() === $path`Avant Guard`) return null;

  const { total, rendered } = renderSourceList(FREE_ZONES);
  if (total === 0) return null;

  return (
    <Tile
      header={plural(total, "free zone fight")}
      id="free-zones-resource"
      imageUrl={
        haveUnrestricted($familiar`Machine Elf`) &&
        get("_machineTunnelsAdv") < 5
          ? "/images/itemimages/machelf.gif"
          : "/images/itemimages/collins.gif"
      }
    >
      {rendered}
    </Tile>
  );
};

export default FreeZones;
