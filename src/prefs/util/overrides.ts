import { AnyIdentified, isIdentified } from "tome-kolmafia-lib";

export function maybeEmpty(value: string): string {
  return value === "[empty]" ? "" : value;
}

export function jsName(obj: AnyIdentified): string {
  return `${obj.objectType}.get(${JSON.stringify(obj.identifierString)})`;
}

export function overrideName(name: string, args: unknown[]) {
  const namedArgs = args.map((arg) =>
    isIdentified(arg) ? jsName(arg) : JSON.stringify(arg),
  );
  return `override:${name}(${namedArgs.join(", ")})`;
}
