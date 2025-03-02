// postbuild.js
import { chmodSync, existsSync, rmSync } from "fs";
import { resolve } from "path";

const cliQuickbaseUpdatePath = resolve("dist/cli-quickbase-update.js");
const cliQuickbaseHtmlPath = resolve("dist/cli-quickbase-html.js");
const cliHideHtmlPath = resolve("dist/cli-hide-html.js");
const cliUninstallPath = resolve("dist/cli-uninstall.js");
const typesDir = resolve("dist/types");

chmodSync(cliQuickbaseUpdatePath, "755");
chmodSync(cliQuickbaseHtmlPath, "755");
chmodSync(cliHideHtmlPath, "755");
chmodSync(cliUninstallPath, "755");

if (existsSync(typesDir)) {
  rmSync(typesDir, { recursive: true }); // Remove the entire types folder
}
