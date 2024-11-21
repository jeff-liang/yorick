import { forwardRef } from "react";

import MainLink from "./MainLink";
import { Button, ButtonProps } from "./ui/button";

interface HeaderButtonProps extends ButtonProps {
  href?: string;
}

const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  ({ href, onClick, children, ...props }, ref) => {
    const button = (
      <Button
        ref={ref}
        colorPalette="gray"
        size="xs"
        px={1}
        height={4}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    );
    return href && !onClick ? (
      <MainLink href={href} _hover={{ textDecoration: "none" }}>
        {button}
      </MainLink>
    ) : (
      button
    );
  },
);

HeaderButton.displayName = "HeaderButton";

export default HeaderButton;
