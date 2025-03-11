import {
  chatIsCurrentlyActive,
  findChatPane,
  getFrames,
  getParent,
  setupFrameWidths,
} from "./util/frames";

/**
 * Type declarations for global window properties used by YORICK
 */
declare global {
  interface Window {
    revision?: number;
    rootset?: HTMLFrameSetElement;
    charpane?: Window;
    chatpane?: Window;
    mainpane?: Window;
    yorickpane?: Window;
    XMLHttpRequest: typeof XMLHttpRequest;
  }
}

const MINIMUM_REVISION = 28385;

/**
 * Initializes or reloads the YORICK interface
 * This function handles:
 * 1. Version compatibility check
 * 2. Frame setup and management
 * 3. Integration with existing chat pane
 */
function load() {
  // Check KoLmafia version compatibility
  const currentRevision = window.parent.parent.revision;
  if (
    currentRevision !== undefined &&
    0 < currentRevision &&
    currentRevision < MINIMUM_REVISION
  ) {
    document.body.innerHTML = `<h1>Need KoLmafia at least version ${MINIMUM_REVISION} for YORICK (you have ${currentRevision}).</h1>`;
    return;
  }

  // Verify frames are available
  const allFrames = getFrames();
  if (!allFrames) {
    console.error("YORICK: Failed to load. Can't find frames.");
    return;
  }

  const existingYorickPane = allFrames.yorickpane;
  if (existingYorickPane) {
    // Reload existing YORICK pane
    existingYorickPane.location.reload();
  } else {
    // Initialize new YORICK pane
    const { pane: chatPane, parent: framesetParent } = findChatPane();
    if (!chatPane?.frameElement || !framesetParent) {
      console.error("YORICK: Failed to load. Can't find chat pane.");
      return;
    }

    // Create and configure YORICK frame
    const yorickFrame = getParent().document.createElement("frame");
    yorickFrame.id = "yorickpane";
    yorickFrame.src = "/yorick/index.html";

    const chatPaneElement = chatPane.frameElement;
    const chatPaneIndex = [...framesetParent.childNodes].indexOf(
      chatPaneElement,
    );
    if (chatPaneIndex <= 0) {
      console.error(
        "YORICK: Failed to load. Can't find chat pane frame element.",
      );
      return;
    }

    // Insert YORICK frame before chat pane
    framesetParent.insertBefore(yorickFrame, chatPane.frameElement);

    // Configure frame layout
    setupFrameWidths(
      framesetParent,
      chatPaneIndex,
      chatIsCurrentlyActive(chatPane),
    );

    // Register YORICK frame in global frames
    if (yorickFrame.contentWindow) {
      allFrames.yorickpane = yorickFrame.contentWindow;
    }
  }

  // Refresh main pane
  const mainPane = getParent().frames.mainpane;
  if (mainPane) mainPane.location.href = "/main.php";
}

// Initialize YORICK
load();
