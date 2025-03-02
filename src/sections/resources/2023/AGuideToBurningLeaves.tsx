import { List, Text } from "@chakra-ui/react";
import { availableAmount, getCampground } from "kolmafia";
import { $effect, $familiar, $item, $skill, get, have } from "libram";
import { FC } from "react";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
import Line from "../../../components/Line";
import LinkBlock from "../../../components/LinkBlock";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";
import { isNormalCampgroundPath } from "../../../util/paths";
import { inRun } from "../../../util/quest";
import { plural } from "../../../util/text";

interface LeafyFight {
  leafCost: number;
  summonedMonster: string;
  scaling: string;
  leavesDropped: number;
  extraDrops?: string;
  needed?: () => boolean;
}

interface LeafySummon {
  leafCost: number;
  summonedItem: string;
  description: string;
  melting?: boolean;
  prefName?: string;
  needed?: () => boolean;
}

const LEAFY_SUMMONS: LeafySummon[] = [
  {
    leafCost: 37,
    summonedItem: "Autumnic Bomb",
    description: "potion; prismatic stinging (25 turns)",
    needed: () =>
      !haveUnrestricted($familiar`Shorter-Order Cook`) &&
      !haveUnrestricted($familiar`Imitation Crab`),
  },
  {
    leafCost: 50,
    summonedItem: "Distilled Resin",
    description: "potion; generate +1 leaf/fight (100 turns)",
  },
  {
    leafCost: 66,
    summonedItem: "Autumnal Aegis",
    description: "shield; +250 DA, +2 all res",
    needed: () =>
      !have($skill`Tao of the Terrapin`) &&
      !have($item`autumnal aegis`) &&
      inRun(),
  },
  {
    leafCost: 69,
    summonedItem: "Lit Leaf Lasso",
    description:
      "combat item; lasso leaf freebies for extra end-of-combat triggers",
    prefName: "_leafLassosCrafted",
  },
  {
    leafCost: 74,
    summonedItem: "Forest Canopy Bed",
    description: "bed; +5 free rests, stats via rests",
    needed: () => !getCampground()["forest canopy bed"],
  },
  {
    leafCost: 99,
    summonedItem: "Autumnic Balm",
    description: "potion; +2 all res (100 turns)",
  },
  {
    leafCost: 222,
    summonedItem: "Day Shortener",
    description: "spend 5 turns for a +turn item",
    prefName: "_leafDayShortenerCrafted",
    needed: () => !inRun(),
  },
  {
    leafCost: 1111,
    summonedItem: "Coping Juice",
    description: "copium for the masses",
    needed: () => !inRun(),
  },
  {
    leafCost: 6666,
    summonedItem: "Smoldering Leafcutter Ant Egg",
    description: "mosquito & leaves familiar",
    prefName: "_leafAntEggCrafted",
    needed: () => !inRun(),
  },
  {
    leafCost: 11111,
    summonedItem: "Super-Heated Leaf",
    description: "burn leaves into your skiiiin",
    prefName: "_leafTattooCrafted",
    needed: () => !inRun(),
  },
];

const LEAFY_FIGHTS: LeafyFight[] = [
  {
    leafCost: 11,
    summonedMonster: "Flaming Leaflet",
    scaling: "11/11/11",
    leavesDropped: 4,
  },
  {
    leafCost: 111,
    summonedMonster: "Flaming Monstera",
    scaling: "scaling",
    leavesDropped: 7,
    extraDrops: "leafy browns",
  },
  {
    leafCost: 666,
    summonedMonster: "Leaviathan",
    scaling: "scaling boss (hard!)",
    leavesDropped: 125,
    extraDrops: "flaming leaf crown",
    needed: () => !inRun() && !have($item`flaming leaf crown`),
  },
];

const AGuideToBurningLeaves: FC = () => {
  const guideToLeaves = $item`A Guide to Burning Leaves`;
  const haveLeaves = haveUnrestricted(guideToLeaves);
  const haveCampground = isNormalCampgroundPath();
  const inflammableLeaf = $item`inflammable leaf`;
  const leafCount = availableAmount(inflammableLeaf);

  const fightsRemaining = Math.max(0, 5 - get("_leafMonstersFought"));
  const leafletsUserCanSummon = Math.floor(leafCount / 11);

  const haveResin = have($item`distilled resin`);
  const haveResined = have($effect`Resined`);

  useNag(
    () => ({
      id: "burning-leaves-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/al_resin.gif",
      node: haveLeaves &&
        haveCampground &&
        !haveResined &&
        (haveResin || leafCount >= 50) && (
          <Tile
            header="Get Resined"
            imageUrl="/images/itemimages/al_resin.gif"
            href={
              haveResin
                ? inventoryLink($item`distilled resin`)
                : "/campground.php?preaction=leaves"
            }
            linkEntireTile
          >
            <Line>
              Use distilled resin{!haveResin && " (50 leaves)"} to collect more
              leaves.
            </Line>
          </Tile>
        ),
    }),
    [haveCampground, haveLeaves, haveResin, haveResined, leafCount],
  );

  if (!haveLeaves || !haveCampground) return null;

  return (
    <Tile
      header="Burning Leaves"
      imageUrl="/images/itemimages/al_book.gif"
      href="/campground.php?preaction=leaves"
    >
      <LinkBlock href="/campground.php?preaction=leaves">
        <Line fontWeight="bold">Item Summons:</Line>
        <List.Root>
          {LEAFY_SUMMONS.map((summon) => {
            if (summon.needed && !summon.needed()) return null;

            const hasEnoughLeaves = leafCount >= summon.leafCost;
            return (
              <List.Item
                key={summon.summonedItem}
                color={hasEnoughLeaves ? "black" : "gray.solid"}
              >
                {summon.leafCost} leaves: {summon.summonedItem} -{" "}
                {summon.description}
                {summon.melting && (
                  <Text as="span" fontSize="xs" color="gray.solid">
                    {" "}
                    (melting)
                  </Text>
                )}
              </List.Item>
            );
          })}
        </List.Root>
      </LinkBlock>

      {fightsRemaining > 0 && (
        <>
          <LinkBlock href="/campground.php?preaction=leaves">
            <Line fontWeight="bold">Fight Summons:</Line>
            <List.Root>
              {LEAFY_FIGHTS.map((fight) => {
                if (fight.needed && !fight.needed()) return null;

                const hasEnoughLeaves = leafCount >= fight.leafCost;
                return (
                  <List.Item
                    key={fight.summonedMonster}
                    color={hasEnoughLeaves ? "black" : "gray.solid"}
                  >
                    {fight.leafCost} leaves: {fight.summonedMonster} -{" "}
                    {fight.scaling}; ~{fight.leavesDropped} leaves dropped
                    {fight.extraDrops && (
                      <Text as="span" fontSize="xs" color="gray.solid">
                        {" "}
                        (also, drops {fight.extraDrops})
                      </Text>
                    )}
                  </List.Item>
                );
              })}
            </List.Root>
          </LinkBlock>
          {leafCount >= 111 * fightsRemaining ? (
            <AdviceTooltipText
              advice={`You can summon ${fightsRemaining} monstera for scaling fights.`}
            >
              <Line>{`You have enough leaves for ${fightsRemaining} monstera.`}</Line>
            </AdviceTooltipText>
          ) : leafCount >= 11 * fightsRemaining ? (
            <AdviceTooltipText
              advice={`You can summon ${fightsRemaining} leaflets for familiar turns.`}
            >
              <Line>{`You have enough leaves for ${fightsRemaining} leaflets.`}</Line>
            </AdviceTooltipText>
          ) : leafCount >= 11 ? (
            <AdviceTooltipText advice="Save leaves for more fights!">
              <Line>{`You can currently summon ${plural(leafletsUserCanSummon, "leaflet")}.`}</Line>
            </AdviceTooltipText>
          ) : (
            <AdviceTooltipText advice="Save leaves for fights!">
              <Line>You cannot currently summon a free fight.</Line>
            </AdviceTooltipText>
          )}
        </>
      )}
    </Tile>
  );
};

export default AGuideToBurningLeaves;
