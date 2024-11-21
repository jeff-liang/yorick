import { FC } from "react";

import { Tooltip, TooltipProps } from "./ui/tooltip";

const AdviceTooltip: FC<TooltipProps> = ({ content, ...props }) => (
  <Tooltip
    showArrow
    contentProps={{
      css: { "--tooltip-bg": "gray.contrast" },
      color: "gray.fg",
      border: "1px solid gray.muted",
      shadow: "xs",
      rounded: "md",
      mx: 5,
      p: 3,
    }}
    content={content}
    {...props}
  />
);

export default AdviceTooltip;
