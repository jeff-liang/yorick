import { Strong } from "@chakra-ui/react";
import { hiddenTempleUnlocked, myMeat } from "kolmafia";
import { $item, have } from "libram";
import { FC } from "react";

import ForestNoncombatAdvice from "../../components/ForestNoncombatAdvice";
import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { inventoryLink } from "../../util/links";

const HiddenTemple: FC = () => {
  if (hiddenTempleUnlocked()) return null;

  const needMap = !have($item`Spooky Temple map`);
  const needCoin = !have($item`tree-holed coin`) && needMap;
  const needFertilizer = !have($item`Spooky-Gro fertilizer`);
  const needSapling = !have($item`spooky sapling`);

  const ncsNeeded = +needMap + +needCoin + +needFertilizer + +needSapling;

  return (
    <QuestTile
      header="Find the Hidden Temple"
      imageUrl="/images/itemimages/map.gif"
      href={
        ncsNeeded === 0 ? inventoryLink($item`Spooky Temple map`) : "/woods.php"
      }
      linkEntireTile
    >
      {needCoin && (
        <Line>
          Explore the stream → Squeeze into the cave to obtain the tree-holed
          coin.
        </Line>
      )}
      {needMap && !needCoin && (
        <Line>
          Brave the dark thicket → Follow the coin → Insert coin to continue to
          obtain the Spooky Temple map.
        </Line>
      )}
      {needFertilizer && (
        <Line>
          Brave the dark thicket → Investigate the dense foliage to obtain
          Spooky-Gro fertilizer.
        </Line>
      )}
      {needSapling && (
        <Line>
          Follow the old road → Talk to the hunter → Buy a tree for 100 Meat to
          obtain the spooky sapling.
          {myMeat() < 100 ? (
            <>
              {" "}
              <Strong color="red.solid">You need 100 meat!</Strong>
            </>
          ) : null}
        </Line>
      )}
      {ncsNeeded === 0 ? (
        <Line>Use your Spooky Temple map!</Line>
      ) : (
        <ForestNoncombatAdvice />
      )}
    </QuestTile>
  );
};

export default HiddenTemple;
