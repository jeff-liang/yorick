import { Heading, HeadingProps } from "@chakra-ui/react";
import { FC } from "react";

const H2: FC<HeadingProps> = (props) => (
  <Heading as="h2" size={["md", "lg"]} {...props} />
);

export default H2;
