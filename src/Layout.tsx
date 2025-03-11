import { Box, Container, Flex, Separator, Stack } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { setGlobalErrorHandler } from "tome-kolmafia-lib";
import { RefreshContext } from "tome-kolmafia-react";

import BrandHeading from "./components/BrandHeading";
import ChatButton from "./components/ChatButton";
import CloseIconButton from "./components/CloseIconButton";
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
import { close, isChatPaneVisible, toggleChatPane } from "./util/frames";

const Layout = () => {
  const { triggerHardRefresh } = useContext(RefreshContext);
  const tooltipRef = useRef<HTMLElement>();
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const [chatFrameOpen, setChatFrameOpen] = useState(isChatPaneVisible());
  const toggleChatFrame = useCallback(() => {
    const isVisible = toggleChatPane();
    setChatFrameOpen(isVisible);
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
        fontSize={["xs", "sm"]}
        h="100vh"
        display="flex"
        flexDirection="column"
        onMouseEnter={() => setButtonsVisible(true)}
        onMouseLeave={() => setButtonsVisible(false)}
      >
        <Flex position="relative" minH={0} flex="1 1 auto">
          <Stack
            direction="row"
            position="absolute"
            top={1}
            left={1}
            zIndex={200}
            {...(!buttonsVisible && { display: "none" })}
          >
            <CloseIconButton onClick={close} />
          </Stack>
          <Stack
            direction="row"
            gap={1}
            position="absolute"
            top={1}
            right={5}
            zIndex={200}
            {...(!buttonsVisible && { display: "none" })}
          >
            {inDevMode() && <PrefsButton />}
            <RefreshButton onClick={triggerHardRefresh} />
          </Stack>
          <Box overflow="scroll" flexGrow={1}>
            <BrandHeading />
            <Stack>
              <NagSection />
              <QuestSection />
              <Separator />
              <ResourceSection />
            </Stack>
          </Box>
          <Flex
            position="absolute"
            h="100vh"
            right={5}
            align="center"
            pointerEvents="none"
            lineHeight={0}
            {...(!buttonsVisible && { display: "none" })}
          >
            <ChatButton
              direction={chatFrameOpen ? "right" : "left"}
              onClick={toggleChatFrame}
              zIndex={200}
              pointerEvents="auto"
            />
          </Flex>
        </Flex>
        <LocationBar />
        <Toaster />
        <Box ref={tooltipRef} />
      </Container>
    </TooltipContext.Provider>
  );
};

export default Layout;
