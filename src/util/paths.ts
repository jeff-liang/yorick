import { myBasestat, myPath, Path } from "kolmafia";
import { $stat } from "libram";

export function isNormalCampgroundPath(path?: Path) {
  const currentPath = path ?? myPath();

  // Astral Spirit
  if (myBasestat($stat`Muscle`) === 0) return false;

  // The list of paths that don't give access to a regular campground (thus, no workshed, garden, etc.)
  if (
    [
      "Actually Ed the Undying",
      "Nuclear Autumn",
      "You, Robot",
      "WereProfessor",
    ].includes(currentPath.name)
  ) {
    return false;
  }

  return true;
}

export function canAccessGarden(path?: Path) {
  const actual_path = path ?? myPath();

  return (
    isNormalCampgroundPath(actual_path) &&
    actual_path.name !== "A Shrunken Adventurer am I"
  );
}
