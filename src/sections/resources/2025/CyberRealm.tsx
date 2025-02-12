import { haveEquipped, myLocation } from "kolmafia";
import { $item, $locations, get } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";

const CyberRealm: FC = () => {
  const haveCyberRealm = haveUnrestricted($item`server room key`);
  const overclockFights = get("_cyberFreeFights");
  const batWingsFights = get("_batWingsFreeFights");
  const batWingsEquipped = haveEquipped($item`bat wings`);
  const inCyberRealm =
    $locations`Cyberzone 1, Cyberzone 2, Cyberzone 3`.includes(myLocation());

  useNag(
    () => ({
      id: "cyberrealm-overclock-bat-wings-nag",
      priority: NagPriority.ERROR,
      imageUrl: "/images/itemimages/ss_overclocked.gif",
      node: haveCyberRealm &&
        overclockFights < 10 &&
        batWingsFights < 5 &&
        batWingsEquipped &&
        inCyberRealm && (
          <Tile
            header="Take off your bat wings"
            imageUrl="/images/itemimages/ss_overclocked.gif"
          >
            <Line fontWeight="bold">
              WARNING: CyberRealm will eat your bat wings free fights.
            </Line>
          </Tile>
        ),
    }),
    [
      batWingsEquipped,
      batWingsFights,
      haveCyberRealm,
      inCyberRealm,
      overclockFights,
    ],
  );

  return null;
};

export default CyberRealm;
