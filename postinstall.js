// Purpose: Add the codepages script to the package.json file

// Explanation: This script is run after the package is installed.
// It reads the package.json file, adds the codepages script,
// and writes the changes back to the file.
// This script is useful when you want to add a script
// to the package.json file that is not included by default.

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

  // Write the updated package.json back to the file
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Successfully added 'codepages' script to package.json");
} catch (error) {
  console.error("Failed to add 'codepages' script to package.json:", error);
}
