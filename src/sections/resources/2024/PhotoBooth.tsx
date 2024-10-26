import { $items, get, have } from "libram";
import { getClanName } from "tome-kolmafia/dist/kolmafia";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { commaAnd, plural } from "../../../util/text";

const PhotoBooth: React.FC = () => {
  const clanName = getClanName();
  // TODO: Support other clans (but we'd have to check unlocks)
  const hasPhotoBooth = clanName === "Bonus Adventures from Hell";

  const photosRemaining = 3 - get("_photoBoothEffects");
  const propsRemaining = 3 - get("_photoBoothEquipment");
  const sheriffPieces = $items`Sheriff pistol, Sheriff badge, Sheriff moustache`;
  const sheriffPiecesMissing = sheriffPieces.filter((item) => !have(item));
  const potentialSheriff = 3 - sheriffPiecesMissing.length + propsRemaining;

  return (
    <Tile
      header="Clan Photo Booth"
      href="/clanphoto.php"
      imageUrl="/images/adventureimages/photobooth.gif"
    >
      {!hasPhotoBooth && (
        <Line command="/whitelist Bonus Adventures from Hell">
          Switch to clan BAFH for photo booth.
        </Line>
      )}
      {photosRemaining > 0 && (
        <>
          <Line>{plural(photosRemaining, "clan photo")} remaining.</Line>
          <Line>50-turn -combat, +combat </Line>
        </>
      )}
      {potentialSheriff === 3 && sheriffPiecesMissing.length > 0 && (
        <>
          <Line>Get sheriff outift for 3 free kills.</Line>
          <Line>Need {commaAnd(sheriffPiecesMissing)}.</Line>
        </>
      )}
    </Tile>
  );
};

export default PhotoBooth;
