import { List, Text } from "@chakra-ui/react";
import { availableAmount, myHash, totalTurnsPlayed } from "kolmafia";
import { $item, get, getTodaysHolidayWanderers, have } from "libram";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";

const MrStore2002Catalog = () => {
  const spookyVHSTape = $item`Spooky VHS Tape`;
  const loathingIdolMicrophone = $item`Loathing Idol Microphone`;
  const flashLiquidizerUltraDousingAccessory = $item`Flash Liquidizer Ultra Dousing Accessory`;
  const proSkateboard = $item`pro skateboard`;

  const nextVHSTurn = get("spookyVHSTapeMonsterTurn") + 8;
  const nextVHSTimer = nextVHSTurn - totalTurnsPlayed();
  const imageName = get("spookyVHSTapeMonster");
  const mr2002Credits =
    get("availableMrStore2002Credits") +
    3 * +!get("_2002MrStoreCreditsCollected");
  const availableVHSes = availableAmount(spookyVHSTape);
  const mcTwistUsed = get("_epicMcTwistUsed");
  const fludaDousesLeft = Math.max(3 - get("_douseFoeUses"), 0);

  const holidayTracker = getTodaysHolidayWanderers();
  const warnings = [];

  if (holidayTracker.length > 0) {
    warnings.push(
      "Be careful -- Borrachos & Feast of Boris wanderers can show up instead of your VHS wanderer.",
    );
  }

  if (get("breathitinCharges") > 0) {
    warnings.push(
      "Breathitin is active; avoid putting your VHS wanderer outdoors, the wanderer is already free!",
    );
  }

  const vhsOptions = [
    "War monsters; especially GROPs",
    "Giant swarm of ghuol whelps",
    "Ninja snowman assassin",
    "Quiet Healer",
    "Burly Sidekick",
  ];

  const mcTwistOptions = [
    "a dairy goat",
    "a hedge trimmer monster",
    "an evil eye monster",
    "a Green Ops Soldier",
    "a tomb rat king",
  ];

  const fludaOptions = ["goat cheese", "filthworm sweat glands"];

  if (!haveUnrestricted($item`2002 Mr. Store Catalog`) || mr2002Credits <= 0) {
    return null;
  }

  return (
    <Tile
      header="2002 Mr. Store"
      imageUrl="/images/itemimages/2002catalog.gif"
      href={`inv_use.php?pwd=${myHash()}&which=3&whichitem=${haveUnrestricted($item`Replica 2002 Mr. Store Catalog`) ? "11280" : "11257"}`}
    >
      <Line>{mr2002Credits} 2002 Mr. Store credits.</Line>
      {mr2002Credits > 0 && (
        <>
          <Line>Spend credits on prehistoric IotMs!</Line>
          <List.Root>
            {!have(flashLiquidizerUltraDousingAccessory) && (
              <List.Item>
                Flash Liquidizer Ultra Dousing Accessory: +3 BLARTpockets
              </List.Item>
            )}
            {!have(proSkateboard) && (
              <List.Item>Pro skateboard: +1 duplicate</List.Item>
            )}
            {!have($item`Letter from Carrie Bradshaw`) &&
              !have($item`red-soled high heels`) && (
                <List.Item>
                  Letter from Carrie Bradshaw: +50% booze drop accessory
                </List.Item>
              )}
            {availableAmount(loathingIdolMicrophone) < 69420 && (
              <List.Item>
                Loathing Idol Microphone: +100% init, +50% items, +5% combat; 4
                uses
              </List.Item>
            )}
            {availableAmount(spookyVHSTape) < 69420 && (
              <List.Item>
                Spooky VHS Tape: wandering freekill YR of the monster you used
                it on; try GROPs!
              </List.Item>
            )}
          </List.Root>
        </>
      )}
      {availableVHSes > 0 && haveUnrestricted(spookyVHSTape) && (
        <>
          <Line>
            Have {availableVHSes} VHS tapes. Use to free-copy into delay &
            guarantee drops from:
          </Line>
          <List.Root>
            {vhsOptions.map((option, index) => (
              <List.Item key={index}>{option}</List.Item>
            ))}
          </List.Root>
        </>
      )}
      {have(loathingIdolMicrophone) && (
        <Line>
          Have {availableAmount(loathingIdolMicrophone)} Loathing Idol
          microphone uses. (50% item, 5% com, or 100% init.)
        </Line>
      )}
      {have(proSkateboard) && !mcTwistUsed && (
        <Line>
          Can Epic McTwist to double drops! Consider using on:{" "}
          {mcTwistOptions.join(", ")}.
        </Line>
      )}
      {have(flashLiquidizerUltraDousingAccessory) && fludaDousesLeft > 0 && (
        <Line>
          Can waterpocket {fludaDousesLeft} more foes with FLUDA. Try stealing
          some {fludaOptions.join(" or ")}.
        </Line>
      )}
      {imageName && (
        <Line>
          {nextVHSTurn <= totalTurnsPlayed() ? (
            <Text as="span" color="red.solid" fontWeight="bold">
              Spooky VHS: {imageName.name} now
            </Text>
          ) : nextVHSTurn - 1 === totalTurnsPlayed() ? (
            <Text as="span" color="blue.solid">
              Spooky VHS: {imageName.name} in 1 more adv
            </Text>
          ) : (
            <AdviceTooltipText
              advice={`${nextVHSTimer} adventures until your free fight YR VHS fight.`}
              children={`Spooky VHS: ${imageName}`}
            />
          )}
        </Line>
      )}
      {warnings.map((warning, index) => (
        <Line key={index} color="red.solid">
          ➾ {warning}
        </Line>
      ))}
    </Tile>
  );
};

export default MrStore2002Catalog;
