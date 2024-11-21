import { Box, Heading, Stack } from "@chakra-ui/react";
import { myDaycount, myTurncount } from "kolmafia";
import { useContext } from "react";

import Section from "../components/Section";
import TileErrorBoundary from "../components/TileErrorBoundary";
import TileImage from "../components/TileImage";
import { Tooltip } from "../components/ui/tooltip";
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
      {nagsList.length > 0 ? (
        <Section name={`Day ${myDaycount()} / Turn ${myTurncount()}`}>
          {nagsList.slice(0, NAG_DISPLAY_LIMIT).map(([id, { node }]) => (
            <TileErrorBoundary key={id} name={id}>
              {node}
            </TileErrorBoundary>
          ))}
          {nagsList.length > NAG_DISPLAY_LIMIT && (
            <Stack flexFlow="row wrap">
              {nagsList
                .slice(NAG_DISPLAY_LIMIT)
                .map(([id, { imageUrl, node }]) => {
                  return (
                    <Tooltip
                      key={id}
                      interactive
                      contentProps={{
                        color: "black",
                        bgColor: "white",
                        border: "1px solid black",
                        rounded: "md",
                        p: 2,
                      }}
                      content={<Box>{node}</Box>}
                    >
                      <TileImage imageUrl={imageUrl} />
                    </Tooltip>
                  );
                })}
            </Stack>
          )}
        </Section>
      ) : (
        <Heading as="h2" px={2}>
          Day {myDaycount()} / Turn {myTurncount()}
        </Heading>
      )}
    </Stack>
  );
};

export default NagSection;
