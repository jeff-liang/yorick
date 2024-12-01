import {
  addOverrideListener,
  isIdentifiedType,
  Override,
  OverrideListener,
} from "tome-kolmafia-lib";

import { jsName, maybeEmpty, overrideName } from "./util/overrides";

export function addDevelopmentListeners() {
  addOverrideListener(<T>(name: string, args: unknown[]) => {
    const firstArg = args[0];
    if (name === "getProperty" && typeof firstArg === "string") {
      const override = localStorage.getItem(overrideName(name, args));
      if (override !== null) {
        return {
          applied: true,
          value: maybeEmpty(override) as T,
        };
      }
    } else if (
      (name === "availableAmount" && isIdentifiedType(firstArg, "Item")) ||
      (name === "haveEffect" && isIdentifiedType(firstArg, "Effect"))
    ) {
      const override = localStorage.getItem(overrideName(name, args));
      if (override !== null) {
        return { applied: true, value: parseInt(override) as T };
      }
    }
    return { applied: false };
  });
  addOverrideListener((<T>(
    name: string,
    args: unknown[],
    value?: T,
  ): Override<T> => {
    let applied = false;
    if (isIdentifiedType(value, "Location")) {
      const turnsSpentOverride = localStorage.getItem(
        `override:${jsName(value)}.turnsSpent`,
      );
      const noncombatQueueOverride = localStorage.getItem(
        `override:${jsName(value)}.noncombatQueue`,
      );
      if (turnsSpentOverride !== null) {
        applied = true;
        value = { ...value, turnsSpent: parseInt(turnsSpentOverride) };
      }
      if (noncombatQueueOverride !== null) {
        applied = true;
        value = {
          ...value,
          noncombatQueue: maybeEmpty(noncombatQueueOverride),
        };
      }
    }

    return applied ? { applied, value: value as T } : { applied };
  }) as OverrideListener);
}
