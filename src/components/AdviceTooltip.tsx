import { FC } from "react";

import { Tooltip, TooltipProps } from "./ui/tooltip";

const AdviceTooltip: FC<TooltipProps> = ({ content, ...props }) => (
  <Tooltip
    openDelay={0}
    contentProps={{
      css: { "--tooltip-bg": "bg" },
      color: "fg.subtle",
      bgColor: "bg",
      border: "1px solid border",
      shadow: "xs",
      rounded: "md",
      p: 2,
    }}
    content={content}
    {...props}
  />
);

export default AdviceTooltip;
