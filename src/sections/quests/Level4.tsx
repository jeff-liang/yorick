import { haveEquipped } from "kolmafia";
import {
  $item,
  $location,
  BooleanProperty,
  get,
  have,
  questStep,
} from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { atStep, Step } from "../../util/quest";
import { commaAnd, plural } from "../../util/text";

interface BatWingLocation {
  name: string;
  pref: BooleanProperty;
  item: string;
}

const BAT_WINGS_LOCATIONS: BatWingLocation[] = [
  {
    name: "the Bat Hole Entrance",
    pref: "batWingsBatHoleEntrance",
    item: "bat wing",
  },
  {
    name: "Guano Junction",
    pref: "batWingsGuanoJunction",
    item: "sonar-in-a-biscuit",
  },
  {
    name: "the Batrat Burrow",
    pref: "batWingsBatratBurrow",
    item: "sonar-in-a-biscuit",
  },
  {
    name: "the Beanbat Chamber",
    pref: "batWingsBeanbatChamber",
    item: "enchanted bean",
  },
];

const Level4: FC = () => {
  const step = questStep("questL04Bat");
  const bodyguards = $location`The Boss Bat's Lair`.turnsSpent;
  const beanstalk = questStep("questL10Garbage") >= 1;

  if (step === Step.FINISHED) return null;

  const batWings = $item`bat wings`;
  const haveBatWings = have(batWings);
  const haveBatWingsEquipped = haveEquipped(batWings);
  const availableLocations = BAT_WINGS_LOCATIONS.filter(
    ({ pref }) => !get(pref),
  );

  return (
    <QuestTile
      header="Explore the Bat Hole"
      imageUrl="/images/adventureimages/bossbat.gif"
      href={atStep(step, [
        [Step.UNSTARTED, "/council.php"],
        [Step.STARTED, "/place.php?whichplace=bathole"],
        [4, "/council.php"],
      ])}
      minLevel={4}
    >
      {step >= 0 && !have($item`enchanted bean`) && !beanstalk && (
        <Line>
          Get an enchanted bean from{" "}
          {haveBatWings ? "bat wings NC" : "a beanbat"} for the level 10 quest.
        </Line>
      )}
      {haveBatWings && availableLocations.length > 0 && (
        <Line>
          {haveBatWingsEquipped
            ? "Equip bat wings and adventure "
            : "Adventure"}{" "}
          for stuff in{" "}
          {commaAnd(
            availableLocations.map(({ name, item }) => `${name} (${item})`),
          )}
          .
        </Line>
      )}
      {atStep(step, [
        [Step.UNSTARTED, <Line>Visit Council to start quest.</Line>],
        [
          Step.STARTED,
          <Line>
            Blow down {plural(3 - step, "bat hole wall")} by fighting Screambats
            or using sonars-in-a-biscuit.
          </Line>,
        ],
        [
          3,
          <Line>
            Face the fearsome Boss Bat in his lair!{" "}
            {bodyguards < 4
              ? `You must fight at least ${Math.max(0, 4 - bodyguards)} bodyguards to find him.`
              : bodyguards === 4
                ? "Appears in the next three turns."
                : bodyguards === 5
                  ? "Appears in the next two turns."
                  : "Appears next turn."}
          </Line>,
        ],
        [4, <Line>Return to the council with news of your defeated foe.</Line>],
      ])}
    </QuestTile>
  );
};

export default Level4;
