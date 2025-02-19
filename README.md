# quickbase-codepages

## Description

Automate updating your QuickBase code pages with the files in your Node.js /dist folder from the command line.

## Prerequisites

- Node.js version 14.x or higher
- A QuickBase account. A free (builder account)[https://www.quickbase.com/builder-program] will work.

## Install

`npm install quickbase-codepages --save-dev`

## Use

`npm run codepages`

## Environment Variables

This project requires certain environment variables to be set in a `.env` file for `npm run codepages` to update code pages.

- **`QUICKBASE_USERNAME`**:

  - Your QuickBase username.
  - Used by Puppeteer to sign in to QuickBase.

- **`QUICKBASE_PASSWORD`**:

  - Your QuickBase password.
  - Used by Puppeteer to sign in to QuickBase.

- **`QUICKBASE_LOGIN_URL`**:

  - The sign-in URL for QuickBase.
  - Used by Puppeteer to sign in to QuickBase.
  - Example: `https://builderprogram-USERNAME.quickbase.com/db/main?a=SignIn`

- **`QUICKBASE_CODEPAGE_EDIT_URL`**:

  - The URL to navigate to a code page in your app.
  - Used by Puppeteer to navigate to the code page to update the code.
  - Example: `https://builderprogram-USERNAME.quickbase.com/nav/app/DBID/action/pageedit?pageID=`

- **`QUICKBASE_CODEPAGE_HTML_ID`**:

  - The HTML code page ID.
  - Optional but recommended.
  - Example: `2`

- **`QUICKBASE_CODEPAGE_JS_IDS`**:

  - Comma-separated list of JavaScript code page IDs.
  - Example: `3,5`

- **`QUICKBASE_CODEPAGE_CSS_IDS`**:

  - Comma-separated list of CSS code page IDs.
  - Example: `4,6`

### Example `.env` File

```properties
# QuickBase credentials.
QUICKBASE_USERNAME=
QUICKBASE_PASSWORD=

# QuickBase URLs.
QUICKBASE_LOGIN_URL=
QUICKBASE_CODEPAGE_EDIT_URL=

# QuickBase code page IDs.
QUICKBASE_CODEPAGE_HTML_ID=
QUICKBASE_CODEPAGE_JS_IDS=
QUICKBASE_CODEPAGE_CSS_IDS=
```

```

```
