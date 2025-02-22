import { List } from "@chakra-ui/react";
import { Familiar, myClass, myLevel } from "kolmafia";
import { $class, $familiars, get } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
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
  if (myClass() !== $class`Zootomist` || myLevel() >= 13) return null;

  const head = get("zootGraftedHeadFamiliar");
  const shoulders = [
    get("zootGraftedShoulderLeftFamiliar"),
    get("zootGraftedShoulderRightFamiliar"),
  ];
  const butt = [get("zootGraftedButtCheekLeftFamiliar"), get("zoot")];
  const headShouldersButt = truthy([head, ...shoulders, ...butt]);

  const suggestedHead =
    $familiars`Mechanical Songbird, Exotic Parrot, Baby Z-Rex, Smiling Rat, Jumpsuited Hound Dog, Ragamuffin Imp`
      .filter(haveUnrestricted)
      .slice(0, 6 - headShouldersButt.length);
  const suggestedLeftNipple = filterHave({
    "-combat": $familiars`Scary Death Orb, Stab Bat, Syncopated Turtle`,
    "fam xp": $familiars`Stab Bat, Syncopated Turtle, Ragamuffin Imp`,
    item: $familiars`Stab Bat, Syncopated Turtle, Mechanical Songbird, Scary Death Orb`,
  });
  const suggestedRightNipple = filterHave({
    "+combat": $familiars`Syncopated Turtle, Stinky Gravy Fairy, Topiary Skunk, Killer Bee`,
    "fam xp": $familiars`Killer Bee, Mosquito`,
    item: $familiars`Ragamuffin Imp, Misshapen Animal Skeleton, Ghuol Whelp`,
  });

  const suggestedLeftKick = $familiars`Quantum Entangler, Foul Ball`.filter(
    haveUnrestricted,
  );
  const suggestedRightKick = $familiars`Phantom Limb, Dire Cassava`.filter(
    haveUnrestricted,
  );

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
