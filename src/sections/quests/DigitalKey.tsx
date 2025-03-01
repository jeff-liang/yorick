import { Strong, Text } from "@chakra-ui/react";
import { haveEquipped, myPath, numericModifier } from "kolmafia";
import { $item, $path, get, have, maxBy, NumericModifier } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { haveUnrestricted } from "../../util/available";
import { inventoryLink } from "../../util/links";
import { plural } from "../../util/text";

type Color = "black" | "red" | "blue" | "green";

const DigitalKeyQuest: FC = () => {
  const continuumTransfunctioner = $item`continuum transfunctioner`;
  const digitalKey = $item`digital key`;

  const started = haveUnrestricted(continuumTransfunctioner);
  const finished =
    myPath() === $path`Community Service` ||
    myPath() === $path`Kingdom of Exploathing` ||
    get("kingLiberated") ||
    have(digitalKey) ||
    get("nsTowerDoorKeysUsed").includes("digital key");

  const currentScore = get("8BitScore");
  const currentColor = (get("8BitColor") || "black") as Color;

  const helpfulModifier: Record<Color, NumericModifier> = {
    black: "Initiative",
    red: "Meat Drop",
    blue: "Damage Absorption",
    green: "Item Drop",
  };

  const minimumToAddPoints: Record<Color, number> = {
    black: 300,
    red: 150,
    blue: 300,
    green: 100,
  };

  const zoneMap: Record<Color, string> = {
    black: "Vanya's Castle",
    red: "The Fungus Plains",
    blue: "Megalo-City",
    green: "Hero's Field",
  };

  const nextColor: Record<Color, Color> = {
    black: "blue",
    red: "black",
    blue: "green",
    green: "red",
  };

  const bonusTurnsRemaining = 5 - get("8BitBonusTurns");

  const userModifier: Record<Color, number> = Object.fromEntries(
    Object.entries(helpfulModifier).map(([key, value]) => [
      key,
      numericModifier(value),
    ]),
  ) as Record<Color, number>;

  const expectedPoints: Record<Color, number> = Object.fromEntries(
    Object.entries(helpfulModifier).map(([key]) => {
      const isCurrentZoneBonus = currentColor === key;
      const addedBonus = isCurrentZoneBonus ? 100 : 50;
      const denominator = isCurrentZoneBonus ? 10 : 20;
      const rawPoints = Math.min(
        300,
        Math.max(
          0,
          userModifier[key as Color] - minimumToAddPoints[key as Color],
        ),
      );
      return [key, addedBonus + Math.round(rawPoints / denominator) * 10];
    }),
  ) as Record<Color, number>;

  const highestPointColor = maxBy(
    Object.entries(expectedPoints),
    ([, value]) => value,
  )[0] as Color;

  if (finished) return null;

  if (!started) {
    return (
      <QuestTile
        header="Get the continuum transfunctioner"
        id="digital-key-quest"
        imageUrl="/images/itemimages/pixelkey.gif"
        href="/place.php?whichplace=forestvillage&action=fv_mystic"
        minLevel={2}
      >
        <Line>Visit the crackpot mystic for your transfunctioner.</Line>
      </QuestTile>
    );
  }

  const activeMod = helpfulModifier[currentColor];
  const neededModifier = (minimumToAddPoints[currentColor] + 300).toString();

  const treasureLink = haveEquipped(continuumTransfunctioner)
    ? "/place.php?whichplace=8bit&action=8treasure"
    : undefined;

  const suffix = activeMod !== "Damage Absorption" ? "%" : "";
  return (
    <QuestTile
      header={`Get ${currentScore < 10000 ? `${(10000 - currentScore).toLocaleString()} digital key points` : "digital key"}`}
      id="digital-key-quest"
      imageUrl="/images/itemimages/pixelkey.gif"
      href={
        haveEquipped(continuumTransfunctioner)
          ? "/place.php?whichplace=8bit"
          : inventoryLink(continuumTransfunctioner)
      }
      minLevel={5}
    >
      {currentScore >= 10000 ? (
        <>
          <Line href={treasureLink}>
            Woah, 10000 points??? That's this life's high score!
          </Line>
          <Line href={treasureLink}>
            Visit the <Strong>Treasure House</Strong> to claim your hard-earned
            Digital Key.
          </Line>
        </>
      ) : (
        <>
          <Line>
            <Strong>BONUS ZONE</Strong>:{" "}
            <Strong color={currentColor}>{zoneMap[currentColor]}</Strong>
            {` (${plural(bonusTurnsRemaining, "more fight", "more fights")})`}
          </Line>
          {expectedPoints[currentColor] === 400 ? (
            <>
              <Line color={currentColor}>
                <Strong>MAXIMUM POINTS!</Strong>
              </Line>
              <Line>
                Adventure in{" "}
                <Text as="span" color={currentColor}>
                  {zoneMap[currentColor]}
                </Text>{" "}
                for 400 points per turn!
              </Line>
            </>
          ) : (
            <>
              <Line>
                Current expected points: {expectedPoints[currentColor]}.
              </Line>
              <Line>
                Need {activeMod === "Initiative" && `+${neededModifier}% init`}
                {activeMod === "Meat Drop" && `+${neededModifier}% meat`}
                {activeMod === "Damage Absorption" && `+${neededModifier} DA`}
                {activeMod === "Item Drop" && `+${neededModifier}% item`}. You
                have {numericModifier(activeMod).toFixed(0)}
                {suffix}.
              </Line>
              <Line>
                You need{" "}
                {(
                  minimumToAddPoints[currentColor] +
                  300 -
                  userModifier[currentColor]
                ).toFixed(0)}
                {suffix} more for max points.
              </Line>
            </>
          )}
          <Line>
            In {plural(bonusTurnsRemaining, "more fight", "more fights")}, bonus
            zone will be{" "}
            <Strong color={nextColor[currentColor]}>
              {zoneMap[nextColor[currentColor]]}
            </Strong>
            .
          </Line>
          {highestPointColor !== currentColor && (
            <Line color="gray">
              Alternate Route: At current stats, you'd earn{" "}
              <Strong>{expectedPoints[highestPointColor]} points</Strong> per
              fight at <Strong>{zoneMap[highestPointColor]}</Strong>. Not
              recommended!
            </Line>
          )}
          <Line>
            If you max your bonus, key in{" "}
            {plural(Math.ceil((10000 - currentScore) / 400), "turn")}.
          </Line>
        </>
      )}
      {!haveEquipped(continuumTransfunctioner) && (
        <Line command="equip acc3 continuum transfunctioner" color="red">
          Equip your transfunctioner to access the realm.
        </Line>
      )}
    </QuestTile>
  );
};

export default DigitalKeyQuest;
