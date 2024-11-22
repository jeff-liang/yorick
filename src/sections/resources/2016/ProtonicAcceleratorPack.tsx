import { Box, Strong } from "@chakra-ui/react";
import { canAdventure, haveEquipped, myPath, totalTurnsPlayed } from "kolmafia";
import { $item, $location, $path, get, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { inRun, questStarted } from "../../../util/quest";

const ELEMENTS_TO_RESIST: Record<string, string> = {
  "Cobb's Knob Treasury": "spooky",
  "The Haunted Conservatory": "stench",
  "The Haunted Gallery": "hot",
  "The Haunted Kitchen": "cold",
  "The Haunted Wine Cellar": "sleaze",
  "The Icy Peak": "hot",
  "Inside the Palindome": "spooky",
  "Madness Bakery": "hot",
  "The Old Landfill": "stench",
  "The Overgrown Lot": "sleaze",
  "The Skeleton Store": "spooky",
  "The Smut Orc Logging Camp": "spooky",
  "The Spooky Forest": "spooky",
} as const;

const ProtonicAcceleratorPack = () => {
  const protonPack = $item`protonic accelerator pack`;
  const haveProtonPack = haveUnrestricted(protonPack);
  const protonPackEquipped = haveEquipped(protonPack);
  const nextGhostTurn = get("nextParanormalActivity");
  const nextGhostTimer = nextGhostTurn - totalTurnsPlayed();
  const ghostLocation = get("ghostLocation");
  const streamsCrossed = get("_streamsCrossed");

  useNag(
    () => ({
      id: "protonic-pack-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/protonpack.gif",
      node: haveProtonPack && nextGhostTurn <= totalTurnsPlayed() && (
        <Tile header="It's ghost bustin' time!" linkedContent={protonPack}>
          {protonPackEquipped ? (
            <Line color="red.solid">Equip the protopack first.</Line>
          ) : (
            <Line color="blue.solid">Who you gonna call? You!</Line>
          )}
        </Tile>
      ),
    }),
    [haveProtonPack, nextGhostTurn, protonPack, protonPackEquipped],
  );

  useNag(
    () => ({
      id: "protonic-pack-quest-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/protonpack.gif",
      node: questStarted("questPAGhost") &&
        ghostLocation !== null &&
        haveProtonPack &&
        canAdventure(ghostLocation) && (
          <Tile
            header={`Defeat the ghost in ${ghostLocation}`}
            linkedContent={protonPack}
          >
            <Line>This won't cost a turn.</Line>
            {protonPackEquipped ? (
              <Line>Cast "shoot ghost" three times, then "trap ghost".</Line>
            ) : (
              <Line command="equip protonic accelerator pack" color="red.solid">
                Equip the protonic accelerator pack first.
              </Line>
            )}
            {ghostLocation === $location`Inside the Palindome` &&
              !haveEquipped($item`Talisman o' Namsilat`) &&
              (have($item`Talisman o' Namsilat`) ? (
                <Line command="equip Talisman o' Namsilat">
                  Equip the Talisman o' Namsilat first.
                </Line>
              ) : (
                <Line>Need Talisman o' Namsilat first.</Line>
              ))}
            {Object.entries(ELEMENTS_TO_RESIST).map(
              ([location, element]) =>
                ghostLocation?.identifierString === location && (
                  <Line key={location}>
                    <Box
                      as="span"
                      className={`r_element_${element}`}
                    >{`+${element} resist`}</Box>
                  </Line>
                ),
            )}
          </Tile>
        ),
    }),
    [ghostLocation, haveProtonPack, protonPack, protonPackEquipped],
  );

  if (
    !haveProtonPack ||
    (!(nextGhostTurn > totalTurnsPlayed()) &&
      !(!streamsCrossed && inRun() && myPath() !== $path`G-Lover`))
  ) {
    return null;
  }

  return (
    <Tile linkedContent={protonPack}>
      {nextGhostTurn > totalTurnsPlayed() && (
        <Line>{nextGhostTimer} adventures until your next protonic ghost.</Line>
      )}
      {!streamsCrossed && inRun() && myPath() !== $path`G-Lover` && (
        <>
          <Line>
            <Strong>Stream crossing available:</Strong> +20% stats for 10 turns.
          </Line>
          {!protonPackEquipped && (
            <Line>Equip the protonic accelerator pack first.</Line>
          )}
        </>
      )}
    </Tile>
  );
};

export default ProtonicAcceleratorPack;
