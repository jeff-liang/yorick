import { Heading, HeadingProps } from "@chakra-ui/react";
import { FC } from "react";

const H3: FC<HeadingProps> = (props) => (
  <Heading as="h3" size="md" {...props} />
);

export default H3;
