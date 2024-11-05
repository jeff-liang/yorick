import { Box, Text } from "@chakra-ui/react";
import {
  availableAmount,
  canInteract,
  getCampground,
  mySpleenUse,
  spleenLimit,
} from "kolmafia";
import { $item, $location, get, have } from "libram";

import AdviceTooltip from "../../../components/AdviceTooltip";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { inventoryLink } from "../../../util/links";
import { commaAnd, commaSeparate, plural } from "../../../util/text";

const Thanksgarden = () => {
  const turkeyBlaster = $item`turkey blaster`;
  const stuffingFluffer = $item`stuffing fluffer`;
  const cashew = $item`cashew`;
  const cornucopia = $item`cornucopia`;
  const cornucopiaCount = getCampground()["cornucopia"];

  const availableSpleen = spleenLimit() - mySpleenUse();

  const blasterTurnsUsed = get("_turkeyBlastersUsed");
  const blasterTurnsLeft = Math.min(
    3 - blasterTurnsUsed,
    Math.floor(availableSpleen / 2),
  );
  const delayAreas = [
    $location`The Outskirts of Cobb's Knob`,
    $location`The Spooky Forest`,
    $location`The Castle in the Clouds in the Sky (Ground Floor)`,
    $location`The Haunted Gallery`,
    $location`The Haunted Bathroom`,
    $location`The Haunted Ballroom`,
    $location`The Boss Bat's Lair`,
  ].filter((l) => l.turnsSpent >= 1);

  if (
    !have(cornucopia) &&
    !have(cashew) &&
    !have(turkeyBlaster) &&
    !have(stuffingFluffer) &&
    cornucopiaCount === 0
  ) {
    return null;
  }

  return (
    <Tile
      header="Thanksgarden Resources"
      imageUrl="/images/itemimages/cornucop.gif"
    >
      {cornucopiaCount > 0 && (
        <Line href="/campground.php">
          Harvest {plural(cornucopiaCount, "cornucopia")}, or wait til tomorrow
          for more.
        </Line>
      )}
      {have(cornucopia) && !canInteract() && (
        <Line href={inventoryLink(cornucopia)}>
          Open for thanksgarden food.
        </Line>
      )}
      {have(cashew) && !canInteract() && (
        <Line href="/shop.php?whichshop=thankshop">
          Could make into{" "}
          <Box as="span">
            {commaSeparate([
              <AdviceTooltip
                key="turkey"
                label={`${plural(
                  Math.floor(availableAmount(cashew) / 3),
                  turkeyBlaster,
                )} to burn delay`}
                text="Requires 3 cashews each."
              />,
              <AdviceTooltip
                key="stuffing"
                label={`${plural(
                  Math.floor(availableAmount(cashew) / 3),
                  stuffingFluffer,
                )} for the war`}
                text="Requires 3 cashews each."
              />,
              "various foods",
              <AdviceTooltip
                key="boat"
                label="gravy boat for the crypt (somewhat marginal)"
                text="Requires 3 cashews."
              />,
            ])}
            .
          </Box>
        </Line>
      )}
      {have(turkeyBlaster) && (
        <Line href={inventoryLink(turkeyBlaster)}>
          <Text>
            Will burn five turns of delay in the last area adventured.
          </Text>
          {delayAreas.length > 0 && (
            <Text>
              Suggested areas: {commaAnd(delayAreas.map((l) => l.toString()))}.
            </Text>
          )}
          {blasterTurnsLeft === 0 ? (
            <Text>
              Cannot use any more today
              {3 - blasterTurnsUsed > 0 ? "; no spleen room" : ""}.
            </Text>
          ) : (
            <Text>Can use {plural(blasterTurnsLeft, "more time")} today.</Text>
          )}
        </Line>
      )}
      {have(stuffingFluffer) && (
        <Line href={inventoryLink(stuffingFluffer)}>
          Clears out level 12 armies. Use before adventuring on the battlefield.
        </Line>
      )}
    </Tile>
  );
};

export default Thanksgarden;
