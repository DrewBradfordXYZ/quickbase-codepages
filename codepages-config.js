// codepages-config.js

// You can load environment variables however you prefer (e.g., dotenv, process.env, custom logic).
// Example with dotenv (optional):
// import dotenv from "dotenv";
// dotenv.config();

// Define your QuickBase configuration here.
// Sensitive data (e.g., username, password) can be sourced from environment variables or hardcoded,
// depending on your security preferences.
export default {
  quickbaseLoginUrl:
    process.env.QUICKBASE_LOGIN_URL ||
    "https://yourdomain.quickbase.com/db/main",
  username: process.env.QUICKBASE_USERNAME || "your-username",
  password: process.env.QUICKBASE_PASSWORD || "your-password",
  apps: {
    MYAPP1: {
      quickbaseCodepagesUrl: "https://yourdomain.quickbase.com/db/bxyz123",
      quickbaseCodepageEditUrl:
        "https://yourdomain.quickbase.com/db/bxyz123?a=editpage&id=",
      quickbaseHtmlPageTitle: "My App 1",
      quickbaseCodepageHtmlId: "5",
      quickbaseCodepageJsIds: ["6", "7"],
      quickbaseCodepageCssIds: ["8"],
    },
    MYAPP2: {
      quickbaseCodepagesUrl: "https://yourdomain.quickbase.com/db/babc456",
      quickbaseCodepageEditUrl:
        "https://yourdomain.quickbase.com/db/babc456?a=editpage&id=",
      quickbaseHtmlPageTitle: "My App 2",
      quickbaseCodepageHtmlId: "9",
      quickbaseCodepageJsIds: ["10", "11"],
      quickbaseCodepageCssIds: ["12"],
    },
  },
};
