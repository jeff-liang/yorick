import { readFileSync } from "fs";
import * as path from "path";
import { chdir } from "process";
import * as url from "url";

import { Project, SourceFile } from "ts-morph";
import * as ts from "typescript";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectDir = path.dirname(__dirname);

function getAllImportsFromPackage(
  project: Project,
  packageName: string,
): Set<string> {
  const imports = new Set<string>();

  project.getSourceFiles().forEach((sourceFile: SourceFile) => {
    sourceFile.getImportDeclarations().forEach((importDeclaration) => {
      const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
      if (moduleSpecifier.startsWith(packageName)) {
        for (const imported of importDeclaration.getNamedImports()) {
          imports.add(imported.getName());
        }
      }
    });
  });

  return imports;
}

async function printNamedFunctions(names: Set<string>) {
  const filePath =
    "node_modules/tome-kolmafia-lib/dist/kolmafia/generated/functions.d.ts";
  const sourceFile = ts.createSourceFile(
    filePath,
    readFileSync(filePath, "utf-8"),
    ts.ScriptTarget.Latest,
  );
  sourceFile.forEachChild((node: ts.Node) => {
    if (
      ts.isFunctionDeclaration(node) &&
      ts
        .getModifiers(node)
        ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) &&
      names.has(ts.getNameOfDeclaration(node)?.getText(sourceFile) ?? "")
    ) {
      console.log(node.getText(sourceFile));
    }
  });
}

chdir(projectDir);
const project = new Project({
  tsConfigFilePath: "tsconfig.app.json",
});
const imports = getAllImportsFromPackage(project, "kolmafia");
printNamedFunctions(imports);
// console.log([...imports].join(" "));
// console.log(imports.has("canEquip"));
