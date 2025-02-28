import {
  appearanceRates,
  getMonsters,
  isBanished,
  Location,
  Monster,
  trackCopyCount,
  trackIgnoreQueue,
} from "kolmafia";
import { $monster, sum } from "libram";

export function monsterFrequencyAndQueue(location: Location) {
  const monsters = getMonsters(location);
  const appearingMonsters = monsters.filter(
    (monster) =>
      monster !== $monster`none` && appearanceRates(location)[monster.name] > 0,
  );
  const queue = (location.combatQueue ?? "")
    .split("; ")
    .filter((s) => s)
    .map((name) => Monster.get(name));

  const monsterCopies = appearingMonsters.map((monster) => {
    const copies = isBanished(monster) ? 0 : 1 + trackCopyCount(monster);
    const reject = !trackIgnoreQueue(monster);
    const copiesWithQueue =
      (reject && queue.includes(monster) ? 0.25 : 1) * copies;
    return { monster, copiesWithQueue };
  });

  const totalCopiesWithQueue = sum(monsterCopies, "copiesWithQueue");
  const monsterFrequency = monsterCopies.map(
    ({ monster, copiesWithQueue }) => ({
      monster,
      frequency: copiesWithQueue / totalCopiesWithQueue,
    }),
  );
  return { monsterFrequency, queue };
}
