import { Stack } from "@chakra-ui/react";
import { useContext } from "react";

import Section from "../components/Section";
import TileErrorBoundary from "../components/TileErrorBoundary";
import NagContext from "../contexts/NagContext";

import Timeline from "./Timeline";

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
          {nagsList.map(([id, { node }]) => (
            <TileErrorBoundary key={id} name={id}>
              {node}
            </TileErrorBoundary>
          ))}
        </Section>
      )}
    </Stack>
  );
};

export default NagSection;
