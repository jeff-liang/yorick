import { $skill, get } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

// TODO: Add some suggestions.
const TranscendentOlfaction: FC = () => {
  const haveOlfaction = haveUnrestricted($skill`Transcendent Olfaction`);
  const remaining = 3 - get("_olfactionsUsed");
  if (!haveOlfaction || remaining < 0) return null;

  const tracked = get("olfactedMonster");

  return (
    <Tile
      header={plural(remaining, "transcendent olfaction")}
      id="olfaction-tile"
      imageUrl="/images/itemimages/snout.gif"
    >
      <Line>Make encountering a zone monster much more likely.</Line>
      {tracked && <Line>Currently tracking {tracked.identifierString}.</Line>}
    </Tile>
  );
};

export default TranscendentOlfaction;
