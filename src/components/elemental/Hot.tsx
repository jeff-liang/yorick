import { FC, ReactNode } from "react";

import ElementName from "../ElementName";

export interface SpecificElementProps {
  children?: ReactNode;
}

const Hot: FC<SpecificElementProps> = ({ ...props }) => {
  return <ElementName element="hot" {...props} />;
};

export default Hot;
