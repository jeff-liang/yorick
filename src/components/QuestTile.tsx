import { myLevel } from "kolmafia";
import { FC } from "react";

import Tile, { TileProps } from "./Tile";

interface QuestTileProps extends TileProps {
  minLevel?: number;
}

const QuestTile: FC<QuestTileProps> = ({
  header,
  href,
  minLevel,
  children,
  ...props
}) => {
  return minLevel !== undefined && myLevel() < minLevel ? (
    <Tile
      header={header}
      headerSuffix={`(level ${minLevel})`}
      {...props}
      disabled={true}
    />
  ) : (
    <Tile header={header} href={href} {...props}>
      {children}
    </Tile>
  );
};

export default QuestTile;
