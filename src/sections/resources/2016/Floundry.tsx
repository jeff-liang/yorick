import { Text } from "@chakra-ui/react";
import { canEquip } from "kolmafia";
import { $item, $skill, get, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inRun } from "../../../util/quest";

const ClanFloundry = () => {
  const vipAvailable = haveUnrestricted($item`Clan VIP Lounge key`);

  // Early exits if conditions aren't met
  if (!vipAvailable) return null;
  if (!inRun()) return null;

  // Check if we already have any of the floundry items
  const floundryItems = [
    $item`bass clarinet`,
    $item`fish hatchet`,
    $item`carpe`,
    $item`codpiece`,
    $item`troutsers`,
    $item`tunac`,
  ];

  if (floundryItems.some((item) => have(item))) return null;

  const torsoAware = have($skill`Torso Awareness`);
  const canEquipWeapons = canEquip($item`bass clarinet`);
  const bridgeComplete = get("chasmBridgeProgress") >= 30;

  return (
    <Tile
      header="Rent Floundry Equipment"
      imageUrl="/images/itemimages/fishhatchet.gif"
      href="/clan_viplounge.php?action=floundry"
    >
      {canEquipWeapons && (
        <>
          <Line>
            <Text as="b">Bass Clarinet (Ranged Weapon):</Text> -10% combat,
            +100% moxie, -3 MP skill cost, +50 ranged damage.
          </Line>
          <Line>
            <Text as="b">Fish Hatchet (Weapon):</Text> -10% combat, +100%
            muscle, +5 familiar weight, +50 weapon damage
            {!bridgeComplete && ", +5 bridge progress"}.
          </Line>
        </>
      )}
      <Line>
        <Text as="b">Codpiece (Acc):</Text> -10% combat, +100% myst, +100 max
        MP, +50 spell damage{!get("oilPeakLit") && ", 8 bubblin' crudes"}.
      </Line>
      <Line>
        <Text as="b">Carpe (Back):</Text> +combat, +50% meat, +50% myst, regen
        ~8 MP.
      </Line>
      {torsoAware && (
        <Line>
          <Text as="b">Tunac (Shirt):</Text> +combat, +25 ML, +25% item, +50%
          muscle.
        </Line>
      )}
      <Line>
        <Text as="b">Troutsers (Pants):</Text> +50% moxie, +50% pickpocket, +5
        all res, +11 prismatic damage.
      </Line>
    </Tile>
  );
};

export default ClanFloundry;
