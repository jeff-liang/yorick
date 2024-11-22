import { Strong, Text } from "@chakra-ui/react";
import { myClass, myLevel, myPrimestat, numericModifier } from "kolmafia";
import { $class, $familiar, get } from "libram";
import { FC } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";

const GreyGoose: FC = () => {
  const greyGoose = $familiar`Grey Goose`;
  const gooseDrones = get("gooseDronesRemaining");
  const gooseWeight = Math.min(Math.floor(Math.sqrt(greyGoose.experience)), 20);
  const gooseExperience = greyGoose.experience;
  const famExperienceGain = numericModifier("familiar experience") + 1;
  const newGooseExp = gooseExperience + famExperienceGain;
  const famExpNeededForNextPound = (gooseWeight + 1) ** 2 - gooseExperience;
  const famExpNeededForTwoPounds = (gooseWeight + 2) ** 2 - gooseExperience;
  const horribleFamExpCalculation = Math.ceil(
    (36 - gooseExperience) / famExperienceGain,
  );
  const horribleFamExpCalculationForGreyYou = Math.ceil(
    (196 - gooseExperience) / famExperienceGain,
  );
  const horribleFamExpCalculationForStandard = Math.ceil(
    (400 - gooseExperience) / famExperienceGain,
  );

  useNag(
    () => ({
      id: "grey-goose-nag",
      priority: NagPriority.ERROR,
      imageUrl: "/images/itemimages/greygoose.gif",
      node: gooseDrones > 0 && (
        <Tile header="GOOSO IS LIT" imageUrl="/images/itemimages/greygoose.gif">
          <Line>
            <Text as="span" color="brown" fontWeight="bold">
              {gooseDrones}
            </Text>
            <Text as="span" color="gray.solid">
              {" "}
              GOOSO drones deployed.
            </Text>
          </Line>
          <Line>Automatically duplicates non-conditional drops.</Line>
        </Tile>
      ),
    }),
    [gooseDrones],
  );

  useNag(
    () => ({
      id: "grey-goose-grey-you-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/greygoose.gif",
      node: myClass() === $class`Grey Goo` && gooseWeight > 5 && (
        <Tile
          header="Re-Process Matter"
          imageUrl="/images/itemimages/greygoose.gif"
        >
          <Line color="gray.solid">
            GOOSO is {gooseWeight} pounds ({gooseExperience} exp)
          </Line>
          <Line>
            Re-Process a bunch of matter to gain a bunch of adventures in Grey
            You.
          </Line>
        </Tile>
      ),
    }),
    [gooseWeight, gooseExperience],
  );

  if (!haveUnrestricted(greyGoose)) return null;

  return (
    <Tile linkedContent={greyGoose}>
      <Line>
        Currently have <Strong>{gooseWeight}</Strong> weight (
        <Strong>{gooseExperience}</Strong> experience), currently gain{" "}
        <Strong>{famExperienceGain}</Strong> fam exp per fight. (Will become{" "}
        <Text
          as="b"
          color={
            (gooseWeight + 1) ** 2 > newGooseExp ? "red.solid" : "blue.solid"
          }
        >
          {newGooseExp}
        </Text>
        )
      </Line>
      {gooseWeight < 6 ? (
        <Line>
          <Strong>
            {Math.ceil(famExpNeededForNextPound / famExperienceGain)}
          </Strong>{" "}
          combats until next pound, or{" "}
          <Strong>{Math.ceil(horribleFamExpCalculation)}</Strong> combats for 6
          weight.
        </Line>
      ) : (
        <>
          <Line>
            <Strong>{famExpNeededForNextPound}</Strong> famxp needed for next
            pound, or <Strong>{famExpNeededForTwoPounds}</Strong> for the one
            after that.
          </Line>
          {famExperienceGain < famExpNeededForNextPound && (
            <Line color="red.solid">Insufficient famxp for next fight.</Line>
          )}
          <Line>
            Can emit <Strong>{gooseWeight - 5}</Strong> drones to duplicate
            items.
          </Line>
          {get("_meatifyMatterUsed") === false && (
            <Line>
              Can meatify matter for <Strong>{(gooseWeight - 5) ** 4}</Strong>{" "}
              meat.
            </Line>
          )}
          {myClass() === $class`Grey Goo` &&
          gooseWeight > 5 &&
          myLevel() < 11 ? (
            <>
              <Line>
                Can generate <Strong>{(gooseWeight - 5) ** 2}</Strong> mainstat.
              </Line>
              <Line>
                <Strong>
                  GREY YOU:{" "}
                  {Math.ceil(famExpNeededForNextPound / famExperienceGain)}
                </Strong>{" "}
                combats until next pound, or{" "}
                <Strong>
                  {Math.ceil(horribleFamExpCalculationForGreyYou)}
                </Strong>{" "}
                combats for 14 weight.
              </Line>
            </>
          ) : (
            gooseWeight > 5 &&
            myLevel() < 11 && (
              <>
                <Line>
                  Can generate{" "}
                  <Strong>
                    {Math.round(
                      (gooseWeight - 5) ** 3 *
                        (1.0 +
                          numericModifier(
                            `${myPrimestat()} Experience Percent`,
                          ) /
                            100.0),
                    )}
                  </Strong>{" "}
                  substats. (<Strong>{(gooseWeight - 5) ** 3}</Strong> base).
                </Line>
                <Line>
                  <Strong>
                    STAT GOOSO:{" "}
                    {Math.ceil(famExpNeededForNextPound / famExperienceGain)}
                  </Strong>{" "}
                  combats until next pound, or{" "}
                  <Strong>
                    {Math.ceil(horribleFamExpCalculationForStandard)}
                  </Strong>{" "}
                  combats for 20 weight.
                </Line>
              </>
            )
          )}
          {!get("_questPartyFair") && (
            <Line>
              {famExperienceGain >= 39 ? (
                <Text as="span" color="green.solid">
                  Can GOOSO 3 drops per fight!
                </Text>
              ) : famExperienceGain >= 24 ? (
                <Text as="span" color="blue.solid">
                  Can GOOSO 2 drops per fight!
                </Text>
              ) : famExperienceGain >= 11 ? (
                <Text as="span" color="purple.solid">
                  Can GOOSO 1 drop per fight!
                </Text>
              ) : (
                <Text as="span" color="red.solid">
                  Cannot GOOSO any drops per fight!
                </Text>
              )}
            </Line>
          )}
        </>
      )}
    </Tile>
  );
};

export default GreyGoose;
