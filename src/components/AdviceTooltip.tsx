import { FC } from "react";

import { Tooltip, TooltipProps } from "./ui/tooltip";

const AdviceTooltip: FC<TooltipProps> = ({ content, ...props }) => (
  <Tooltip
    showArrow
    openDelay={0}
    contentProps={{
      css: { "--tooltip-bg": "bg" },
      bgColor: "bg",
      border: "1px solid border",
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
