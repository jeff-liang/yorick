import { haveEquipped } from "kolmafia";
import { $effect, $item, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";

const RomanCandelabra = () => {
  const romanCandelabra = $item`Roman Candelabra`;
  const springShoes = $item`spring shoes`;
  const everythingLooksGreen = $effect`Everything Looks Green`;
  const everythingLooksPurple = $effect`Everything Looks Purple`;

  const haveCandelabra = haveUnrestricted(romanCandelabra);
  const haveSpringShoes = haveUnrestricted(springShoes);
  const candelabraEquipped = haveEquipped(romanCandelabra);
  const haveELG = have(everythingLooksGreen);
  const haveELP = have(everythingLooksPurple);

  useNag(
    () => ({
      id: "roman-candelabra-nag",
      priority: haveSpringShoes ? NagPriority.MID : NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/romcandel.gif",
      node: haveCandelabra && (!haveELP || (!haveELG && !haveSpringShoes)) && (
        <Tile
          header="Candelabra monster chain"
          linkedContent={romanCandelabra}
          id="roman-candelabra-nag"
        >
          {!haveELG && !haveSpringShoes && (
            <>
              <Line color="green.solid">Green candle runaway!</Line>
              {candelabraEquipped ? (
                <Line color="green.solid">Candelabra equipped.</Line>
              ) : (
                <Line color="red.solid">Equip the Roman Candelabra first.</Line>
              )}
            </>
          )}
          {!haveELP && (
            <>
              {candelabraEquipped ? (
                <Line color="purple.solid">
                  Equipped, blow your purple candle!
                </Line>
              ) : (
                <Line color="red.solid">
                  Equip the candelabra and purple ray.
                </Line>
              )}
            </>
          )}
        </Tile>
      ),
    }),
    [
      haveCandelabra,
      romanCandelabra,
      haveELG,
      haveSpringShoes,
      candelabraEquipped,
      haveELP,
    ],
  );

  return null;
};

export default RomanCandelabra;
