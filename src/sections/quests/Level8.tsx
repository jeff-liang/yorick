import {
  haveEquipped,
  itemAmount,
  myPath,
  numericModifier,
  toItem,
} from "kolmafia";
import {
  $item,
  $items,
  $location,
  $monster,
  $path,
  get,
  have,
  questStep,
} from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Monsters from "../../components/Monsters";
import QuestTile from "../../components/QuestTile";
import { neededNinjaItems } from "../../questInfo/trapper";
import faxLikes from "../../util/faxLikes";
import { inventoryLink } from "../../util/links";
import { atStep, Step } from "../../util/quest";
import { commaAnd, commaOr, plural, truthy } from "../../util/text";

const TRAPPER_URL = "/place.php?whichplace=mclargehuge&action=trappercabin";

const Level8: FC = () => {
  const step = questStep("questL08Trapper");

  const goatCheese = itemAmount($item`goat cheese`);
  const oreType = get("trapperOre") || "none";
  const ore = oreType !== "none" ? itemAmount(toItem(oreType)) : 0;

  const neededNinja = neededNinjaItems();
  const neededNinjaCount = neededNinja.length;

  const haveDuffelBag = have($item`McHugeLarge duffel bag`);
  const duffelPieces = $items`McHugeLarge duffel bag, McHugeLarge right pole, McHugeLarge left pole, McHugeLarge right ski, McHugeLarge left ski`;
  const equippedDuffelPieces = duffelPieces.filter((item) =>
    haveEquipped(item),
  );
  const outfitPieces = $items`snowboarder pants, eXtreme mittens, eXtreme scarf`;
  const neededOutfitPieces = outfitPieces.filter((item) => !have(item));
  const nonEquippedOutfitPieces = outfitPieces.filter(
    (item) => !haveEquipped(item),
  );

  const coldRes = Math.floor(numericModifier("Cold Resistance"));

  const yetiCount = Math.floor(
    $location`Mist-Shrouded Peak`.turnsSpent /
      (myPath() === $path`Avant Guard` ? 2 : 1),
  );

  if (step === Step.FINISHED) return null;

  return (
    <QuestTile
      header="Trapper"
      imageUrl="/images/otherimages/thetrapper.gif"
      href={atStep(step, [
        [Step.UNSTARTED, "/council.php"],
        [Step.STARTED, TRAPPER_URL],
        [1, "/place.php?whichplace=mclargehuge"],
      ])}
      minLevel={8}
    >
      {atStep(step, [
        [Step.UNSTARTED, <Line>Visit Council to start quest.</Line>],
        [Step.STARTED, <Line>Visit the Trapper to get your assignment.</Line>],
        [
          1,
          goatCheese < 3 || ore < 3 ? (
            <>
              <Line href="/place.php?whichplace=mclargehuge">
                Acquire{" "}
                {commaAnd(
                  truthy([
                    goatCheese < 3 && `${3 - goatCheese} goat cheese`,
                    ore < 3 && `${3 - ore} ${oreType}`,
                  ]),
                )}
                .
              </Line>
              {goatCheese < 3 && (
                <Line>
                  <Monsters
                    location={$location`The Goatlet`}
                    target={$monster`dairy goat`}
                  />
                </Line>
              )}
              {ore < 3 && faxLikes.length > 0 && (
                <Line>Could use {commaOr(faxLikes())} for a mountain man.</Line>
              )}
            </>
          ) : (
            <Line href={TRAPPER_URL}>Return to the trapper.</Line>
          ),
        ],
        [
          2,
          neededNinjaCount === 0 || get("currentExtremity") === 3 ? (
            <Line>
              {coldRes >= 5
                ? "Climb "
                : `Get 5 cold resistance (+${5 - coldRes}) and climb `}
              the Icy Peak.
            </Line>
          ) : neededOutfitPieces.length === 0 ||
            have($item`McHugeLarge left pole`) ? (
            <>
              {have($item`McHugeLarge left pole`)
                ? equippedDuffelPieces.length < 5 && (
                    <Line>
                      Equip{" "}
                      {plural(
                        5 - equippedDuffelPieces.length,
                        "McHugeLarge item",
                      )}{" "}
                      before adventuring.
                    </Line>
                  )
                : nonEquippedOutfitPieces.length > 0 && (
                    <Line>
                      Equip {commaAnd(nonEquippedOutfitPieces)} before
                      adventuring.
                    </Line>
                  )}
              <Line>
                Get {plural(3 - get("currentExtremity"), "more NC")} on the
                eXtreme slope.
              </Line>
            </>
          ) : haveDuffelBag ? (
            <Line href={inventoryLink($item`McHugeLarge duffel bag`)}>
              Open duffel bag for outfit.
            </Line>
          ) : (
            <>
              <Line>
                Complete your outfit: get {commaAnd(neededOutfitPieces)} from
                NCs or from monsters on the eXtreme slope.
              </Line>
              <Line>Low drop rate, so try to get noncombats if you can.</Line>
            </>
          ),
        ],
        [
          3,
          <Line>
            {coldRes >= 5
              ? "Fight "
              : `Get 5 cold resistance (+${5 - coldRes}) and fight `}
            {yetiCount < 3
              ? `${plural(3 - yetiCount, "yeti")} and Groar`
              : "Groar"}
            .
          </Line>,
        ],
        [5, <Line>Return fur to the Trapper.</Line>],
      ])}
    </QuestTile>
  );
};

export default Level8;
