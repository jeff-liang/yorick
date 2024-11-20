import { Heading, Stack, StackProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

export interface SectionProps extends StackProps {
  name: string;
  children?: ReactNode;
}

const Section: FC<SectionProps> = ({ name, children, ...props }) => (
  <Stack gap={2} align="stretch" px={2} pb={1} {...props}>
    <Heading as="h2">{name}</Heading>
    <Stack
      gap={2}
      _empty={{
        _after: {
          content: '"Nothing to display."',
          px: 2,
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
