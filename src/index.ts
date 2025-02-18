import puppeteer, { Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import chalk from "chalk";

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // this line is needed to get the absolute path of the current file in an ES6 module,
const __dirname = path.dirname(__filename);

const getAllFiles = (
  extension: string,
  directory: string = "assets"
): string[] => {
  const assetsDir = path.resolve(__dirname, `../dist/${directory}`);
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

const takeScreenshot = async (page: Page, filename: string): Promise<void> => {
  const screenshotPath = path.join(__dirname, filename);
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

const updateCodePages = async () => {
  const quickbaseUrl = process.env.QUICKBASE_LOGIN_URL!;
  const quickbasePagePath = process.env.QUICKBASE_CODEPAGE_EDIT_URL!;
  const username = process.env.QUICKBASE_USERNAME!;
  const password = process.env.QUICKBASE_PASSWORD!;
  const htmlPageId = process.env.QUICKBASE_CODEPAGE_HTML_ID!;
  const jsPageIds = process.env.QUICKBASE_CODEPAGE_JS_IDS!.split(",");
  const cssPageIds = process.env.QUICKBASE_CODEPAGE_CSS_IDS!.split(",");

  const jsFiles = getAllFiles(".js");
  const cssFiles = getAllFiles(".css");
  const htmlFiles = getAllFiles(".html", ""); // Specify the root dist directory for HTML files

  // --no-sandbox is required when running Puppeteer on a Linux server
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  try {
    // Log in to QuickBase
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
        console.error(
          chalk.red(
            `Login attempt ${loginAttempt} failed: ${
              (loginError as Error).message
            }`
          )
        );
        if (loginAttempt >= maxLoginAttempts) {
          console.error(
            chalk.bold.bgRed("Max login attempts reached. Exiting.")
          );
          await browser.close();
          return;
        }
        // Add a delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    // Function to update code page content
    const updatePageContent = async (
      pageId: string,
      codeContent: string,
      filePath: string
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

          console.log(
            `${chalk.bold.whiteBright(`Opened code-page-${pageId}`)}`
          );
          success = true;
        } catch (error) {
          console.error(
            chalk.yellow(
              `Attempt ${attempt}: Failed to navigate to code-page-${pageId}`
            )
          );

          const enableErrorDetails = false; // Set to true to display error details

          if (attempt >= maxRetries) {
            console.error(chalk.bold.bgRed("Max retries reached."));
            console.error(chalk.bold.red(`${url}`));
            if (enableErrorDetails) {
              console.error(error);
            }
            return;
          }

          // Add a delay before retrying
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }

      // Update the code page content
      await page.evaluate((codeContent) => {
        const codeEditor = document.querySelector(
          "#codeEditor"
        ) as HTMLTextAreaElement;
        codeEditor.value = codeContent;
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

    // Update HTML code page if htmlPageId is not empty
    if (htmlPageId && htmlFiles.length > 0) {
      const htmlFilePath = htmlFiles[0];
      const htmlCodeContent = fs.readFileSync(htmlFilePath, "utf8");
      await updatePageContent(htmlPageId, htmlCodeContent, htmlFilePath);
    }

    // Update JavaScript code pages
    for (let i = 0; i < jsFiles.length; i++) {
      const jsFilePath = jsFiles[i];
      const jsCodeContent = fs.readFileSync(jsFilePath, "utf8");
      const jsPageId = jsPageIds[i];
      await updatePageContent(jsPageId, jsCodeContent, jsFilePath);
    }

    // Update CSS code pages
    for (let i = 0; i < cssFiles.length; i++) {
      const cssFilePath = cssFiles[i];
      const cssCodeContent = fs.readFileSync(cssFilePath, "utf8");
      const cssPageId = cssPageIds[i];
      await updatePageContent(cssPageId, cssCodeContent, cssFilePath);
    }

    // Set to true to test screenshot capture
    if (false) {
      throw new Error("Intentional error for testing screenshot capture.");
    }

    // Delete the screenshot file after successful execution
    const screenshotPath = path.join(
      __dirname,
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
    console.error("Something went wrong, check the screenshot", error);
    try {
      // Take a screenshot for debugging
      await takeScreenshot(
        page,
        "./screenshots-puppeteer/error_codepage_screenshot.png"
      );
    } catch (screenshotError) {
      console.error("Error capturing screenshot:", screenshotError);
    }
  } finally {
    await browser.close();
  }
};

export { updateCodePages };
