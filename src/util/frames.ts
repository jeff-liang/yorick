export function getParent(): Window {
  return window.parent.parent.parent;
}

export function getFrames(): Window {
  return getParent().frames;
}

export function chatIsCurrentlyActive(chatpane: Window): boolean {
  if (chatpane === undefined) return false;

  const url = chatpane.location.href;
  return ["mchat.php", "chat.html", "chat.php"].some((s) => url.includes(s));
}

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

    const url = frame.location.href;
    if (
      ["chatlaunch.php", "mchat.php", "chat.html", "chat.php"].some((s) =>
        url.endsWith(s),
      )
    ) {
      // Found chat pane, get its parent frameset
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

export function setupFrameWidths(
  parent: HTMLFrameSetElement,
  chatActive: boolean,
): void {
  if (!parent) return;

  const cols = parent.cols.split(",");
  const chatPaneIndex = cols.length - 1;
  const yorickPaneIndex = chatPaneIndex;

  // Insert yorick width before chat pane
  cols.splice(yorickPaneIndex, 0, "25%");

  // Set chat pane width based on active state
  cols[chatPaneIndex + 1] = chatActive ? cols[chatPaneIndex + 1] : "0";

  parent.cols = cols.join(",");
}

export function visibleFrameCount(): number {
  if (getFrames().length === 0) return -1;

  const rootset = getFrames().rootset;
  if (!rootset) {
    console.error("YORICK: Can't find rootset.");
    return -1;
  }

  return rootset.cols.split(",").length;
}

export function setup4Frames(): void {
  if (getFrames().length === 0) return;

  const rootset = getFrames().rootset;
  if (!rootset) {
    console.error("YORICK: Can't find rootset.");
    return;
  }

  const cols = rootset.cols.split(",");
  rootset.cols = [...cols.slice(0, 2), "25%", ...cols.slice(2)].join(",");
}

export function setup3Frames(): void {
  if (getFrames().length === 0) return;

  const rootset = getFrames().rootset;
  if (!rootset) {
    console.error("YORICK: Can't find rootset.");
    return;
  }

  const cols = rootset.cols.split(",");
  rootset.cols = [...cols.slice(0, 2), "25%"].join(",");
}

export function close(): void {
  const { pane: chatPane, parent: framesetParent } = findChatPane();
  if (!framesetParent || !chatPane || !chatPane.frameElement) return;

  const yorickPane = getFrames().yorickpane;
  if (!yorickPane?.frameElement) return;

  // Remove yorick's width from cols
  const cols = framesetParent.cols.split(",");
  const yorickIndex = Array.from(framesetParent.children).indexOf(
    yorickPane.frameElement,
  );

  if (yorickIndex >= 0) {
    // If chat is not active, restore its width to match other panes
    const chatIndex = Array.from(framesetParent.children).indexOf(
      chatPane.frameElement,
    );
    if (chatIndex >= 0 && !chatIsCurrentlyActive(chatPane)) {
      cols[chatIndex] = "533";
    }

    cols.splice(yorickIndex, 1);

    framesetParent.cols = cols.join(",");
  }

  delete getFrames().yorickpane;
  // function terminates after this line, as this removes the script context we're in.
  yorickPane.frameElement.remove();
}
