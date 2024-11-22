import { ButtonProps, IconButton } from "@chakra-ui/react";
import { RepeatIcon } from "lucide-react";
import { FC } from "react";

const RefreshButton: FC<ButtonProps> = (props) => (
  <IconButton
    asChild
    aria-label="Refresh"
    size="2xs"
    p={1}
    variant="outline"
    {...props}
  >
    <RepeatIcon />
  </IconButton>
);

export default RefreshButton;
