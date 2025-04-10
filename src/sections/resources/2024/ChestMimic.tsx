import { Strong } from "@chakra-ui/react";
import { numericModifier } from "kolmafia";
import { $familiar, $item, clamp, get, have } from "libram";

import ItemButtons from "../../../components/ItemButtons";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

const ChestMimic = () => {
  const chestMimic = $familiar`Chest Mimic`;
  const mimicEgg = $item`mimic egg`;

  if (!haveUnrestricted(chestMimic)) return null;

  const famExperienceGain = numericModifier("familiar experience") + 1;
  const chestExperience = chestMimic.experience;
  const famExpNeededForNextEgg = 50 - (chestExperience % 50);
  const fightsForNextEgg =
    famExperienceGain > 0
      ? plural(Math.ceil(famExpNeededForNextEgg / famExperienceGain), "fight")
      : "cannot get";
  const mimicEggsLeft = clamp(11 - get("_mimicEggsObtained"), 0, 11);

  return (
    <Tile linkedContent={chestMimic}>
      <Line>
        Currently have <Strong>{chestExperience}</Strong> experience, currently
        gain <Strong>{famExperienceGain}</Strong> fam exp per fight.
      </Line>
      <Line>
        Need <Strong>{famExpNeededForNextEgg}</Strong> more famxp for next egg (
        {fightsForNextEgg}).
      </Line>
      <Line>
        Can lay <Strong>{mimicEggsLeft}</Strong> more eggs today.
      </Line>
      {have(mimicEgg) && (
        <Line>
          Fight some copies. <ItemButtons linkedContent={mimicEgg} />
        </Line>
      )}
    </Tile>
  );
};

export default ChestMimic;
