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

const textRecipe = defineRecipe({
  base: {
    lineHeight: "moderate",
  },
});

const headingRecipe = defineRecipe({
  base: {
    lineHeight: "moderate",
  },
});

const config = defineConfig({
  // globalCss: {
  //   html: {
  //     lineHeight: "moderate",
  //   },
  // },
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
      heading: headingRecipe,
      text: textRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
