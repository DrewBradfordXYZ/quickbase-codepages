import { chmodSync } from "fs";
import { resolve } from "path";

// This makees the generated files executable after running 'npm run build'

const codePagesUpdatePath = resolve("dist/codePagesUpdate.js");
const htmlGenPath = resolve("dist/createCodePageHtml.js");
const hideDefaultHtmlPath = resolve("dist/hideDefaultHtml.js");
const uninstallPath = resolve("dist/uninstall.js");

// Ensure the files have the correct permissions
chmodSync(codePagesUpdatePath, "755");
chmodSync(htmlGenPath, "755");
chmodSync(hideDefaultHtmlPath, "755");
chmodSync(uninstallPath, "755");
