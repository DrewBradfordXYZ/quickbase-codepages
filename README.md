# quickbase-codepages

Update QuickBase code pages from the command line.

## Install

`npm install quickbase-codepages --save-dev`

## Environment Variables

This project requires certain environment variables to be set in a `.env` file. Below is a list of the variables and their descriptions:

### Optional Variables for Development and Production

These variables are optional for `npm run dev` and `npm run build`. You can run development and production without these variables.

### Required Variables for QuickBase Operations

These variables are required for `npm run quickbase` to update code pages from the command line, but they can be updated manually. They also help generate the `quickbase-copy.html` for `npm run build`, but it can be updated manually. `npm run dev` is not affected by these variables.

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

### Example `.env` File

```properties
# QuickBase credentials.
QUICKBASE_USERNAME=your-username
QUICKBASE_PASSWORD=your-password

# QuickBase URLs.
QUICKBASE_LOGIN_URL=https://builderprogram-USERNAME.quickbase.com/db/main?a=SignIn
QUICKBASE_CODEPAGE_EDIT_URL=https://builderprogram-USERNAME.quickbase.com/nav/app/DBID/action/pageedit?pageID=
```
