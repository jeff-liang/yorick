import { questStep } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { Step } from "../../util/quest";

const Level1: FC = () => {
  const step = questStep("questM05Toot");

  if (step === Step.FINISHED) return null;

  return (
    <Tile
      header="Toot Oriole"
      imageUrl="/images/otherimages/oriole.gif"
      href="/tutorial.php?action=toot"
      linkEntireTile
    >
      <Line>Visit the Toot Oriole.</Line>
    </Tile>
  );
};

export default Level1;
