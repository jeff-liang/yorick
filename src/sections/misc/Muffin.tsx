import { $item, get } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { NagPriority } from "../../contexts/NagContext";
import useNag from "../../hooks/useNag";
import { haveUnrestricted } from "../../util/available";

const Muffin: FC = () => {
  const muffin = get("muffinOnOrder");
  const muffinTin = $item`earthenware muffin tin`;
  const haveTin = haveUnrestricted(muffinTin);
  const muffinOnOrder = muffin && muffin.name.endsWith("muffin");
  const orderedMuffinToday = get("_muffinOrderedToday");

  useNag(
    () => ({
      id: "muffin-order-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/earthmuffin.gif",
      node: (muffin === muffinTin || (haveTin && !orderedMuffinToday)) && (
        <Tile
          header="Order a muffin"
          id="muffin-order-nag"
          imageUrl="/images/itemimages/earthmuffin.gif"
          href="/place.php?whichplace=monorail&action=monorail_downtown"
          linkEntireTile
        >
          <Line>Go to the Breakfast Counter.</Line>
        </Tile>
      ),
    }),
    [haveTin, muffin, muffinTin, orderedMuffinToday],
  );

  useNag(
    () => ({
      id: "muffin-pickup-nag",
      priority: NagPriority.LOW,
      imageUrl: `/images/itemimages/${muffin?.image}`,
      node: muffinOnOrder && !orderedMuffinToday && (
        <Tile
          header={`Pick up your ${muffin.name}`}
          id="muffin-pickup-nag"
          imageUrl={`/images/itemimages/${muffin.image}`}
          href="/place.php?whichplace=monorail&action=monorail_downtown"
          linkEntireTile
        >
          <Line>Go to the Breakfast Counter.</Line>
        </Tile>
      ),
    }),
    [muffin, muffinOnOrder, orderedMuffinToday],
  );

  return null;
};

export default Muffin;
