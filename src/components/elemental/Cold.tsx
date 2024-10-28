import { FC, ReactNode } from "react";

import ElementName from "../ElementName";

export interface SpecificElementProps {
  children?: ReactNode;
}

const Cold: FC<SpecificElementProps> = ({ ...props }) => {
  return <ElementName element="cold" {...props} />;
};

export default Cold;
