import { $item } from "libram";
import { FC } from "react";

import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";

const Leprecondo: FC = () => {
  // eslint-disable-next-line libram/verify-constants
  const leprecondo = $item`Leprecondo`;

  if (!haveUnrestricted(leprecondo)) return null;

  return (
    <Tile linkedContent={leprecondo}>
      Arrange your Leprecondo for benefits!
    </Tile>
  );
};

export default Leprecondo;
