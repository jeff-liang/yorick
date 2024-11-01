import { Box, Text, TooltipProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import AdviceTip from "./AdviceTip";

interface AdviceTooltipProps extends Omit<TooltipProps, "children"> {
  text: string | JSX.Element;
  label: ReactNode;
}
/**
 * A tooltip generated on text for a quick descriptive tooltip.
 * @param text The text you want displayed inside this tooltip.
 * @param label The text you want displayed that users hover over to get the tooltip
 * @returns A FC Tooltip object where the label generates the tooltip on hoverover.
 */

const AdviceTooltip: FC<AdviceTooltipProps> = ({ text, label, ...props }) => {
  const toolTip = (
    <Box bg="gray.100" p={2} rounded="md" fontSize={12}>
      {typeof text === "string" ? <Text>{text}</Text> : text}
    </Box>
  );

  return (
    <AdviceTip label={toolTip} {...props}>
      <Text
        as="span"
        fontWeight="bold"
        color="gray.500"
        decoration="underline dotted lightsteelblue"
      >
        {label}
      </Text>
    </AdviceTip>
  );
};

export default AdviceTooltip;
