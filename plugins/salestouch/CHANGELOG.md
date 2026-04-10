# Changelog

## 0.4.3 - 2026-04-10

- Align the `create-offer` reference payload with the snake_case `offer.save` MCP schema so plugin examples match the actual command contract.
- Expand the LinkedIn scrape import skill with all supported source URL types, clearer examples, and the required date inputs for company page viewers.

## 0.4.2 - 2026-04-10

- Add a new `onboarding` skill that guides first-time users from company setup to their first sent LinkedIn message.
- Refresh the `routine-prospection` skill around a tighter one-lead-at-a-time cadence with clearer session progress and milestone messaging.
- Simplify the gamification guide so onboarding and daily prospecting share a more focused achievement and combo system.

## 0.4.1 - 2026-04-10

- Add a `create-offer` skill that researches company context and builds exhaustive `offer.save` payloads.
- Add a `create-mission` skill with reproducible mission briefs organized around description, job to be done, instructions, and sources.
- Expose clearer mission MCP aliases and route existing prospecting skills toward the new mission and offer creation flows.

## 0.4.0 - 2026-04-10

- Add the new LinkedIn scrape import skill with clearer source inference from supported Sales Navigator and LinkedIn URLs.
- Ship a full prospecting routine skill that runs lead selection, enrichment, draft review, and send flows from SalesTouch MCP.
- Make draft workflows lead-centric so save, send, and cancel actions resolve the active draft from the lead instead of exposing internal draft ids.
- Expose active lead drafts in `lead.search` context responses to support review and follow-up sessions directly from Claude.

## 0.3.0 - 2026-04-10

- Ship the new lead scoring model with import provenance, lexical fit, completeness, activity, company size targeting, and optional deep scoring support.
- Add offer-specific lexical review flows so imports can return headline samples and save new weighted expressions through `scrape.review.save`.
- Expose import scoring inputs plus lead deep score and offer company size settings across the published MCP command surface.
- Retire the legacy public scoring command in favor of the import-driven review workflow and the unified scoring engine.

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
