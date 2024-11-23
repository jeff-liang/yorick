import { Box, Container, Flex, Separator, Stack } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { setGlobalErrorHandler } from "tome-kolmafia-lib";
import { RefreshContext } from "tome-kolmafia-react";

import BrandHeading from "./components/BrandHeading";
import ChatButton from "./components/ChatButton";
import LocationBar from "./components/LocationBar";
import PrefsButton from "./components/PrefsButton";
import RefreshButton from "./components/RefreshButton";
import { toaster, Toaster } from "./components/ui/toaster";
import { TooltipContext } from "./contexts/TooltipContext";
import { addDevelopmentListeners } from "./prefs/addListeners";
import NagSection from "./sections/NagSection";
import QuestSection from "./sections/QuestSection";
import ResourceSection from "./sections/ResourceSection";
import { inDevMode } from "./util/env";
import { setup3Frames, setup4Frames, visibleFrameCount } from "./util/frames";

const Layout = () => {
  const { triggerHardRefresh } = useContext(RefreshContext);
  const tooltipRef = useRef<HTMLElement>();

  const [chatFrameOpen, setChatFrameOpen] = useState(visibleFrameCount() >= 4);
  const toggleChatFrame = useCallback(() => {
    if (visibleFrameCount() >= 4) {
      setup3Frames();
      setChatFrameOpen(false);
    } else {
      setup4Frames();
      setChatFrameOpen(true);
    }
  }, []);

  useEffect(() => {
    if (inDevMode()) {
      // Refresh trigger for dev override interface.
      window.addEventListener("message", (event: MessageEvent) => {
        if (
          event.origin === "http://localhost:3000" &&
          event.data === "refresh"
        ) {
          triggerHardRefresh();
        }
      });

      addDevelopmentListeners();
    }
  }, [triggerHardRefresh]);

  useEffect(() => {
    setGlobalErrorHandler((err) => {
      console.error(err);
      toaster.error({
        title: "Error updating.",
        description:
          err !== null && (typeof err === "object" || typeof err === "string")
            ? err.toString()
            : "Unknown error.",
        duration: 10000,
      });
    });
  }, []);

  return (
    <TooltipContext.Provider value={tooltipRef}>
      <Container
        maxW="4xl"
        paddingX={0}
        fontSize="sm"
        h="100vh"
        display="flex"
        flexDirection="column"
      >
        <Flex position="relative" minH={0}>
          <Stack
            direction="row"
            gap={1}
            position="absolute"
            top={1}
            right={1}
            zIndex={200}
          >
            {inDevMode() && <PrefsButton />}
            <RefreshButton onClick={triggerHardRefresh} />
          </Stack>
          <Box overflow="scroll">
            <BrandHeading />
            <Stack>
              <NagSection />
              <QuestSection />
              <Separator />
              <ResourceSection />
            </Stack>
          </Box>
          <ChatButton
            direction={chatFrameOpen ? "right" : "left"}
            onClick={toggleChatFrame}
            position="absolute"
            bottom={1}
            right={1}
            zIndex={200}
          />
        </Flex>
        <LocationBar />
        <Toaster />
        <Box ref={tooltipRef} />
      </Container>
    </TooltipContext.Provider>
  );
};

export default Layout;
