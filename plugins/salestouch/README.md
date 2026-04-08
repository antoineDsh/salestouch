# SalesTouch Claude Plugin

This folder contains the Claude plugin bundle for SalesTouch.

The plugin is now plugin-first and remote-first:

- no CLI is required for Claude users
- no local MCP server is bundled
- the canonical transport is the SalesTouch remote MCP server at `https://www.salestouch.io/api/mcp`

## Structure

- `.claude-plugin/plugin.json`: plugin bundle metadata
- `.mcp.json`: remote MCP registration for Claude
- `commands/`: slash commands exposed inside Claude Code
- `settings.json`: default Claude plugin settings
- `skills/`: bundled SalesTouch skills
- `hooks/hooks.json`: plugin hook entrypoint
- `../../.claude-plugin/marketplace.json`: repo-level Claude marketplace manifest

## Canonical Flow

1. Install the SalesTouch plugin in Claude Code or Claude Cowork.
2. Open Claude and run `/mcp`.
3. Complete the SalesTouch OAuth flow in the browser.
4. Use the SalesTouch tools and skills from Claude.

## Remote MCP

The plugin ships this canonical MCP config:

```json
{
  "mcpServers": {
    "salestouch": {
      "type": "http",
      "url": "https://www.salestouch.io/api/mcp"
    }
  }
}
```

If Claude needs an explicit metadata override, use:

```json
{
  "mcpServers": {
    "salestouch": {
      "type": "http",
      "url": "https://www.salestouch.io/api/mcp",
      "oauth": {
        "authServerMetadataUrl": "https://www.salestouch.io/.well-known/openid-configuration"
      }
    }
  }
}
```

Support fallback only:

```json
{
  "mcpServers": {
    "salestouch": {
      "type": "http",
      "url": "https://www.salestouch.io/api/mcp",
      "headers": {
        "X-API-Key": "st_..."
      }
    }
  }
}
```

## Plugin Commands

The plugin ships this command entrypoint in Claude Code:

- `/salestouch:linkedin-message-writer`

## Distribution Bundles

`pnpm build:salestouch-plugin` generates two downloadable archives in `public/downloads/`:

- `salestouch-marketplace.zip`: Claude Code marketplace bundle
- `salestouch-plugin.zip`: raw plugin file for Cowork custom plugin upload

## Claude Code Install

Repo marketplace flow:

```text
/plugin marketplace add antoineDsh/salestouch
/plugin install salestouch@salestouch
```

Then run:

```text
/mcp
```

## Cowork Install

Cowork follows the custom plugin upload flow from the Cowork UI:

1. Download `salestouch-plugin.zip`.
2. Open the custom plugin upload screen in Cowork.
3. Upload the zip file directly.
4. Connect SalesTouch through the bundled remote MCP entry.

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
