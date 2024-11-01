import { Tooltip, TooltipProps } from "@chakra-ui/react";
import { FC } from "react";

const AdviceTip: FC<TooltipProps> = ({ ...props }) => (
  <Tooltip
    bg="white"
    color="gray.600"
    border="1px"
    borderColor="gray.400"
    shadow="xs"
    rounded="md"
    hasArrow
    arrowSize={10}
    arrowShadowColor="gray" // NOTE: The "gray.400" style colors don't work in this field.
    mx={5}
    p={3}
    {...props}
  />
);

export default AdviceTip;
