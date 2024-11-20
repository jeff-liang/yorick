import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonProps, IconButton } from "@chakra-ui/react";
import { FC } from "react";

export interface ChatButtonProps extends ButtonProps {
  direction: "left" | "right";
}

const ChatButton: FC<ChatButtonProps> = ({ direction, ...props }) => (
  <IconButton
    asChild
    aria-label="Refresh"
    size="xs"
    fontSize="20px"
    variant="outline"
    backgroundColor="white"
    {...props}
  >
    {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
  </IconButton>
);

export default ChatButton;
