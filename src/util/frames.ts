/**
 * Constants for frame-related URLs and dimensions
 */
const CHAT_URLS = ["mchat.php", "chat.html", "chat.php"] as const;
const CHAT_LAUNCH_URLS = ["chatlaunch.php", ...CHAT_URLS] as const;
const DEFAULT_YORICK_WIDTH = "25%";
const DEFAULT_CHAT_WIDTH = "533";
const CHAT_WIDTH_WITH_YORICK = "25%";

/**
 * Gets the root window parent that contains all frames
 */
export function getParent(): Window {
  return window.parent.parent.parent;
}

/**
 * Gets all available frames from the root window
 */
export function getFrames(): Window {
  return getParent().frames;
}

/**
 * Checks if the chat pane is currently active based on its URL
 */
export function chatIsCurrentlyActive(chatpane: Window): boolean {
  if (chatpane === undefined) return false;
  return CHAT_URLS.some((url) => chatpane.location.href.includes(url));
}

/**
 * Finds the chat pane and its parent frameset element
 * @returns Object containing the chat pane window and its parent frameset element
 */
export function findChatPane(): {
  pane: Window | undefined;
  parent: HTMLFrameSetElement | undefined;
} {
  const allFrames = getFrames();
  if (!allFrames) return { pane: undefined, parent: undefined };

  // Search through all frames to find chat pane by URL
  for (let i = 0; i < allFrames.length; i++) {
    const frame = allFrames[i];
    if (!frame || !frame.location) continue;

    if (CHAT_LAUNCH_URLS.some((url) => frame.location.href.endsWith(url))) {
      const frameElement = frame.frameElement;
      if (!frameElement?.parentElement) continue;

      return {
        pane: frame,
        parent: frameElement.parentElement as HTMLFrameSetElement,
      };
    }
  }

  return { pane: undefined, parent: undefined };
}

/**
 * Configures frame widths in the parent frameset
 * @param parent The parent frameset element
 * @param chatActive Whether the chat pane is currently active
 */
export function setupFrameWidths(
  parent: HTMLFrameSetElement,
  chatActive: boolean,
): void {
  if (!parent) return;

  const columnWidths = parent.cols.split(",");
  const chatPaneIndex = columnWidths.length - 1;
  const yorickPaneIndex = chatPaneIndex;

  // Set chat pane width based on active state
  columnWidths[chatPaneIndex] = chatActive ? columnWidths[chatPaneIndex] : "0";

  // Insert yorick width before chat pane
  columnWidths.splice(yorickPaneIndex, 0, DEFAULT_YORICK_WIDTH);

  parent.cols = columnWidths.join(",");
}

/**
 * Toggles the chat pane visibility
 * @returns The new visibility state of the chat pane
 */
export function toggleChatPane(): boolean {
  const { pane: chatPane, parent: framesetParent } = findChatPane();
  if (!chatPane?.frameElement || !framesetParent) return false;

  const columnWidths = framesetParent.cols.split(",");
  const chatIndex = Array.from(framesetParent.children).indexOf(
    chatPane.frameElement,
  );

  if (chatIndex < 0) return false;

  const currentWidth = columnWidths[chatIndex];
  const isVisible = currentWidth !== "0";

  // Toggle chat pane width
  columnWidths[chatIndex] = isVisible ? "0" : CHAT_WIDTH_WITH_YORICK;
  framesetParent.cols = columnWidths.join(",");

  return !isVisible;
}

/**
 * Gets the chat pane visibility state
 * @returns true if chat pane is visible, false otherwise
 */
export function isChatPaneVisible(): boolean {
  const { pane: chatPane, parent: framesetParent } = findChatPane();
  if (!chatPane?.frameElement || !framesetParent) return false;

  const columnWidths = framesetParent.cols.split(",");
  const chatIndex = Array.from(framesetParent.children).indexOf(
    chatPane.frameElement,
  );

  return chatIndex >= 0 && columnWidths[chatIndex] !== "0";
}

/**
 * Closes the Yorick pane and restores the original frame layout
 */
export function close(): void {
  const { pane: chatPane, parent: framesetParent } = findChatPane();
  if (!framesetParent || !chatPane || !chatPane.frameElement) return;

  const yorickPane = getFrames().yorickpane;
  if (!yorickPane?.frameElement) return;

  // Remove yorick's width from cols
  const columnWidths = framesetParent.cols.split(",");
  const yorickIndex = Array.from(framesetParent.children).indexOf(
    yorickPane.frameElement,
  );

  if (yorickIndex >= 0) {
    // If chat is not active, restore its width to match other panes
    const chatIndex = Array.from(framesetParent.children).indexOf(
      chatPane.frameElement,
    );
    if (chatIndex >= 0 && !chatIsCurrentlyActive(chatPane)) {
      columnWidths[chatIndex] = DEFAULT_CHAT_WIDTH;
    }

    columnWidths.splice(yorickIndex, 1);
    framesetParent.cols = columnWidths.join(",");
  }

  delete getFrames().yorickpane;
  // function terminates after this line, as this removes the script context we're in.
  // (so it has to come last)
  yorickPane.frameElement.remove();
}
