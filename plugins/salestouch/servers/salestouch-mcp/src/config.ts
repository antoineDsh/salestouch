import { access, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

type PluginConfig = {
  apiKey?: string;
  accessToken?: string;
  baseUrl?: string;
};

const DEFAULT_BASE_URL = "https://www.salestouch.io";
const CONFIG_FILE_NAME = "salestouch.json";
const LEGACY_CONFIG_FILE_NAME = "cli.json";
const WORKSPACE_BASE_URL_FILES = [".env.local", ".env"];
const WORKSPACE_BASE_URL_KEY = "SALESTOUCH_API_BASE_URL";
const PROJECT_CONFIG_MARKERS = [
  path.join(".salestouch", CONFIG_FILE_NAME),
  path.join(".salestouch", LEGACY_CONFIG_FILE_NAME),
  path.join(".salestouch", "setup.json"),
];
const PROJECT_ROOT_MARKERS = ["package.json", ".git"];

type LoadedPluginConfig = {
  apiKey: string | null;
  accessToken: string | null;
  baseUrl: string | null;
};

export type ResolvedPluginApiConfig = {
  baseUrl: string;
  apiKey: string | null;
  accessToken: string | null;
};

function readEnvString(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

async function pathExists(targetPath: string) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function getGlobalConfigDirectory() {
  const override = readEnvString("SALESTOUCH_CONFIG_DIR");
  if (override) {
    return override;
  }

  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "SalesTouch");
  }

  if (process.platform === "win32") {
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
      "SalesTouch",
    );
  }

  return path.join(
    process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"),
    "salestouch",
  );
}

function getGlobalConfigPath() {
  return path.join(getGlobalConfigDirectory(), CONFIG_FILE_NAME);
}

function getLegacyConfigPath(configPath: string) {
  return path.join(path.dirname(configPath), LEGACY_CONFIG_FILE_NAME);
}

async function findExistingProjectConfigBaseDir(startDir: string) {
  let currentDir = path.resolve(startDir);

  while (true) {
    for (const marker of PROJECT_CONFIG_MARKERS) {
      if (await pathExists(path.join(currentDir, marker))) {
        return currentDir;
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

async function findNearestProjectBaseDir(startDir: string) {
  const configBaseDir = await findExistingProjectConfigBaseDir(startDir);
  if (configBaseDir) {
    return configBaseDir;
  }

  let currentDir = path.resolve(startDir);

  while (true) {
    for (const marker of PROJECT_ROOT_MARKERS) {
      if (await pathExists(path.join(currentDir, marker))) {
        return currentDir;
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return path.resolve(startDir);
    }

    currentDir = parentDir;
  }
}

export async function getProjectConfigPath(startDir: string) {
  const baseDir = await findNearestProjectBaseDir(startDir);
  return path.join(baseDir, ".salestouch", CONFIG_FILE_NAME);
}

async function readConfigFile(filePath: string): Promise<LoadedPluginConfig | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as PluginConfig;
    return {
      apiKey: typeof parsed.apiKey === "string" && parsed.apiKey.trim() ? parsed.apiKey.trim() : null,
      accessToken:
        typeof parsed.accessToken === "string" && parsed.accessToken.trim()
          ? parsed.accessToken.trim()
          : null,
      baseUrl: typeof parsed.baseUrl === "string" && parsed.baseUrl.trim() ? parsed.baseUrl.trim() : null,
    };
  } catch {
    return null;
  }
}

async function loadConfig(configPath: string) {
  const config = await readConfigFile(configPath);
  if (config) {
    return config;
  }

  return (await readConfigFile(getLegacyConfigPath(configPath))) ?? {
    apiKey: null,
    accessToken: null,
    baseUrl: null,
  };
}

function parseEnvLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");
  if (separatorIndex <= 0) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

async function readWorkspaceBaseUrlFromFile(filePath: string) {
  try {
    const raw = await readFile(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);
      if (parsed?.key === WORKSPACE_BASE_URL_KEY && parsed.value) {
        return parsed.value;
      }
    }
  } catch {
    // ignore missing files
  }

  return null;
}

async function findWorkspaceBaseUrl(startDir: string) {
  let currentDir = path.resolve(startDir);

  while (true) {
    for (const fileName of WORKSPACE_BASE_URL_FILES) {
      const baseUrl = await readWorkspaceBaseUrlFromFile(path.join(currentDir, fileName));
      if (baseUrl) {
        return baseUrl;
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

function getResolutionStartDir() {
  return (
    readEnvString("SALESTOUCH_PROJECT_DIR") ||
    readEnvString("INIT_CWD") ||
    process.cwd()
  );
}

export async function resolvePluginApiConfig(
  options?: {
    cwd?: string;
  },
): Promise<ResolvedPluginApiConfig> {
  const cwd = options?.cwd ?? getResolutionStartDir();
  const projectConfig = await loadConfig(await getProjectConfigPath(cwd));
  const globalConfig = await loadConfig(getGlobalConfigPath());
  const workspaceBaseUrl = await findWorkspaceBaseUrl(cwd);

  const envApiKey = readEnvString("SALESTOUCH_API_KEY");
  const envAccessToken = readEnvString("SALESTOUCH_ACCESS_TOKEN");
  const envBaseUrl = readEnvString("SALESTOUCH_API_BASE_URL");

  const apiKey = envApiKey || projectConfig.apiKey || globalConfig.apiKey || null;
  const accessToken =
    envAccessToken || projectConfig.accessToken || globalConfig.accessToken || null;
  const baseUrl = (
    envBaseUrl ||
    projectConfig.baseUrl ||
    globalConfig.baseUrl ||
    workspaceBaseUrl ||
    DEFAULT_BASE_URL
  ).replace(/\/$/, "");

  if (!apiKey && !accessToken) {
    throw new Error(
      "Missing SalesTouch authentication. Run `salestouch setup`, `salestouch auth login`, or provide SALESTOUCH_API_KEY / SALESTOUCH_ACCESS_TOKEN.",
    );
  }

  return {
    baseUrl,
    apiKey,
    accessToken,
  };
}
