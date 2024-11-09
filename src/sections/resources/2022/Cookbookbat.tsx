import { Stack, Text, UnorderedList } from "@chakra-ui/react";
import {
  availableAmount,
  fullnessLimit,
  Location,
  myDaycount,
  myFullness,
  myPath,
  toLocation,
} from "kolmafia";
import { $familiar, $item, $path, clamp, get } from "libram";

import AdviceTooltip from "../../../components/AdviceTooltip";
import Line from "../../../components/Line";
import MainLink from "../../../components/MainLink";
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

  const freeCooksRemaining = clamp(5 - get("_cookbookbatCrafting"), 0, 5);

  const questMonsterName = get("_cookbookbatQuestMonster", "");
  const questLocationName =
    get("_cookbookbatQuestLastLocation", "") ||
    get("_cookbookbatQuestSuggestedLocation", "");
  const questLocation = toLocation(questLocationName);

  const path = myPath();
  const daycount = myDaycount();

  useNag(
    () => ({
      id: "cookbookbat-quest-nag",
      priority: NagPriority.MID,
      // Only nag on quests in AG - and only for 1-day attempts.
      node: questMonsterName !== "" &&
        path === $path`Avant Guard` &&
        daycount === 1 && (
          <Tile header="Cookbookbat Quest" linkedContent={cookbookbat}>
            <Line>Fight a {questMonsterName} for Cookbookbat ingredients.</Line>
            <Line
              href={
                questLocation !== Location.none
                  ? parentPlaceLink(questLocation)
                  : undefined
              }
            >
              Could find one in {questLocationName}.
            </Line>
          </Tile>
        ),
    }),
    [
      cookbookbat,
      daycount,
      path,
      questLocation,
      questLocationName,
      questMonsterName,
    ],
  );

  if (!haveUnrestricted(cookbookbat)) return null;
  if (myFullness() >= fullnessLimit()) return null;

  const ingredientsCharge = get("cookbookbatIngredientsCharge", 0);
  const fightsUntilQuest = get("_cookbookbatCombatsUntilNewQuest", 0);

  return (
    <Tile
      header="Pizza party with the Cookbookbat!"
      linkedContent={cookbookbat}
      href="/craft.php?mode=cook"
    >
      <Line>
        {plural(11 - ingredientsCharge, "fight")} until next ingredients drop.
      </Line>
      {questMonsterName !== "" && (
        <Line>
          Or fight a {questMonsterName} in {questLocationName} for ingredients.
        </Line>
      )}
      {fightsUntilQuest > 1 ? (
        <Line>{plural(fightsUntilQuest, "fight")} until next quest.</Line>
      ) : (
        <Line>New ingredient quest next turn.</Line>
      )}
      <MainLink href="/craft.php?mode=cook">
        <Stack spacing={0.5}>
          <Line>
            You currently have {wheyAmount} whey, {vegAmount} veg, and{" "}
            {yeastAmount} yeast. Make:
          </Line>
          <UnorderedList>
            <Line>
              <Text as="b">{borisBreadCraftable}x Boris's Bread:</Text> +100%
              meat.
            </Line>
            <Line>
              <Text as="b">
                {roastedVegCraftable}x Roasted Vegetable of Jarlsberg:
              </Text>{" "}
              +100% item.
            </Line>
            <Line>
              <Text as="b">
                {focacciaCraftable}x Roasted Vegetable Focaccia:
              </Text>{" "}
              +10 fam XP.
            </Line>
          </UnorderedList>
        </Stack>
      </MainLink>
      <AdviceTooltip
        text={
          <Stack align="start">
            <Text as="b">Cookbookbat Recipes!</Text>
            <Text>Boris's Bread = yeast + yeast</Text>
            <Text>Roasted Vegetable of Jarlsberg = veg + veg</Text>
            <Text>Roasted Vegetable Focaccia = bread + roastveg</Text>
          </Stack>
        }
        label="Important Recipes"
      />
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
