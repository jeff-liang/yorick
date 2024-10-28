import { FC, ReactNode } from "react";

import ElementName from "../ElementName";

export interface SpecificElementProps {
  children?: ReactNode;
}

const Spooky: FC<SpecificElementProps> = ({ ...props }) => {
  return <ElementName element="spooky" {...props} />;
};

export default Spooky;
