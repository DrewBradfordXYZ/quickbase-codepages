import { chmodSync } from "fs";
import { resolve } from "path";

// This makees the generated files executable after running 'npm run build'

const codePagesUpdatePath = resolve("dist/codePagesUpdate.js");
const htmlGenPath = resolve("dist/createHtmlCodePage.js");
const hideNodeHtmlPath = resolve("dist/hideNodeHtml.js");
const uninstallPath = resolve("dist/uninstall.js");

// Ensure the files have the correct permissions
chmodSync(codePagesUpdatePath, "755");
chmodSync(htmlGenPath, "755");
chmodSync(hideNodeHtmlPath, "755");
chmodSync(uninstallPath, "755");

console.log(
  "Permissions set for codePagesUpdate.js, createHtmlCodePage.js, hideNodeHtml.js and uninstall.js"
);
