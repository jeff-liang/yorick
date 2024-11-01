import {
  availableAmount,
  getWorkshed,
  Item,
  mySpleenUse,
  Skill,
  spleenLimit,
} from "kolmafia";
import { $effect, $item, $items, $skill, clamp, get, have, sum } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { plural } from "../../util/text";

// Item, Skill, or [name, have()]
type Source = Item | Skill | [string, () => boolean];

function haveSource(source: Source) {
  return Array.isArray(source) ? source[1]() : have(source);
}

interface FreeKillSource {
  // What gives your account access to this free kill.
  source: Source;
  // How to immediately use this free kill source.
  thing: Item | Skill;
  caption?: () => string;
  captionPlural?: () => string;
  remaining: () => number;
}

// TODO: Add mafia middle finger ring, tennis ball

const SHERIFF_PIECES = $items`Sheriff pistol, Sheriff badge, Sheriff moustache`;
const FREE_KILL_SOURCES: FreeKillSource[] = [
  {
    source: $skill`Shattering Punch`,
    thing: $skill`Shattering Punch`,
    remaining: () => 3 - get("_shatteringPunchUsed"),
  },
  {
    source: $skill`Gingerbread Mob Hit`,
    thing: $skill`Gingerbread Mob Hit`,
    remaining: () => (get("_gingerbreadMobHitUsed") ? 0 : 1),
  },
  {
    source: $item`Asdon Martin keyfob (on ring)`,
    thing: $skill`Asdon Martin: Missile Launcher`,
    caption: () => "Missile Launcher",
    remaining: () =>
      getWorkshed() === $item`Asdon Martin keyfob (on ring)` &&
      !get("_missileLauncherUsed")
        ? 1
        : 0,
  },
  {
    source: $item`Lil' Doctor™ bag`,
    thing: $skill`Chest X-Ray`,
    remaining: () => 3 - get("_chestXRayUsed"),
  },
  {
    source: $item`replica bat-oomerang`,
    thing: $item`replica bat-oomerang`,
    remaining: () => 3 - get("_usedReplicaBatoomerang"),
  },
  {
    source: $item`Everfull Dart Holster`,
    thing: $skill`Darts: Aim for the Bullseye`,
    caption: () => "darts bullseye",
    remaining: () => (have($effect`Everything Looks Red`) ? 0 : 1),
  },
  {
    source: [
      "Sheriff Outfit",
      () => SHERIFF_PIECES.every((item) => have(item)),
    ],
    thing: $skill`Assert your Authority`,
    caption: () => "authority assertion",
    remaining: () => 3 - get("_authorityUsed", 0),
  },
  {
    source: $item`Breathitin™`,
    thing: $item`Breathitin™`,
    remaining: () =>
      clamp(
        availableAmount($item`Breathitin™`),
        0,
        Math.floor((spleenLimit() - mySpleenUse()) / 2),
      ),
  },
  {
    source: $item`powdered madness`,
    thing: $item`powdered madness`,
    remaining: () =>
      Math.min(
        availableAmount($item`powdered madness`),
        5 - get("_powderedMadnessUses"),
      ),
  },
  {
    source: $item`power pill`,
    thing: $item`power pill`,
    remaining: () =>
      Math.min(availableAmount($item`power pill`), 20 - get("_powerPillUses")),
  },
];

const FreeKills: FC = () => {
  const count = sum(FREE_KILL_SOURCES, ({ source, remaining }) =>
    haveSource(source) ? remaining() : 0,
  );
  return (
    count > 0 && (
      <Tile
        header={plural(count, "free kill")}
        id="free-kills"
        imageUrl="/images/itemimages/kneestick.gif"
      >
        {FREE_KILL_SOURCES.map(
          ({ source, thing, caption, captionPlural, remaining }) =>
            !haveSource(source) || remaining() <= 0 ? null : (
              <Line
                key={
                  Array.isArray(source) ? source[0] : source.identifierString
                }
                color={have(thing) ? undefined : "gray.500"}
              >
                {plural(
                  remaining(),
                  caption?.() ?? thing.name,
                  captionPlural?.() ??
                    ("plural" in thing ? thing.plural : `${thing.name}s`),
                )}
              </Line>
            ),
        )}
      </Tile>
    )
  );
};

export default FreeKills;
