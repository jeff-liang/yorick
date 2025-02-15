import {
  canAdventure,
  canEquip,
  getProperty,
  haveEquipped,
  inHardcore,
  Location,
  myLocation,
  myMeat,
  myPath,
  numericModifier,
} from "kolmafia";
import { $effect, $item, $location, $path, get, have, questStep } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import MainLink from "../../../components/MainLink";
import QuestTile from "../../../components/QuestTile";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink, parentPlaceLink } from "../../../util/links";
import { questFinished, Step } from "../../../util/quest";
import { commaOr, plural } from "../../../util/text";

const CELLAR_LINK = "/place.php?whichplace=manor4";

const LordSpookyraven: FC = () => {
  const step = questStep("questL11Manor");

  const isPathBoris = myPath() === $path`Avatar of Boris`;
  const isPathActuallyEdTheUndying =
    myPath() === $path`Actually Ed the Undying`;
  const isPathNuclearAutumn = myPath() === $path`Nuclear Autumn`;
  const isPathVampire = myPath() === $path`Dark Gyffte`;
  const isInHardcore = inHardcore();
  const isInBadMoon =
    getProperty("moonTuned") === "true" &&
    getProperty("charpanemode") === "badmoon";

  const canEquipAnyWeapon = canEquip($item`seal-clubbing club`);
  const useFastRoute =
    canEquipAnyWeapon &&
    !(isPathNuclearAutumn && isInHardcore) &&
    !isPathBoris &&
    !isInBadMoon;

  const hauntedBallroomAvailable = canAdventure(
    $location`The Haunted Ballroom`,
  );
  const delayRemaining = 5 - $location`The Haunted Ballroom`.turnsSpent;

  const haveSpectacles = have($item`Lord Spookyraven's spectacles`);
  const recipeWillBeAutoread =
    haveSpectacles && useFastRoute && get("autoCraft");
  const recipeWasReadWithGlasses =
    get("spookyravenRecipeUsed") === "with_glasses";
  const recipeWasRead =
    recipeWasReadWithGlasses || get("spookyravenRecipeUsed") === "no_glasses";

  const haveWineBomb = have($item`wine bomb`);
  const haveUnstableFulminate = have($item`unstable fulminate`);
  const haveUnstableFulminateEquipped = haveEquipped($item`unstable fulminate`);
  const haveChateauDeVinegar = have($item`bottle of Chateau de Vinegar`);
  const haveBlastingSoda = have($item`blasting soda`);

  const currentMl = numericModifier("Monster Level");
  const mlNeeded = 82 - currentMl;

  const searchables = {
    "The Haunted Kitchen": $item`loosening powder`,
    "The Haunted Conservatory": $item`powdered castoreum`,
    "The Haunted Bathroom": $item`drain dissolver`,
    "The Haunted Gallery": $item`triple-distilled turpentine`,
    "The Haunted Laboratory": $item`detartrated anhydrous sublicalc`,
    "The Haunted Storage Room": $item`triatomaceous dust`,
  };

  const missingSearchables = Object.entries(searchables).filter(
    ([, item]) => !have(item),
  );

  const inBoilerRoom = myLocation() === $location`The Haunted Boiler Room`;

  useNag(
    () => ({
      id: "lord-spookyraven-quest-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/wine2.gif",
      node: step < Step.FINISHED &&
        inBoilerRoom &&
        haveUnstableFulminate &&
        (!haveUnstableFulminateEquipped || mlNeeded > 0) && (
          <Tile
            header="Make a wine bomb"
            imageUrl="/images/itemimages/wine2.gif"
          >
            <Line
              href={inventoryLink($item`unstable fulminate`)}
              color="red.solid"
            >
              {!haveUnstableFulminateEquipped && mlNeeded > 0
                ? `Equip unstable fulminate and get ${Math.ceil(mlNeeded)} more ML.`
                : !haveUnstableFulminateEquipped
                  ? "Equip unstable fulminate."
                  : `Get ${Math.ceil(mlNeeded)} more ML.`}
            </Line>
          </Tile>
        ),
    }),
    [
      haveUnstableFulminate,
      haveUnstableFulminateEquipped,
      inBoilerRoom,
      mlNeeded,
      step,
    ],
  );

  if (step === Step.FINISHED) return null;

  const boilerFights = Math.ceil(
    50.1 / (10 + Math.floor(Math.max(currentMl, 0) / 2)),
  );
  return (
    <QuestTile
      header={
        missingSearchables.length === 0 || haveWineBomb || step === 3
          ? "Fight Lord Spookyraven"
          : "Find Lord Spookyraven"
      }
      id="lord-spookyraven-quest"
      imageUrl="/images/adventureimages/lordspooky.gif"
      href={
        step < 1 ||
        (useFastRoute && !haveSpectacles && !recipeWasReadWithGlasses)
          ? "/place.php?whichplace=manor2"
          : CELLAR_LINK
      }
      minLevel={11}
      disabled={!hauntedBallroomAvailable}
    >
      {step < 1 &&
        (questFinished("questL11Black") ? (
          <>
            <Line href={parentPlaceLink($location`The Haunted Ballroom`)}>
              Run -combat in the Haunted Ballroom.
              {delayRemaining > 0 &&
                ` Delay for ${plural(delayRemaining, "turn")}.`}
            </Line>
          </>
        ) : delayRemaining > 0 ? (
          <Line>
            Pre-burn {plural(delayRemaining, "turn")} of delay in the Haunted
            Ballroom.
          </Line>
        ) : (
          <Line>All delay burned. Find your dad's diary.</Line>
        ))}
      {step === 1 &&
        (useFastRoute && !haveSpectacles && !recipeWasReadWithGlasses ? (
          <Line href={parentPlaceLink($location`The Haunted Bedroom`)}>
            Acquire Lord Spookyraven's spectacles from the Haunted Bedroom.
          </Line>
        ) : recipeWillBeAutoread ? (
          <Line href={CELLAR_LINK}>
            Click on the suspicious masonry in the basement.
          </Line>
        ) : (
          <Line href={CELLAR_LINK}>
            Click on the suspicious masonry in the basement, then read the
            recipe.
          </Line>
        ))}
      {step === 2 &&
        !haveUnstableFulminate &&
        !haveWineBomb &&
        useFastRoute &&
        (!recipeWasReadWithGlasses ? (
          <Line href={parentPlaceLink($location`The Haunted Bedroom`)}>
            Need to{" "}
            {!haveSpectacles && "acquire Lord Spookyraven's spectacles and "}
            read the recipe before you can use the quick route.
          </Line>
        ) : (
          <>
            {!haveChateauDeVinegar && (
              <Line href={CELLAR_LINK}>
                Find bottle of Chateau de Vinegar from possessed wine rack in
                the Haunted Wine Cellar.
              </Line>
            )}
            {!haveBlastingSoda && (
              <Line href={CELLAR_LINK}>
                Find blasting soda from the cabinet in the Haunted Laundry Room.
              </Line>
            )}
            {haveChateauDeVinegar && haveBlastingSoda && (
              <Line href="/craft.php?mode=cook">Cook unstable fulminate.</Line>
            )}
          </>
        ))}
      {step === 2 &&
        !useFastRoute &&
        (!recipeWasRead ? (
          <Line href={inventoryLink($item`recipe: mortar-dissolving solution`)}>
            Read the recipe.
          </Line>
        ) : missingSearchables.length > 0 ? (
          <Line>
            Go search in the Haunted{" "}
            {commaOr(
              missingSearchables.map(([location]) => (
                <MainLink href={parentPlaceLink(Location.get(location))}>
                  location.replace("The Haunted ", "")
                </MainLink>
              )),
              missingSearchables.map(([location]) => location),
            )}
            .
          </Line>
        ) : (
          <Line href={CELLAR_LINK}>
            Use your mortar-dissolving ingredients to clear out the masonry.
          </Line>
        ))}
      {haveUnstableFulminate && (
        <>
          <Line href={CELLAR_LINK}>
            Adventure in the haunted boiler room
            {mlNeeded > 0 && ` with +${mlNeeded} ML`}.
          </Line>
          <Line href={CELLAR_LINK}>
            {boilerFights > 1 ? `~${boilerFights}` : boilerFights} total boiler
            fights to charge fulminate.
          </Line>
        </>
      )}
      {haveWineBomb && (
        <Line href={CELLAR_LINK}>
          Use the wine bomb to clear out the masonry.
        </Line>
      )}
      {step === 3 &&
        (isPathActuallyEdTheUndying ? (
          <Line href={CELLAR_LINK}>Talk to Lord Spookyraven.</Line>
        ) : isPathVampire ? (
          <Line href={CELLAR_LINK}>Fight the path-specific boss.</Line>
        ) : (
          <>
            <Line href={CELLAR_LINK}>Fight Lord Spookyraven.</Line>
            {!have($effect`Red Door Syndrome`) &&
              myMeat() > 1000 &&
              !haveUnrestricted($item`can of black paint`) && (
                <Line href="/shop.php?whichshop=blackmarket">
                  A can of black paint can help with fighting him.
                  {myMeat() < 20000 && " Bit pricy. (1k meat)"}
                </Line>
              )}
          </>
        ))}
    </QuestTile>
  );
};

export default LordSpookyraven;
