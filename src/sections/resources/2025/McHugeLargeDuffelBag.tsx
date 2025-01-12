import { $item, have } from "libram";
import { FC } from "react";

import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";

const McHugeLargeDuffelBag: FC = () => {
  if (
    !haveUnrestricted($item`McHugeLarge duffel bag`) ||
    have($item`McHugeLarge left ski`)
  ) {
    return null;
  }

  return (
    <Tile linkedContent={$item`McHugeLarge duffel bag`}>
      Open your duffel bag for ski equipment!
    </Tile>
  );
};

export default McHugeLargeDuffelBag;
