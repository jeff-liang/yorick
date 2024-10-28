import { ReactNode } from "react";

import ElementName from "../ElementName";

export interface SpecificElementProps {
  children?: ReactNode;
}

const Sleaze: FC<SpecificElementProps> = ({ ...props }) => {
  return <ElementName element="sleaze" {...props} />;
};

export default Sleaze;
