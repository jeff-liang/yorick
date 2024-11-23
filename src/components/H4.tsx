import { Heading, HeadingProps } from "@chakra-ui/react";
import { FC } from "react";

const H4: FC<HeadingProps> = (props) => (
  <Heading as="h4" size="sm" {...props} />
);

export default H4;
