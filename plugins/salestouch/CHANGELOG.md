# Changelog

## 0.1.15 - 2026-04-09

- Request the full SalesTouch scope set during the initial Claude OAuth authorization flow.
- Return proper MCP auth challenges when a tool call is missing required scopes so Claude can re-authorize cleanly.
- Publish the plugin manifest with explicit command, agent, skill, hook, MCP, and output-style paths.
- Add placeholder `agents/`, `scripts/`, and `styles/` plugin directories for a more stable bundle layout.

## 0.1.13 - 2026-04-09

- Release the SalesTouch Claude marketplace plugin.

## 0.1.12 - 2026-04-08

- Release the SalesTouch Claude marketplace plugin.

## 0.1.11 - 2026-04-08

- Release the SalesTouch Claude marketplace plugin.

## 0.1.10 - 2026-04-08

- Pin the bundled MCP config to the canonical OAuth metadata endpoint for more reliable Claude connection setup.

## 0.1.9 - 2026-04-08

- Release the SalesTouch Claude marketplace plugin.

## 0.1.0

- Added the initial SalesTouch Claude plugin scaffold.
- Mirrored routine-agent skills into the plugin bundle.
- Added MCP catalog and resource scaffold aligned with the current routine command surface.
