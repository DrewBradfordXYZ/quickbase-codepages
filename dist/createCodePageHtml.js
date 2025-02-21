#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { findUp } from "find-up";
import dotenv from "dotenv";
dotenv.config();
// Function to get app identifiers from environment variables
const getAppIdentifiers = () => {
    const env = process.env;
    const appIdentifierSet = new Set();
    Object.keys(env).forEach((key) => {
        const match = key.match(/^([^_]+)_QUICKBASE_.+$/);
        if (match) {
            appIdentifierSet.add(match[1]);
        }
    });
    return appIdentifierSet;
};
function getEnvironmentVariables(appIdentifier) {
    const htmlTitle = process.env[`${appIdentifier}_QUICKBASE_HTML_PAGE_TITLE`];
    const cssPageIds = process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_CSS_IDS`].split(",") || ["<-QUICKBASE-CODEPAGE-CSS-IDS->"];
    const jsPageIds = process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_JS_IDS`]
        ? process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_JS_IDS`].split(",")
        : ["<-QUICKBASE-CODEPAGE-JS-IDS->"];
    const quickbasePagesUrl = process.env[`${appIdentifier}_QUICKBASE_CODEPAGES_URL`]
        ? process.env[`${appIdentifier}_QUICKBASE_CODEPAGES_URL`]
        : "<-QUICKBASE-CODEPAGES-URL->";
    return { htmlTitle, cssPageIds, jsPageIds, quickbasePagesUrl };
}
function generateHtmlLinks(cssPageIds, jsPageIds, quickbasePagesUrl) {
    const cssLinks = cssPageIds
        .map((id, index) => `${index === 0 ? "" : "  "}\t<link href="${quickbasePagesUrl}?a=dbpage&pageID=${id.trim()}" rel="stylesheet">`)
        .join("\n");
    const jsScripts = jsPageIds
        .map((id, index) => `${index === 0 ? "" : "  "}\t<script src="${quickbasePagesUrl}?a=dbpage&pageID=${id.trim()}"></script>`)
        .join("\n");
    return { cssLinks, jsScripts };
}
function generateEnvironmentComments(appIdentifier) {
    const commentsPageUrl = process.env[`${appIdentifier}_QUICKBASE_CODEPAGES_URL`]
        ? ""
        : `    <!-- Update ${appIdentifier}_QUICKBASE_CODEPAGES_URL in the .env file. -->`;
    const commentsCssPageIds = process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_CSS_IDS`]
        ? ""
        : `    <!-- Update ${appIdentifier}_QUICKBASE_CODEPAGE_CSS_IDS in the .env file. -->`;
    const commentsJsPageIds = process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_JS_IDS`]
        ? ""
        : `    <!-- Update ${appIdentifier}_QUICKBASE_CODEPAGE_JS_IDS in the .env file. -->`;
    let commentsEnvRename = "";
    if (commentsPageUrl && commentsCssPageIds && commentsJsPageIds) {
        commentsEnvRename =
            "    <!-- Make sure to rename the .env.example file to .env -->";
    }
    return {
        commentsPageUrl,
        commentsCssPageIds,
        commentsJsPageIds,
        commentsEnvRename,
    };
}
function generateHtml() {
    getAppIdentifiers().forEach((appIdentifier) => {
        const { htmlTitle, cssPageIds, jsPageIds, quickbasePagesUrl } = getEnvironmentVariables(appIdentifier);
        const { cssLinks, jsScripts } = generateHtmlLinks(cssPageIds, jsPageIds, quickbasePagesUrl || "");
        const { commentsPageUrl, commentsCssPageIds, commentsJsPageIds, commentsEnvRename, } = generateEnvironmentComments(appIdentifier);
        let htmlContent = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${htmlTitle}</title>`;
        if (commentsEnvRename)
            htmlContent += `\n${commentsEnvRename}`;
        if (commentsPageUrl)
            htmlContent += `\n${commentsPageUrl}`;
        if (commentsCssPageIds)
            htmlContent += `\n${commentsCssPageIds}`;
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
        if (commentsPageUrl)
            htmlContent += `\n${commentsPageUrl}`;
        if (commentsJsPageIds)
            htmlContent += `\n${commentsJsPageIds}`;
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
            fs.writeFileSync(path.join(process.cwd(), `./dist/${appIdentifier}_${rootFolderName}.html`), htmlContent, "utf8");
        });
    });
}
generateHtml();
// If the script is run directly, call the function
if (import.meta.url === `file://${process.argv[1]}`) {
    generateHtml();
}
