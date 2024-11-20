import { List } from "@chakra-ui/react";
import { FC } from "react";

import Chevrons, { ChevronsProps } from "./Chevrons";

interface ChevronsListProps extends ChevronsProps {
  usesLeft: number;
  totalUses: number;
}

const ChevronsList: FC<ChevronsListProps> = (props) => (
  <List.Indicator
    asChild
    display="inline-flex"
    verticalAlign="center"
    my="auto"
  >
    <Chevrons {...props} />
  </List.Indicator>
);

export default ChevronsList;
