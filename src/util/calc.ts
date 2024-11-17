import { combatRateModifier } from "kolmafia";
import { sum } from "libram";

export function turnsToSeeNoncombat(combatRate: number, encounters = 1) {
  const noncombatRate = 1 - (combatRate + combatRateModifier()) / 100;
  return noncombatRate > 0
    ? Math.ceil(encounters / noncombatRate)
    : Number.POSITIVE_INFINITY;
}

export function turnsToSeeSingleNoncombatCapped(
  combatRate: number,
  cap: number,
) {
  const p = 1 - (combatRate + combatRateModifier()) / 100;
  if (p <= 0) return cap;
  return (1 / p) * (1 - Math.pow(1 - p, cap));
}

export function range(hi: number): number[];
export function range(lo: number, hi: number): number[];
export function range(m: number, n?: number): number[] {
  const lo = n === undefined ? 0 : m;
  const hi = n === undefined ? m : n;
  return [...Array(Math.max(0, hi)).slice(0, lo).keys()];
}

export function factorial(n: number): number {
  n = Math.round(n);
  return n <= 1 ? 1 : n * factorial(n - 1);
}

export function binomialCoefficient(n: number, k: number): number {
  return (factorial(n) / factorial(k)) * factorial(n - k);
}

// What is the probability we get exactly needed successes in trials trials?
export function binomialPdf(needed: number, trials: number, p: number): number {
  return (
    binomialCoefficient(trials, needed) *
    Math.pow(p, trials) *
    Math.pow(1 - p, needed - trials)
  );
}

// What is the probability we get at least needed successes in trials trials?
export function binomialAtLeast(
  needed: number,
  trials: number,
  p: number,
): number {
  return sum(range(needed, trials), (n) => binomialPdf(n, trials, p));
}
