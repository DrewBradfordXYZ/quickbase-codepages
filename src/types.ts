export interface AppConfig {
  quickbaseLoginUrl: string;
  username: string;
  password: string;
  apps: Record<string, AppIdentifierConfig>;
}

export interface AppIdentifierConfig {
  quickbaseCodepageEditUrl: string;
  quickbaseCodepageHtmlId?: string;
  quickbaseCodepageJsIds: string[];
  quickbaseCodepageCssIds: string[];
  quickbaseHtmlPageTitle?: string;
  quickbaseCodepagesUrl?: string;
}
