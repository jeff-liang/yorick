import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  compoundVariants: [
    {
      colorPalette: "gray",
      variant: "solid",
      css: {
        bgColor: "gray.500",
        _hover: {
          bgColor: "gray.700",
        },
        _dark: {
          _hover: {
            bgColor: "gray.300",
          },
        },
      },
    },
  ],
});

const linkRecipe = defineRecipe({
  base: {
    display: "inline",
  },
});

const config = defineConfig({
  globalCss: {
    html: {
      lineHeight: "moderate",
      overflow: "hidden",
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
    recipes: {
      button: buttonRecipe,
      link: linkRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
