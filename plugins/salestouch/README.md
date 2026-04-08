# SalesTouch Claude Plugin

This folder contains the Claude plugin bundle for SalesTouch.

The plugin is now plugin-first and remote-first:

- no local MCP server is bundled
- the canonical transport is the SalesTouch remote MCP server at `https://www.salestouch.io/api/mcp`

## Structure

- `.claude-plugin/plugin.json`: plugin bundle metadata
- `.mcp.json`: remote MCP registration for Claude
- `commands/`: slash commands exposed inside Claude Code
- `settings.json`: default Claude plugin settings
- `skills/`: bundled SalesTouch skills
- `hooks/hooks.json`: plugin hook entrypoint

## Canonical Flow

1. Add the SalesTouch marketplace in Claude Cowork and enable the plugin.
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

## Claude Cowork Install

1. Open Claude Desktop and switch to `Cowork`.
2. Open `Customize`.
3. Click `Add a plugin`.
4. Click `Create a plugin`.
5. Click `Add a marketplace`.
6. Enter `antoinedsh/salestouch`.
7. Open the `Personal` tab and enable `salestouch`.
8. Run `/mcp`.

## Claude Code Advanced Install

If you prefer a marketplace-based install in Claude Code, use:

```text
/plugin marketplace add antoinedsh/salestouch
/plugin install salestouch@salestouch
```

Then run:

```text
/mcp
```

## Public Repo

The public Claude marketplace repository is:

```text
antoinedsh/salestouch
```

In the private source repository, this plugin now lives inside the subtree prefix:

```text
marketplace/salestouch
```

Publish it with:

```bash
git subtree push --prefix marketplace/salestouch https://github.com/antoineDsh/salestouch.git main
```

Or use the release helper from the source repo:

```bash
pnpm release:plugin patch
pnpm release:plugin patch -m "chore: ship plugin v{version}"
```
