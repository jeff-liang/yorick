import { List } from "@chakra-ui/react";
import { availableAmount, isUnrestricted } from "kolmafia";
import { $item, $skill, CursedMonkeyPaw, get, sum } from "libram";
import { FC } from "react";

import AdviceTooltipText from "../../components/AdviceTooltipText";
import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { inRunEffectWishes } from "../../resourceInfo/wishes";
import { haveUnrestricted } from "../../util/available";
import {
  inventoryActionLink,
  inventoryUseLink,
  mainActionLink,
} from "../../util/links";
import { inRun } from "../../util/quest";
import { renderSourceList, Source } from "../../util/source";
import { commaAnd, plural } from "../../util/text";

const GENIE_SOURCES: Source[] = [
  {
    name: "Genie",
    remaining: () =>
      +haveUnrestricted($item`genie bottle`) && 3 - get("_genieWishesUsed"),
    render: ({ remaining }) => `${remaining} genie`,
  },
  {
    name: "Pocket",
    remaining: () =>
      +isUnrestricted($item`pocket wish`) &&
      availableAmount($item`pocket wish`),
    render: ({ remaining }) => `${remaining} pocket`,
  },
  {
    name: "BOFA",
    remaining: () =>
      +haveUnrestricted($skill`Just the Facts`) &&
      3 - get("_bookOfFactsWishes"),
    render: ({ remaining }) => `${remaining} BOFA`,
  },
];

const WISH_SOURCES: Source[] = [
  {
    name: "Genie Wish",
    remaining: () => sum(GENIE_SOURCES, ({ remaining }) => remaining()),
    render: () => {
      const { total, rendered } = renderSourceList(GENIE_SOURCES);
      return (
        <Line href={inventoryUseLink($item`pocket wish`)}>
          {plural(total, "wish", "wishes")} ({commaAnd(rendered)}).
        </Line>
      );
    },
  },
  {
    name: "Cargo Shorts",
    remaining: () => +!get("_cargoPocketEmptied"),
    render: () => (
      <Line href={inventoryActionLink("pocket")}>
        1 cargo shorts pocket (limited).
      </Line>
    ),
  },
  {
    name: "Cursed Monkey's Paw",
    remaining: () => +CursedMonkeyPaw.have() && CursedMonkeyPaw.wishes(),
    render: ({ remaining }) => (
      <Line href={mainActionLink("cmonk")}>
        {plural(remaining, "monkey's paw wish", "monkey's paw wishes")}.
      </Line>
    ),
  },
];

const Wishes: FC = () => {
  const { total, rendered } = renderSourceList(WISH_SOURCES);
  if (total <= 0) return null;

  const effects = inRunEffectWishes().filter(
    ({ shouldDisplay }) => shouldDisplay,
  );

  return (
    <Tile
      header={plural(total, "effect wish", "effect wishes")}
      linkedContent={$item`pocket wish`}
    >
      {rendered}
      {inRun() && effects.length > 0 && (
        <AdviceTooltipText
          advice={
            <List.Root>
              {effects.map(
                ({ target, additionalDescription, currentlyAccessible }) => (
                  <List.Item
                    key={target.identifierString}
                    color={currentlyAccessible ? "fg.muted" : undefined}
                  >
                    {target.identifierString}
                    {additionalDescription && <> ({additionalDescription})</>}
                  </List.Item>
                ),
              )}
            </List.Root>
          }
        >
          Suggested effects.
        </AdviceTooltipText>
      )}
    </Tile>
  );
};

export default Wishes;
