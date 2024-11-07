import { LinkProps, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { haveEquipped, myInebriety } from "kolmafia";
import { $item, $skill, get } from "libram";
import { FC } from "react";

import AsyncLink from "../../../components/AsyncLink";
import MainLink from "../../../components/MainLink";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { skillLink } from "../../../util/links";
import { plural } from "../../../util/text";

const LinkOrEquip: FC<LinkProps> = ({ href, ...props }) =>
  !haveEquipped($item`designer sweatpants`) ? (
    <AsyncLink command="equip designer sweatpants" {...props} />
  ) : (
    <MainLink href={href} {...props} />
  );

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
          <LinkOrEquip href={skillLink($skill`Sweat Sip`)}>
            <Text as="b">Sweat Sip (5% sweat):</Text> Regain 50 MP
          </LinkOrEquip>
        </ListItem>
        <ListItem>
          <LinkOrEquip href={skillLink($skill`Drench Yourself in Sweat`)}>
            <Text as="b">Drench Yourself in Sweat (15% sweat):</Text> +100%
            Initiative
          </LinkOrEquip>
        </ListItem>
        {boozeSweatsLeft > 0 && (
          <ListItem>
            <LinkOrEquip href={skillLink($skill`Sweat Out Some Booze`)}>
              <Text as="b">Sweat Out Some Booze (25% sweat):</Text>
            </LinkOrEquip>
            <LinkOrEquip
              href={skillLink($skill`Sweat Out Some Booze`)}
              color="orange.500"
            >
              {` -1 Drunkenness. ${plural(boozeSweatsLeft, "use")} left for today.`}
              {myInebriety() === 0 && " Drink some booze first."}
            </LinkOrEquip>
          </ListItem>
        )}
      </UnorderedList>
    </Tile>
  );
};

export default DesignerSweatpants;
