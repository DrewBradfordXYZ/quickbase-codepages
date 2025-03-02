#!/usr/bin/env node
import { updateCodePages } from "./quickbase-update.js";
import fs from "fs";
import path from "path";
const args = process.argv.slice(2);
const configFlagIndex = args.indexOf("--config");
const configFilePath = configFlagIndex !== -1
    ? args[configFlagIndex + 1]
    : path.join(process.cwd(), "codepages-config.js");
if (!fs.existsSync(configFilePath)) {
    console.error(`Config file not found at ${configFilePath}. Please create a codepages-config.js in your project root or specify a file with --config.`);
    console.error("Example config:");
    console.error(`
    import dotenv from "dotenv";
    dotenv.config();

    export default {
      quickbaseLoginUrl: process.env.QUICKBASE_LOGIN_URL,
      username: process.env.QUICKBASE_USERNAME,
      password: process.env.QUICKBASE_PASSWORD,
      apps: {
        APP1: {
          quickbaseCodepageEditUrl: process.env.APP1_QUICKBASE_CODEPAGE_EDIT_URL,
          quickbaseCodepageHtmlId: process.env.APP1_QUICKBASE_CODEPAGE_HTML_ID,
          quickbaseCodepageJsIds: process.env.APP1_QUICKBASE_CODEPAGE_JS_IDS?.split(",") || [],
          quickbaseCodepageCssIds: process.env.APP1_QUICKBASE_CODEPAGE_CSS_IDS?.split(",") || [],
          quickbaseHtmlPageTitle: process.env.APP1_QUICKBASE_HTML_PAGE_TITLE,
          quickbaseCodepagesUrl: process.env.APP1_QUICKBASE_CODEPAGES_URL
        }
      }
    };
  `);
    process.exit(1);
}
// Dynamically import the ES module
async function loadConfig() {
    const { default: config } = await import(configFilePath);
    return config;
}
loadConfig()
    .then((config) => updateCodePages(config))
    .catch((err) => {
    console.error("Failed to load config:", err);
    process.exit(1);
});
