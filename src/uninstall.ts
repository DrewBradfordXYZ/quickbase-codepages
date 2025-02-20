#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

console.log("Running custom uninstall script...");

try {
  const packageJsonPath: string = resolve(process.cwd(), "package.json");
  console.log("Resolved package.json path:", packageJsonPath);

  const packageJson: { scripts?: { [key: string]: string } } = JSON.parse(
    readFileSync(packageJsonPath, "utf-8")
  );

  // Remove the codepages script
  if (packageJson.scripts && packageJson.scripts.codepages) {
    delete packageJson.scripts.codepages;
  }

  // Remove createHtmlCodePage and hideNodeHtml from the build script
  if (packageJson.scripts && packageJson.scripts.build) {
    packageJson.scripts.build = packageJson.scripts.build
      .replace("&& createHtmlCodePage", "")
      .replace("&& hideNodeHtml", "")
      .trim();
  }

  // Write the updated package.json back to the file
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Successfully removed scripts from package.json");

  // Uninstall the package
  execSync("npm uninstall quickbase-codepages --save-dev", {
    stdio: "inherit",
  });
  console.log("Successfully uninstalled quickbase-codepages");
} catch (error) {
  console.error("An error occurred during the uninstall process:", error);
}
