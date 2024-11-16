import { Flex, FlexProps, Image } from "@chakra-ui/react";
import { forwardRef } from "react";

interface TileImageProps extends FlexProps {
  imageUrl?: string;
  imageAlt?: string;
}

const TileImage = forwardRef<HTMLDivElement, TileImageProps>(
  ({ imageUrl, imageAlt, boxSize, ...props }, ref) =>
    imageUrl ? (
      <Flex ref={ref} direction="row" justify="center" {...props}>
        <Image src={imageUrl} alt={imageAlt} w={boxSize} fit="contain" />
      </Flex>
    ) : (
      <Flex w={boxSize} ref={ref} {...props} />
    ),
);

export default TileImage;
