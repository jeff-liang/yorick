import { Badge, BadgeProps } from "@chakra-ui/react";

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
    {...props}
  >
    {children}
  </Badge>
);

export default Requirement;
