import { FC, ReactNode, useCallback, useState } from "react";

import NagContext, { NagWithPriority } from "./NagContext";

export interface NagContextProviderProps {
  children?: ReactNode;
}

const NagContextProvider: FC<NagContextProviderProps> = ({ children }) => {
  const [nags, setNags] = useState<Record<string, NagWithPriority>>({});

  const withNag = useCallback(
    (id: string, priority: number, imageUrl: string, node: ReactNode) => {
      setNags((oldNags) => {
        if (node) {
          return { ...oldNags, [id]: { priority, imageUrl, node } };
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = oldNags;
          return rest;
        }
      });
    },
    [setNags],
  );

  return (
    <NagContext.Provider value={{ nags, withNag }}>
      {children}
    </NagContext.Provider>
  );
};

export default NagContextProvider;
