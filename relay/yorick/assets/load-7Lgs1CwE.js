import { g as getFrames, f as findChatPane, a as getParent, s as setupFrameWidths, b as chatIsCurrentlyActive } from "./frames-rNTNIV4O.js";
const MINIMUM_REVISION = 28385;
function load() {
  const currentRevision = window.parent.parent.revision;
  if (currentRevision !== void 0 && 0 < currentRevision && currentRevision < MINIMUM_REVISION) {
    document.body.innerHTML = `<h1>Need KoLmafia at least version ${MINIMUM_REVISION} for YORICK (you have ${currentRevision}).</h1>`;
    return;
  }
  const allFrames = getFrames();
  if (!allFrames) {
    console.error("YORICK: Failed to load. Can't find frames.");
    return;
  }
  const existingYorickPane = allFrames.yorickpane;
  if (existingYorickPane) {
    existingYorickPane.location.reload();
  } else {
    const { pane: chatPane, parent: framesetParent } = findChatPane();
    if (!(chatPane == null ? void 0 : chatPane.frameElement) || !framesetParent) {
      console.error("YORICK: Failed to load. Can't find chat pane.");
      return;
    }
    const yorickFrame = getParent().document.createElement("frame");
    yorickFrame.id = "yorickpane";
    yorickFrame.src = "/yorick/index.html";
    const chatPaneElement = chatPane.frameElement;
    const chatPaneIndex = [...framesetParent.childNodes].indexOf(
      chatPaneElement
    );
    if (chatPaneIndex <= 0) {
      console.error(
        "YORICK: Failed to load. Can't find chat pane frame element."
      );
      return;
    }
    framesetParent.insertBefore(yorickFrame, chatPane.frameElement);
    setupFrameWidths(
      framesetParent,
      chatPaneIndex,
      chatIsCurrentlyActive(chatPane)
    );
    if (yorickFrame.contentWindow) {
      allFrames.yorickpane = yorickFrame.contentWindow;
    }
  }
  const mainPane = getParent().frames.mainpane;
  if (mainPane) mainPane.location.href = "/main.php";
}
load();
