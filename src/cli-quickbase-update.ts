#!/usr/bin/env node

import { updateQuickbase } from "./quickbase-update.js"; // Updated from updateCodePages
import { AppConfig } from "./types/quickbase-types.js";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const configFlagIndex = args.indexOf("--config");
const configFilePath =
  configFlagIndex !== -1
    ? args[configFlagIndex + 1]
    : path.join(process.cwd(), "codepages-config.js");

if (!fs.existsSync(configFilePath)) {
  console.error(
    `Config file not found at ${configFilePath}. Please create a codepages-config.js in your project root or specify a file with --config.`
  );
  console.error("Example config:");
  console.error(`
    export default {
      quickbaseLoginUrl: "https://yourdomain.quickbase.com/db/main",
      username: "your-username",
      password: "your-password",
      apps: {
        MYAPP: {
          quickbaseCodepageEditUrl: "https://yourdomain.quickbase.com/db/<app-id>?a=editpage&id=",
          quickbaseCodepageHtmlId: "5",
          quickbaseCodepageJsIds: ["6", "7"],
          quickbaseCodepageCssIds: ["8"],
          quickbaseHtmlPageTitle: "My App",
          quickbaseCodepagesUrl: "https://yourdomain.quickbase.com/db/<app-id>"
        }
      }
    };
  `);
  process.exit(1);
}

async function loadConfig() {
  const { default: config }: { default: AppConfig } = await import(
    configFilePath
  );
  return config;
}

loadConfig()
  .then((config) => updateQuickbase(config))
  .catch((err) => {
    console.error("Failed to load config:", err);
    process.exit(1);
  });
