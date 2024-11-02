import { FC } from "react";

import Section, { SectionProps } from "./Section";
import TileErrorBoundary from "./TileErrorBoundary";

export interface TileSectionProps extends SectionProps {
  tiles: FC[];
}

const TileSection = ({ tiles, ...props }: TileSectionProps) => {
  const rendered = tiles.map<[string, JSX.Element]>((SpecificTile) => [
    SpecificTile.name,
    <SpecificTile />,
  ]);

  return (
    <Section {...props}>
      {rendered.map(([name, tile]) => (
        <TileErrorBoundary key={name} name={name}>
          {tile}
        </TileErrorBoundary>
      ))}
    </Section>
  );
};

export default TileSection;
