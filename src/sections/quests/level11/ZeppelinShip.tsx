import { myPath } from "kolmafia";
import { $item, $path, clamp, get, have } from "libram";

import Line from "../../../components/Line";
import { plural } from "../../../util/text";

const ZeppelinShip = () => {
  const remaining = clamp(6 - get("zeppelinProgress"), 0, 6);
  return (
    <>
      {!have($item`Red Zeppelin ticket`) && (
        <Line color="red" href="/shop.php?whichshop=blackmarket">
          Purchase a red zeppelin ticket in the black market.
        </Line>
      )}
      <Line>
        Search for Ron in the Zeppelin. Defeat{" "}
        {plural(remaining, "more monster")}.
      </Line>
      {myPath() !== $path`Avant Guard` && (
        <Line>
          {have($item`glark cable`) && "Use glark cable in combat. "}
          {get("_glarkCableUses")}/5 glark cables used. (free kills)
        </Line>
      )}
    </>
  );
};

export default ZeppelinShip;
