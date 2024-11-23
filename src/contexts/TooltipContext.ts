import { createContext, createRef, RefObject } from "react";

export const TooltipContext =
  createContext<RefObject<HTMLElement | undefined>>(createRef());
