import { Box, Image, ImageProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface TileImageProps extends ImageProps {
  imageUrl?: string;
  imageAlt?: string;
}

const TileImage = forwardRef<HTMLDivElement, TileImageProps>(
  ({ imageUrl, imageAlt, boxSize, ...props }, ref) =>
    imageUrl ? (
      <Box ref={ref}>
        <Image src={imageUrl} alt={imageAlt} fit="contain" {...props} />
      </Box>
    ) : (
      <Box w={boxSize} ref={ref} />
    ),
);

export default TileImage;
