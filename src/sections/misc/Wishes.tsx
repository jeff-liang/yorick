import { availableAmount, isUnrestricted } from "kolmafia";
import { $item, $skill, CursedMonkeyPaw, get, sum } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import { haveUnrestricted } from "../../util/available";
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
        <Line>
          {plural(total, "wish", "wishes")} ({commaAnd(rendered)}).
        </Line>
      );
    },
  },
  {
    name: "Cargo Shorts",
    remaining: () => +!get("_cargoPocketEmptied"),
    render: () => <Line>1 cargo shorts pocket (limited).</Line>,
  },
  {
    name: "Cursed Monkey's Paw",
    remaining: () => +CursedMonkeyPaw.have() && CursedMonkeyPaw.wishes(),
    render: ({ remaining }) => (
      <Line>
        {plural(remaining, "monkey's paw wish", "monkey's paw wishes")}
      </Line>
    ),
  },
];

const Wishes: FC = () => {
  const { total, rendered } = renderSourceList(WISH_SOURCES);
  if (total <= 0) return null;

  return <>{rendered}</>;
};

export default Wishes;
