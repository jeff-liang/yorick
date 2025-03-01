import { List, Strong } from "@chakra-ui/react";
import { availableAmount, getCampground } from "kolmafia";
import { $item, get, have } from "libram";

import Line from "../../../components/Line";
import MainLink from "../../../components/MainLink";
import Tile from "../../../components/Tile";
import { inventoryLink } from "../../../util/links";
import { canAccessGarden } from "../../../util/paths";
import { inRun } from "../../../util/quest";

const gravelMessage = (gravels: number) => {
  return (
    <>
      <Strong>{gravels}</Strong>x groveling gravel (free kill*)
    </>
  );
};

const whetStoneMessage = (whetStones: number) => {
  return (
    <MainLink href={inventoryLink($item`whet stone`)}>
      <Strong>{whetStones}</Strong>x whet stone (+1 adv on food).
    </MainLink>
  );
};

const milestoneMessage = (milestones: number) => {
  const desertProgress = get("desertExploration");
  return (
    <MainLink href={inventoryLink($item`milestone`)}>
      <Strong>{milestones}</Strong>x milestone (+5% desert progress),{" "}
      {100 - desertProgress}% remaining.
    </MainLink>
  );
};

const RockGarden = () => {
  const desertProgress = get("desertExploration");
  const gardenGravels = getCampground()["groveling gravel"];
  const gardenWhetStones = getCampground()["whet stone"];
  const gardenMilestones =
    desertProgress < 100 ? getCampground()["milestone"] : 0;

  const availableGravels = availableAmount($item`groveling gravel`);
  const availableWhetStones = availableAmount($item`whet stone`);
  const availableMilestones =
    desertProgress < 100 ? availableAmount($item`milestone`) : 0;

  const isCommunityService = get("challengePath") === "Community Service";
  const canAccess = canAccessGarden();

  if (
    isCommunityService ||
    !canAccess ||
    !inRun() ||
    !getCampground()["packet of rock seeds"] ||
    availableGravels +
      availableMilestones +
      availableWhetStones +
      gardenGravels +
      gardenMilestones +
      gardenWhetStones ===
      0
  ) {
    return null;
  }

  return (
    <Tile
      header="Rock Garden Resources"
      href="/campground.php"
      imageUrl="/images/itemimages/rockgardenbook.gif"
    >
      {!get("_molehillMountainUsed") && have($item`molehill mountain`) && (
        <Line href={inventoryLink($item`molehill mountain`)}>
          Molehill moleman: Free scaling fight.
        </Line>
      )}
      {(availableGravels > 0 ||
        availableWhetStones > 0 ||
        (availableMilestones > 0 && desertProgress < 100)) && (
        <>
          <Line>Inventory:</Line>
          <List.Root>
            {availableGravels > 0 && (
              <List.Item>{gravelMessage(availableGravels)}</List.Item>
            )}
            {availableWhetStones > 0 && (
              <List.Item>{whetStoneMessage(availableWhetStones)}</List.Item>
            )}
            {availableMilestones > 0 && desertProgress < 100 && (
              <List.Item>{milestoneMessage(availableMilestones)}</List.Item>
            )}
          </List.Root>
        </>
      )}
      {(gardenGravels > 0 ||
        gardenWhetStones > 0 ||
        (gardenMilestones > 0 && desertProgress < 100)) && (
        <>
          <Line>Harvest from your garden:</Line>
          <List.Root>
            {gardenGravels > 0 && (
              <List.Item>{gravelMessage(gardenGravels)}</List.Item>
            )}
            {gardenWhetStones > 0 && (
              <List.Item>{whetStoneMessage(gardenWhetStones)}</List.Item>
            )}
            {gardenMilestones > 0 && desertProgress < 100 && (
              <List.Item>{milestoneMessage(gardenMilestones)}</List.Item>
            )}
          </List.Root>
        </>
      )}
    </Tile>
  );
};

export default RockGarden;
