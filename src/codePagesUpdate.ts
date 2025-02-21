#!/usr/bin/env node

import puppeteer, { Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // this line is needed to get the absolute path of the current file in an ES6 module,
const __dirname = path.dirname(__filename);

const getAllFiles = (
  extension: string,
  directory: string = "assets"
): string[] => {
  const assetsDir = path.resolve(process.cwd(), `./dist/${directory}`);
  let files: string[];
  try {
    files = fs.readdirSync(assetsDir);
  } catch (error) {
    throw new Error(
      `Error reading directory ${assetsDir}: ${(error as Error).message}`
    );
  }
  const filteredFiles = files.filter((file) => file.endsWith(extension));
  if (filteredFiles.length === 0) {
    throw new Error(
      `No files found in dist/${directory} directory with extension ${extension}`
    );
  }
  return filteredFiles.map((file) => path.join(assetsDir, file));
};

const generateScreenshotPath = (filename: string): string => {
  const libraryRoot = path.resolve(__dirname, ".."); // Go up one level from dist
  return path.join(libraryRoot, "screenshots-puppeteer", filename);
};

const captureScreenshot = async (
  page: Page,
  filename: string
): Promise<void> => {
  const screenshotPath = generateScreenshotPath(filename);
  try {
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error(`Error taking screenshot: ${(error as Error).message}`);
  }
};

const logNavigationAttempt = (attempt: number, url: string) => {
  const message =
    attempt === 1
      ? `${chalk.bold.whiteBright("Navigating to")} ${chalk.blue(url)}`
      : chalk.bold.whiteBright(
          `Attempt ${attempt}: Navigating to ${chalk.blue(url)}`
        );
  console.log(message);
};

const extractPageName = async (page: Page): Promise<string> => {
  return await page.evaluate(() => {
    const nameInput = document.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement;
    return nameInput ? nameInput.value : "Unknown";
  });
};

// Function to log into QuickBase
const loginToQuickBase = async (
  page: Page,
  quickbaseUrl: string,
  username: string,
  password: string
) => {
  console.log(chalk.bold.underline.whiteBright("Logging in to QuickBase"));
  let loginSuccess = false;
  const maxLoginAttempts = 3;
  let loginAttempt = 0;

  while (!loginSuccess && loginAttempt < maxLoginAttempts) {
    try {
      loginAttempt++;
      if (loginAttempt > 1) {
        console.log(chalk.blue(`Login attempt ${loginAttempt}`));
      }
      await page.goto(quickbaseUrl, { timeout: 60000 });
      await page.waitForSelector("input[name='loginid']", { timeout: 60000 });
      await page.type("input[name='loginid']", username);
      await page.type("input[name='password']", password);
      await page.click("#signin");
      await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 60000,
      });

      // Check if login was successful
      const loginError = await page.$(".login-error");
      if (loginError) {
        throw new Error("Login failed. Please check your credentials.");
      }

      console.log(chalk.bold.green("Signed In to QuickBase."));
      loginSuccess = true;
    } catch (loginError) {
      const errorMessage = (loginError as Error).message;
      console.error(
        chalk.red(`Login attempt ${loginAttempt} failed: ${errorMessage}`)
      );
      if (loginAttempt >= maxLoginAttempts) {
        console.error(chalk.bold.bgRed("Max login attempts reached. Exiting."));
        await page.browser().close();
        return false;
      }
      // Add a delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  return loginSuccess;
};
type EnvVariables = {
  missingEnvVars: number;
  quickbasePagePath: string;
  htmlPageId: string;
  jsPageIds: string[];
  cssPageIds: string[];
};
// Function to get app identifiers from environment variables
const getAppIdentifiers = (): Set<string> => {
  const env = process.env;
  const appIdentifierSet = new Set<string>();
  Object.keys(env).forEach((key) => {
    const match = key.match(/^([^_]+)_QUICKBASE_.+$/);
    if (match) {
      appIdentifierSet.add(match[1]);
    }
  });
  return appIdentifierSet;
};
function getEnvVariablesByAppIdentifier(appIdentifier: string): EnvVariables {
  console.log(chalk.bold.whiteBright.underline(`\nStarting ${appIdentifier}`));
  const quickbasePagePath =
    process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_EDIT_URL`] || "";
  const htmlPageId =
    process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_HTML_ID`] || "";
  const jsPageIds =
    process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_JS_IDS`] || "";
  const cssPageIds =
    process.env[`${appIdentifier}_QUICKBASE_CODEPAGE_CSS_IDS`] || "";

  let missingEnvVars = 0;
  if (!quickbasePagePath) {
    console.warn(`Missing ${appIdentifier}_QUICKBASE_CODEPAGE_EDIT_URL`);
    missingEnvVars++;
  }
  if (!jsPageIds) {
    console.warn(`Missing ${appIdentifier}_QUICKBASE_CODEPAGE_JS_IDS`);
    missingEnvVars++;
  }
  if (!cssPageIds) {
    console.warn(`Missing ${appIdentifier}_QUICKBASE_CODEPAGE_CSS_IDS`);
    missingEnvVars++;
  }
  if (!htmlPageId) {
    console.warn("Skipping HTML page update. Missing HTML page ID.");
  }

  return {
    missingEnvVars,
    quickbasePagePath,
    htmlPageId,
    jsPageIds: jsPageIds.split(","),
    cssPageIds: cssPageIds.split(","),
  };
}

const updatePageContent = async (
  pageId: string,
  codeContent: string,
  filePath: string,
  quickbasePagePath: string,
  page: any
) => {
  const url = `${quickbasePagePath}${pageId}`;
  const maxRetries = 3;
  let attempt = 0;
  let success = false;
  let codePageName = "Unknown"; // Initialize pageName

  while (attempt < maxRetries && !success) {
    try {
      attempt++;
      logNavigationAttempt(attempt, url);

      await page.goto(url, { timeout: 30000 }); // 30 seconds timeout
      await page.waitForSelector("#pagetext", { timeout: 30000 }); // Wait for the element where the code goes

      // Extract the value of the name field
      codePageName = await extractPageName(page);

      console.log(`${chalk.bold.whiteBright(`Opened code-page-${pageId}`)}`);
      success = true;
    } catch (error) {
      console.error(
        chalk.yellow(
          `Attempt ${attempt} to open code-page-${pageId} failed: ${
            (error as Error).message
          }`
        )
      );
    }
  }

  if (!success) {
    throw new Error(
      `Failed to open code-page-${pageId} after ${maxRetries} attempts`
    );
  }

  // Update the code page content
  await page.evaluate((codeContent: string) => {
    const pageText = document.querySelector("#pagetext") as HTMLTextAreaElement;
    if (pageText) {
      pageText.value = codeContent;
    } else {
      throw new Error("Code editor element not found");
    }
  }, codeContent);

  // Save the changes
  await page.click("#btnSaveDone");
  console.log(
    `${chalk.bold.whiteBright("Updating")} ${chalk.hex("#FFA500")(
      `${codePageName}`
    )} ${chalk.bold.whiteBright("with")} ${chalk.hex("#FFA500")(
      path.basename(filePath)
    )}`
  );
  await page.waitForNavigation();
  console.log(chalk.bold.bgGreen(`Successfully Saved`));
};

const updateCodePages = async () => {
  // Get ./dist files with .js, .css, and .html extensions
  const jsFiles = getAllFiles(".js");
  const cssFiles = getAllFiles(".css");
  const htmlFiles = getAllFiles(".html", ""); // Specify the root dist directory for HTML files
  // Get QuickBase login credentials
  const quickbaseUrl = process.env.QUICKBASE_LOGIN_URL!;
  const username = process.env.QUICKBASE_USERNAME!;
  const password = process.env.QUICKBASE_PASSWORD!;

  // --no-sandbox is required when running Puppeteer on a Linux server
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  try {
    const loginSuccess = await loginToQuickBase(
      page,
      quickbaseUrl,
      username,
      password
    );
    if (!loginSuccess) {
      return;
    }

    //Ex: {'APPNAME1', 'APPNAME2', 'APP3'}
    const appIdentifierSet = getAppIdentifiers();

    // Iterate over each appIdentifier and call updatePageContent
    for (const appIdentifier of appIdentifierSet) {
      // Process environment variables for each appIdentifier
      const {
        missingEnvVars,
        quickbasePagePath,
        htmlPageId,
        jsPageIds,
        cssPageIds,
      } = getEnvVariablesByAppIdentifier(appIdentifier);

      // Skip appIdentifier update if any required environment variables are missing
      if (missingEnvVars === 0) {
        // Update HTML code page if htmlPageId is not empty
        if (htmlPageId && htmlFiles.length > 0) {
          const htmlFilePath = htmlFiles[0];
          const htmlCodeContent = fs.readFileSync(htmlFilePath, "utf8");
          await updatePageContent(
            htmlPageId,
            htmlCodeContent,
            htmlFilePath,
            quickbasePagePath,
            page
          );
        }

        // Update JavaScript code pages
        for (let i = 0; i < jsFiles.length; i++) {
          const jsFilePath = jsFiles[i];
          const jsCodeContent = fs.readFileSync(jsFilePath, "utf8");
          const jsPageId = jsPageIds[i];
          await updatePageContent(
            jsPageId,
            jsCodeContent,
            jsFilePath,
            quickbasePagePath,
            page
          );
        }

        // Update CSS code pages
        for (let i = 0; i < cssFiles.length; i++) {
          const cssFilePath = cssFiles[i];
          const cssCodeContent = fs.readFileSync(cssFilePath, "utf8");
          const cssPageId = cssPageIds[i];
          await updatePageContent(
            cssPageId,
            cssCodeContent,
            cssFilePath,
            quickbasePagePath,
            page
          );
        }
      } else {
        console.warn(
          `Skipping update for ${appIdentifier} due to missing environment variables.`
        );
      }
    }

    // Set to true to test screenshot capture
    if (false) {
      throw new Error("Intentional error for testing screenshot capture.");
    }

    // Delete the screenshot file after successful execution
    const screenshotPath = generateScreenshotPath(
      "error_codepage_screenshot.png"
    );
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
      console.log(
        "Script ran without errors, screenshot error file deleted successfully."
      );
    }
  } catch (error) {
    console.error("Something went wrong, check the screenshot", error);
    try {
      // Take a screenshot for debugging
      await captureScreenshot(page, "error_codepage_screenshot.png");
    } catch (screenshotError) {
      console.error("Error capturing screenshot:", screenshotError);
    }
  } finally {
    await browser.close();
  }
}; // End of updateCodePages function

// Export the function for external use
export { updateCodePages };

// If the script is run directly, call the function
if (import.meta.url === `file://${__filename}`) {
  updateCodePages();
}
