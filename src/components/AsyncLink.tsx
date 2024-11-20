import { Link, LinkProps, Spinner } from "@chakra-ui/react";
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

import { toaster } from "./ui/toaster";
import { Tooltip } from "./ui/tooltip";

export interface AsyncLinkProps extends Omit<LinkProps, "href"> {
  href?: string;
  command?: string;
}

const AsyncLink = forwardRef<HTMLAnchorElement, AsyncLinkProps>(
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
      async (event: MouseEvent<HTMLAnchorElement>) => {
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

    const link = (
      <Link ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
    return isLoading ? (
      <Link
        ref={ref}
        {...props}
        textDecoration="none !important"
        pointerEvents="none"
        color="gray.500"
      >
        {children} <Spinner as="span" size="xs" />
      </Link>
    ) : command ? (
      <Tooltip content={command}>{link}</Tooltip>
    ) : (
      link
    );
  },
);

export default AsyncLink;
