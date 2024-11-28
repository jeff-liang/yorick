import { Link, LinkProps } from "@chakra-ui/react";
import { FC } from "react";

export type MainLinkProps = Omit<LinkProps, "href" | "target"> & {
  href?: string;
};

const MainLink: FC<MainLinkProps> = ({ href, children, ...props }) =>
  href ? (
    <Link target="mainpane" href={href} {...props}>
      {children}
    </Link>
  ) : (
    children
  );

export default MainLink;
