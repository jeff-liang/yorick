import { Box, Image, ImageProps } from "@chakra-ui/react";

interface Props extends ImageProps {
  imageUrl?: string;
  imageAlt?: string;
}

const TileImage: FC<Props> = ({ imageUrl, imageAlt, boxSize, ...props }) =>
  imageUrl ? (
    <Image src={imageUrl} alt={imageAlt} fit="contain" {...props} />
  ) : (
    <Box w={boxSize} />
  );

export default TileImage;
