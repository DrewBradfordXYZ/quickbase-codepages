# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.1](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v3.0.0...v3.0.1) (2025-03-02)

App Start Logging: Added console.log(chalk.bold.whiteBright.underline(\nStarting ${appIdentifier})); at the start of each app loop.

HTML Skip Logging: Added a specific warning when htmlPageId is missing or empty: Skipping HTML page update for ${appIdentifier}. Missing HTML page ID.

Screenshot Cleanup: Reintroduced the post-success cleanup of error_codepage_screenshot.png.

## [3.0.0](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v2.2.1...v3.0.0) (2025-03-02)

Breaking Changes
Configuration Overhaul: Replaced .env file requirement with a new codepages-config.js JavaScript configuration file in the project root. This change removes direct dependency on dotenv and allows flexible configuration management. Users must now define QuickBase credentials and app settings in codepages-config.js instead of .env. See the updated README (#example-codepages-configjs-file) for details.

CLI File Renaming: Renamed CLI entry points for consistency and clarity:
codePagesUpdate.ts → cli-quickbase-update.ts

createCodePageHtml.ts → cli-quickbase-html.ts

hideDefaultHtml.ts → cli-hide-html.ts

uninstall.ts → cli-uninstall.ts

Updated package.json bin entries accordingly.

Core File Renaming: Renamed core logic files to better reflect QuickBase functionality:
updateCodePages.ts → quickbase-update.ts

generateHtml.ts → quickbase-html-generate.ts

types.ts → quickbase-types.ts (moved to src/types/).

Build Process: Simplified npm run build to only run tsc, removing vite build (intended for consuming projects). Added postbuild.js cleanup to remove unnecessary dist/types/quickbase-types.js.

Type Handling: Moved quickbase-types.ts to src/types/ and excluded it from dist/ output, as it’s only needed for internal type checking (CLI-only usage).

Added
Flexible Config: codepages-config.js supports optional environment variable integration (e.g., via dotenv) or hardcoded values, giving users flexibility in managing sensitive data.

HTML Comments and Placeholders: Restored feature from previous versions where missing quickbaseCodepagesUrl, quickbaseCodepageJsIds, or quickbaseCodepageCssIds in codepages-config.js trigger instructional comments and <-...-> placeholders in generated HTML files, aiding user debugging.

README: Completely rewritten to remove .env instructions, focusing on codepages-config.js setup with generic environment variable guidance and URL examples.

Removed
Direct .env Dependency: No longer requires a .env file or dotenv in the library itself; users can optionally use environment variables in codepages-config.js.

TypeScript Declarations: Stopped generating .d.ts files in dist/, as the library is CLI-only and doesn’t expose a programmatic API.

Notes
Users upgrading from 2.x.x must:
Replace their .env file with a codepages-config.js file (see README for examples).

Update package.json scripts if they manually referenced old CLI names (though bin entries ensure compatibility with npm run codepages, etc.).

The dist/types/ folder is no longer generated, keeping the output clean for CLI usage.

### [2.2.1](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v2.2.0...v2.2.1) (2025-02-24)

Removed console logs for cleaner terminal output

## [2.2.0](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v2.1.0...v2.2.0) (2025-02-21)

Now that there is an html page for each app, update codePagesUpdate to handle a new html file for each app.

### Features

- Many app html page gen ([5ef7a89](https://github.com/DrewBradfordXYZ/quickbase-codepages/commit/5ef7a89de11b8d517e6e824879a3f323409f57ff))

## [2.1.0](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v2.0.0...v2.1.0) (2025-02-21)

feat: If an app has missing env variables, log what is missing and skip app updates

### Features

- update multiple apps ([45a1c13](https://github.com/DrewBradfordXYZ/quickbase-codepages/commit/45a1c135c5ea9e9b471518c0bc228ad3b4a14051))

## [2.0.0](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.10...v2.0.0) (2025-02-21)

Feature: Update multiple apps with .env app prefix identifiers

### [1.2.10](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.9...v1.2.10) (2025-02-20)

Rename createCodePageHtml

### [1.2.9](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.8...v1.2.9) (2025-02-20)

try again, a file wasnt saved maybe

### [1.2.8](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.7...v1.2.8) (2025-02-20)

Change the name of the script that hides the default index.html

### [1.2.7](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.6...v1.2.7) (2025-02-20)

Set permissions for uninstall script

### [1.2.6](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.5...v1.2.6) (2025-02-20)

Add an uninstall script

### [1.2.5](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.4...v1.2.5) (2025-02-20)

Remove console log from codePagesUpdate.ts

### [1.2.4](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.3...v1.2.4) (2025-02-20)

Update dependancies to latest versions

### [1.2.3](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.2...v1.2.3) (2025-02-20)

Fix variable typo

### [1.2.2](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.1...v1.2.2) (2025-02-20)

Add HTML page title variable to .env

### [1.2.1](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.2.0...v1.2.1) (2025-02-20)

Update README

## [1.2.0](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.17...v1.2.0) (2025-02-19)

Feat: Generate an html file built for QuickBase code pages and hide the index.html file that node generates in a ./dist/unused folder.

### [1.1.17](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.16...v1.1.17) (2025-02-19)

Hide node index.html in ./dist/unused

### [1.1.16](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.15...v1.1.16) (2025-02-19)

Needed to npm run build

### [1.1.15](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.14...v1.1.15) (2025-02-19)

Don't append script if && createHtmlCodePage is already there.

### [1.1.14](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.13...v1.1.14) (2025-02-19)

Forgot to npm run build

### [1.1.13](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.12...v1.1.13) (2025-02-19)

find-up package needed to be updated to support import syntax

### [1.1.12](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.11...v1.1.12) (2025-02-19)

Forgot to save package.json

### [1.1.11](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.10...v1.1.11) (2025-02-19)

Update htmlGen permissions in postbuild.js

### [1.1.10](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.9...v1.1.10) (2025-02-19)

Try to add htmlgen

### [1.1.9](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.8...v1.1.9) (2025-02-19)

Wait for login page inputs to load before entering information

### [1.1.8](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.7...v1.1.8) (2025-02-19)

Turns out npm does not allow for cleanup scripts to run on uninstall

### [1.1.7](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.6...v1.1.7) (2025-02-19)

Check if preuninstall is running at all, removing the script.

### [1.1.6](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.5...v1.1.6) (2025-02-19)

if initCwd is not set, throw an error.

### [1.1.5](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.4...v1.1.5) (2025-02-19)

Remove npm run codepages when the package is uninstalled

### [1.1.4](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.3...v1.1.4) (2025-02-19)

Try to target the consuming projects package.json

### [1.1.3](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.2...v1.1.3) (2025-02-19)

Add error checking to postinstall.js

### [1.1.2](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.1...v1.1.2) (2025-02-19)

Add a postinstall script to add 'npm run codepages'

### [1.1.1](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.1.0...v1.1.1) (2025-02-19)

Add a script command to run codepages

## [1.1.0](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.15...v1.1.0) (2025-02-19)

Code pages get updated and the error screenshot gets created and deleted correctly

### [1.0.15](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.14...v1.0.15) (2025-02-19)

The codepage content id #pagetext got renamed without me noticing

### [1.0.14](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.13...v1.0.14) (2025-02-19)

Refactor screenshot logic

### [1.0.13](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.12...v1.0.13) (2025-02-19)

I think I forgot to npm run build

### [1.0.12](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.11...v1.0.12) (2025-02-19)

Try to put screenshot in the src/screenshots-puppeteer folder

### [1.0.11](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.10...v1.0.11) (2025-02-19)

repeat, not sure

### [1.0.10](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.9...v1.0.10) (2025-02-19)

Add screenshots-puppeteer folder to hold errors pics

### [1.0.9](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.8...v1.0.9) (2025-02-19)

If the script is run directly with npx call updateCodePage

### [1.0.8](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.7...v1.0.8) (2025-02-19)

Forgot to build

### [1.0.7](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.6...v1.0.7) (2025-02-19)

Try targeting the ./dist/ folder

### [1.0.6](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.5...v1.0.6) (2025-02-19)

Try fixing an issue with relative path to get to the dist/ folder in the imported project

### [1.0.5](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.4...v1.0.5) (2025-02-19)

Try updaing the ./dist/.index.js bin url

### [1.0.4](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.3...v1.0.4) (2025-02-18)

Add a console log to see if the script is running

### [1.0.3](https://github.com/DrewBradfordXYZ/quickbase-codepages/compare/v1.0.2...v1.0.3) (2025-02-18)

npm pkg fix was run

### 1.0.2 (2025-02-18)

First attempt at running this library. I think the script wasn't executable, trying again.
