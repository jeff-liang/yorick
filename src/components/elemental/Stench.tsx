import { FC, ReactNode } from "react";

import ElementName from "../ElementName";

export interface SpecificElementProps {
  children?: ReactNode;
}

const Stench: FC<SpecificElementProps> = ({ ...props }) => {
  return <ElementName element="stench" {...props} />;
};

export default Stench;
