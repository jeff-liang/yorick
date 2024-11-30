import { Box, Text, TextProps } from "@chakra-ui/react";
import { FC } from "react";

import AdviceTooltip from "./AdviceTooltip";
import { TooltipProps } from "./ui/tooltip";

interface AdviceTooltipProps extends Omit<TooltipProps, "content"> {
  advice: string | JSX.Element;
  textProps?: TextProps;
}
/**
 * A tooltip generated on text for a quick descriptive tooltip.
 * @param text The text you want displayed inside this tooltip.
 * @param label The text you want displayed that users hover over to get the tooltip
 * @returns A FC Tooltip object where the label generates the tooltip on hoverover.
 */

const AdviceTooltipText: FC<AdviceTooltipProps> = ({
  advice,
  textProps,
  children,
  ...props
}) => {
  const toolTip = (
    <Box bg="bg.muted" color="fg.muted" p={2} rounded="md" fontSize="xs">
      {typeof advice === "string" ? <Text>{advice}</Text> : advice}
    </Box>
  );

  return (
    <AdviceTooltip content={toolTip} {...props}>
      <Text
        as="span"
        textDecoration="underline dotted"
        cursor="pointer"
        {...textProps}
      >
        {children}
      </Text>
    </AdviceTooltip>
  );
};

export default AdviceTooltipText;
