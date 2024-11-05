import { Familiar } from "kolmafia";
import { totalFamiliarWeight } from "libram";
import { useEffect, useState } from "react";

function useMaxObservedWeight(familiar: Familiar) {
  const [maxObservedWeight, setMaxObservedWeight] = useState(20);
  const Weight = totalFamiliarWeight(familiar, true);

  useEffect(() => {
    if (Weight > maxObservedWeight) {
      setMaxObservedWeight(Weight);
    }
  }, [Weight, maxObservedWeight]);

  return maxObservedWeight;
}

export default useMaxObservedWeight;
