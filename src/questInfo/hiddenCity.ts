import { myPath } from "kolmafia";
import { $items, $path, have } from "libram";

export const MACHETES = $items`antique machete, muculent machete, machetito`;
export function haveMachete() {
  return MACHETES.some((item) => have(item));
}

export function lianasCanBeFree() {
  return myPath() !== $path`Avant Guard` && myPath() !== $path`BIG!`;
}
