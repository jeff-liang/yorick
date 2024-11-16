import { Stack, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";

import Section from "../components/Section";
import TileErrorBoundary from "../components/TileErrorBoundary";
import TileImage from "../components/TileImage";
import NagContext from "../contexts/NagContext";

import Timeline from "./Timeline";

const NAG_DISPLAY_LIMIT = 5;

const NagSection = () => {
  const { nags } = useContext(NagContext);
  const nagsList = [...Object.entries(nags)].sort(
    ([, { priority: priorityA }], [, { priority: priorityB }]) =>
      -(priorityA - priorityB),
  );
  return (
    <Stack
      top={0}
      position="sticky"
      backgroundColor="white"
      zIndex={100}
      pt="0.5rem"
      pb={2}
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <Timeline px={2} />
      {nagsList.length > 0 && (
        <Section name="Now">
          {nagsList.slice(0, NAG_DISPLAY_LIMIT).map(([id, { node }]) => (
            <TileErrorBoundary key={id} name={id}>
              {node}
            </TileErrorBoundary>
          ))}
          {nagsList.length > NAG_DISPLAY_LIMIT && (
            <Stack flexFlow="row wrap" px={2}>
              {nagsList
                .slice(NAG_DISPLAY_LIMIT)
                .map(([, { imageUrl, node }]) => (
                  <Tooltip
                    color="black"
                    bgColor="white"
                    border="1px solid black"
                    borderRadius="4px"
                    p={2}
                    label={node}
                  >
                    <TileImage imageUrl={imageUrl} />
                  </Tooltip>
                ))}
            </Stack>
          )}
        </Section>
      )}
    </Stack>
  );
};

export default NagSection;
