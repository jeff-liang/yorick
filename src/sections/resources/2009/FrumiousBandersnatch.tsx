import { Effect, isUnrestricted, myFamiliar, numericModifier } from "kolmafia";
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
import { NagPriority } from "../../../contexts/NagContext";
import useMaxObservedWeight from "../../../hooks/useMaxObservedWeight";
import useNag from "../../../hooks/useNag";
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
  const current = myFamiliar();
  const bander = $familiar`Frumious Bandersnatch`;
  const boots = $familiar`Pair of Stomping Boots`;
  const familiar = [bander, boots].includes(current)
    ? current
    : have(bander) &&
        bander.experience > boots.experience &&
        have($skill`The Ode to Booze`)
      ? bander
      : boots;
  const maxObservedWeight = useMaxObservedWeight(familiar);

  if (!have(familiar)) return null;

  const needOde =
    have($skill`The Ode to Booze`) && !have($effect`Ode to Booze`);

  useNag(
    () => ({
      id: "bandersnatch-nag",
      priority: NagPriority.ERROR,
      imageUrl: "/images/itemimages/odetobooze.gif",
      node: current === bander && needOde && (
        <Tile
          header="Cast Ode to Booze"
          imageUrl="/images/itemimages/odetobooze.gif"
        >
          <Line command="cast Ode to Booze">
            Make sure you have Ode before adventuring!
          </Line>
        </Tile>
      ),
    }),
    [bander, current, needOde],
  );

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
