import { ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { $item, get, have, questStep } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { Step } from "../../../util/quest";

const IndustrialFireExtinguisher = () => {
  const fireExtinguisher = $item`industrial fire extinguisher`;
  const foam = get("_fireExtinguisherCharge");

  const knobUnfinished = questStep("questL05Goblin") < Step.FINISHED;
  const knobUnused = !get("fireExtinguisherHaremUsed");
  const hasPants = have($item`Knob Goblin harem pants`);
  const hasVeil = have($item`Knob Goblin harem veil`);
  const canVisitTheThrone = hasPants && hasVeil;
  const showKnob =
    questStep("questL05Goblin") > Step.UNSTARTED &&
    !canVisitTheThrone &&
    knobUnused &&
    knobUnfinished;

  const bridgeUnfinished = questStep("questL09Topping") < 1;
  const blechUnused = !get("fireExtinguisherChasmUsed");
  const showBlech =
    questStep("questL09Topping") > Step.UNSTARTED &&
    bridgeUnfinished &&
    blechUnused;

  const batwallsUnfinished = questStep("questL04Bat") < 3;
  const batUnused = !get("fireExtinguisherBatHoleUsed");
  const showBat =
    questStep("questL04Bat") > Step.UNSTARTED &&
    batwallsUnfinished &&
    batUnused;

  const bonerUnready = [
    get("cyrptAlcoveEvilness"),
    get("cyrptCrannyEvilness"),
    get("cyrptNicheEvilness"),
    get("cyrptNookEvilness"),
  ].some((evilness) => evilness > 25);
  const cyrptUnused = !get("fireExtinguisherCyrptUsed");
  const showCyrpt =
    questStep("questL07Cyrptic") > Step.UNSTARTED &&
    bonerUnready &&
    cyrptUnused;

  const desertIncomplete = get("desertExploration") < 100;
  const desertUnused = !get("fireExtinguisherDesertUsed");
  const showDesert =
    questStep("questL11Desert") > Step.UNSTARTED &&
    desertIncomplete &&
    desertUnused;

  if (!haveUnrestricted(fireExtinguisher) || foam <= 0) {
    return null;
  }

  return (
    <Tile linkedContent={fireExtinguisher}>
      <Line>
        {`${foam} foam (${Math.floor(foam / 10)} polar
        vortices).`}
      </Line>
      {foam >= 20 && (
        <UnorderedList>
          {showBat && (
            <ListItem>
              <Text as="b">Constricted Blast</Text>: Unlock a Bat Hole chamber.
            </ListItem>
          )}
          {showKnob && (
            <ListItem>
              <Text as="b">Foam the Place</Text>: Obtain the Knob Harem Outfit.
            </ListItem>
          )}
          {showCyrpt && (
            <ListItem>
              <Text as="b">Replace the Chill</Text>: Reduce evil by 10 in a
              zone.
            </ListItem>
          )}
          {showBlech && (
            <ListItem>
              <Text as="b">Cool it Down</Text>: 73% Blech House progress.
            </ListItem>
          )}
          {showDesert && (
            <ListItem>
              <Text as="b">Take a Drink</Text>: 15 turns of Ultrahydrated.
            </ListItem>
          )}
        </UnorderedList>
      )}
    </Tile>
  );
};

export default IndustrialFireExtinguisher;
