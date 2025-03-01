import { Strong } from "@chakra-ui/react";
import { canEquip, haveEquipped, myPath } from "kolmafia";
import { $effect, $item, $paths, $skill, clamp, get, have } from "libram";
import { FC } from "react";

import AsyncButton from "../../../components/AsyncButton";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";

const JurassicParka: FC = () => {
  const jurassicParka = $item`Jurassic Parka`;
  const haveParka = haveUnrestricted(jurassicParka);
  const parkaMode = get("parkaMode");
  const spikolodonSpikesLeft = clamp(5 - get("_spikolodonSpikeUses"), 0, 5);

  const parkaEquipped = haveEquipped(jurassicParka);
  const canEquipParka = canEquip(jurassicParka);
  const haveELY = have($effect`Everything Looks Yellow`);
  const haveFondeluge = have($skill`Fondeluge`);
  const inBadPath = $paths`Community Service, Avant Guard`.includes(myPath());

  useNag(
    () => ({
      id: "jurassic-parka-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/jparka3.gif",
      node: haveParka &&
        canEquipParka &&
        !inBadPath &&
        !haveELY &&
        !haveFondeluge && (
          <Tile
            header="Spit Jurassic Acid"
            linkedContent={jurassicParka}
            id="jurassic-parka-nag"
            extraLinks={
              parkaMode === "dilophosaur" ? null : (
                <AsyncButton command="parka dilophosaur">diloph</AsyncButton>
              )
            }
          >
            {!parkaEquipped && (
              <Line color="red.solid">Equip your Jurassic Parka!</Line>
            )}
            {parkaEquipped &&
              (parkaMode === "dilophosaur" ? (
                <Line color="fg.success">Free YR. Parka equipped.</Line>
              ) : (
                <Line color="red.solid" command="parka dilophosaur">
                  Change your parka to dilophosaur mode!
                </Line>
              ))}
          </Tile>
        ),
    }),
    [
      haveParka,
      canEquipParka,
      inBadPath,
      haveELY,
      haveFondeluge,
      jurassicParka,
      parkaMode,
      parkaEquipped,
    ],
  );

  if (!haveParka || !canEquipParka) {
    return null;
  }

  const parkaEnchantment = (() => {
    switch (parkaMode) {
      case "kachungasaur":
        return "+100% HP, +50% meat, +2 Cold res.";
      case "dilophosaur":
        return "+20 Sleaze and Sleaze Spell, +2 Stench res, YR free kill.";
      case "spikolodon":
        return "+ML, +2 Sleaze res, NC forcing ability.";
      case "ghostasaurus":
        return "+10 DR, +50 MP, +2 Spooky res.";
      case "pterodactyl":
        return "-5% Combat, +50% Initiative, +2 Hot res.";
      default:
        return "";
    }
  })();

  return (
    <Tile
      header={`Jurassic Parka${parkaMode ? ` (${parkaMode})` : ""}`}
      id="jurassic-parka-tile"
      linkedContent={jurassicParka}
    >
      <Line color="blue.solid">{parkaEnchantment}</Line>
      {spikolodonSpikesLeft > 0 && (
        <Line command="parka spikolodon">
          <Strong>{spikolodonSpikesLeft}</Strong> spikolodon spikes available.
        </Line>
      )}
    </Tile>
  );
};

export default JurassicParka;
