# SalesTouch for Claude

SalesTouch brings lead search, scoring, LinkedIn outreach, and mission orchestration into Claude through the official marketplace plugin.

## Install in Claude Cowork

1. Open Claude Desktop and switch to `Cowork`.
2. Open `Customize`.
3. Click `Add a plugin`.
4. Click `Create a plugin`.
5. Click `Add a marketplace`.
6. Enter `antoinedsh/salestouch`.
7. Open the `Personal` tab and enable `salestouch`.
8. Run `/mcp`.

Claude opens the browser login and connects to the SalesTouch remote MCP server at `https://www.salestouch.io/api/mcp`.

## Advanced install in Claude Code

```text
/plugin marketplace add antoinedsh/salestouch
/plugin install salestouch@salestouch
/mcp
```

## What you get

- Lead search and enrichment
- Mission and offer workflows
- Scoring and prioritization
- LinkedIn draft creation and approval
- Remote MCP transport with OAuth-first auth

## Repository layout

- `.claude-plugin/marketplace.json`: marketplace manifest
- `plugins/salestouch/`: plugin bundle shipped to Claude

## Publish from the source repo

This public repo is published from the source monorepo using `git subtree` with the prefix:

```text
marketplace/salestouch
```

From the source repo:

```bash
pnpm publish:salestouch-marketplace
```
