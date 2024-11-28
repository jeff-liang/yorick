import { Badge, BadgeProps } from "@chakra-ui/react";
import { FC } from "react";

interface RequirementProps extends Omit<BadgeProps, "colorScheme"> {
  met: boolean;
  disabled?: boolean;
}

const Requirement: FC<RequirementProps> = ({
  met,
  disabled = false,
  children,
  ...props
}) => (
  <Badge
    colorScheme={disabled ? "gray" : met ? "blue" : "red"}
    p={0.5}
    textTransform="uppercase"
    {...props}
  >
    {children}
  </Badge>
);

export default Requirement;
