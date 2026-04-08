---
name: salestouch
description: Use the SalesTouch hosted MCP server for leads, missions, offers, imports, LinkedIn prospecting, and scoring workflows that live in SalesTouch.
---

# SalesTouch

Use the SalesTouch hosted MCP server for SalesTouch-native workflows.

## When To Use It

- Leads, missions, offers, imports, LinkedIn prospecting, scoring
- Workspace status and SalesTouch reference resources
- Multi-step prospecting tasks that still map to existing SalesTouch tools

## Workflow

1. Inspect the available SalesTouch tools and resources relevant to the task.
2. Read the tool schema before constructing inputs.
3. Prefer read operations when context is missing.
4. Execute the smallest deterministic action that satisfies the request.
5. Summarize the result briefly and accurately.

## Rules

- Use SalesTouch MCP tools as the default interface to SalesTouch.
- Prefer schema-first execution for write actions.
- Keep payloads JSON-first and deterministic.
- Do not invent SalesTouch IDs, handles, or hidden fields.
- If a required field is unclear, fetch more context before writing.
