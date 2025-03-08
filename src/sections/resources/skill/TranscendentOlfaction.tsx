import { Strong } from "@chakra-ui/react";
import { haveEquipped } from "kolmafia";
import { $effect, $item, $skill, get, have } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";
import { renderSourceList, Source } from "../../../util/source";
import { plural } from "../../../util/text";

const TRACK_SOURCES: Source[] = [
  {
    name: "Transcendent Olfaction",
    remaining: () =>
      +have($skill`Transcendent Olfaction`) && 3 - get("_olfactionsUsed"),
    render: ({ remaining }) => (
      <Line>{plural(remaining, "Transcendent Olfaction")}.</Line>
    ),
  },
  {
    name: "McHugeLarge Slash",
    remaining: () =>
      +have($item`McHugeLarge duffel bag`) && 3 - get("_mcHugeLargeSlashUses"),
    render({ remaining }) {
      const leftPole = $item`McHugeLarge left pole`;
      const havePole = haveUnrestricted(leftPole);
      const poleEquipped = haveEquipped(leftPole);
      return (
        <Line
          href={
            !poleEquipped
              ? inventoryLink(
                  havePole ? leftPole : $item`McHugeLarge duffel bag`,
                )
              : undefined
          }
          color={!poleEquipped ? "gray.solid" : undefined}
        >
          {plural(remaining, "McHugeLarge Slash", "McHugeLarge Slashes")}.
        </Line>
      );
    },
  },
];

// TODO: Add some suggestions.
const TranscendentOlfaction: FC = () => {
  const { total, rendered } = renderSourceList(TRACK_SOURCES);
  if (total === 0) return null;

  const tracked = have($effect`On the Trail`) && get("olfactedMonster");

  return (
    <Tile
      header={plural(total, "olfaction")}
      id="olfaction-tile"
      imageUrl="/images/itemimages/snout.gif"
    >
      <Line>Make encountering a zone monster much more likely.</Line>
      {tracked && (
        <Line>
          Currently olfacted <Strong>{tracked.identifierString}</Strong>.
        </Line>
      )}
      {rendered}
    </Tile>
  );
};

export default TranscendentOlfaction;
