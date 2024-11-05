import { Text } from "@chakra-ui/react";
import {
  availableAmount,
  canAdventure,
  myAscensions,
  myPath,
  myPrimestat,
  numericModifier,
} from "kolmafia";
import {
  $item,
  $location,
  $path,
  $skill,
  $stat,
  DeckOfEveryCard as DeckLibram,
  get,
  have,
  questStep,
} from "libram";

import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";
import { inRun } from "../../../util/quest";
import { plural } from "../../../util/text";

interface CardSummon {
  cards: string[];
  reason: string;
}

function makeSummon(cards: string | string[], reason: string): CardSummon {
  return {
    cards: Array.isArray(cards) ? cards : [cards],
    reason,
  };
}

const DeckOfEveryCard = () => {
  const deckOfEveryCard = $item`Deck of Every Card`;
  const replicaDeckOfEveryCard = $item`replica Deck of Every Card`;

  const activeDeck = have(replicaDeckOfEveryCard)
    ? replicaDeckOfEveryCard
    : deckOfEveryCard;

  if (!haveUnrestricted(activeDeck)) return null;
  if (myPath() === $path`G-Lover`) return null;

  const cardSummonsLeft = DeckLibram.getRemainingDraws();
  const cheatsLeft = DeckLibram.getRemainingCheats();

  if (cardSummonsLeft === 0) return null;

  const summons: CardSummon[] = [];

  // Daily Dungeon key logic
  if (inRun()) {
    summons.push(makeSummon("XVI - The Tower", "Daily Dungeon key."));
  }

  // Ancestral Recall logic
  if (myPath() !== $path`Slow and Steady`) {
    if (haveUnrestricted($skill`Ancestral Recall`)) {
      summons.push(
        makeSummon(
          ["Ancestral Recall", "Island"],
          "+3 adventures via Ancestral Recall.",
        ),
      );
    } else if (!inRun()) {
      summons.push(
        makeSummon("Ancestral Recall", "Gives +adventure summoning skill."),
      );
    }
  }

  // PVP fights
  if (get("hippyStoneBroken") === "true") {
    summons.push(makeSummon("X of Clubs", "+3 PVP fights."));
  }

  // Item drop buff
  if (inRun()) {
    summons.push(
      makeSummon("X - The Wheel of Fortune", "+100% item for 20 turns."),
    );
  }

  // Mainstat gains
  if (inRun() && myPath() !== $path`The Source`) {
    const mainstat = myPrimestat();
    let cardName = "Cardiff";
    if (mainstat === $stat`Muscle`) {
      cardName = "XXI - The World";
    } else if (mainstat === $stat`Mysticality`) {
      cardName = "III - The Empress";
    } else if (mainstat === $stat`Moxie`) {
      cardName = "VI - The Lovers";
    }

    const statGain = Math.floor(
      500 * (1.0 + numericModifier(`${mainstat} Experience Percent`) / 100.0),
    );
    summons.push(makeSummon(cardName, `+${statGain} mainstat.`));
  }

  // Mine ore logic
  if (inRun() && questStep("questL08Trapper")) {
    summons.push(makeSummon("Mine", "One of every ore."));
  }

  // Knife for meat farming
  if (!inRun() && !have($item`knife`)) {
    summons.push(makeSummon("Knife", "+50% meat farming weapon."));
  }

  // Weapon choices
  const weaponChoices: CardSummon[] = [];
  if (inRun()) {
    const mainstat = get("mainStat");
    if (mainstat === "Muscle" && !have($skill`Summon Smithsness`)) {
      weaponChoices.push(makeSummon("Lead pipe", "+100% muscle, +HP club."));
    }
    if (mainstat === "Mysticality" && !have($skill`Summon Smithsness`)) {
      weaponChoices.push(makeSummon("Wrench", "+100% spell damage weapon."));
      weaponChoices.push(
        makeSummon(
          "Candlestick",
          "+100% myst, +2 myst/fight weapon. (wrench may be better)",
        ),
      );
    }
    if (mainstat === "Moxie" && !have($skill`Summon Smithsness`)) {
      if (have($skill`Tricky Knifework`)) {
        weaponChoices.push(
          makeSummon("Knife", "+50% meat, +100% moxie knife."),
        );
      } else {
        weaponChoices.push(
          makeSummon("Revolver", "+50% init, +2 moxie/fight ranged weapon."),
        );
      }
    }
    weaponChoices.push(makeSummon("Rope", "+10 familiar weight weapon."));
  }
  summons.push(...weaponChoices);

  // Mickey Mantle card
  summons.push(makeSummon("1952 Mickey Mantle", "Autosells for 10k."));

  // Stone wool logic
  if (inRun() && myPath() !== $path`Community Service`) {
    let woolNeeded = 0;
    if (
      haveUnrestricted($item`Mayam Calendar`) &&
      get("lastTempleAdventures") < myAscensions()
    ) {
      woolNeeded += 1;
    }
    if (!canAdventure($location`The Hidden Park`)) {
      woolNeeded += 1;
      if (
        !have($item`the Nostril of the Serpent`) &&
        !get("lastTempleButtonsUnlock")
      ) {
        woolNeeded += 1;
      }
    }
    if (availableAmount($item`stone wool`) < woolNeeded) {
      summons.push(makeSummon("Sheep", "3 stone wool."));
    }
  }

  // Emperor's outfit
  if (!inRun()) {
    // TODO: Convert outfit checking logic
    summons.push(
      makeSummon("IV - The Emperor", "The Emperor's New Clothes outfit."),
    );
    summons.push(makeSummon("Gift card", "Sell to the needy."));
  }

  // Random cards
  if (!inRun() && cardSummonsLeft >= 5) {
    summons.push(
      makeSummon(
        "Random card",
        `${cardSummonsLeft} luck${cardSummonsLeft > 1 ? "s" : ""} of the draw.`,
      ),
    );
  }

  const cardsAlreadyDrawn: string[] = DeckLibram.getCardsSeen();
  const unusedSummons = summons
    .map(({ cards, reason }) => ({
      cards: cards.filter((card) => !cardsAlreadyDrawn.includes(card)),
      reason,
    }))
    .filter(({ cards }) => cards.length > 0);

  return (
    <Tile
      header={`${plural(cheatsLeft, "card")} drawable`}
      id="deck-of-every-card-tile"
      href={inventoryLink(deckOfEveryCard)}
      imageUrl="/images/itemimages/deckdeck.gif"
    >
      {unusedSummons.map((summon) => (
        <Text key={summon.cards.join(" / ")}>
          <Text as="b">{summon.cards.join(" / ")}</Text>: {summon.reason}
        </Text>
      ))}
    </Tile>
  );
};

export default DeckOfEveryCard;
