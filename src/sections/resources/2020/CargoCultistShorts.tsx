import { Strong } from "@chakra-ui/react";
import { availableAmount, canAdventure, myPath } from "kolmafia";
import { $familiar, $item, $location, $path, get, have } from "libram";
import { FC, Fragment } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";

const POCKETS = [
  {
    pocket: 343,
    needed: () => get("sidequestOrchardCompleted") !== "none",
    render: () => (
      <Line>
        <Strong color="red.500">343 - Filthworm Drone Stench:</Strong> Stinky!
      </Line>
    ),
  },
  {
    pocket: 666,
    needed: () => true,
    render: () => (
      <Line>
        <Strong color="red.500">666 - Smut Orc Pervert:</Strong> 5 bridge
        fasteners/lumber.
        {have($familiar`Grey Goose`) && " Use a goose drone to copy the box."}
      </Line>
    ),
  },
  {
    pocket: 533,
    needed: () =>
      availableAmount($item`star chart`) === 0 &&
      availableAmount($item`Richard's star key`) === 0,
    render: () => (
      <Line>
        <Strong color="red.500">533 - Greasy Desk Bell:</Strong> Star key
        components.
      </Line>
    ),
  },
  {
    pocket: 565,
    needed: () => !canAdventure($location`The eXtreme Slope`),
    render: () => (
      <Line>
        <Strong color="red.500">565 - Mountain Man:</Strong> YR for 2x ore.
      </Line>
    ),
  },
  {
    pocket: 589,
    needed: () => !canAdventure($location`The Battlefield (Frat Uniform)`),
    render: () => (
      <Line>
        <Strong color="red.500">589 - Green Ops Soldier:</Strong> Olfact for
        funny meme strategies.
      </Line>
    ),
  },
];

const CargoCultistShorts: FC = () => {
  const shortsPocketEmptied = get("_cargoPocketEmptied");
  const youHaveTheShorts = haveUnrestricted($item`Cargo Cultist Shorts`);
  const emptyPockets = get("cargoPocketsEmptied").split(",").map(Number);

  if (!youHaveTheShorts || shortsPocketEmptied) return null;

  return (
    <Tile
      header="Cargo Cultist Shorts"
      imageUrl="/images/itemimages/cargoshorts.gif"
      href="inventory.php?action=pocket"
    >
      <Line>Pick a pocket for something useful!</Line>
      {myPath() !== $path`Community Service` && (
        <>
          {POCKETS.filter(
            ({ pocket, needed }) => needed() && !emptyPockets.includes(pocket),
          ).map(({ pocket, render }) => (
            <Fragment key={pocket}>{render()}</Fragment>
          ))}
        </>
      )}
    </Tile>
  );
};

export default CargoCultistShorts;
