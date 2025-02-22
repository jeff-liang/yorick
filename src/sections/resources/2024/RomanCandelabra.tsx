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
      id: "roman-candelabra-green-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/romcandel.gif",
      node: haveCandelabra && !haveELG && !haveSpringShoes && (
        <Tile header="Run away with Candelabra" linkedContent={romanCandelabra}>
          <Line color="green.solid">Green candle runaway!</Line>
          {!candelabraEquipped && (
            <Line color="red.solid" command="equip Roman Candelabra">
              Equip the Roman Candelabra first.
            </Line>
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
    ],
  );

  useNag(
    () => ({
      id: "roman-candelabra-purple-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/romcandel.gif",
      node: haveCandelabra && !haveELP && (
        <Tile
          header="Candelabra monster chain"
          linkedContent={romanCandelabra}
          id="roman-candelabra-purple-nag"
        >
          {candelabraEquipped ? (
            <Line color="purple.solid">Equipped, blow your purple candle!</Line>
          ) : (
            <Line color="red.solid" command="equip Roman Candelabra">
              Equip the candelabra and purple ray.
            </Line>
          )}
        </Tile>
      ),
    }),
    [haveCandelabra, romanCandelabra, candelabraEquipped, haveELP],
  );

  return null;
};

export default RomanCandelabra;
