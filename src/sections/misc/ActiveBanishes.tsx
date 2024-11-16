import { Text } from "@chakra-ui/react";
import { decode } from "html-entities";
import { myTurncount } from "kolmafia";
import { get } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { activeBanishes } from "../../util/banish";
import { plural } from "../../util/text";

const ActiveBanishes: FC = () => {
  const phylumBanishedString = get("banishedPhyla");
  const [phylumName, , phylumTurnString] = phylumBanishedString
    ? phylumBanishedString.split(":")
    : [null, null, null];
  const phylumTurn = phylumTurnString ? parseInt(phylumTurnString) : null;
  const phylumLength = phylumTurn ? 100 + phylumTurn - myTurncount() : null;
  const banishes = activeBanishes();
  return (
    <Tile header="Active Banishes" imageUrl="/images/itemimages/ballbat.gif">
      {phylumLength !== null && phylumLength > 0 && (
        <Line>
          <Text as="b">Phylum {phylumName}</Text>: Patriotic Eagle (
          {plural(phylumLength, "turn")}).
        </Line>
      )}
      {banishes.map((banish, index) => (
        <Line key={index}>
          <Text as="b">{decode(banish.banishedMonster.name)}:</Text>{" "}
          {banish.banishSource} (
          {banish.banishTurnLength === -1
            ? "Until Rollover"
            : plural(banish.banishTurnLength, "turn")}
          ).
        </Line>
      ))}
      {banishes.length === 0 && <Line>No active banishes.</Line>}
    </Tile>
  );
};

export default ActiveBanishes;
