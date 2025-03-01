// Explanation: This script is run after the package is installed.
// It reads the package.json file, adding the necessary npm scripts.

// These script names reference the 'bin' section in package.json,
// which are the entry points for the CLI commands.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

console.log("Running postinstall script...");

try {
  const packageJsonPath = resolve(
    process.env.INIT_CWD || process.cwd(),
    "package.json"
  );
  console.log("Resolved package.json path:", packageJsonPath);

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  packageJson.scripts = packageJson.scripts || {};

  packageJson.scripts.codepages = "codepages";

  if (!packageJson.scripts.build?.includes("&& createCodePageHtml")) {
    packageJson.scripts.build = packageJson.scripts.build
      ? `${packageJson.scripts.build} && createCodePageHtml`
      : "createCodePageHtml";
  }
  if (!packageJson.scripts.build?.includes("&& hideDefaultHtml")) {
    packageJson.scripts.build = `${packageJson.scripts.build} && hideDefaultHtml`;
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Successfully added scripts to package.json");
} catch (error) {
  console.error("Failed to add scripts to package.json:", error);
}
