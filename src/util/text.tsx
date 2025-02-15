import { availableAmount, Item } from "kolmafia";
import { Fragment, ReactNode } from "react";
import { AnyIdentified, isIdentified } from "tome-kolmafia-lib";

type Falsey = undefined | null | false;

export function pluralJustDesc(
  count: number,
  description: string | { name: string; plural: string },
  descriptionPlural?: string,
) {
  if (
    typeof description === "object" &&
    "name" in description &&
    "plural" in description
  ) {
    descriptionPlural = description.plural;
    description = description.name;
  }
  if (!descriptionPlural) descriptionPlural = `${description}s`;
  return count === 1 ? description : descriptionPlural;
}

export function plural(
  count: number,
  description: string | { name: string; plural: string },
  descriptionPlural?: string,
) {
  return `${count} ${pluralJustDesc(count, description, descriptionPlural)}`;
}

export function pluralJustDescItem(item: Item, count?: number) {
  return pluralJustDesc(count ?? availableAmount(item), item.name, item.plural);
}

export function pluralItem(item: Item, count?: number) {
  return plural(
    count ?? availableAmount(item),
    item.identifierString,
    item.plural,
  );
}

function separateInternal(
  values: (string | AnyIdentified | Falsey)[] | ReactNode[],
  separator: string,
  keys?: string[] | number[],
) {
  values = values.map((x) => (isIdentified(x) ? x.identifierString : x));
  // Show only truthy values.
  values = truthy(values);
  if (values.length === 0) return "";
  else if (values.length >= 1) {
    if (values.every((value) => typeof value === "string")) {
      return values.join(separator);
    } else {
      return (
        <>
          {values.slice(0, -1).map((value, index) => (
            <Fragment key={keys?.[index] ?? index}>
              {value}
              {separator}
            </Fragment>
          ))}
          {values[values.length - 1]}
        </>
      );
    }
  }
}

export function separate(
  values: (string | AnyIdentified | Falsey)[],
  separator: string,
): string;
export function separate(
  values: ReactNode[],
  separator: string,
  keys: string[] | number[],
): ReactNode;
export function separate(
  values: (string | AnyIdentified | Falsey)[] | ReactNode[],
  separator: string,
  keys?: string[] | number[],
): ReactNode {
  return separateInternal(values, separator, keys);
}

export function commaSeparate(
  values: (string | AnyIdentified | Falsey)[],
): string;
export function commaSeparate(
  values: ReactNode[],
  keys: string[] | number[],
): ReactNode;
export function commaSeparate(
  values: (string | AnyIdentified | Falsey)[] | ReactNode[],
  keys?: string[] | number[],
): ReactNode {
  return separateInternal(values, ", ", keys);
}

function commaListInternal(
  values: (string | AnyIdentified | Falsey)[] | ReactNode[],
  connector: string,
  keys?: string[] | number[],
): ReactNode {
  values = values.map((x) => (isIdentified(x) ? x.identifierString : x));
  // Show only truthy values.
  values = truthy(values);
  keys = keys?.filter((key, index) => values[index]) as
    | string[]
    | number[]
    | undefined;
  if (values.length === 0) return "none";
  else if (values.length === 1) return values[0];
  else if (values.length === 2) {
    if (values.every((value) => typeof value === "string")) {
      return `${values[0]} ${connector} ${values[1]}`;
    } else {
      return (
        <>
          {values[0]} {connector} {values[1]}
        </>
      );
    }
  } else {
    if (values.every((value) => typeof value === "string")) {
      return `${values.slice(0, -1).join(", ")}, ${connector} ${
        values[values.length - 1]
      }`;
    } else {
      return (
        <>
          {values.slice(0, -1).map((value, index) => (
            <Fragment
              key={keys && keys[index] !== undefined ? keys[index] : index}
            >
              {value}
              {", "}
            </Fragment>
          ))}
          {`${connector} `}
          {values[values.length - 1]}
        </>
      );
    }
  }
}

export function commaList(
  values: (string | AnyIdentified | Falsey)[],
  connector: string,
): string;
export function commaList(
  values: ReactNode[],
  connector: string,
  keys: string[] | number[],
): ReactNode;
export function commaList(
  values: (string | AnyIdentified | Falsey)[] | ReactNode[],
  connector: string,
  keys?: string[] | number[],
): ReactNode {
  return commaListInternal(values, connector, keys);
}

export function commaAnd(values: (string | AnyIdentified | Falsey)[]): string;
export function commaAnd(
  values: ReactNode[],
  keys: string[] | number[],
): ReactNode;
export function commaAnd(
  values: (string | AnyIdentified | Falsey)[] | ReactNode[],
  keys?: string[] | number[],
): ReactNode {
  return commaListInternal(values, "and", keys);
}

export function commaOr(values: (string | AnyIdentified | Falsey)[]): string;
export function commaOr(
  values: ReactNode[],
  keys: string[] | number[],
): ReactNode;
export function commaOr(
  values: (string | AnyIdentified | Falsey)[] | ReactNode[],
  keys?: string[] | number[],
): ReactNode {
  return commaListInternal(values, "or", keys);
}

export function truthy<T>(values: (T | Falsey)[]): T[] {
  return values.filter((x) => x) as T[];
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeWords(text: string) {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function ordinal(n: number) {
  if (10 <= n % 100 && n % 100 <= 20) {
    return `${n}th`;
  } else if (n % 10 === 1) {
    return `${n}st`;
  } else if (n % 10 === 2) {
    return `${n}nd`;
  } else if (n % 10 === 3) {
    return `${n}rd`;
  } else {
    return `${n}th`;
  }
}
