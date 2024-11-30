import { availableAmount, haveEquipped, Item, myAscensions } from "kolmafia";
import { $familiar, $item, get, have } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { haveUnrestricted } from "../../util/available";
import { commaAnd, plural, pluralItem } from "../../util/text";

const Island: FC = () => {
  const shoreScrip = availableAmount($item`Shore Inc. Ship Trip Scrip`);
  const haveCcsc = haveUnrestricted($item`candy cane sword cane`);
  const haveCcscEquipped = haveEquipped($item`candy cane sword cane`);
  const requiredTrips = haveCcsc ? 2 : 3;
  const islandUnlocked = get("lastIslandUnlock") === myAscensions();

  const pixels: [Item, number][] = [
    [$item`yellow pixel`, 50],
    [$item`red pixel`, 5],
    [$item`green pixel`, 5],
    [$item`blue pixel`, 5],
  ];

  const pixelsNeeded = pixels
    .map(
      ([item, count]) =>
        [item, count - availableAmount(item)] as [Item, number],
    )
    .filter(([, count]) => count > 0);

  if (islandUnlocked) return null;

  return (
    <QuestTile
      header="Unlock Mysterious Island"
      imageUrl="/images/itemimages/dinghy.gif"
      href={
        !have($item`dinghy plans`)
          ? "/place.php?whichplace=desertbeach"
          : undefined
      }
    >
      {shoreScrip < 3 && !have($item`dinghy plans`) && (
        <>
          <Line>
            Visit The Shore, Inc.{" "}
            {plural(requiredTrips - shoreScrip, "more time")} to get enough
            scrip for the dinghy plans.
          </Line>
          {haveCcsc && !haveCcscEquipped && !get("candyCaneSwordShore") && (
            <Line>Equip your candy cane sword to get extra scrip.</Line>
          )}
        </>
      )}
      {shoreScrip >= 3 && !have($item`dinghy plans`) && (
        <Line href="/shop.php?whichshop=shore">Buy dinghy plans.</Line>
      )}
      {have($item`dinghy plans`) &&
        (!have($item`dingy planks`) ? (
          <Line command="buy dingy planks">
            Get some dingy planks to make a boat.
          </Line>
        ) : (
          <Line command="use dinghy plans">
            Use your dinghy plans to make a boat.
          </Line>
        ))}
      {(haveUnrestricted($familiar`Puck Man`) ||
        haveUnrestricted($familiar`Ms. Puck Man`)) &&
        (pixelsNeeded.length > 0 ? (
          <Line>
            Or get a yellow submarine from your Puck Man. Need{" "}
            {commaAnd(
              pixelsNeeded.map(([item, count]) => pluralItem(item, count)),
            )}
            .
          </Line>
        ) : !have($item`yellow submarine`) ? (
          <Line href="/place.php?whichplace=forestvillage&action=fv_mystic">
            You have all the pixels needed. Make a yellow submarine.
          </Line>
        ) : null)}
      {/* TODO: add junk junk */}
    </QuestTile>
  );
};

export default Island;
