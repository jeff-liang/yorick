import { ButtonProps, IconButton } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC } from "react";

export interface ChatButtonProps extends ButtonProps {
  direction: "left" | "right";
}

const ChatButton: FC<ChatButtonProps> = ({ direction, ...props }) => (
  <IconButton
    asChild
    aria-label="Refresh"
    _hover={{ bgColor: "bg.emphasized" }}
    bgColor="bg"
    size="2xs"
    p={1}
    variant="outline"
    {...props}
  >
    {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
  </IconButton>
);

export default ChatButton;
