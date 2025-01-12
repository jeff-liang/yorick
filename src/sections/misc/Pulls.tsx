import { List } from "@chakra-ui/react";
import {
  canInteract,
  fullnessLimit,
  hiddenTempleUnlocked,
  inHardcore,
  isUnrestricted,
  Item,
  myAscensions,
  myFullness,
  myPath,
  pullsRemaining,
  storageAmount,
} from "kolmafia";
import { $effect, $item, $items, $path, get, have } from "libram";
import { FC } from "react";

import AdviceTooltipText from "../../components/AdviceTooltipText";
import MainLink from "../../components/MainLink";
import Tile from "../../components/Tile";
import { bridgeItemsNeeded } from "../../questInfo/bridgeItemsNeeded";
import { needKillingJar, needWormRiding } from "../../questInfo/desert";
import { haveMachete, lianasCanBeFree } from "../../questInfo/hiddenCity";
import { spinStatus } from "../../questInfo/pyramid";
import { neededNinjaItems } from "../../questInfo/trapper";
import { bitCount } from "../../util/calc";
import { mallLink, storageLink } from "../../util/links";
import { inRun, questFinished, questPastStep, Step } from "../../util/quest";
import { commaAnd, plural, truthy } from "../../util/text";

interface Pull {
  item: Item;
  turns: number;
  description: string;
  needed?: number;
}

const Pulls: FC = () => {
  if (!inRun() || inHardcore() || canInteract()) {
    return null;
  }

  const path = myPath();

  const neededScrip =
    +(get("lastIslandUnlock") < myAscensions() && 3) +
    +!have($item`UV-resistant compass`);

  const { fastenersNeeded, lumberNeeded } = bridgeItemsNeeded();

  const pullList = truthy<Pull>([
    {
      item: $item`bottle of Blank-Out`,
      turns: 5,
      description: "5 free runs.",
    },
    ...(fullnessLimit() - myFullness() >= 4
      ? $items`Boris's key lime pie, Jarlsberg's key lime pie, Sneaky Pete's key lime pie`.map(
          (item) => {
            const key = Item.get(item.name.replace(" lime pie", ""));
            return (
              !have(key) &&
              !get("nsTowerDoorKeysUsed").includes(key.name) && {
                item,
                turns: 4,
                description: `Eat (${item.fullness} fullness) for ${key.name} for the tower.`,
              }
            );
          },
        )
      : []),
    !have($item`Mega Gem`) &&
      (!have($item`bird rib`) || !have($item`lion oil`)) && {
        item: $item`wet stew`,
        turns: 4,
        description: "Skips Whitey's Grove for Bird Rib & Lion Oil..",
      },
    ...neededNinjaItems().map((item) => ({
      item,
      turns: 3,
      description: "Allows ascending the Icy Peak.",
    })),
    {
      item: $item`Shore Inc. Ship Trip Scrip`,
      turns: 3,
      description: `Skip a trip at the Shore (need ${commaAnd([
        get("lastIslandUnlock") < myAscensions() && "dinghy plans",
        !have($item`UV-resistant compass`) && "compass",
      ])})`,
      needed: neededScrip,
    },
    !haveMachete() &&
      lianasCanBeFree() && {
        item: $item`muculent machete`,
        turns: 3,
        description: "Avoids Hidden Park (banish janitors separately).",
      },
    get("hiddenTavernUnlock") < myAscensions() && {
      item: $item`book of matches`,
      turns: 3,
      description: "Access cursed punch and free-kill drunk pygmies.",
    },
    get("zeppelinProtestors") < 80 && {
      item: $item`deck of lewd playing cards`,
      turns: 3,
      description:
        "Speeds up Zeppelin Mob/Tower Test with 138 sleaze/spell damage",
    },
    get("blackForestProgress") < 5 && {
      item: $item`blackberry galoshes`,
      turns: 2,
      description: "Accelerate Black Forest exploration.",
    },
    fastenersNeeded + lumberNeeded > 0 && {
      item: $item`smut orc keepsake box`,
      turns: 2,
      description: "Bridge: 5 lumber + 5 fasteners.",
    },
    !get("nsTowerDoorKeysUsed").includes("Richard's star key") &&
      !have($item`Richard's star key`) && {
        item: $item`star chart`,
        turns: 2,
        description: "Skip finding Astronomer for star key.",
      },
    get("desertExploration") < 100 && {
      item: $item`milestone`,
      turns: 2,
      description: "Advance desert exploration by 5.",
      needed: Number.POSITIVE_INFINITY,
    },
    !hiddenTempleUnlocked() && {
      item: $item`Spooky-Gro fertilizer`,
      turns: 2,
      description: "One fewer Arboreal Respite encounter.",
    },
    get("desertExploration") < 100 &&
      needWormRiding() && {
        item: $item`drum machine`,
        turns: 2,
        description: "Skip finding Blur in Oasis to wormride.",
      },
    {
      item: $item`pocket wish`,
      turns: 2,
      description: "Get any effect (Nuns, +item, etc.) or summon a monster.",
      needed: Number.POSITIVE_INFINITY,
    },
    {
      item: $item`patent invisibility tonic`,
      turns: 2,
      description:
        "-15% combat potion. String a bunch of NC zones together, and this will save turns.",
    },
    ...(!questFinished("questL12War") &&
    get("sidequestNunsCompleted") === "none" &&
    path !== $path`Two Crazy Random Summer`
      ? [
          !have($effect`Sinuses For Miles`) && {
            item: $item`Mick's IcyVapoHotness Inhaler`,
            turns: 2,
            description: "+200% meat drop.",
          },
          !have($effect`Low on the Hog`) && {
            item: $item`tempura cauliflower`,
            turns: 1,
            description: "+100% meat drop.",
          },
          !have($item`Yeast of Boris`, 2) &&
            !have($effect`Inspired Chef`) && {
              item: $item`Boris's bread`,
              turns: 1,
              description: "+100% meat drop.",
            },
        ]
      : []),
    {
      item: $item`mafia middle finger ring`,
      turns: 2,
      description:
        "Accessory. Grants 1 free run-banish per day. Given how few banishes low-shiny users have, it's pretty easy to argue that a freerun banish like this (where you get 1 banish a day) saves you about 1.5-2 turns per day. Also, it's an 80-turn banish! The length of the banish is actually huge; it allows you to use it for multiple zones in the Junkyard quest (on AMC Gremlins) and the Hidden City (on janitors preferably, or Orderlies/Lawyers if needed)",
    },
    {
      item: $item`Spooky VHS Tape`,
      turns: 2,
      description:
        "Combat item. Throw at a monster to get a free, wandering copy of that monster 8 turns later that auto-YRs.",
      needed: Number.POSITIVE_INFINITY,
    },
    {
      item: $item`Flash Liquidizer Ultra Dousing Accessory`,
      turns: 2,
      description:
        "Accessory. 20% item drop, grants Douse Water for 3 almost-guaranteed pickpockets per day.",
    },
    {
      item: $item`stuffed yam stinkbomb`,
      turns: 2,
      description: "Combat item. Free run-banish.",
      needed: Number.POSITIVE_INFINITY,
    },
    {
      item: $item`pro skateboard`,
      turns: 1,
      description:
        "Accessory. Grants Do an epic mctwist!, which duplicates a monster's items.",
    },
    {
      item: $item`waffle`,
      turns: 1,
      description:
        "Combat item. 1 monster replacement with another in the zone.",
      needed: Number.POSITIVE_INFINITY,
    },
    !questPastStep("questL10Garbage", Step.STARTED) &&
      !have($item`bat wings`) && {
        item: $item`enchanted bean`,
        turns: 1,
        description: "Skip finding enchanted bean.",
      },
    {
      item: $item`rusty hedge trimmers`,
      turns: 1,
      description: "Force NC in Twin Peak.",
      needed: 4 - bitCount(get("twinPeakProgress")),
    },
    questFinished("questL03Rat") &&
      spinStatus().extraSpinsNeeded > 0 && {
        item: $item`tangle of rat tails`,
        turns: 1,
        description: "Summon tomb rat king for more tomb ratchets.",
      },
    !questFinished("questL10Garbage") && {
      item: $item`Mohawk wig`,
      turns: 1,
      description: "For Giant's Castle top floor.",
    },
    !questPastStep("questL11Desert", 2) &&
      get("desertExploration") < 100 &&
      needKillingJar() && {
        item: $item`killing jar`,
        turns: 1,
        description: "+15% desert exploration.",
      },
    !questPastStep("questL11Palindome", 1) &&
      !have($item`photograph of a dog`) && {
        item: $item`disposable instant camera`,
        turns: 1,
        description: "Photograph Racecar Bob in the Palindome.",
      },
    {
      item: $item`11-leaf clover`,
      turns: 1,
      description:
        "Force NCs in Zeppelin Mob, bridge parts, helpful items, or semirare food and booze.",
    },
    {
      item: $item`duonoculars`,
      turns: 1,
      description:
        "Accessory. -5% combat. Also has a very tiny amount of ML, +5.",
    },
    (!have($item`June cleaver`) || !isUnrestricted($item`June cleaver`)) && {
      item: $item`iFlail`,
      turns: 1,
      description: "Weapon slot. Fam weight + -5% combat.",
    },
  ]);

  const pullsUsed = get("_roninStoragePulls")
    .split(",")
    .map((s) => parseInt(s));
  const pullsNeeded = pullList.filter(
    ({ item, needed }) =>
      !have(item, needed ?? 1) &&
      isUnrestricted(item) &&
      !pullsUsed.includes(item.id) &&
      (storageAmount(item) > 0 || item.tradeable),
  );

  if (pullsNeeded.length === 0) return null;

  return (
    <Tile
      header={`${plural(pullsRemaining(), "pull")} from storage`}
      id="pulls-resource"
      imageUrl="/images/adventureimages/hagnk_tentacle.gif"
      href="/storage.php"
    >
      <List.Root>
        {pullsNeeded.map(({ item, turns, description }) => (
          <List.Item key={item.identifierString}>
            <MainLink
              href={
                storageAmount(item) > 0
                  ? storageLink(item)
                  : item.tradeable
                    ? mallLink(item)
                    : undefined
              }
            >
              <AdviceTooltipText
                advice={description}
                textProps={{ _hover: { textDecoration: "none" } }}
              >
                {item.identifierString}: {plural(turns, "turn")}.
              </AdviceTooltipText>
            </MainLink>
          </List.Item>
        ))}
      </List.Root>
    </Tile>
  );
};

export default Pulls;
