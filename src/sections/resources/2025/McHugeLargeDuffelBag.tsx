import { $item, have } from "libram";
import { FC } from "react";

import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";

const McHugeLargeDuffelBag: FC = () => {
  const duffelBag = $item`McHugeLarge duffel bag`;

  if (!haveUnrestricted(duffelBag) || have($item`McHugeLarge left ski`)) {
    return null;
  }

  return (
    <Tile
      header="McHugeLarge duffel bag"
      imageUrl="/images/itemimages/skibag2.gif"
      href={inventoryLink(duffelBag)}
      linkEntireTile
    >
      Open your duffel bag for ski equipment!
    </Tile>
  );
};

export default McHugeLargeDuffelBag;
