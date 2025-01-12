import { haveEffect, isBanished, Phylum } from "kolmafia";
import { $effect, $familiar, $item, $skill, clamp, get, have } from "libram";

import AdviceTooltipIcon from "../../../components/AdviceTooltipIcon";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

const BookOfFacts = () => {
  const justTheFactsSkill = $skill`Just the Facts`;

  const habitatMonster = get("_monsterHabitatsMonster");
  const habitatMonsterName = habitatMonster?.name;
  const habitatMonsterPhylum = habitatMonster?.phylum;
  const fightsLeft = Math.max(
    0,
    Math.min(get("_monsterHabitatsFightsLeft"), 5),
  );
  const patrioticEagle = $familiar`Patriotic Eagle`;
  const eagleUsable = haveUnrestricted(patrioticEagle);
  const eaglePhylumBanished =
    get("banishedPhyla") !== ""
      ? Phylum.get(get("banishedPhyla").split(":")[0])
      : null;
  const olfactionString =
    haveUnrestricted($skill`Transcendent Olfaction`) &&
    get("_olfactionsUsed") < 3 &&
    get("olfactedMonster") !== habitatMonster
      ? ", or olfact the monster"
      : "";
  const habitatMonsterBanished = habitatMonster && isBanished(habitatMonster);

  useNag(
    () => ({
      id: "book-of-facts-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/factbook.gif",
      node:
        habitatMonster && habitatMonsterName !== "none" && fightsLeft > 0 ? (
          <Tile
            header={`Fight ${plural(fightsLeft, `habitat ${habitatMonsterName}`)}`}
            id="habitat-nag"
            imageUrl="/images/itemimages/factbook.gif"
          >
            <Line>
              Appears as a wandering monster in any zone. Try a place with few
              competing monsters{olfactionString}.
              {eagleUsable && (
                <>
                  {" "}
                  <AdviceTooltipIcon advice="Remember, you can phylum-banish with your Patriotic Eagle to make it easier!" />
                </>
              )}
            </Line>
            {eaglePhylumBanished === habitatMonsterPhylum && (
              <Line color="red.solid">
                WARNING: {habitatMonsterName}'s phylum is banished!
              </Line>
            )}
            {habitatMonsterBanished && (
              <Line color="red.solid">
                WARNING: {habitatMonsterName} is banished!
              </Line>
            )}
          </Tile>
        ) : null,
    }),
    [
      habitatMonster,
      habitatMonsterName,
      fightsLeft,
      olfactionString,
      eagleUsable,
      eaglePhylumBanished,
      habitatMonsterPhylum,
      habitatMonsterBanished,
    ],
  );

  const circadianAdv = get("_circadianRhythmsAdventures");
  const circadianPhylum = get("_circadianRhythmsPhylum");
  const recallingCircadianRhythms = $effect`Recalling Circadian Rhythms`;

  useNag(
    () => ({
      id: "book-of-facts-circadian-rhythms-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/clock.gif",
      node:
        haveEffect(recallingCircadianRhythms) > 0 &&
        circadianAdv < 10 &&
        circadianPhylum ? (
          <Tile
            header="Circadian Rhythms turngen"
            imageUrl="/images/itemimages/clock.gif"
          >
            <Line>
              Fight {11 - circadianAdv} more {circadianPhylum.identifierString}s
              to get RO advs.
            </Line>
          </Tile>
        ) : null,
    }),
    [circadianAdv, circadianPhylum, recallingCircadianRhythms],
  );

  const snowmanCrate = $item`X-32-F snowman crate`;
  const glitchItem = $item`[glitch season reward name]`;
  const witchessSet = $item`Witchess Set`;
  const neverendingPartyInvitation = $item`Neverending Party invitation envelope`;
  const closedCircuitPayPhone = $item`closed-circuit pay phone`;

  const constructDescriptor = `${haveUnrestricted(snowmanCrate) ? " + snojo" : ""}${
    have(glitchItem) ? " + glitch" : ""
  }`;
  const dudeDescriptor = `${haveUnrestricted(witchessSet) ? " + witchess" : ""}${
    haveUnrestricted(neverendingPartyInvitation) ? " + NEP" : ""
  }`;
  const horrorDescriptor = have(closedCircuitPayPhone) ? " + shadow rifts" : "";

  const circadianRhythmsRecalled = get("_circadianRhythmsRecalled");
  const habitatRecallsLeft = clamp(3 - get("_monsterHabitatsRecalled"), 0, 3);
  const bookOfFactsWishes = clamp(3 - get("_bookOfFactsWishes"), 0, 3);
  const springShoes = $item`spring shoes`;
  const romanCandelabra = $item`Roman Candelabra`;
  const bookOfFactsTatters = clamp(11 - get("_bookOfFactsTatters"), 0, 11);

  if (!haveUnrestricted(justTheFactsSkill)) {
    return null;
  }

  if (
    circadianRhythmsRecalled &&
    habitatRecallsLeft === 0 &&
    bookOfFactsWishes === 0 &&
    (haveUnrestricted(springShoes) ||
      !have(romanCandelabra) ||
      bookOfFactsTatters === 0)
  ) {
    return null;
  }

  return (
    <Tile header="Book of Facts" imageUrl="/images/itemimages/factbook.gif">
      {!circadianRhythmsRecalled && (
        <>
          <Line>Can recall Circadian Rhythms to get +11 RO adv.</Line>
          <Line>
            Good targets: construct (nightstands{constructDescriptor}), dudes
            (pygmies
            {dudeDescriptor}), horrors (copied tentacles{horrorDescriptor})
          </Line>
        </>
      )}
      {habitatRecallsLeft > 0 && (
        <>
          <Line>{plural(habitatRecallsLeft, "Habitat recall")} available.</Line>
          <Line>Good targets include monsters you want 6 of:</Line>
          <Line>
            Dirty old lihc, fantasy bandit, eldritch tentacle, black crayon orc
            if the stars align.
          </Line>
        </>
      )}
      {bookOfFactsWishes > 0 && (
        <Line>
          {plural(bookOfFactsWishes, "BOFA wish", "BOFA wishes")} available.
        </Line>
      )}
      {!haveUnrestricted(springShoes) &&
        !have(romanCandelabra) &&
        bookOfFactsTatters > 0 && (
          <Line>{plural(bookOfFactsTatters, "BOFA tatter")} available.</Line>
        )}
    </Tile>
  );
};

export default BookOfFacts;
