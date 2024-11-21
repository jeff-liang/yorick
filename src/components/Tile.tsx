import {
  Box,
  Heading,
  HStack,
  IconButton,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import { decode } from "html-entities";
import { Familiar, Item, Skill } from "kolmafia";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FC, ReactNode, useState } from "react";

import useLocalStorage from "../hooks/useLocalStorage";
import { inDevMode } from "../util/env";
import { capitalizeWords } from "../util/text";

import ContentButtons from "./ContentButtons";
import MainLink from "./MainLink";
import TileImage from "./TileImage";

export interface TileProps extends StackProps {
  header?: ReactNode;
  headerSuffix?: ReactNode;
  // If header is not a string and there is no linkedContent, id must be set
  // to ensure persistent collapsing. Tiles will throw an error otherwise.
  id?: string;
  imageUrl?: string;
  imageAlt?: string;
  icon?: ReactNode;
  href?: string;
  disabled?: boolean;
  linkedContent?: Item | Familiar | Skill;
  linkHide?: boolean;
  linkEntireTile?: boolean;
  extraLinks?: ReactNode;
  tooltip?: ReactNode;
  nonCollapsible?: boolean;
  children?: ReactNode;
}

const Tile: FC<TileProps> = ({
  header,
  headerSuffix,
  id,
  imageUrl,
  imageAlt,
  icon,
  href,
  disabled,
  children,
  linkedContent,
  linkHide = false,
  linkEntireTile = false,
  extraLinks,
  tooltip,
  nonCollapsible,
  ...props
}) => {
  const storageId =
    id ||
    linkedContent?.identifierString ||
    (typeof header === "string" ? header : null) ||
    null;
  if (storageId === null && inDevMode()) {
    throw new Error(`Tile (unknown) needs an id parameter.`);
  }

  const [lastStorageId] = useState(storageId);
  if (storageId !== lastStorageId && inDevMode()) {
    throw new Error(
      `Tile ${header} needs an id parameter (saw storageId change).`,
    );
  }

  const [collapsed, setCollapsed] = useLocalStorage(
    `collapse-${storageId}`,
    false,
  );

  const headerMain =
    header ??
    (linkedContent?.identifierString
      ? capitalizeWords(decode(linkedContent.identifierString))
      : undefined);
  const heading =
    headerMain && headerSuffix ? `${headerMain} ${headerSuffix}` : headerMain;

  const imageSize = collapsed || disabled ? "20px" : "30px";

  const tileContents = (
    <VStack align="stretch" gap={0.5}>
      <HStack gap={1} align="center">
        <Heading as="h3" size="md">
          {!collapsed && !disabled && !linkEntireTile && href ? (
            <MainLink href={href}>{heading}</MainLink>
          ) : (
            heading
          )}
        </Heading>
        <HStack
          gap={1}
          css={{
            ".chakra-portal &": {
              display: "none",
            },
          }}
        >
          {!collapsed && tooltip}
          {!collapsed && linkedContent && !linkHide && (
            <ContentButtons linkedContent={linkedContent} />
          )}
          {!collapsed && extraLinks}
          {disabled || nonCollapsible || (
            <IconButton
              asChild
              aria-label="Collapse"
              h={4}
              minW={4}
              fontSize="20px"
              variant="ghost"
              onClick={() => setCollapsed((collapsed) => !collapsed)}
            >
              {collapsed ? <ChevronUp /> : <ChevronDown />}
            </IconButton>
          )}
        </HStack>
      </HStack>
      {!collapsed && !disabled && children}
    </VStack>
  );

  return (
    <HStack
      align="stretch"
      color={collapsed || disabled ? "gray.solid" : undefined}
      {...props}
    >
      <Box
        w="30px"
        flexShrink={0}
        css={{
          ".chakra-portal &": {
            display: "none",
          },
        }}
      >
        {icon ?? (
          <TileImage
            imageUrl={
              imageUrl ??
              (linkedContent?.image
                ? `/images/itemimages/${linkedContent?.image}`
                : undefined)
            }
            imageAlt={
              imageAlt ?? (typeof header === "string" ? header : undefined)
            }
            mt={collapsed || disabled ? 0 : 1}
            mb="auto"
            mx={collapsed || disabled ? "auto" : undefined}
            boxSize={imageSize}
          />
        )}
      </Box>
      {!collapsed && !disabled && linkEntireTile ? (
        <MainLink href={href}>{tileContents}</MainLink>
      ) : (
        tileContents
      )}
    </HStack>
  );
};

export default Tile;
