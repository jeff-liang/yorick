import { Stack, StackProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import H2 from "./H2";

export interface SectionProps extends StackProps {
  name: string;
  children?: ReactNode;
}

const Section: FC<SectionProps> = ({ name, children, ...props }) => (
  <Stack gap={2} align="stretch" px={2} pb={1} {...props}>
    <H2>{name}</H2>
    <Stack
      gap={2}
      _empty={{
        _after: {
          content: '"Nothing to display."',
          fontWeight: "bold",
          fontStyle: "italic",
        },
      }}
    >
      {children}
    </Stack>
  </Stack>
);

export default Section;
