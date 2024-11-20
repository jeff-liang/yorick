import { FC } from "react";

import { Tooltip, TooltipProps } from "./ui/tooltip";

const AdviceTip: FC<TooltipProps> = ({ content, ...props }) => (
  <Tooltip
    showArrow
    contentProps={{
      bgColor: "white",
      color: "gray.600",
      border: "1px",
      borderColor: "gray.400",
      shadow: "xs",
      rounded: "md",
      mx: 5,
      p: 3,
    }}
    content={content}
    {...props}
  />
);

export default AdviceTip;
