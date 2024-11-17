import { createContext, ReactNode } from "react";

export enum NagPriority {
  // CMC (not a tile) goes before anything
  CMC = 200,
  // User is probably making a mistake.
  ERROR = 150,
  // Something the user should really do immediately.
  IMMEDIATE = 100,
  // Default.
  MID = 50,
  // Something user needs to pay attention to, but not right this second.
  LOW = 0,
}

export type NagWithPriority = {
  priority: number;
  imageUrl: string;
  node: ReactNode;
};

export interface NagContextValue {
  // Map from priority to list of nodes at that priority.
  nags: Record<string, NagWithPriority>;
  withNag(
    id: string,
    priority: number,
    imageUrl: string,
    node: ReactNode,
  ): void;
}

const NagContext = createContext<NagContextValue>({
  nags: {},
  withNag() {},
});

export default NagContext;
