export default {
  quickbaseLoginUrl: "https://example.quickbase.com/db/main",
  username: "user@example.com",
  password: "secret",
  apps: {
    MYAPP1: {
      quickbaseCodepageEditUrl:
        "https://example.quickbase.com/db/abc123?a=editpage&id=",
      quickbaseCodepageHtmlId: "5",
      quickbaseCodepageJsIds: ["6", "7"],
      quickbaseCodepageCssIds: ["8"],
      quickbaseHtmlPageTitle: "My App",
      quickbaseCodepagesUrl: "https://example.quickbase.com/db/abc123",
    },
    MYAPP2: {
      quickbaseCodepageEditUrl:
        "https://example.quickbase.com/db/abc123?a=editpage&id=",
      quickbaseCodepageHtmlId: "5",
      quickbaseCodepageJsIds: ["6", "7"],
      quickbaseCodepageCssIds: ["8"],
      quickbaseHtmlPageTitle: "My App",
      quickbaseCodepagesUrl: "https://example.quickbase.com/db/abc123",
    },
  },
};
