import { Heading, HeadingProps } from "@chakra-ui/react";
import { FC } from "react";

const H1: FC<HeadingProps> = (props) => (
  <Heading as="h1" size="3xl" {...props} />
);

export default H1;
