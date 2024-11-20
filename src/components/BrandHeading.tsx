import { Heading, Image } from "@chakra-ui/react";
import { FC } from "react";

const BrandHeading: FC = () => (
  <Heading as="h1" size="3xl" textAlign="center">
    Y
    <Image
      src="Skull192.png"
      alt="O"
      display="inline"
      h="1.75rem"
      ml="-5px"
      mt="-5px"
      mr="-1px"
      // FIXME: make logo itself transparent.
      mixBlendMode="multiply"
    />
    RICK
  </Heading>
);

export default BrandHeading;
