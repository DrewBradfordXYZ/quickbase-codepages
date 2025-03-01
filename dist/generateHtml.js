// src/generateHtml.ts
import * as fs from "fs";
import * as path from "path";
import { findUp } from "find-up";
export function generateHtml(config) {
    for (const [appIdentifier, appConfig] of Object.entries(config.apps)) {
        const htmlTitle = appConfig.quickbaseHtmlPageTitle || "Default Title";
        const cssPageIds = appConfig.quickbaseCodepageCssIds || [];
        const jsPageIds = appConfig.quickbaseCodepageJsIds || [];
        const quickbasePagesUrl = appConfig.quickbaseCodepagesUrl || "";
        const cssLinks = cssPageIds
            .map((id, index) => `${index === 0 ? "" : "  "}\t<link href="${quickbasePagesUrl}?a=dbpage&pageID=${id.trim()}" rel="stylesheet">`)
            .join("\n");
        const jsScripts = jsPageIds
            .map((id, index) => `${index === 0 ? "" : "  "}\t<script src="${quickbasePagesUrl}?a=dbpage&pageID=${id.trim()}"></script>`)
            .join("\n");
        const htmlContent = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${htmlTitle}</title>
  ${cssLinks}
</head>
<body>
  <noscript>
    <strong>
    We're sorry but this app doesn't work properly without
    JavaScript enabled. Please enable it to continue.
    </strong>
  </noscript>
  <div id="root"></div>
  ${jsScripts}
</body>
</html>`;
        findUp(".git", { type: "directory" }).then((gitRootPath) => {
            const rootFolderName = gitRootPath
                ? path.basename(path.dirname(gitRootPath))
                : "codepage";
            fs.writeFileSync(path.join(process.cwd(), `./dist/${appIdentifier}_${rootFolderName}.html`), htmlContent, "utf8");
        });
    }
}
