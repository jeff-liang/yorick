(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const CHAT_URLS = ["mchat.php", "chat.html", "chat.php"];
const CHAT_LAUNCH_URLS = ["chatlaunch.php", ...CHAT_URLS];
const DEFAULT_YORICK_WIDTH = "25%";
const DEFAULT_CHAT_WIDTH = "533";
const CHAT_WIDTH_WITH_YORICK = "25%";
function getParent() {
  return window.parent.parent.parent;
}
function getFrames() {
  return getParent().frames;
}
function chatIsCurrentlyActive(chatpane) {
  if (chatpane === void 0) return false;
  return CHAT_URLS.some((url) => chatpane.location.href.includes(url));
}
function findChatPane() {
  const allFrames = getFrames();
  if (!allFrames) return { pane: void 0, parent: void 0 };
  for (let i = 0; i < allFrames.length; i++) {
    const frame = allFrames[i];
    if (!frame || !frame.location) continue;
    if (CHAT_LAUNCH_URLS.some((url) => frame.location.href.endsWith(url))) {
      const frameElement = frame.frameElement;
      if (!(frameElement == null ? void 0 : frameElement.parentElement)) continue;
      return {
        pane: frame,
        parent: frameElement.parentElement
      };
    }
  }
  return { pane: void 0, parent: void 0 };
}
function setupFrameWidths(parent, chatPaneIndex, chatActive) {
  const columnWidths = parent.cols.split(",");
  columnWidths[chatPaneIndex] = chatActive ? columnWidths[chatPaneIndex] : "0";
  columnWidths.splice(chatPaneIndex, 0, DEFAULT_YORICK_WIDTH);
  parent.cols = columnWidths.join(",");
}
function toggleChatPane() {
  const { pane: chatPane, parent: framesetParent } = findChatPane();
  if (!(chatPane == null ? void 0 : chatPane.frameElement) || !framesetParent) return false;
  const columnWidths = framesetParent.cols.split(",");
  const chatIndex = [...framesetParent.children].indexOf(chatPane.frameElement);
  if (chatIndex < 0) return false;
  const currentWidth = columnWidths[chatIndex];
  const isVisible = currentWidth !== "0";
  columnWidths[chatIndex] = isVisible ? "0" : CHAT_WIDTH_WITH_YORICK;
  framesetParent.cols = columnWidths.join(",");
  return !isVisible;
}
function isChatPaneVisible() {
  const { pane: chatPane, parent: framesetParent } = findChatPane();
  if (!(chatPane == null ? void 0 : chatPane.frameElement) || !framesetParent) return false;
  const columnWidths = framesetParent.cols.split(",");
  const chatIndex = [...framesetParent.children].indexOf(chatPane.frameElement);
  return chatIndex >= 0 && columnWidths[chatIndex] !== "0";
}
function close() {
  const { pane: chatPane, parent: framesetParent } = findChatPane();
  if (!framesetParent || !chatPane || !chatPane.frameElement) return;
  const yorickPane = getFrames().yorickpane;
  if (!(yorickPane == null ? void 0 : yorickPane.frameElement)) return;
  const columnWidths = framesetParent.cols.split(",");
  const yorickIndex = Array.from(framesetParent.children).indexOf(
    yorickPane.frameElement
  );
  if (yorickIndex >= 0) {
    const chatIndex = Array.from(framesetParent.children).indexOf(
      chatPane.frameElement
    );
    if (chatIndex >= 0 && !chatIsCurrentlyActive(chatPane)) {
      columnWidths[chatIndex] = DEFAULT_CHAT_WIDTH;
    }
    columnWidths.splice(yorickIndex, 1);
    framesetParent.cols = columnWidths.join(",");
  }
  delete getFrames().yorickpane;
  yorickPane.frameElement.remove();
}
export {
  getParent as a,
  chatIsCurrentlyActive as b,
  close as c,
  findChatPane as f,
  getFrames as g,
  isChatPaneVisible as i,
  setupFrameWidths as s,
  toggleChatPane as t
};
