import { ButtonProps, forwardRef, Tooltip, useToast } from "@chakra-ui/react";
import {
  FC,
  MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { remoteCliExecute } from "tome-kolmafia-lib";
import { RefreshContext } from "tome-kolmafia-react";

import HeaderButton from "./HeaderButton";

export interface AsyncButtonProps extends ButtonProps {
  href?: string;
  command?: string;
}

const AsyncButton: FC<AsyncButtonProps> = forwardRef(
  ({ href, command, onClick, children, ...props }, ref) => {
    const { triggerHardRefresh } = useContext(RefreshContext);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const onClickWithCommand = useMemo(
      () =>
        command && !onClick
          ? async () => {
              const result = await remoteCliExecute(command);
              if (result?.functions?.[0] === false) {
                toast({
                  title: "Command failed.",
                  description: `Failed to execute "${command}".`,
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
              }
            }
          : onClick,
      [command, onClick, toast],
    );

    const handleClick = useCallback(
      async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsLoading(true);
        await (onClickWithCommand
          ? onClickWithCommand(event)
          : href && fetch(href).then((response) => response.text()));
        setIsLoading(false);
        triggerHardRefresh();
      },
      [href, onClickWithCommand, triggerHardRefresh],
    );

    return (
      <HeaderButton
        isLoading={isLoading}
        href={href}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {command ? (
          <Tooltip label={command} fontSize="xs">
            {children}
          </Tooltip>
        ) : (
          children
        )}
      </HeaderButton>
    );
  },
);

AsyncButton.displayName = "AsyncButton";

export default AsyncButton;
