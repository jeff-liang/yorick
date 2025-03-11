import {
  chatIsCurrentlyActive,
  findChatPane,
  getFrames,
  getParent,
  setupFrameWidths,
} from "./util/frames";

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

const SINCE_REVISION = 28385;

function load() {
  const revision = window.parent.parent.revision;
  // Skip version check for custom build.
  if (revision !== undefined && 0 < revision && revision < SINCE_REVISION) {
    document.body.innerHTML = `<h1>Need KoLmafia at least version ${SINCE_REVISION} for YORICK (you have ${revision}).</h1>`;
    return;
  }

  const allFrames = getFrames();
  if (!allFrames) {
    console.error("YORICK: Failed to load. Can't find frames.");
    return;
  }

  const yorickPane = allFrames.yorickpane;
  if (yorickPane) {
    // Already opened YORICK. Reload pane.
    // eslint-disable-next-line no-self-assign
    yorickPane.location.href = yorickPane.location.href;
  } else {
    // Find chat pane and its parent frameset
    const { pane: chatPane, parent: framesetParent } = findChatPane();
    if (!chatPane || !framesetParent) {
      console.error("YORICK: Failed to load. Can't find chat pane.");
      return;
    }

    // Create yorick frame
    const frameElement = getParent().document.createElement("frame");
    frameElement.id = "yorickpane";
    frameElement.src = "/yorick/index.html";

    // Insert before chat pane
    framesetParent.insertBefore(frameElement, chatPane.frameElement);

    // Setup frame widths
    setupFrameWidths(framesetParent, chatIsCurrentlyActive(chatPane));

    if (frameElement.contentWindow) {
      allFrames.yorickpane = frameElement.contentWindow;
    }
  }

  const mainpane = getParent().frames.mainpane;
  if (mainpane) mainpane.location.href = "/main.php";
}

load();
