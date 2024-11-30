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
    alignItems="center"
    height="1rem"
    mt="1px"
    marginInlineEnd={0.5}
  >
    <Chevrons {...props} />
  </List.Indicator>
);

export default ChevronsList;
