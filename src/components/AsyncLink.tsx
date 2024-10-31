import { Link, LinkProps, Spinner, Tooltip } from "@chakra-ui/react";
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

    const onClickWithCommand = useMemo(
      () =>
        command && !onClick
          ? async () => {
              await remoteCliExecute(command);
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
      <Tooltip label={command} fontSize="xs">
        {link}
      </Tooltip>
    ) : (
      link
    );
  },
);

export default AsyncLink;
