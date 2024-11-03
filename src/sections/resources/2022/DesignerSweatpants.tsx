import { ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { $item, get } from "libram";

import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

const DesignerSweatpants = () => {
  const designerSweatpants = $item`designer sweatpants`;
  const sweatOMeter = get("sweat");
  const boozeSweatsLeft = Math.max(3 - get("_sweatOutSomeBoozeUsed"), 0);

  if (!haveUnrestricted(designerSweatpants)) {
    return null;
  }

  return (
    <Tile
      header={`${sweatOMeter}% sweaty sweatpants`}
      id="designer-sweatpants-tile"
      linkedContent={designerSweatpants}
    >
      <UnorderedList>
        <ListItem>
          <Text as="b">Sweat Sip (5% sweat):</Text> Regain 50 MP
        </ListItem>
        <ListItem>
          <Text as="b">Drench Yourself In Sweat (15% sweat):</Text> +100%
          Initiative
        </ListItem>
        {boozeSweatsLeft > 0 && (
          <ListItem>
            <Text as="b">Sweat Out Some Booze (25% sweat):</Text>
            <Text
              as="span"
              color="orange.500"
            >{` -1 Drunkenness. ${plural(boozeSweatsLeft, "use")} left for today.`}</Text>
          </ListItem>
        )}
      </UnorderedList>
    </Tile>
  );
};

export default DesignerSweatpants;
