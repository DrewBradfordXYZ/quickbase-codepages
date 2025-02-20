// Explanation: This script is run after the package is installed.
// It reads the package.json file, adding the necessary npm scripts.

// These script names reference the 'bin' section in package.json,
// which are the entry points for the CLI commands.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

console.log("Running postinstall script...");

try {
  // Use INIT_CWD to get the path to the consuming project's directory
  const packageJsonPath = resolve(process.env.INIT_CWD, "package.json");
  console.log("Resolved package.json path:", packageJsonPath);

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  // Ensure the scripts section exists
  packageJson.scripts = packageJson.scripts || {};

  // Add the codepages script
  packageJson.scripts.codepages = "codepages";

  // Check if '&& htmlgen' is already present in the build script
  if (!packageJson.scripts.build.includes("&& createCodePageHtml")) {
    // Append the createCodePageHtml script to the existing build script
    packageJson.scripts.build = `${packageJson.scripts.build} && createCodePageHtml`;
  }

  // Check if '&& hideDefaultHtml' is already present in the build script
  if (!packageJson.scripts.build.includes("&& hideDefaultHtml")) {
    // Append the hideDefaultHtml script to the existing build script
    packageJson.scripts.build = `${packageJson.scripts.build} && hideDefaultHtml`;
  }

  // Write the updated package.json back to the file
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Successfully added scripts in package.json");
} catch (error) {
  console.error("Failed to add scripts to package.json:", error);
}
