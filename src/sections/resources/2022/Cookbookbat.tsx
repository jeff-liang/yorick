import { List, Strong } from "@chakra-ui/react";
import {
  availableAmount,
  fullnessLimit,
  Item,
  myDaycount,
  myFullness,
  myPath,
  todayToString,
} from "kolmafia";
import { $familiar, $item, $path, clamp, get } from "libram";

import Line from "../../../components/Line";
import LinkBlock from "../../../components/LinkBlock";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { parentPlaceLink } from "../../../util/links";
import { plural } from "../../../util/text";

const Cookbookbat = () => {
  const cookbookbat = $familiar`Cookbookbat`;
  const whey = $item`St. Sneaky Pete's Whey`;
  const veg = $item`Vegetable of Jarlsberg`;
  const yeast = $item`Yeast of Boris`;

  const wheyAmount = availableAmount(whey);
  const vegAmount = availableAmount(veg);
  const yeastAmount = availableAmount(yeast);

  const borisBreadCraftable = Math.floor(yeastAmount / 2);
  const roastedVegCraftable = Math.floor(vegAmount / 2);
  const focacciaCraftable =
    roastedVegCraftable > 0 && borisBreadCraftable > 0
      ? Math.min(borisBreadCraftable, roastedVegCraftable)
      : 0;

  const allPizzasEaten =
    +get("deepDishOfLegendEaten") +
      +get("calzoneOfLegendEaten") +
      +get("pizzaOfLegendEaten") ===
    3;

  const freeCooksRemaining = clamp(5 - get("_cookbookbatCrafting"), 0, 5);

  const questMonster = get("_cookbookbatQuestMonster");
  const questLocation = get("_cookbookbatQuestLastLocation");
  const questIngredientName = get("_cookbookbatQuestIngredient");
  const questIngredient =
    questIngredientName === "" ? null : Item.get(questIngredientName);

  const path = myPath();
  const daycount = myDaycount();
  const year = parseInt(todayToString().substring(0, 4));

  useNag(
    () => ({
      id: "cookbookbat-quest-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/bbat_fam.gif",
      // Only nag on quests in hardcore AG/2024 std - and only for 1-day attempts.
      node: questMonster !== null &&
        !allPizzasEaten &&
        year === 2024 &&
        (path === $path`Avant Guard` || path === $path`Standard`) &&
        daycount === 1 && (
          <Tile header="Cookbookbat Quest" linkedContent={cookbookbat}>
            <Line>
              Fight a {questMonster.identifierString} for{" "}
              {questIngredient && plural(3, questIngredient)}.
            </Line>
            <Line
              href={
                questLocation !== null
                  ? parentPlaceLink(questLocation)
                  : undefined
              }
            >
              Could find one in {questLocation?.identifierString}.
            </Line>
          </Tile>
        ),
    }),
    [
      allPizzasEaten,
      cookbookbat,
      daycount,
      path,
      questIngredient,
      questLocation,
      questMonster,
      year,
    ],
  );

  if (!haveUnrestricted(cookbookbat)) return null;
  if (myFullness() >= fullnessLimit()) return null;

  const ingredientsCharge = get("cookbookbatIngredientsCharge");
  const fightsUntilQuest = get("_cookbookbatCombatsUntilNewQuest");

  return (
    <Tile
      header="Pizza party with the Cookbookbat!"
      linkedContent={cookbookbat}
      href="/craft.php?mode=cook"
    >
      <Line>
        {plural(11 - ingredientsCharge, "fight")} until next ingredients drop.
      </Line>
      {questMonster !== null && (
        <Line>
          Or fight a {questMonster.identifierString} in{" "}
          {questLocation?.identifierString} for{" "}
          {questIngredient && plural(3, questIngredient)}.
        </Line>
      )}
      {fightsUntilQuest > 1 ? (
        <Line>
          {plural(fightsUntilQuest, "fight")} until next
          {questMonster && " (rerolled)"} quest.
        </Line>
      ) : (
        <Line>New ingredient quest next turn.</Line>
      )}
      <LinkBlock href="/craft.php?mode=cook">
        <Line>
          You currently have {wheyAmount} whey, {vegAmount} veg, and{" "}
          {yeastAmount} yeast. Make:
        </Line>
        <List.Root>
          <List.Item>
            <Strong>{borisBreadCraftable}x Boris's Bread:</Strong> +100% meat.
          </List.Item>
          <List.Item>
            <Strong>
              {roastedVegCraftable}x Roasted Vegetable of Jarlsberg:
            </Strong>{" "}
            +100% item.
          </List.Item>
          <List.Item>
            <Strong>{focacciaCraftable}x Roasted Vegetable Focaccia:</Strong>{" "}
            +10 fam XP.
          </List.Item>
        </List.Root>
      </LinkBlock>
      {freeCooksRemaining > 0 && (
        <Line>
          {plural(freeCooksRemaining, "free cook")}: Unstable fulminate,
          potions, and more.
        </Line>
      )}
    </Tile>
  );
};

export default Cookbookbat;
