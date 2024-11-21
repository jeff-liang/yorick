import { ButtonProps, Text } from "@chakra-ui/react";
import {
  forwardRef,
  MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { remoteCliExecute } from "tome-kolmafia-lib";
import { RefreshContext } from "tome-kolmafia-react";

import HeaderButton from "./HeaderButton";
import { toaster } from "./ui/toaster";
import { Tooltip } from "./ui/tooltip";

export interface AsyncButtonProps extends ButtonProps {
  href?: string;
  command?: string;
}

const AsyncButton = forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ href, command, onClick, children, ...props }, ref) => {
    const { triggerHardRefresh } = useContext(RefreshContext);
    const [isLoading, setIsLoading] = useState(false);

    const onClickWithCommand = useMemo(
      () =>
        command && !onClick
          ? async () => {
              const result = await remoteCliExecute(command);
              if (result === false) {
                toaster.error({
                  title: "Command failed.",
                  description: `Failed to execute "${command}".`,
                  duration: 5000,
                });
              }
            }
          : onClick,
      [command, onClick],
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
        loading={isLoading}
        href={href}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {command ? (
          <Tooltip content={command}>
            {typeof children === "string" ? (
              <Text as="span">{children}</Text>
            ) : (
              children
            )}
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
