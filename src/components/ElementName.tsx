import { Text } from "@chakra-ui/react";
import { ElementType } from "kolmafia";
import { FC, ReactNode } from "react";

export interface ElementNameProps {
  element: ElementType;
  children?: ReactNode;
}

const ElementName: FC<ElementNameProps> = ({ element, children }) => {
  const elementColors: Record<string, string> = {
    cold: "blue.solid",
    hot: "red.solid",
    spooky: "gray.solid",
    stench: "green.solid",
    sleaze: "purple.solid",
  };

  return (
    <Text as="b" color={elementColors[element]}>
      {children ?? element}
    </Text>
  );
};

export default ElementName;
