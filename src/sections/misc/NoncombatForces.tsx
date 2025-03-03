import { get } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { NagPriority } from "../../contexts/NagContext";
import useNag from "../../hooks/useNag";
import { FORCE_SOURCES } from "../../resourceInfo/noncombatForces";
import { renderSourceList } from "../../util/source";
import { plural } from "../../util/text";

const NoncombatForces: FC = () => {
  const active = get("noncombatForcerActive");
  useNag(
    () => ({
      id: "nc-forces-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/clarabell.gif",
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
