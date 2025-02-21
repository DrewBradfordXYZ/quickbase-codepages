# quickbase-codepages

## Description

Automatically update your QuickBase code pages with production files in your `./dist` folder using `npm run codepages`. It also generates an HTML file with JS and CSS code page links using `npm run build`.

This allows you to deploy and test your project in QuickBase with ease. Removing the hassle of manually copy and pasting into code pages.

This project uses Puppeteer to automate this process.

![Copy code page in the terminal](copyExample.png)

## Prerequisites

- Node.js version 16.x or higher is recommended.
- A QuickBase account. A free [builder account](https://www.quickbase.com/builder-program) will work.

## Install

```bash
npm install quickbase-codepages --save-dev
```

## Uninstall

```bash
# This uninstalls the entire library
npx uninstall-quickbase-codepages
```

It's not recommended to uninstall with `npm uninstall quickbase-codepages --save-dev`. If you did, reinstall the library with `npm install quickbase-codepages --save-dev` and uninstall correctly with `npx uninstall-quickbase-codepages`.

## Use

`npm run codepages`

auto updates code page content with production files in your projects `./dist` folder.

- Terminal messages display the matching behavior of code pages to production files so you can see what is being saved.
- To change the matching behavior, reorder the code page ID variable lists in `.env`. NOTE: the order starts top down in `./dist` by file type.
- If you wish to not update your HTML code page, set `QUICKBASE_CODEPAGE_HTML_ID=` in `.env`.

`npm run build`

is extended with additional features to set up a QuickBase ready HTML file and project structure:

- Auto creates a QuickBase ready `yourprojectname.html` file in your project's `./dist` folder with CSS and JS links pointing to your code page URLs.
  - To turn this behavior off, remove `&& createCodePageHtml` from the `"build"` script in `package.json`
- The default `index.html` is no longer needed and is moved into `./dist/unused/`. This folder is ignored by `npm run codepages` and will not be saved to a code page.
  - To turn this behavior off, remove `&& hideDefaultHtml` from the `"build"` script in `package.json`.

## Required: Environment Variables

This project requires environment variables to be set in your `.env` file.

#### .gitignore

> **Note:** Make sure to add `.env` to your `.gitignore` file to avoid exposing sensitive information.

```gitignore
# Environment variables
.env
```

- **`QUICKBASE_USERNAME`**:

  - Your QuickBase username.

- **`QUICKBASE_PASSWORD`**:

  - Your QuickBase password.

- **`QUICKBASE_LOGIN_URL`**:

  - Logout to get the sign-in URL for QuickBase.
  - Example: `https://builderprogram-USERNAME.quickbase.com/db/main?a=SignIn`

> **Note:** You may rename 'APPNAME1', 'APPNAME2', 'APPNAME3' etc to be your app name. However they cannot be removed or have spaces. The assigned names are displayed in the terminal while updating, so renaming is helpful.

- **`APPNAME1_QUICKBASE_CODEPAGES_URL`**:

  - Navigate to the Pages section in your app. This is the page that lists all your code pages.
  - Example: `https://builderprogram-USERNAME.quickbase.com/nav/app/DBID/action/AppDBPages`

- **`APPNAME1_QUICKBASE_CODEPAGE_EDIT_URL`**:

  - The URL when you navigate to an individual code page.
  - Example: `https://builderprogram-USERNAME.quickbase.com/nav/app/DBID/action/pageedit?pageID=`

- **`APPNAME1_QUICKBASE_HTML_PAGE_TITLE`**:

  - The HTML `<title></title>` for the generated HTML code page.
  - Example: `Page Title`

- **`APPNAME1_QUICKBASE_CODEPAGE_HTML_ID`**:

  - The HTML code page ID.
  - Optional but recommended.
  - Example: `2`

- **`APPNAME1_QUICKBASE_CODEPAGE_JS_IDS`**:

  - Comma-separated list of JavaScript code page IDs.
  - Example: `3,5`

- **`APPNAME1_QUICKBASE_CODEPAGE_CSS_IDS`**:

  - Comma-separated list of CSS code page IDs.
  - Example: `4,6`

### Example `.env` File

See `.env.example` in the project files. You may use this as a template. Rename `.env.example` to `.env` and place it in your root folder.

> **Note:** Make sure to add `.env` to your `.gitignore` file to avoid exposing sensitive information.

```properties
# QuickBase login
QUICKBASE_USERNAME=
QUICKBASE_PASSWORD=
QUICKBASE_LOGIN_URL=

# Code Page URLs
APPNAME1_QUICKBASE_CODEPAGES_URL=
APPNAME1_QUICKBASE_CODEPAGE_EDIT_URL=

# HTML <title>Page Title</title>
APPNAME1_QUICKBASE_HTML_PAGE_TITLE=

# QuickBase code page IDs
APPNAME1_QUICKBASE_CODEPAGE_HTML_ID=
APPNAME1_QUICKBASE_CODEPAGE_JS_IDS=
APPNAME1_QUICKBASE_CODEPAGE_CSS_IDS=

# Second app
APPNAME2_QUICKBASE_CODEPAGES_URL=
APPNAME2_QUICKBASE_CODEPAGE_EDIT_URL=
APPNAME2_QUICKBASE_HTML_PAGE_TITLE=
APPNAME2_QUICKBASE_CODEPAGE_HTML_ID=
APPNAME2_QUICKBASE_CODEPAGE_JS_IDS=
APPNAME2_QUICKBASE_CODEPAGE_CSS_IDS=

# Additional apps follow the pattern above...
```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
