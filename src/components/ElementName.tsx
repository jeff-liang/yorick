import { Strong } from "@chakra-ui/react";
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

  return <Strong color={elementColors[element]}>{children ?? element}</Strong>;
};

export default ElementName;
