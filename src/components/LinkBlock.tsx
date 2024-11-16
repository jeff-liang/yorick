import { Stack } from "@chakra-ui/react";
import { FC } from "react";

import MainLink, { MainLinkProps } from "./MainLink";

const LinkBlock: FC<MainLinkProps> = ({ children, ...props }) => (
  <MainLink {...props}>
    <Stack spacing={0.5}>{children}</Stack>
  </MainLink>
);

export default LinkBlock;
