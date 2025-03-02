// src/quickbase-update.ts
import puppeteer, { Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { AppConfig, AppIdentifierConfig } from "./types/quickbase-types.js";

export async function updateQuickbase(config: AppConfig) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  try {
    const loginSuccess = await loginToQuickbase(
      page,
      config.quickbaseLoginUrl,
      config.username,
      config.password
    );
    if (!loginSuccess) return;

    for (const [appIdentifier, appConfig] of Object.entries(config.apps)) {
      console.log(
        chalk.bold.whiteBright.underline(`\nStarting ${appIdentifier}`)
      );

      const {
        missingEnvVars,
        quickbasePagePath,
        htmlPageId,
        jsPageIds,
        cssPageIds,
      } = normalizeAppConfig(appIdentifier, appConfig);

      if (missingEnvVars > 0) {
        console.warn(
          `Skipping update for ${appIdentifier} due to missing required variables.`
        );
        continue;
      }

      const jsFiles = getAllFiles(".js");
      const cssFiles = getAllFiles(".css");
      const htmlFiles = getAllFiles(".html", "");

      if (htmlPageId && htmlFiles.length > 0) {
        const htmlFilePath = htmlFiles.find((file) =>
          path.basename(file).startsWith(`${appIdentifier}_`)
        );
        if (htmlFilePath) {
          const htmlCodeContent = fs.readFileSync(htmlFilePath, "utf8");
          await updatePageContent(
            htmlPageId,
            htmlCodeContent,
            htmlFilePath,
            quickbasePagePath,
            page
          );
        } else {
          console.warn(`No HTML file found for ${appIdentifier} in dist/`);
        }
      } else if (!htmlPageId) {
        console.warn(
          `Skipping HTML page update for ${appIdentifier}. Missing HTML page ID.`
        );
      }

      for (let i = 0; i < jsFiles.length && i < jsPageIds.length; i++) {
        const jsFilePath = jsFiles[i];
        const jsCodeContent = fs.readFileSync(jsFilePath, "utf8");
        await updatePageContent(
          jsPageIds[i],
          jsCodeContent,
          jsFilePath,
          quickbasePagePath,
          page
        );
      }

      for (let i = 0; i < cssFiles.length && i < cssPageIds.length; i++) {
        const cssFilePath = cssFiles[i];
        const cssCodeContent = fs.readFileSync(cssFilePath, "utf8");
        await updatePageContent(
          cssPageIds[i],
          cssCodeContent,
          cssFilePath,
          quickbasePagePath,
          page
        );
      }
    }

    // Screenshot cleanup
    const screenshotPath = path.join(
      process.cwd(),
      "screenshots-puppeteer",
      "error_codepage_screenshot.png"
    );
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
      console.log(
        "Script ran without errors, screenshot error file deleted successfully."
      );
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    await captureScreenshot(page, "error_codepage_screenshot.png");
  } finally {
    await browser.close();
  }
}

const getAllFiles = (
  extension: string,
  directory: string = "assets"
): string[] => {
  const assetsDir = path.resolve(process.cwd(), `./dist/${directory}`);
  let files: string[];
  try {
    files = fs.readdirSync(assetsDir);
  } catch (error) {
    console.warn(
      `Could not read directory ${assetsDir}: ${(error as Error).message}`
    );
    return [];
  }
  const filteredFiles = files.filter((file) => file.endsWith(extension));
  if (filteredFiles.length === 0) {
    console.warn(
      `No files found in dist/${directory} with extension ${extension}`
    );
    return [];
  }
  return filteredFiles.map((file) => path.join(assetsDir, file));
};

const generateScreenshotPath = (filename: string): string => {
  // Use process.cwd() instead of __dirname for ESM compatibility
  return path.join(process.cwd(), "screenshots-puppeteer", filename);
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

const loginToQuickbase = async (
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
      if (loginAttempt > 1)
        console.log(chalk.blue(`Login attempt ${loginAttempt}`));
      await page.goto(quickbaseUrl, { timeout: 60000 });
      await page.waitForSelector("input[name='loginid']", { timeout: 60000 });
      await page.type("input[name='loginid']", username);
      await page.type("input[name='password']", password);
      await page.click("#signin");
      await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 60000,
      });

      const loginError = await page.$(".login-error");
      if (loginError)
        throw new Error("Login failed. Please check your credentials.");

      console.log(chalk.bold.green("Signed In to QuickBase."));
      loginSuccess = true;
    } catch (error) {
      console.error(
        chalk.red(
          `Login attempt ${loginAttempt} failed: ${(error as Error).message}`
        )
      );
      if (loginAttempt >= maxLoginAttempts) {
        console.error(chalk.bold.bgRed("Max login attempts reached. Exiting."));
        await page.browser().close();
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  return loginSuccess;
};

const updatePageContent = async (
  pageId: string,
  codeContent: string,
  filePath: string,
  quickbasePagePath: string,
  page: Page
) => {
  const url = `${quickbasePagePath}${pageId}`;
  const maxRetries = 3;
  let attempt = 0;
  let success = false;
  let codePageName = "Unknown";

  while (attempt < maxRetries && !success) {
    try {
      attempt++;
      logNavigationAttempt(attempt, url);
      await page.goto(url, { timeout: 30000 });
      await page.waitForSelector("#pagetext", { timeout: 30000 });
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

  await page.evaluate((content: string) => {
    const pageText = document.querySelector("#pagetext") as HTMLTextAreaElement;
    if (pageText) pageText.value = content;
    else throw new Error("Code editor element not found");
  }, codeContent);

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

const normalizeAppConfig = (
  appIdentifier: string,
  config: AppIdentifierConfig
) => {
  let missingEnvVars = 0;
  if (!config.quickbaseCodepageEditUrl) {
    console.warn(`Missing quickbaseCodepageEditUrl for ${appIdentifier}`);
    missingEnvVars++;
  }
  if (!config.quickbaseCodepageJsIds?.length) {
    console.warn(`Missing quickbaseCodepageJsIds for ${appIdentifier}`);
    missingEnvVars++;
  }
  if (!config.quickbaseCodepageCssIds?.length) {
    console.warn(`Missing quickbaseCodepageCssIds for ${appIdentifier}`);
    missingEnvVars++;
  }

  return {
    missingEnvVars,
    quickbasePagePath: config.quickbaseCodepageEditUrl,
    htmlPageId: config.quickbaseCodepageHtmlId,
    jsPageIds: config.quickbaseCodepageJsIds || [],
    cssPageIds: config.quickbaseCodepageCssIds || [],
  };
};
