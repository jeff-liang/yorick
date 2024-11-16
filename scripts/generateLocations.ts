import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { chdir } from "process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generateLocations() {
  const data = await fetch(
    "https://github.com/kolmafia/kolmafia/raw/refs/heads/main/src/data/adventures.txt",
  ).then((response) => response.text());

  const lines = data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length !== 0 && !line.startsWith("#"));

  const locationData = lines
    .map((line) => line.split("\t"))
    .filter(([parent, , , name]) => parent && name)
    .map(([parent, location, , name]) => [
      parent,
      name,
      location.startsWith("adventure=")
        ? new Number(location.replace("adventure=", ""))
        : null,
    ])
    .filter((line) => line)
    .sort();

  mkdirSync("src/generated", { recursive: true });
  writeFileSync(
    "src/generated/locationData.ts",
    `export default ${JSON.stringify(locationData)} as [string, string, number | null][];\n`,
  );
}

chdir(resolve(__dirname, ".."));
generateLocations();
