import { getWorkshed, totalTurnsPlayed } from "kolmafia";
import { $item, get, maxBy } from "libram";

export const ENV_COLORS: Record<string, string> = {
  X: "gray.solid",
  U: "red.solid",
  I: "blue.solid",
  O: "yellow.solid",
};

export const ENV_RESULTS: Record<string, string> = {
  X: "Fleshazole™",
  U: "Breathitin™",
  I: "Extrovermectin™",
  O: "Homebodyl™",
};

export interface CMCInfo {
  available: boolean;
  consults: number;
  turnsToConsult: number;
  environments: string[];
  maxEnvironment: string;
  result: string;
}

export function getCMCInfo(): CMCInfo {
  const cabinet = $item`cold medicine cabinet`;
  const workshed = getWorkshed();
  const consults = get("_coldMedicineConsults");

  if (workshed !== cabinet || consults >= 5) {
    return {
      available: false,
      consults,
      turnsToConsult: 0,
      environments: [],
      maxEnvironment: "X",
      result: ENV_RESULTS.X,
    };
  }

  const nextConsult = get("_nextColdMedicineConsult");
  const turnsToConsult = nextConsult - totalTurnsPlayed();

  const environments = [...get("lastCombatEnvironments").toUpperCase()];
  const counts: Record<string, number> = {};
  for (const c of environments) {
    counts[c] = (counts[c] ?? 0) + 1;
  }
  const maxEnvironment = maxBy(Object.keys(ENV_RESULTS), (c) => counts[c] ?? 0);
  const result =
    counts[maxEnvironment] >= 11 ? ENV_RESULTS[maxEnvironment] : ENV_RESULTS.X;

  return {
    available: true,
    consults,
    turnsToConsult,
    environments,
    maxEnvironment,
    result,
  };
}
