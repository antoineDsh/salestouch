---
name: salestouch
description: Use the SalesTouch hosted MCP server for leads, missions, offers, imports, LinkedIn prospecting, and scoring workflows that live in SalesTouch.
---

# SalesTouch

Use the SalesTouch hosted MCP server for SalesTouch-native workflows.

## When To Use It

- Leads, missions, offers, imports, LinkedIn prospecting, scoring
- SalesTouch tool-driven workflows exposed through the hosted MCP server
- Multi-step prospecting tasks that still map to existing SalesTouch tools

## Lead Search & Sorting

`lead_search` supports two smart sort strategies, chosen automatically:

- **Action sort** (default when no sort params): surfaces leads by next action needed — RESPOND > SEND_DRAFT > FIRST_MESSAGE > INVITE > ENRICH > WAITING > OTHER. Best for prospecting and automation workflows.
- **Field sort**: activated by passing `sort_by`, `score_order`, or `sort_order`. Sorts by a single field (score, createdAt, etc.). Best for reporting and analysis.

To get action-priority ordering, call `lead_search` without any sort parameters. To override, pass `sort_by` or `score_order` explicitly.

## Workflow

1. Inspect the available SalesTouch tools relevant to the task.
2. Read the tool schema before constructing inputs.
3. Use SalesTouch MCP tools as the default interface to SalesTouch.
4. Prefer read operations when context is missing.
5. Execute the smallest deterministic action that satisfies the request.
6. Summarize the result briefly and accurately.
