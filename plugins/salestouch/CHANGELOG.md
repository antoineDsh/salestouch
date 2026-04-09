# Changelog

## 0.2.0 - 2026-04-10

- Consolidate the Claude-facing MCP surface around compound lead, scrape, LinkedIn, mission, and offer tools so common workflows require fewer calls.
- Remove legacy public REST endpoints, MCP resources, and deprecated runtime pages from the published plugin surface.
- Tighten OAuth scope metadata, public permission mapping, and premium gating for the new MCP aliases.
- Align the bundled plugin layout and docs with the `output-styles` path and the streamlined marketplace manifest.

## 0.1.16 - 2026-04-09

- Align the protected resource metadata with the full SalesTouch OAuth scope set so Claude requests the right scopes during plugin authorization.
- Add explicit consent labels for agent, import, LinkedIn, scoring, and email scopes in the plugin auth flow.

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
