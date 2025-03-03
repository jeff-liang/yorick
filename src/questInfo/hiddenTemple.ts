import { hiddenTempleUnlocked } from "kolmafia";
import { $item, have } from "libram";

export function hiddenTempleInfo() {
  const completed = hiddenTempleUnlocked();

  const needMap = !have($item`Spooky Temple map`);
  const needCoin = !have($item`tree-holed coin`) && needMap;
  const needFertilizer = !have($item`Spooky-Gro fertilizer`);
  const needSapling = !have($item`spooky sapling`);

  const ncsNeeded = +needMap + +needCoin + +needFertilizer + +needSapling;

  return {
    completed,
    needMap,
    needCoin,
    needFertilizer,
    needSapling,
    ncsNeeded,
  };
}
