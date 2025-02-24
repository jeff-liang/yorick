import { List } from "@chakra-ui/react";
import { Familiar, myClass, myFamiliar, myLevel } from "kolmafia";
import { $class, $effect, $familiar, $familiars, get, have } from "libram";
import { FC, useMemo } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { NagPriority } from "../../contexts/NagContext";
import useNag from "../../hooks/useNag";
import { haveUnrestricted } from "../../util/available";
import { commaSeparate, plural, separate, truthy } from "../../util/text";

function filterHave(
  obj: Record<string, Familiar[]>,
): Record<string, Familiar[]> {
  return Object.fromEntries(
    Object.entries(obj).map(([tag, familiars]) => [
      tag,
      familiars.filter(haveUnrestricted),
    ]),
  );
}

function familiarsWithGoals(header: string, goals: Record<string, Familiar[]>) {
  return (
    Object.values(goals).some((x) => x.length > 0) && (
      <>
        <Line>{header}:</Line>
        <List.Root>
          {Object.entries(goals)
            .filter(([, familiars]) => familiars.length > 0)
            .map(([goal, familiars]) => (
              <List.Item key={goal}>
                {goal}: {commaSeparate(familiars)}.
              </List.Item>
            ))}
        </List.Root>
      </>
    )
  );
}

const Zootomist: FC = () => {
  const enable = myClass() === $class`Zootomist`;

  const yrFamiliars = $familiars`Quantum Entangler, Foul Ball`;
  const banishFamiliars = $familiars`Phantom Limb, Dire Cassava`;
  const leftFoot = get("zootGraftedFootLeftFamiliar");
  const rightFoot = get("zootGraftedFootRightFamiliar");
  const hasYR =
    leftFoot && yrFamiliars.includes(leftFoot)
      ? "left"
      : rightFoot && yrFamiliars.includes(rightFoot)
        ? "right"
        : null;
  const hasBanish =
    leftFoot && banishFamiliars.includes(leftFoot)
      ? "left"
      : rightFoot && banishFamiliars.includes(rightFoot)
        ? "right"
        : null;
  const feet = useMemo(
    () => ({ left: leftFoot, right: rightFoot }),
    [leftFoot, rightFoot],
  );
  const hasELY = have($effect`Everything Looks Yellow`);
  const hasELB = have($effect`Everything Looks Blue`);

  useNag(
    () => ({
      id: "zootomist-ely-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl:
        hasYR && feet[hasYR] ? `/images/itemimages/${feet[hasYR].image}` : "",
      node: enable && hasYR && feet[hasYR] && !hasELY && (
        <Tile
          header={`Use ${hasYR} kick YR`}
          imageUrl={`/images/itemimages/${feet[hasYR].image}`}
        >
          <Line color={"yellow.700"} _dark={{ color: "yellow.300" }}>
            Free kill and force monster drops.
          </Line>
        </Tile>
      ),
    }),
    [enable, feet, hasELY, hasYR],
  );

  useNag(
    () => ({
      id: "zootomist-elb-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl:
        hasBanish && feet[hasBanish]
          ? `/images/itemimages/${feet[hasBanish].image}`
          : "",
      node: enable && hasBanish && feet[hasBanish] && !hasELB && (
        <Tile
          header={`Use ${hasBanish} kick banish`}
          imageUrl={`/images/itemimages/${feet[hasBanish].image}`}
        >
          <Line color="blue.solid">
            Free fight and banish monster for 100 turns.
          </Line>
        </Tile>
      ),
    }),
    [enable, feet, hasBanish, hasELB],
  );

  if (!enable || myLevel() >= 13) return null;

  const head = get("zootGraftedHeadFamiliar");
  const shoulders = [
    get("zootGraftedShoulderLeftFamiliar"),
    get("zootGraftedShoulderRightFamiliar"),
  ];
  const butt = [
    get("zootGraftedButtCheekLeftFamiliar"),
    get("zootGraftedButtCheekRightFamiliar"),
  ];
  const headShouldersButt = truthy([head, ...shoulders, ...butt]);

  const suggestedHead =
    $familiars`Mechanical Songbird, Exotic Parrot, Baby Z-Rex, Smiling Rat, Jumpsuited Hound Dog, Ghuol Whelp, Ragamuffin Imp`
      .filter(haveUnrestricted)
      .slice(0, 6 - headShouldersButt.length);
  const suggestedLeftNipple = filterHave({
    "-combat": $familiars`Scary Death Orb, Stab Bat, Syncopated Turtle`,
    "fam xp": $familiars`Stab Bat, Syncopated Turtle, Ragamuffin Imp`,
    item: $familiars`Stab Bat, Syncopated Turtle, Mechanical Songbird, Scary Death Orb`,
  });
  const suggestedRightNipple = filterHave({
    "+combat": $familiars`Syncopated Turtle, Stinky Gravy Fairy, Topiary Skunk`,
    "fam xp": $familiars`Killer Bee, Mosquito`,
    item: $familiars`Ragamuffin Imp, Misshapen Animal Skeleton, Ghuol Whelp`,
  });

  const suggestedLeftKick = yrFamiliars.filter(haveUnrestricted);
  const suggestedRightKick = banishFamiliars.filter(haveUnrestricted);

  const currentXp = myFamiliar().experience;
  const threshold = (myLevel() + 2) ** 2;

  return (
    <Tile
      header="Z is for Zootomist"
      imageUrl="/images/adventureimages/zootomist.gif"
      href="/place.php?whichplace=graftinglab"
      linkEntireTile
    >
      <Line>
        Graft {plural(12 - myLevel(), "additional familiar")} to yourself to hit
        level 13.
      </Line>
      {myFamiliar() !== $familiar`none` &&
        (currentXp < threshold ? (
          <Line>
            Need {threshold - currentXp} XP on {myFamiliar().identifierString}{" "}
            to graft.
          </Line>
        ) : (
          <Line fontWeight="bold">
            Could graft {myFamiliar().identifierString} now!
          </Line>
        ))}
      {!get("zootGraftedNippleLeftFamiliar") &&
        familiarsWithGoals("Left Nipple", suggestedLeftNipple)}
      {!get("zootGraftedNippleRightFamiliar") &&
        familiarsWithGoals("Right Nipple", suggestedRightNipple)}
      {!get("zootGraftedFootLeftFamiliar") && suggestedLeftKick.length > 0 && (
        <Line>Left Kick (free YR): {commaSeparate(suggestedLeftKick)}.</Line>
      )}
      {!get("zootGraftedFootRightFamiliar") &&
        suggestedRightKick.length > 0 && (
          <Line>
            Right Kick (free banish): {commaSeparate(suggestedRightKick)}.
          </Line>
        )}
      {headShouldersButt.length < 5 && suggestedHead.length > 0 && (
        <Line>
          {separate(
            [
              !head && "Head",
              shoulders.some((s) => !s) && "Shoulders",
              butt.some((b) => !b) && "Butt",
            ],
            "/",
          )}
          : {commaSeparate(suggestedHead)}.
        </Line>
      )}
    </Tile>
  );
};

export default Zootomist;
