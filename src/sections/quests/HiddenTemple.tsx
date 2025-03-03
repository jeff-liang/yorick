import { Strong } from "@chakra-ui/react";
import { myMeat } from "kolmafia";
import { $item } from "libram";
import { FC } from "react";

import ForestNoncombatAdvice from "../../components/ForestNoncombatAdvice";
import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { hiddenTempleInfo } from "../../questInfo/hiddenTemple";
import { inventoryLink } from "../../util/links";

const HiddenTemple: FC = () => {
  const info = hiddenTempleInfo();
  if (info.completed) return null;

  const { needMap, needCoin, needFertilizer, needSapling, ncsNeeded } = info;

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
          {needSapling && myMeat() < 100 ? (
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
