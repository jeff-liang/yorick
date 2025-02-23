import { Box, Flex, Stack, StackProps, Text } from "@chakra-ui/react";
import { appearanceRates, myLocation } from "kolmafia";
import { $location } from "libram";
import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { remoteCliExecute } from "tome-kolmafia-lib";
import { RefreshContext } from "tome-kolmafia-react";

import LOCATION_DATA from "../generated/locationData";
import { getFrames } from "../util/frames";
import { parentPlaceLink, parentPlaceNameLink } from "../util/links";
import { plural } from "../util/text";

import AutocompleteInput from "./AutocompleteInput";
import DetailedMonsters from "./DetailedMonsters";
import H2 from "./H2";
import MainLink from "./MainLink";

const MAX_AUTOCOMPLETE = 10;
const LOCATION_NAMES = LOCATION_DATA.filter(
  ([parent]) => parent !== "Obsolete",
).map(([parent, name]) => `${parent}: ${name}`);

const LocationBar: FC<StackProps> = (props) => {
  const { triggerHardRefresh } = useContext(RefreshContext);
  const [showDetails, setShowDetails] = useState(false);
  const [autoValue, setAutoValue] = useState("");
  const [autoHasFocus, setAutoHasFocus] = useState(false);
  const [autoFocusCount, setAutoFocusCount] = useState(0);
  const locationFieldRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDownGlobal = useCallback((event: KeyboardEvent) => {
    if (
      event.target?.constructor?.name !== "HTMLInputElement" &&
      event.key === "\\" &&
      !event.metaKey &&
      !event.altKey &&
      !event.shiftKey &&
      !event.ctrlKey
    ) {
      setAutoHasFocus(true);
      setAutoFocusCount((count) => count + 1);
      locationFieldRef.current?.focus();
      event.preventDefault();
    }
  }, []);

  useEffect(() => {
    locationFieldRef.current?.focus();
  }, [autoFocusCount]);

  useEffect(() => {
    const frameList = Array.from(new Array(getFrames().length).keys()).map(
      (i) => getFrames()[i],
    );
    for (const frame of frameList) {
      // use the .onX to avoid adding copies of listeners in dev mode.
      frame.onkeydown = handleKeyDownGlobal;
      const frameElement = frame.frameElement as HTMLFrameElement;
      frameElement.onload = (event: Event) => {
        const frameElement2 = event.target as HTMLFrameElement;
        if (frameElement2.contentWindow) {
          frameElement2.contentWindow.onkeydown = handleKeyDownGlobal;
        }
      };
    }
  }, [handleKeyDownGlobal, locationFieldRef]);

  const handleSubmit = useCallback(
    async (current: string | null) => {
      if (current !== null) {
        const [zone, location] = current.split(": ", 2);
        if (location !== undefined) {
          remoteCliExecute(`set nextAdventure = ${location}`);
          triggerHardRefresh();
          setAutoValue("");
          const mainpane = window.parent.parent.mainpane;
          if (mainpane) {
            const link = parentPlaceNameLink(location, zone);
            if (link) {
              mainpane.location.href = link;
            }
          }
        }
      }
    },
    [triggerHardRefresh],
  );

  const location = myLocation();
  const nowhere = location === $location`none`;
  const combatQueue = (location.combatQueue ?? "").split(";").filter((s) => s);
  const noncombatQueue = (location.noncombatQueue ?? "")
    .split(";")
    .filter((s) => s);

  const isOpen = showDetails || autoHasFocus;

  return (
    <Flex
      direction="column"
      w="100%"
      maxH="100vh"
      onMouseOver={() => setShowDetails(true)}
      onMouseOut={() => setShowDetails(false)}
      backgroundColor="white"
    >
      <Stack
        w="100%"
        minH={0}
        flex="0 1 auto"
        py={2}
        px={3}
        borderTop="1px solid"
        borderColor="gray.muted"
        fontSize="xs"
        display={isOpen ? "flex" : "none"}
      >
        <H2>{location.identifierString}</H2>
        <Box flex="0 1 auto" overflow="scroll">
          <DetailedMonsters location={location} />
        </Box>
        <Text>
          Combat Queue:{" "}
          {combatQueue.length === 0 ? "empty" : combatQueue.join(" → ")}
        </Text>
        {(appearanceRates(location).none ?? 0) > 0 && (
          <Text>
            Noncombat Queue:{" "}
            {noncombatQueue.length === 0 ? "empty" : noncombatQueue.join(" → ")}
          </Text>
        )}
        <AutocompleteInput
          placeholder="Go To Location (press \)"
          allValues={LOCATION_NAMES}
          maxOptions={MAX_AUTOCOMPLETE}
          value={autoValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setAutoValue(event.target.value)
          }
          onSubmit={handleSubmit}
          onFocus={() => setAutoHasFocus(true)}
          onBlur={() => setAutoHasFocus(false)}
          hide={!showDetails && !autoHasFocus}
          ref={locationFieldRef}
        />
      </Stack>
      <Stack
        w="100%"
        py={2}
        px={3}
        direction="row"
        justify="space-between"
        borderTop="1px solid"
        borderColor="gray.muted"
        fontSize="xs"
        {...props}
      >
        <Text>
          <MainLink href={parentPlaceLink(location)}>
            {nowhere ? "No Location" : location.identifierString}
          </MainLink>
        </Text>
        {!nowhere && <Text>{plural(location.turnsSpent, "turn")} spent</Text>}
      </Stack>
    </Flex>
  );
};

export default LocationBar;
