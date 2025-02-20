#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { findUp } from "find-up";
import dotenv from "dotenv";

dotenv.config();

function generateHtml() {
  const htmlTitle = process.env.QUICKBASE_HTML_PAGE_TITLE || "QuickBase";
  const cssPageIds = process.env.QUICKBASE_CODEPAGE_CSS_IDS
    ? process.env.QUICKBASE_CODEPAGE_CSS_IDS.split(",")
    : ["<-QUICKBASE-CODEPAGE-CSS-IDS->"];
  const jsPageIds = process.env.QUICKBASE_CODEPAGE_JS_IDS
    ? process.env.QUICKBASE_CODEPAGE_JS_IDS.split(",")
    : ["<-QUICKBASE-CODEPAGE-JS-IDS->"];
  const quickbasePagesUrl =
    process.env.QUICKBASE_CODEPAGES_URL || "<-QUICKBASE-CODEPAGES-URL->";

  const cssLinks = cssPageIds
    .map(
      (id, index) =>
        `${
          index === 0 ? "" : "  "
        }\t<link href="${quickbasePagesUrl}?a=dbpage&pageID=${id.trim()}" rel="stylesheet">`
    )
    .join("\n");

  const jsScripts = jsPageIds
    .map(
      (id, index) =>
        `${
          index === 0 ? "" : "  "
        }\t<script src="${quickbasePagesUrl}?a=dbpage&pageID=${id.trim()}"></script>`
    )
    .join("\n");

  const commentsPageUrl = process.env.QUICKBASE_CODEPAGES_URL
    ? ""
    : "    <!-- Update QUICKBASE_CODEPAGES_URL in the .env file. -->";

  const commentsCssPageIds = process.env.QUICKBASE_CODEPAGE_CSS_IDS
    ? ""
    : "    <!-- Update QUICKBASE_CODEPAGE_CSS_IDS in the .env file. -->";

  const commentsJsPageIds = process.env.QUICKBASE_CODEPAGE_JS_IDS
    ? ""
    : "    <!-- Update QUICKBASE_CODEPAGE_JS_IDS in the .env file. -->";

  let commentsEnvRename = "";
  if (commentsPageUrl && commentsCssPageIds && commentsJsPageIds) {
    commentsEnvRename =
      "    <!-- Make sure to rename the .env.example file to .env -->";
  }

  let htmlContent = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${htmlTitle}</title>`;

  if (commentsEnvRename) htmlContent += `\n${commentsEnvRename}`;
  if (commentsPageUrl) htmlContent += `\n${commentsPageUrl}`;
  if (commentsCssPageIds) htmlContent += `\n${commentsCssPageIds}`;

  htmlContent += `
  ${cssLinks}
</head>
<body>
  <noscript>
    <strong>
    We're sorry but this app doesn't work properly without
    JavaScript enabled. Please enable it to continue.
    </strong>
  </noscript>
  <div id="root"></div>`;

  if (commentsPageUrl) htmlContent += `\n${commentsPageUrl}`;
  if (commentsJsPageIds) htmlContent += `\n${commentsJsPageIds}`;

  htmlContent += `
  ${jsScripts}
</body>
</html>`;

  // Get the root project name
  findUp(".git", { type: "directory" }).then((gitRootPath) => {
    const rootFolderName = gitRootPath
      ? path.basename(path.dirname(gitRootPath))
      : "codepage"; // if git is not found, use codepage as the default name

    // Writing to file
    fs.writeFileSync(
      path.join(process.cwd(), `./dist/${rootFolderName}.html`),
      htmlContent,
      "utf8"
    );
  });
}

generateHtml();

// If the script is run directly, call the function
if (import.meta.url === `file://${process.argv[1]}`) {
  generateHtml();
}
