#!/usr/bin/env node
import { generateQuickbaseHtml } from "./quickbase-html-generate.js";
import fs from "fs";
import path from "path";
const args = process.argv.slice(2);
const configFlagIndex = args.indexOf("--config");
const configFilePath = configFlagIndex !== -1
    ? args[configFlagIndex + 1]
    : path.join(process.cwd(), "codepages-config.js");
if (!fs.existsSync(configFilePath)) {
    console.error(`Config file not found at ${configFilePath}. Please create a codepages-config.js in your project root or specify a file with --config.`);
    process.exit(1);
}
// Dynamically import the ES module
async function loadConfig() {
    const { default: config } = await import(configFilePath);
    return config;
}
loadConfig()
    .then((config) => generateQuickbaseHtml(config))
    .catch((err) => {
    console.error("Failed to load config:", err);
    process.exit(1);
});
