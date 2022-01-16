import React from "react";
import { Heading, VStack } from "@chakra-ui/react";

type Props = {
  name: string;
};

const Section: React.FC<Props> = ({ name, children }) => (
  <VStack spacing={1} align="stretch">
    <Heading as="h2" size="md" px={2}>
      {name}
    </Heading>
    {children}
  </VStack>
);

export default Section;
