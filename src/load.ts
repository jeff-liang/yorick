import {
  chatIsCurrentlyActive,
  getFrames,
  getParent,
  setup3Frames,
  setup4Frames,
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

const SINCE_REVISION = 28100;

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
  }

  const yorickPane = allFrames.yorickpane;
  if (yorickPane) {
    // eslint-disable-next-line no-self-assign
    yorickPane.location.href = yorickPane.location.href;
  } else {
    const rootset = allFrames.rootset;
    if (!rootset) {
      console.error("YORICK: Failed to load. Can't find rootset.");
      return;
    }

    const chatpane = allFrames.chatpane;
    if (chatpane === undefined) {
      console.error("YORICK: Failed to load. Can't find chatpane.");
      return;
    }

    const frameElement = getParent().document.createElement("frame");
    frameElement.id = "yorickpane";
    frameElement.src = "/yorick/index.html";

    rootset.insertBefore(frameElement, chatpane.frameElement);

    if (chatIsCurrentlyActive()) {
      setup4Frames();
    } else {
      setup3Frames();
    }

    if (frameElement.contentWindow) {
      allFrames.yorickpane = frameElement.contentWindow;
    }
  }

  const mainpane = getParent().frames.mainpane;
  if (mainpane) mainpane.location.href = "/main.php";
}

load();
