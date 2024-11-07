import { Link, LinkProps, Spinner, Tooltip, useToast } from "@chakra-ui/react";
import {
  FC,
  forwardRef,
  MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { remoteCliExecute } from "tome-kolmafia-lib";
import { RefreshContext } from "tome-kolmafia-react";

export interface AsyncLinkProps extends Omit<LinkProps, "href"> {
  href?: string;
  command?: string;
}

const AsyncLink: FC<AsyncLinkProps> = forwardRef(
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
      <Tooltip label={command} fontSize="xs">
        {link}
      </Tooltip>
    ) : (
      link
    );
  },
);

export default AsyncLink;
