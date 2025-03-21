import { haveEquipped } from "kolmafia";
import { $effect, $item, $location, get, have, questStep } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { inventoryLink, parentPlaceLink } from "../../util/links";
import { atStep, Step } from "../../util/quest";
import { plural } from "../../util/text";

const Level5: FC = () => {
  const step = questStep("questL05Goblin");

  const turnsSpent = $location`The Outskirts of Cobb's Knob`.turnsSpent;
  const haveKey = have($item`Knob Goblin Encryption Key`);
  const veil = $item`Knob Goblin harem veil`;
  const pants = $item`Knob Goblin harem pants`;
  const outfit = have(veil) && have(pants);
  const havePerfume = have($item`Knob Goblin perfume`);
  const havePerfumeEffect = have($effect`Knob Goblin Perfume`);
  const equippedOutfit = haveEquipped(veil) && haveEquipped(pants);
  const haveFireExtinguisher = have($item`industrial fire extinguisher`);
  const fireExtinguisherCharge = get("_fireExtinguisherCharge");
  const haremExtinguished = get("fireExtinguisherHaremUsed");

  if (step === Step.FINISHED) return null;

  return (
    <QuestTile
      header="Knob Goblin King"
      imageUrl="/images/adventureimages/cobbsknob.gif"
      href={
        step >= 1
          ? parentPlaceLink($location`Cobb's Knob Harem`)
          : parentPlaceLink($location`The Outskirts of Cobb's Knob`)
      }
      minLevel={haveKey ? 5 : undefined}
    >
      {step < 1 && turnsSpent < 10 && !haveKey ? (
        <Line>
          Burn {plural(10 - turnsSpent, "turn")} of delay in the Outskirts to
          find the encryption key.
        </Line>
      ) : (
        atStep(step, [
          [Step.UNSTARTED, <Line>Visit Council to start quest.</Line>],
          [
            Step.STARTED,
            !haveKey ? (
              <Line>
                Adventure in the Outskirts to find the encryption key.
              </Line>
            ) : (
              <Line command="use Cobb's Knob map">
                Use Cobb's Knob map to go inside.
              </Line>
            ),
          ],
          [
            1,
            !outfit ? (
              <>
                <Line>Acquire the Harem Girl Disguise.</Line>
                {haveFireExtinguisher &&
                  fireExtinguisherCharge >= 20 &&
                  !haremExtinguished && (
                    <Line fontWeight={"bold"}>
                      Use Fire Extinguisher: Foam the Place in Harem for free
                      disguise.
                    </Line>
                  )}
                {!havePerfume && (
                  <Line>Get perfume if you can from a Knob Goblin Madam.</Line>
                )}
              </>
            ) : !equippedOutfit ? (
              <Line href={inventoryLink("Knob Goblin harem")}>
                Equip the Harem Girl Disguise.
              </Line>
            ) : !havePerfumeEffect ? (
              havePerfume ? (
                <Line href={inventoryLink($item`Knob Goblin perfume`)}>
                  Use Knob Goblin perfume to get effect.
                </Line>
              ) : (
                <Line href={parentPlaceLink($location`Cobb's Knob Harem`)}>
                  Adventure in the Harem to get the Knob Goblin Perfume effect.
                </Line>
              )
            ) : (
              <Line>Fight the Knob Goblin King!</Line>
            ),
          ],
        ])
      )}
    </QuestTile>
  );
};

export default Level5;
