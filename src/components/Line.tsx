import { Text, TextProps } from "@chakra-ui/react";
import { Familiar, haveEquipped, Item, myFamiliar } from "kolmafia";
import { FC } from "react";

import AsyncLink from "./AsyncLink";
import MainLink from "./MainLink";

interface Props extends TextProps {
  href?: string;
  command?: string;
  takeFamiliar?: Familiar;
  equipItem?: Item;
  async?: boolean;
}

const Line: FC<Props> = ({
  href,
  command,
  takeFamiliar,
  equipItem,
  async = false,
  children,
  ...props
}) => {
  if (takeFamiliar && myFamiliar() !== takeFamiliar) {
    command = `familiar ${takeFamiliar.identifierString}`;
  }
  if (equipItem && !haveEquipped(equipItem)) {
    command = `equip ${equipItem.identifierString}`;
  }
  return (
    <Text {...props}>
      {command ? (
        <AsyncLink command={command}>
          <Text as="span">{children}</Text>
        </AsyncLink>
      ) : href ? (
        async ? (
          <AsyncLink href={href}>{children}</AsyncLink>
        ) : (
          <MainLink href={href}>{children}</MainLink>
        )
      ) : (
        children
      )}
    </Text>
  );
};

export default Line;
