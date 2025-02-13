export function getParent(): Window {
  return window.parent.parent.parent;
}

export function getFrames(): Window {
  return getParent().frames;
}

export function chatIsCurrentlyActive(): boolean {
  const chatpane = getFrames().chatpane;
  if (chatpane === undefined) return false;

  const url = chatpane.location.href;
  return ["mchat.php", "chat.html", "chat.php"].some((s) => url.includes(s));
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
  if (getFrames().length === 0) return;

  setup3Frames();

  const allFrames = getFrames();
  allFrames.yorickpane?.frameElement?.remove();
  delete allFrames.yorickpane;
}
