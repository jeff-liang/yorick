import { FC } from "react";

import ABooPeak from "./level9/ABooPeak";
import Angus from "./level9/Angus";
import OilPeak from "./level9/OilPeak";
import OrcChasm from "./level9/OrcChasm";
import TwinPeak from "./level9/TwinPeak";

const Level9: FC = () => {
  return (
    <>
      <OrcChasm />
      <Angus />
      <ABooPeak />
      <TwinPeak />
      <OilPeak />
    </>
  );
};

export default Level9;
