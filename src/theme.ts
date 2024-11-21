import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    html: {
      lineHeight: "moderate",
    },
  },
  theme: {
    tokens: {
      lineHeights: {
        none: { value: 1 },
        shorter: { value: 1.05 },
        short: { value: 1.1 },
        moderate: { value: 1.15 },
        default: { value: 1.15 },
        tall: { value: 1.25 },
        taller: { value: 1.5 },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
