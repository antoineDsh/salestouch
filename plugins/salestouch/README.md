# SalesTouch Claude Plugin

This folder contains the Claude plugin bundle for SalesTouch.
The plugin talks to the same public automation API as the SalesTouch CLI, reuses the same `salestouch.json` config/auth resolution, and now ships the same core SalesTouch skill source as `salestouch setup`.

## Structure

- `.claude-plugin/plugin.json`: plugin bundle metadata.
- `.mcp.json`: local MCP server registration for Claude.
- `commands/`: slash commands exposed by the plugin inside Claude Code.
- `settings.json`: default Claude plugin settings.
- `skills/`: SalesTouch skill pack, including the generated core `salestouch` skill and plugin-specific helpers.
- `hooks/hooks.json`: plugin hook entrypoint.
- `servers/salestouch-mcp/`: local MCP server that proxies SalesTouch tools and resources through the plugin API.
- `../../.claude-plugin/marketplace.json`: repo-level Claude marketplace manifest that points to this plugin.

## Routine Skill Reuse

The plugin keeps:

- `salestouch`
- `linkedin-message-writer`

## Plugin Commands

The plugin ships with this remaining command entrypoint in Claude Code:

- `/salestouch:linkedin-message-writer`

## MCP Scope

The MCP server is organized around the current SalesTouch command surface:

- Leads
- Missions
- Offers
- Imports
- LinkedIn
- Scoring

## Shared Public Automation API

The plugin uses the same canonical public endpoints as the CLI:

- `GET /api/v1/commands`
- `GET /api/v1/commands/{commandId}/schema`
- `POST /api/v1/commands/{commandId}`
- `GET /api/v1/resources`
- `GET /api/v1/resources/read?uri=...`

Legacy `/api/v1/plugin/*` routes remain as compatibility aliases.

## Shared Auth And Config

The plugin resolves SalesTouch auth in this order:

1. `SALESTOUCH_API_KEY` / `SALESTOUCH_ACCESS_TOKEN` / `SALESTOUCH_API_BASE_URL`
2. Project config in `.salestouch/salestouch.json`
3. Legacy project config in `.salestouch/cli.json`
4. Global SalesTouch config

That means a project configured with `salestouch setup` can use a project-specific SalesTouch account inside Claude without re-entering credentials in the plugin.

## Distribution Bundles

`pnpm build:salestouch-plugin` generates two downloadable archives in `public/downloads/`:

- `salestouch-marketplace.zip`: Claude Code marketplace bundle generated from the repo-level marketplace manifest
- `salestouch-plugin.zip`: raw plugin file for Cowork custom plugin upload

## Claude Code Install

Repo marketplace flow:

1. Make sure Claude Code can access a repo that contains:
   - `.claude-plugin/marketplace.json`
   - `plugins/salestouch/`
2. Add the repo as a Claude marketplace, then install the plugin:

```text
/plugin marketplace add antoineDsh/salestouch
/plugin install salestouch@salestouch
```

3. Verify with:

```text
/plugin marketplace list
/help
```

Local zip flow:

1. Download `salestouch-marketplace.zip`.
2. Unzip it locally.
3. Inside Claude Code:

```text
/plugin marketplace add /absolute/path/to/salestouch
/plugin install salestouch@salestouch
```

## Public Repo Sync

The public Claude marketplace repository should live in:

```text
antoineDsh/salestouch
```

From the private source repository, export the generated marketplace bundle into a local clone with:

```bash
pnpm export:salestouch-marketplace --target /absolute/path/to/salestouch
```

That command copies:

- `.claude-plugin/marketplace.json`
- `plugins/salestouch/`
- a minimal public `README.md`

## Cowork Install

Cowork follows the custom plugin upload flow from the Cowork UI:

1. Download `salestouch-plugin.zip`.
2. Open the custom plugin upload screen in Cowork.
3. Upload the zip file directly.

The plugin expects either the same public SalesTouch API key used by the CLI and API docs, or a valid SalesTouch access token. API keys should include these scopes:

- `salestouch.use`
- `agents.read`, `agents.write`
- `leads.read`, `leads.write`
- `missions.read`, `missions.write`
- `offers.read`, `offers.write`
- `imports.read`, `imports.write`
- `linkedin.read`, `linkedin.write`
- `scoring.read`, `scoring.write`
- `email.read`, `email.write`
