// src/quickbase-html-generate.ts
import * as fs from "fs";
import * as path from "path";
import { findUp } from "find-up";
import { AppConfig } from "./types/quickbase-types.js";

export function generateQuickbaseHtml(config: AppConfig) {
  for (const [appIdentifier, appConfig] of Object.entries(config.apps)) {
    const htmlTitle = appConfig.quickbaseHtmlPageTitle || "Default Title";

    // Explicitly handle undefined/null with defaults
    const cssPageIds =
      appConfig.quickbaseCodepageCssIds &&
      appConfig.quickbaseCodepageCssIds.length > 0
        ? appConfig.quickbaseCodepageCssIds
        : ["<-QUICKBASE-CODEPAGE-CSS-IDS->"];
    const jsPageIds =
      appConfig.quickbaseCodepageJsIds &&
      appConfig.quickbaseCodepageJsIds.length > 0
        ? appConfig.quickbaseCodepageJsIds
        : ["<-QUICKBASE-CODEPAGE-JS-IDS->"];
    const quickbasePagesUrl =
      appConfig.quickbaseCodepagesUrl || "<-QUICKBASE-CODEPAGES-URL->";

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

    // Generate conditional comments for missing values in quickbase-config.js
    const commentsPageUrl =
      appConfig.quickbaseCodepagesUrl &&
      appConfig.quickbaseCodepagesUrl !== "<-QUICKBASE-CODEPAGES-URL->"
        ? ""
        : `    <!-- Set 'quickbaseCodepagesUrl' for "${appIdentifier}" in quickbase-config.js -->`;

    const commentsCssPageIds =
      appConfig.quickbaseCodepageCssIds &&
      appConfig.quickbaseCodepageCssIds.length > 0 &&
      !appConfig.quickbaseCodepageCssIds.includes(
        "<-QUICKBASE-CODEPAGE-CSS-IDS->"
      )
        ? ""
        : `    <!-- Set 'quickbaseCodepageCssIds' for "${appIdentifier}" in quickbase-config.js -->`;

    const commentsJsPageIds =
      appConfig.quickbaseCodepageJsIds &&
      appConfig.quickbaseCodepageJsIds.length > 0 &&
      !appConfig.quickbaseCodepageJsIds.includes(
        "<-QUICKBASE-CODEPAGE-JS-IDS->"
      )
        ? ""
        : `    <!-- Set 'quickbaseCodepageJsIds' for "${appIdentifier}" in quickbase-config.js -->`;

    let commentsConfigMissing = "";
    if (commentsPageUrl && commentsCssPageIds && commentsJsPageIds) {
      commentsConfigMissing =
        "    <!-- Ensure all required options are set for your apps in quickbase-config.js -->";
    }

    let htmlContent = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${htmlTitle}</title>`;

    if (commentsConfigMissing) htmlContent += `\n${commentsConfigMissing}`;
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

    findUp(".git", { type: "directory" }).then((gitRootPath) => {
      const rootFolderName = gitRootPath
        ? path.basename(path.dirname(gitRootPath))
        : "codepage";
      fs.writeFileSync(
        path.join(
          process.cwd(),
          `./dist/${appIdentifier}_${rootFolderName}.html`
        ),
        htmlContent,
        "utf8"
      );
    });
  }
}
