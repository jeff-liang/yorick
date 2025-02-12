import { Strong, Text } from "@chakra-ui/react";
import { haveEquipped, myPath } from "kolmafia";
import { $effect, $item, $path, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";

const SpringShoes = () => {
  const springShoes = $item`spring shoes`;
  const everythingLooksGreen = $effect`Everything Looks Green`;

  const haveShoes = haveUnrestricted(springShoes);
  const haveELG = have(everythingLooksGreen);
  const pathCheck =
    myPath() !== $path`Community Service` && myPath() !== $path`WereProfessor`;
  const haveShoesEquipped = haveEquipped(springShoes);

  useNag(
    () => ({
      id: "spring-shoes-nag",
      priority: NagPriority.IMMEDIATE,
      imageUrl: "/images/itemimages/springshoes.gif",
      node: haveShoes && pathCheck && !haveELG && (
        <Tile
          header="Run With Spring Shoes"
          id="spring-shoes-nag"
          linkedContent={springShoes}
        >
          {haveShoesEquipped ? (
            <Line>
              <Text as="span" color="green.solid">
                Free run with the <Strong>Spring Away</Strong> skill!
              </Text>
            </Line>
          ) : (
            <Line>
              <Text as="span" color="red.solid">
                Equip the spring shoes first.
              </Text>
            </Line>
          )}
        </Tile>
      ),
    }),
    [haveELG, haveShoes, haveShoesEquipped, pathCheck, springShoes],
  );

  return null;
};

export default SpringShoes;
