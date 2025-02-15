import { List, ListItemProps } from "@chakra-ui/react";
import { Location } from "kolmafia";
import { sum } from "libram";
import { FC } from "react";

import AdviceTooltipText from "../../components/AdviceTooltipText";
import Line from "../../components/Line";
import MainLink from "../../components/MainLink";
import Tile from "../../components/Tile";
import { remainingDelay } from "../../questInfo/delay";
import { parentPlaceLink } from "../../util/links";
import { plural } from "../../util/text";

type Details = { zone: Location; remaining: number; available: boolean };

const ZoneList: FC<{
  zones: Details[];
  disabledColor: ListItemProps["color"];
}> = ({ zones, disabledColor = "fg.subtle" }) => (
  <List.Root>
    {zones.map(({ zone, remaining, available }) => (
      <List.Item
        key={zone.identifierString}
        color={available ? undefined : disabledColor}
      >
        <MainLink href={available ? parentPlaceLink(zone) : undefined}>
          {plural(remaining, "turn")} in {zone.identifierString}.
        </MainLink>
      </List.Item>
    ))}
  </List.Root>
);

const Delay: FC = () => {
  let allRemaining = remainingDelay().sort(
    ({ available: availableA }, { available: availableB }) =>
      +availableB - +availableA,
  );
  let truncated: Details[] = [];
  if (
    allRemaining.length > 7 &&
    allRemaining.some(({ available }) => !available)
  ) {
    truncated = allRemaining.slice(7);
    allRemaining = allRemaining.slice(0, 7);
  }

  const total = sum(allRemaining, ({ remaining }) => remaining);
  if (total <= 0) return null;

  return (
    <Tile
      header={`${plural(total, "turn")} of delay`}
      id="delay-zones-tile"
      imageUrl="/images/itemimages/al_dayshorter.gif"
    >
      <Line>Use free runs and free wanderers to avoid spending turns.</Line>
      <ZoneList zones={allRemaining} disabledColor="fg.subtle" />
      {truncated.length > 0 && (
        <AdviceTooltipText
          advice={<ZoneList zones={truncated} disabledColor="fg.muted" />}
        >
          <Line>Later zones.</Line>
        </AdviceTooltipText>
      )}
    </Tile>
  );
};

export default Delay;
