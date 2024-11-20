import { ButtonProps, IconButton } from "@chakra-ui/react";
import { RepeatIcon } from "lucide-react";
import { FC } from "react";

const RefreshButton: FC<ButtonProps> = (props) => (
  <IconButton
    asChild
    aria-label="Refresh"
    size="xs"
    p={1.5}
    variant="outline"
    backgroundColor="white"
    {...props}
  >
    <RepeatIcon />
  </IconButton>
);

export default RefreshButton;
