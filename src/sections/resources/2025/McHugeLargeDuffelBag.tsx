import { $item, have } from "libram";
import { FC } from "react";

import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";

const McHugeLargeDuffelBag: FC = () => {
  const duffelBag = $item`McHugeLarge duffel bag`;

  const haveDuffelBag = haveUnrestricted(duffelBag);
  const duffelBagOpen = have($item`McHugeLarge left ski`);

  useNag(
    () => ({
      id: "mchugelarge-duffel-bag-open-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/skibag2.gif",
      node: haveDuffelBag && !duffelBagOpen && (
        <Tile
          header="McHugeLarge duffel bag"
          imageUrl="/images/itemimages/skibag2.gif"
          href={inventoryLink(duffelBag)}
          linkEntireTile
        >
          Open your duffel bag for ski equipment!
        </Tile>
      ),
    }),
    [duffelBag, duffelBagOpen, haveDuffelBag],
  );
  return null;
};

export default McHugeLargeDuffelBag;
