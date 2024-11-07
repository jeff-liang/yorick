import { getClanName, isUnrestricted } from "kolmafia";
import { $item, $items, get, have } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { commaAnd, plural } from "../../../util/text";

const PhotoBooth: FC = () => {
  const clanName = getClanName();
  // TODO: Support other clans (but we'd have to check unlocks)
  const hasPhotoBooth = clanName === "Bonus Adventures from Hell";

  const photosRemaining = 3 - get("_photoBoothEffects");
  const propsRemaining = 3 - get("_photoBoothEquipment");
  const sheriffPieces = $items`Sheriff pistol, Sheriff badge, Sheriff moustache`;
  const sheriffPiecesMissing = sheriffPieces.filter((item) => !have(item));
  const potentialSheriff = 3 - sheriffPiecesMissing.length + propsRemaining;

  if (
    !haveUnrestricted($item`Clan VIP Lounge key`) ||
    !isUnrestricted($item`photo booth sized crate`)
  ) {
    return null;
  }

  return (
    <Tile
      header="Clan Photo Booth"
      href="/clan_viplounge.php?action=photobooth"
      imageUrl="/images/adventureimages/photobooth.gif"
    >
      {!hasPhotoBooth && (
        <Line command="/whitelist Bonus Adventures from Hell">
          Switch to clan BAFH for photo booth.
        </Line>
      )}
      {photosRemaining > 0 && (
        <Line>
          {plural(photosRemaining, "clan photo")} remaining: 50-turn -combat,
          +combat buff.
        </Line>
      )}
      {potentialSheriff === 3 && sheriffPiecesMissing.length > 0 && (
        <Line>
          Get sheriff outift for 3 free kills. Need{" "}
          {commaAnd(
            sheriffPiecesMissing.map((item) => item.name.split(" ")[1]),
          )}
          .
        </Line>
      )}
    </Tile>
  );
};

export default PhotoBooth;
