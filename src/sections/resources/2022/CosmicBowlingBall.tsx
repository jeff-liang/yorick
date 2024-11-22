import { Strong, Text } from "@chakra-ui/react";
import { $item, $location, get } from "libram";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

/**
 * Summarizes turns til next bowling banish & highlights when banish is available
 * @returns A tile describing the Cosmic Bowling Ball
 */

const CosmicBowlingBall = () => {
  const returnCombats = get("cosmicBowlingBallReturnCombats");
  const youHaveTheBall = haveUnrestricted($item`cosmic bowling ball`);
  const currentZone = get("nextAdventure");

  useNag(
    () => ({
      id: "cosmic-bowling-ball-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/cosmicball2.gif",
      node: (youHaveTheBall || returnCombats === 1) && (
        <Tile
          header="Cosmic Bowling Ball"
          id="cosmic-bowling-ball-nag"
          imageUrl="/images/itemimages/cosmicball2.gif"
        >
          <Line>
            {youHaveTheBall ? "You have it!" : "Bowling ball back next combat!"}{" "}
            Throw a curveball for a free run/banish.
          </Line>
        </Tile>
      ),
    }),
    [returnCombats, youHaveTheBall],
  );

  if (!youHaveTheBall && returnCombats < 0) return null;

  // To-Do list for this tile:
  //   - Add support for showing possible items & probability distribution from Bowl Backwards
  //   - Once mafia support exists, show the # of turns the banish is / expected stats from X turns in current zone with +50% stats, # of turns on buff etc
  //   - I'd like to figure out ways to make this info more compact
  //   - Conditional formatting to gray out others other than bowl backwards?
  return (
    <Tile
      header="Cosmic Bowling Ball"
      imageUrl="/images/itemimages/cosmicball2.gif"
    >
      {currentZone === $location`The Hidden Bowling Alley` && (
        <Line>
          <Text as="span" color="teal.solid" fontWeight={"bold"}>
            You're in the bowling alley; remember to bowl for pygmies!
          </Text>{" "}
        </Line>
      )}
      {youHaveTheBall && (
        <Line>
          <Text as="span" color="red.solid" fontWeight={"bold"}>
            You've got your bowling ball; throw it!
          </Text>{" "}
        </Line>
      )}
      {youHaveTheBall && (
        <>
          <Line>
            <Strong>Bowl a Curveball:</Strong> Banish the monster, for free!
          </Line>
          <Line>
            <Strong>Bowl Sideways:</Strong> Gain ~ 1.5x stats within{" "}
            {currentZone?.identifierString}
          </Line>
          <Line>
            <Strong>Bowl Straight Up:</Strong> Gain +25% items / +50% meat
          </Line>
          <Line>
            <Text as="span" color="gray.emphasized">
              <Strong>Bowl Backwards:</Strong> Pickpocket from the rest of your
              current CSV.
            </Text>
          </Line>
        </>
      )}
      {returnCombats > 0 && (
        <Line>
          Your Bowling Ball will return in{" "}
          <AdviceTooltipText advice="Free runs count for this!">
            {plural(returnCombats, "turn")}
          </AdviceTooltipText>
          .
        </Line>
      )}
      {returnCombats === 0 && (
        <Line>
          Your Bowling Ball will return at the start of the next combat!
        </Line>
      )}
    </Tile>
  );
};

export default CosmicBowlingBall;
