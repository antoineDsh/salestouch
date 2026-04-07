import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getProjectConfigPath, resolvePluginApiConfig } from "./config.js";

const ORIGINAL_ENV = { ...process.env };

async function writeJson(filePath: string, value: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

describe("resolvePluginApiConfig", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("prefers the project config over the global config", async () => {
    const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "salestouch-plugin-config-"));
    process.env.SALESTOUCH_CONFIG_DIR = path.join(fixtureDir, "global-config");

    await writeFile(path.join(fixtureDir, "package.json"), "{}\n", "utf8");
    await writeJson(await getProjectConfigPath(fixtureDir), {
      baseUrl: "https://project.salestouch.io",
      accessToken: "project-token",
    });
    await writeJson(path.join(process.env.SALESTOUCH_CONFIG_DIR, "salestouch.json"), {
      baseUrl: "https://global.salestouch.io",
      apiKey: "global-key",
    });

    const config = await resolvePluginApiConfig({ cwd: fixtureDir });

    expect(config.baseUrl).toBe("https://project.salestouch.io");
    expect(config.accessToken).toBe("project-token");
    expect(config.apiKey).toBe("global-key");
  });

  it("falls back to the legacy cli.json file", async () => {
    const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "salestouch-plugin-legacy-"));
    process.env.SALESTOUCH_CONFIG_DIR = path.join(fixtureDir, "global-config");

    await writeFile(path.join(fixtureDir, "package.json"), "{}\n", "utf8");
    const projectConfigPath = await getProjectConfigPath(fixtureDir);
    await writeJson(path.join(path.dirname(projectConfigPath), "cli.json"), {
      accessToken: "legacy-token",
    });

    const config = await resolvePluginApiConfig({ cwd: fixtureDir });

    expect(config.accessToken).toBe("legacy-token");
    expect(config.baseUrl).toBe("https://www.salestouch.io");
  });

  it("lets environment credentials override project config", async () => {
    const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "salestouch-plugin-env-"));
    process.env.SALESTOUCH_CONFIG_DIR = path.join(fixtureDir, "global-config");
    process.env.SALESTOUCH_API_KEY = "env-key";
    process.env.SALESTOUCH_API_BASE_URL = "https://env.salestouch.io";

    await writeFile(path.join(fixtureDir, "package.json"), "{}\n", "utf8");
    await writeJson(await getProjectConfigPath(fixtureDir), {
      baseUrl: "https://project.salestouch.io",
      accessToken: "project-token",
    });

    const config = await resolvePluginApiConfig({ cwd: fixtureDir });

    expect(config.baseUrl).toBe("https://env.salestouch.io");
    expect(config.apiKey).toBe("env-key");
    expect(config.accessToken).toBe("project-token");
  });
});
