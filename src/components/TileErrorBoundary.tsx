import { Code, Link, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Tile from "./Tile";

interface TileErrorBoundaryProps {
  name: string;
  children: ReactNode;
}

const TileErrorBoundary: FC<TileErrorBoundaryProps> = ({ name, children }) => {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <Tile
          header={
            <Text as="span" color="red.fg">
              Error in tile {name}.
            </Text>
          }
          id={`${name}-error`}
          nonCollapsible
          bgColor="red.subtle"
          borderY="1px solid red"
          py={1}
        >
          <Code>{error.message}</Code>
          <Text>
            <Link
              href="https://github.com/loathers/yorick/issues"
              target="_blank"
            >
              Please report this on GitHub!
            </Link>
          </Text>
        </Tile>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default TileErrorBoundary;
