import { Box, List, Strong } from "@chakra-ui/react";
import {
  haveEquipped,
  inebrietyLimit,
  itemAmount,
  myInebriety,
} from "kolmafia";
import { $item, get } from "libram";
import { getHashIfAvailable } from "tome-kolmafia-lib";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";

const TinyStillsuit = () => {
  const tinyStillsuit = $item`tiny stillsuit`;
  const haveStillsuit = haveUnrestricted(tinyStillsuit);
  const haveStillsuitEquipped = haveEquipped(tinyStillsuit);
  const haveStillsuitInInventory = itemAmount(tinyStillsuit) > 0;
  const familiarSweat = get("familiarSweat");
  const sweatAdvs = Math.round(Math.pow(familiarSweat, 0.4));

  const getSweatCalcSweat = (sweat: number) => {
    if (sweat >= 358) return 449;
    if (sweat >= 279) return 358;
    if (sweat >= 211) return 279;
    if (sweat >= 155) return 211;
    if (sweat >= 108) return 155;
    if (sweat >= 71) return 108;
    if (sweat >= 43) return 71;
    if (sweat >= 23) return 43;
    if (sweat >= 10) return 23;
    return 10;
  };

  const sweatCalcSweat = getSweatCalcSweat(familiarSweat);
  const canGuzzleSweat = myInebriety() < inebrietyLimit();

  useNag(
    () => ({
      id: "tiny-stillsuit-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/stillsuit.gif",
      node: haveStillsuit && canGuzzleSweat && sweatAdvs >= 8 && (
        <Tile
          header={`${sweatAdvs} adv stillsuit sweat booze`}
          id="tiny-stillsuit-nag"
          href={`/inventory.php?action=distill&pwd=${getHashIfAvailable()}`}
          imageUrl="/images/itemimages/stillsuit.gif"
        >
          {familiarSweat > 449 ? (
            <>
              <Line>
                <Strong color="red.solid">{sweatAdvs}</Strong> advs when
                guzzling now (costs 1 liver).
              </Line>
              <Line>You should probably guzzle your sweat now.</Line>
            </>
          ) : (
            <Line>
              <Strong>
                {familiarSweat}/{sweatCalcSweat}
              </Strong>{" "}
              drams of stillsuit sweat for next adventure (
              {Math.ceil((sweatCalcSweat - familiarSweat) / 3)} combats on
              current familiar).
            </Line>
          )}
          {haveStillsuitEquipped && (
            <Line color="purple.solid">
              Currently collecting sweat from current familiar!
            </Line>
          )}
          {!haveStillsuitEquipped && haveStillsuitInInventory && (
            <Line color="red.solid">
              Not collecting sweat from any familiar right now.
            </Line>
          )}
          {!haveStillsuitEquipped && !haveStillsuitInInventory && (
            <Line color="fuchsia.solid">
              Currently collecting sweat on a different familiar!
            </Line>
          )}
        </Tile>
      ),
    }),
    [
      canGuzzleSweat,
      familiarSweat,
      haveStillsuit,
      haveStillsuitEquipped,
      haveStillsuitInInventory,
      sweatAdvs,
      sweatCalcSweat,
    ],
  );

  const advDramsTable: Record<number, number> = {
    3: 10,
    4: 23,
    5: 43,
    6: 71,
    7: 108,
    8: 155,
    9: 211,
    10: 279,
    11: 358,
    12: 449,
    13: 553,
    14: 670,
    15: 801,
    16: 946,
    17: 1106,
    18: 1282,
  };

  if (!haveStillsuit) return null;

  return (
    <Tile
      header={`${familiarSweat}/${sweatCalcSweat} drams of stillsuit sweat`}
      linkedContent={tinyStillsuit}
      href={`/inventory.php?action=distill&pwd=${getHashIfAvailable()}`}
    >
      {familiarSweat > 358 ? (
        <>
          <Line>
            <Strong>11</Strong> advs when guzzling now (costs 1 liver).
          </Line>
          <Line>You should probably guzzle your sweat now.</Line>
        </>
      ) : familiarSweat > 10 ? (
        <>
          <Line>
            <Strong>{sweatAdvs}</Strong> advs when guzzling now (costs 1 liver).
          </Line>
          <Line>
            <Strong>{sweatCalcSweat - familiarSweat}</Strong> more sweat until
            +1 more adventure. (
            {Math.ceil((sweatCalcSweat - familiarSweat) / 3)} combats on current
            familiar)
          </Line>
        </>
      ) : (
        <>
          <Line color="red.solid">Not enough sweat to guzzle.</Line>
          <Line>
            <Strong>{sweatCalcSweat - familiarSweat}</Strong> more sweat until
            +1 more adventure. (
            {Math.ceil((sweatCalcSweat - familiarSweat) / 3)} combats on current
            familiar)
          </Line>
        </>
      )}
      {haveStillsuitEquipped && (
        <Line color="purple.solid">
          Currently collecting sweat from current familiar!
        </Line>
      )}
      {haveStillsuitInInventory && (
        <Line color="red.solid">
          Not collecting sweat from any familiar right now.
        </Line>
      )}
      {!haveStillsuitEquipped && !haveStillsuitInInventory && (
        <Line color="fuchsia.solid">
          Currently collecting sweat on a different familiar!
        </Line>
      )}
      <Box>
        <AdviceTooltipText
          advice={
            <List.Root>
              {Object.entries(advDramsTable).map(
                ([advs, drams]) =>
                  drams > familiarSweat && (
                    <List.Item key={advs}>
                      {advs} advs: {drams} drams ({drams - familiarSweat} more
                      sweat)
                    </List.Item>
                  ),
              )}
              {familiarSweat > 553 && (
                <List.Item>
                  {" "}
                  13 advs: ... y'know, you should probably just drink it, buddy.
                </List.Item>
              )}
            </List.Root>
          }
        >
          Sweat/Advs
        </AdviceTooltipText>{" "}
        •{" "}
        <AdviceTooltipText
          advice={
            <List.Root>
              <List.Item>Cubeling / Stomping Boots: +item</List.Item>
              <List.Item>
                Levitating Potato / Candy Carnie / Flan: +item and +food
              </List.Item>
              <List.Item>
                Star Starfish / Emilio / Globmule / Waifuton: +item and +sleaze
              </List.Item>
            </List.Root>
          }
        >
          Suggested Familiars
        </AdviceTooltipText>
      </Box>
    </Tile>
  );
};

export default TinyStillsuit;
