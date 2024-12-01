import {
  isBooleanProperty,
  isNumericOrStringProperty,
  isNumericProperty,
} from "libram";

export type ValidityType =
  | "string"
  | "number"
  | "boolean"
  | "string | number"
  | "quest";

export function validityType(override: string): ValidityType {
  const propertyMatch = /^override:getProperty\((.*)\)$/.exec(override);
  let propertyName: string | null = null;
  if (propertyMatch) {
    try {
      const parsed = JSON.parse(propertyMatch[1]);
      if (typeof parsed === "string") propertyName = parsed;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      /* empty */
    }
  }
  if (
    (propertyName && isNumericProperty(propertyName)) ||
    /^override:Location.get\(.*\).turnsSpent$/.test(override) ||
    /^override:haveEffect\(.*\)$/.test(override) ||
    /^override:availableAmount\(.*\)$/.test(override)
  ) {
    return "number";
  } else if (propertyName && isBooleanProperty(propertyName)) {
    return "boolean";
  } else if (propertyName && isNumericOrStringProperty(propertyName)) {
    return "string | number";
  } else if (propertyName && propertyName.startsWith("quest")) {
    return "quest";
  } else {
    return "string";
  }
}

export function validValue(type: ValidityType, value: string) {
  switch (type) {
    case "string":
      return true;
    case "number":
      return !!value.match(/^-?\d+$/);
    case "boolean":
      return !!value.match(/^(true|false)$/);
    case "string | number":
      return true;
    case "quest":
      return !!value.match(/^(unstarted|started|finished|step\d+)$/);
  }
}
