import { Portal, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import React, { RefObject, useContext } from "react";

import { TooltipContext } from "../../contexts/TooltipContext";

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (props, ref) => {
    const {
      showArrow,
      children,
      disabled,
      portalled,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props;

    const containerRef = useContext(TooltipContext);

    if (disabled) return children;

    rest.openDelay ??= 200;

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal
          disabled={!portalled}
          container={
            portalRef ??
            (containerRef.current
              ? (containerRef as RefObject<HTMLElement>)
              : undefined)
          }
        >
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  },
);
