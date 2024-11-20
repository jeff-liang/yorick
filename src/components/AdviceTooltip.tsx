import { Box, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import AdviceTip from "./AdviceTip";
import { TooltipProps } from "./ui/tooltip";

interface AdviceTooltipProps extends Omit<TooltipProps, "children"> {
  text: string | JSX.Element;
  content: ReactNode;
}
/**
 * A tooltip generated on text for a quick descriptive tooltip.
 * @param text The text you want displayed inside this tooltip.
 * @param label The text you want displayed that users hover over to get the tooltip
 * @returns A FC Tooltip object where the label generates the tooltip on hoverover.
 */

const AdviceTooltip: FC<AdviceTooltipProps> = ({ text, content, ...props }) => {
  const toolTip = (
    <Box bg="gray.100" p={2} rounded="md" fontSize="xs">
      {typeof text === "string" ? <Text>{text}</Text> : text}
    </Box>
  );

  return (
    <AdviceTip content={toolTip} {...props}>
      <Text
        as="span"
        fontWeight="bold"
        color="gray.500"
        textDecoration="underline dotted lightsteelblue"
        cursor="pointer"
      >
        {content}
      </Text>
    </AdviceTip>
  );
};

export default AdviceTooltip;
