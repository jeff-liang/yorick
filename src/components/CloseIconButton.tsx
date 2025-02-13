import { ButtonProps, IconButton } from "@chakra-ui/react";
import { XIcon } from "lucide-react";
import { FC } from "react";

const CloseIconButton: FC<ButtonProps> = (props) => (
  <IconButton
    asChild
    aria-label="Close"
    size="2xs"
    _hover={{ bgColor: "bg.emphasized" }}
    bgColor="bg"
    p={1}
    variant="outline"
    {...props}
  >
    <XIcon />
  </IconButton>
);

export default CloseIconButton;
