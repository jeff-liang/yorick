import { ListItem, UnorderedList } from "@chakra-ui/react";
import { availableAmount, toItem } from "kolmafia";
import {
  $effect,
  $item,
  $items,
  $location,
  $skill,
  get,
  have,
  questStep,
} from "libram";
import { FC, ReactNode } from "react";

import AsyncLink from "../../components/AsyncLink";
import Line from "../../components/Line";
import MainLink from "../../components/MainLink";
import Tile from "../../components/Tile";
import { NagPriority } from "../../contexts/NagContext";
import useNag from "../../hooks/useNag";
import { haveUnrestricted } from "../../util/available";
import { inventoryLink, parentPlaceLink, skillLink } from "../../util/links";
import { questFinished } from "../../util/quest";
import { renderSourceList } from "../../util/source";
import { plural } from "../../util/text";

interface LuckySource {
  name: string;
  remaining: () => number;
  render: (props: { remaining: number }) => ReactNode;
}

const LUCKY_SOURCES: LuckySource[] = [
  {
    name: "Hermit",
    remaining: () =>
      3 - get("_cloversPurchased") + availableAmount($item`11-leaf clover`),
    render: () => {
      const clover = $item`11-leaf clover`;
      const cloversAvailableToday = 3 - get("_cloversPurchased");
      const cloversInInventory = availableAmount(clover);
      return (
        <Line>
          <MainLink href={inventoryLink(clover)}>
            {plural(cloversInInventory, clover)}
          </MainLink>
          {cloversAvailableToday > 0 && (
            <>
              {" "}
              <AsyncLink
                command={`coinmaster buy hermit ${cloversAvailableToday} 11-leaf clover`}
              >
                (can grab {cloversAvailableToday} more from Hermit)
              </AsyncLink>
            </>
          )}
          .
        </Line>
      );
    },
  },
  {
    name: "Apriling Sax",
    remaining: () =>
      +haveUnrestricted($item`Apriling band saxophone`) &&
      3 - get("_aprilBandSaxophoneUses"),
    render: ({ remaining }) => (
      <Line href={inventoryLink($item`Apriling band saxophone`)}>
        {plural(remaining, "Apriling Sax use")}.
      </Line>
    ),
  },
  {
    name: "August Scepter",
    remaining: () =>
      +haveUnrestricted($skill`Aug. 2nd: Find an Eleven-Leaf Clover Day`) &&
      +!get("_aug2Cast"),
    render: () => {
      const aug2Skill = $skill`Aug. 2nd: Find an Eleven-Leaf Clover Day`;
      return <Line href={skillLink(aug2Skill)}>1 August 16th use.</Line>;
    },
  },
  {
    name: "Energy Drinks",
    remaining: () =>
      6 * availableAmount($item`[10882]carton of astral energy drinks`) +
      availableAmount($item`[10883]astral energy drink`),
    render: ({ remaining }) => {
      const drink = $item`[10883]astral energy drink`;
      const carton = $item`[10882]carton of astral energy drinks`;
      return (
        <Line href={inventoryLink(have(drink) ? drink : carton)}>
          {remaining} energy drinks.
        </Line>
      );
    },
  },
];

const WAND_INGREDIENTS = $items`ruby W, metallic A, lowercase N, heavy D`;
const luckyAdventureUses: [string, () => ReactNode][] = [
  [
    "Wand",
    () => {
      const haveWand = have($item`Wand of Nagamar`);
      const haveIngredients = WAND_INGREDIENTS.every((item) => have(item));
      const basement = $location`The Castle in the Clouds in the Sky (Basement)`;

      return (
        !haveWand &&
        !haveIngredients && (
          <MainLink href={parentPlaceLink(basement)}>
            Castle Basement: Wand of Nagamar ingredients.
          </MainLink>
        )
      );
    },
  ],
  [
    "Zeppelin",
    () => {
      if (questStep("questL11Ron") >= 2) return null;
      return (
        <MainLink
          href={parentPlaceLink($location`A Mob of Zeppelin Protesters`)}
        >
          Zeppelin Mob: Choose NC (sleaze, Whatshisname, lynyrdness).
        </MainLink>
      );
    },
  ],
  [
    "A-Boo Peak",
    () =>
      !get("booPeakLit") && (
        <MainLink href={parentPlaceLink($location`A-Boo Peak`)}>
          A-Boo Peak: Get 2 A-Boo clues.
        </MainLink>
      ),
  ],
  [
    "Smut Orc Logging Camp",
    () =>
      get("chasmBridgeProgress") < 30 && (
        <MainLink href={parentPlaceLink($location`The Smut Orc Logging Camp`)}>
          Smut Orcs: Get 3 lumber and 3 fasteners.
        </MainLink>
      ),
  ],
  [
    "Itznotyerzitz Mine",
    () =>
      questStep("questL08Trapper") <= 1 &&
      availableAmount(toItem(get("trapperOre") || "none")) < 3 && (
        <MainLink href={parentPlaceLink($location`Itznotyerzitz Mine`)}>
          Mine: Get one of each type of ore.
        </MainLink>
      ),
  ],
  [
    "Castle Top Floor",
    () =>
      get("sidequestNunsCompleted") === "none" &&
      !questFinished("questL12War") && (
        <MainLink
          href={parentPlaceLink(
            $location`The Castle in the Clouds in the Sky (Top Floor)`,
          )}
        >
          Castle Top Floor: Get inhaler, +200% meat potion for Nuns.
        </MainLink>
      ),
  ],
  [
    "Oasis",
    () =>
      get("desertExploration") < 100 && (
        <MainLink href={parentPlaceLink($location`The Oasis`)}>
          Oasis: Get 20 turns of Ultrahydrated.
        </MainLink>
      ),
  ],
];

const LuckyAdventures: FC = () => {
  // TODO: suggest actual uses for adventures

  const isLucky = have($effect`Lucky!`);

  useNag(
    () => ({
      id: "lucky-adventures-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/11leafclover.gif",
      node: isLucky && (
        <Tile
          header="You're lucky!"
          imageUrl="/images/itemimages/11leafclover.gif"
        >
          <Line color="green.500">Next adventure will be a lucky one.</Line>
        </Tile>
      ),
    }),
    [isLucky],
  );

  const { total: totalSources, rendered: renderedSources } =
    renderSourceList(LUCKY_SOURCES);
  if (totalSources === 0) return null;

  const renderedUses = luckyAdventureUses.map(([name, use]) => {
    const rendered = use();
    return rendered ? <ListItem key={name}>{rendered}</ListItem> : false;
  });

  return (
    <Tile
      header={plural(totalSources, "Lucky! adventure")}
      id="lucky-adventure-tile"
      imageUrl="/images/itemimages/11leafclover.gif"
    >
      {renderedSources}
      {renderedUses.some((use) => use) ? (
        <>
          <Line>Ideas for uses:</Line>
          <UnorderedList>{renderedUses}</UnorderedList>
        </>
      ) : (
        <Line>No ideas for how to use these. Get creative!</Line>
      )}
    </Tile>
  );
};

export default LuckyAdventures;
