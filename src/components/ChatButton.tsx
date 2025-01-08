import { Button, ButtonProps, Text } from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FC } from "react";

export interface ChatButtonProps extends ButtonProps {
  direction: "left" | "right";
}

const ChatButton: FC<ChatButtonProps> = ({ direction, ...props }) => (
  <Button
    asChild
    aria-label="Refresh"
    _hover={{ bgColor: "bg.emphasized" }}
    bgColor="bg"
    p={1}
    size={"xs"}
    variant="outline"
    height={"fit-content"}
    {...props}
  >
    <Text rotate={"-90deg"}>
      Chat {direction === "left" ? <ChevronUp /> : <ChevronDown />}
    </Text>
  </Button>
);

export default ChatButton;
