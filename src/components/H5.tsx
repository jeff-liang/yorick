import { Heading, HeadingProps } from "@chakra-ui/react";
import { FC } from "react";

const H5: FC<HeadingProps> = (props) => (
  <Heading as="h5" size="xs" {...props} />
);

export default H5;
