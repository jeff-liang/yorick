import { sum } from "libram";
import { Fragment, ReactNode } from "react";

export interface Source {
  name: string;
  remaining: () => number;
  render: (props: { remaining: number }) => ReactNode;
}

export function renderSourceList(sourceList: Source[]): {
  total: number;
  rendered: ReactNode[];
  keys: string[];
} {
  const sources = sourceList
    .map((source): [Source, number] => [source, source.remaining()])
    .filter(([, remaining]) => remaining > 0)
    .sort(([, a], [, b]) => b - a);
  return {
    total: sum(sources, ([, remaining]) => remaining),
    rendered: sources.map(([{ name, render }, remaining]) => (
      <Fragment key={name}>{render({ remaining })}</Fragment>
    )),
    keys: sources.map(([{ name }]) => name),
  };
}
