import { Effect, isUnrestricted, numericModifier } from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $skill,
  get,
  have,
  sum,
  Witchess,
} from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import useMaxObservedWeight from "../../../hooks/useMaxObservedWeight";
import { haveUnrestricted } from "../../../util/available";
import { commaSeparate, plural } from "../../../util/text";

const LIMITED_BUFFS: [string, Effect, () => boolean][] = [
  [
    "Witchess",
    $effect`Puzzle Champ`,
    () => Witchess.have() && !get("_witchessBuff"),
  ],
  [
    "LOV",
    $effect`Open Heart Surgery`,
    () =>
      get("loveTunnelAvailable") &&
      isUnrestricted($item`LOV Entrance Pass`) &&
      !get("_loveTunnelUsed"),
  ],
  [
    "fortune",
    $effect`A Girl Named Sue`,
    () =>
      haveUnrestricted($item`Clan VIP Lounge key`) &&
      !get("_clanFortuneBuffUsed"),
  ],
  [
    "pool",
    $effect`Billiards Belligerence`,
    () => haveUnrestricted($item`Clan VIP Lounge key`) && get("_poolGames") < 3,
  ],
];

const FrumiousBandersnatch = () => {
  const bander = $familiar`Frumious Bandersnatch`;
  const boots = $familiar`Pair of Stomping Boots`;
  const familiar =
    have(bander) && bander.experience > boots.experience ? bander : boots;
  const maxObservedWeight = useMaxObservedWeight(familiar);

  if (!have(familiar)) return null;

  const availableBuffs = LIMITED_BUFFS.filter(
    ([, effect, available]) => !have(effect) && available(),
  );
  const possibleWeight = sum(availableBuffs, ([, effect]) =>
    numericModifier(effect, "Familiar Weight"),
  );

  const runs = get("_banderRunaways");
  const maxRuns = Math.floor(maxObservedWeight / 5);
  const maxPossibleRuns = Math.floor((maxObservedWeight + possibleWeight) / 5);
  return (
    <Tile
      header={familiar === bander ? "Bandersnatch Runaways" : "Boots Runaways"}
      id="bander-runs-resource"
      imageUrl={`/images/itemimages/${familiar.image}`}
    >
      {familiar.experience < 400 &&
        have($skill`Cannelloni Cannon`) &&
        have($skill`Flavour of Magic`) && (
          <Line>
            {familiar.experience} {familiar === boots ? "boots" : "bander"} XP.
            Tune Cannelloni Cannon to monster element and use repeatedly for XP.
            {/* TODO: add specific target suggestions */}
          </Line>
        )}
      <Line>
        Used {plural(runs, "run")} out of at least {maxRuns} possible (at{" "}
        {maxObservedWeight} lbs).
      </Line>
      {possibleWeight > 0 && (
        <Line>
          Could get +{possibleWeight} lbs from buffs (
          {commaSeparate(availableBuffs.map(([name]) => name))}).
        </Line>
      )}
      {haveUnrestricted($skill`Meteor Shower`) &&
        get("_meteorShowerUses") < 5 &&
        runs < maxPossibleRuns + 4 && (
          <Line>
            Meteor Shower in combat for up to{" "}
            {plural(
              Math.min(
                4,
                4 + maxPossibleRuns - runs,
                5 - get("_meteorShowerUses"),
              ),
              "more run",
            )}
            .
          </Line>
        )}
    </Tile>
  );
};

export default FrumiousBandersnatch;
