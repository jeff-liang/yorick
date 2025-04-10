import { haveEquipped, myAscensions, myClass } from "kolmafia";
import { $classes, $item, get } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";

const TearawayPants = () => {
  const tearawayPants = $item`tearaway pants`;
  const havePantsEquipped = haveEquipped(tearawayPants);
  const isMoxieClass = $classes`Disco Bandit, Accordion Thief`.includes(
    myClass(),
  );

  if (
    !haveUnrestricted(tearawayPants) ||
    !isMoxieClass ||
    myAscensions() <= get("lastGuildStoreOpen")
  ) {
    return null;
  }

  return (
    <Tile
      header="Tearaway Pants"
      linkedContent={tearawayPants}
      href={havePantsEquipped ? "guild.php" : inventoryLink(tearawayPants)}
    >
      {havePantsEquipped ? (
        <Line>
          Visit the Department of Shadowy Arts and Crafts to unlock the guild!
        </Line>
      ) : (
        <Line>
          Visit the Department of Shadowy Arts and Crafts with your pants
          equipped to unlock the guild!
        </Line>
      )}
    </Tile>
  );
};

export default TearawayPants;
