import { Image } from "@chakra-ui/react";
import { FC } from "react";

import H1 from "./H1";

const BrandHeading: FC = () => (
  <H1 textAlign="center">
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
  </H1>
);

export default BrandHeading;
