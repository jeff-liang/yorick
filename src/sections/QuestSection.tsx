import { myBasestat, myPath } from "kolmafia";
import { $path, $stat } from "libram";

import TileSection from "../components/TileSection";
import { inRun } from "../util/quest";

import Leveling from "./misc/Leveling";
import Zootomist from "./path/Zootomist";
import Delay from "./quests/Delay";
import DigitalKey from "./quests/DigitalKey";
import HeroKeys from "./quests/HeroKeys";
import HiddenTemple from "./quests/HiddenTemple";
import Island from "./quests/Island";
import Level1 from "./quests/Level1";
import Level10 from "./quests/Level10";
import Level11 from "./quests/Level11";
import Level12 from "./quests/Level12";
import Level13 from "./quests/Level13";
import Level2 from "./quests/Level2";
import Level3 from "./quests/Level3";
import Level4 from "./quests/Level4";
import Level5 from "./quests/Level5";
import Level6 from "./quests/Level6";
import Level7 from "./quests/Level7";
import Level8 from "./quests/Level8";
import Level9 from "./quests/Level9";
import Manor from "./quests/Manor";
import StarKey from "./quests/StarKey";
import WandOfNagamar from "./quests/WandOfNagamar";

const QuestSection = () => {
  const showStandardQuests =
    inRun() &&
    myPath() !== $path`Community Service` &&
    myPath() !== $path`Grey Goo` &&
    myBasestat($stat`Muscle`) > 0; // Not Astral Spirit
  return (
    <TileSection
      name="Quests"
      tiles={[
        ...(showStandardQuests
          ? [
              Level1,
              Zootomist,
              Leveling,
              Delay,
              Manor,
              Level2,
              Level3,
              Level4,
              Level5,
              Level6,
              Level7,
              Level8,
              Level9,
              Level10,
              HiddenTemple,
              Level11,
              Island,
              Level12,
              HeroKeys,
              DigitalKey,
              StarKey,
              WandOfNagamar,
              Level13,
            ]
          : [Manor]),
      ]}
    />
  );
};

export default QuestSection;
