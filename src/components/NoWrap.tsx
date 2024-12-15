import { Text, TextProps } from "@chakra-ui/react";
import { FC } from "react";

const NoWrap: FC<TextProps> = (props) => {
  return <Text whiteSpace="nowrap" {...props} />;
};

export default NoWrap;
