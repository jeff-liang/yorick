import { Icon, Text, TextProps } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { FC } from "react";

export interface ChevronsProps extends TextProps {
  usesLeft: number;
  totalUses: number;
}

/**
 * Generate fading chevrons to describe # of a resource left out of total casts
 * @returns Three <List.Indicator> objects colored by availability of the resource
 * @param usesLeft How many casts/uses you have left of the resource
 * @param totalUses Total number of uses the users has
 */
const Chevrons: FC<ChevronsProps> = ({ usesLeft, totalUses, ...props }) => {
  return (
    <Text as="span" verticalAlign="middle" whiteSpace="nowrap" {...props}>
      {new Array(totalUses).fill(null).map((_, index) => (
        <Icon // I tried a few types of icons. This was the best, for now.
          key={index}
          color={index < usesLeft ? "black" : "gray.400"}
          fontWeight={300}
          ml={-2}
        >
          <ChevronRight />
        </Icon>
      ))}
    </Text>
  );
};

export default Chevrons;
