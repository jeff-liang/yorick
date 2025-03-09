import { List } from "@chakra-ui/react";
import { canAdventure, haveEquipped } from "kolmafia";
import { $item, $location, get } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";

const BatWings: FC = () => {
  const batWings = $item`bat wings`;
  const batWingsEquipped = haveEquipped(batWings);
  const batWingSwoopsLeft = Math.max(0, 11 - get("_batWingsSwoopUsed"));
  const batWingRestsLeft = Math.max(0, 11 - get("_batWingsRestUsed"));
  const batWingFreeFightsLeft = Math.max(0, 5 - get("_batWingsFreeFights"));
  const bridge = get("chasmBridgeProgress");

  const batHoleZones = [
    {
      location: $location`The Bat Hole Entrance`,
      used: get("batWingsBatHoleEntrance"),
      reward: $item`bat wing`,
    },
    {
      location: $location`Guano Junction`,
      used: get("batWingsGuanoJunction"),
      reward: $item`sonar-in-a-biscuit`,
    },
    {
      location: $location`The Batrat and Ratbat Burrow`,
      used: get("batWingsBatratBurrow"),
      reward: $item`sonar-in-a-biscuit`,
    },
    {
      location: $location`The Beanbat Chamber`,
      used: get("batWingsBeanbatChamber"),
      reward: $item`enchanted bean`,
    },
  ];

  const availableZones = batHoleZones.filter(({ used }) => !used);

  if (!haveUnrestricted(batWings)) return null;

  return (
    <Tile linkedContent={batWings}>
      {batWingsEquipped && (
        <Line color="purple.solid">Nanananananananana Bat-like man!</Line>
      )}
      {!batWingsEquipped &&
        !canAdventure(
          $location`The Castle in the Clouds in the Sky (Basement)`,
        ) && (
          <Line color="blue.solid">
            Equip your bat wings. This saves turns in the Airship!
          </Line>
        )}
      <Line>Swoop evilpockets: {batWingSwoopsLeft} left.</Line>
      {batWingRestsLeft > 0 && (
        <Line>Rest +1000 HP/MP: {batWingRestsLeft} left.</Line>
      )}
      {batWingFreeFightsLeft > 0 && (
        <Line>Free flaps: {batWingFreeFightsLeft} left.</Line>
      )}
      {bridge >= 25 && !canAdventure($location`Oil Peak`) && (
        <Line>You can skip the rest of the bridge!</Line>
      )}
      {canAdventure($location`The Bat Hole Entrance`) &&
        availableZones.length > 0 && (
          <>
            <Line command={!batWingsEquipped ? "equip bat wings" : undefined}>
              Visit the Bat Hole zones{" "}
              {!batWingsEquipped && "with bat wings equipped "}to get:
            </Line>
            <List.Root>
              {availableZones.map(({ location, reward }) => (
                <List.Item key={location.id}>
                  {location.identifierString}: {reward.name}
                </List.Item>
              ))}
            </List.Root>
          </>
        )}
    </Tile>
  );
};

export default BatWings;
