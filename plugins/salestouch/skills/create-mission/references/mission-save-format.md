# Mission Save Format

Use this reference when building the payload for `mission_save`.

## Core Rule

For creation, the backend strictly requires:

- `name`

But a mission is only operationally useful with:

- `name`
- `job_to_be_done`
- `target_audience`
- `instruction`

In practice, populate all of these whenever possible:

- `name`, `offer_id`, `job_to_be_done`, `description`, `target_audience`, `instruction`, `sources`, `language`, `status`

## Top-Level Payload

```json
{
  "mission_id": "optional for update",
  "name": "string",
  "status": "running",
  "language": "fr",
  "agent_id": "optional string",
  "offer_id": "optional string",
  "job_to_be_done": "string",
  "description": "string",
  "target_audience": "string",
  "instruction": "string",
  "sources": "string"
}
```

## Field Inventory

### Identity

- `mission_id` — use only for update
- `name` — human-readable, unique enough to avoid ambiguity

### Execution Metadata

- `status` — enum: `new`, `running`, `done`, `archived`
- `language` — defaults to `fr` if omitted in creation
- `agent_id` — optional, backend picks the first agent if omitted
- `offer_id` — optional but strongly recommended when tied to an offer

### Mission Brief

- `job_to_be_done` — canonical public field for the mission outcome. Maps to the legacy internal `objective`. Legacy aliases that may still be accepted: `objective`, `expected_result`
- `description` — search-oriented business and operating context
- `target_audience` — explicit target definition
- `instruction` — agent execution rules
- `sources` — links, searches, and source pages the mission should use later

## Field Intent & Quality Guide

### `job_to_be_done`

The expected operational result — concrete and measurable.

Good:
- Book intro calls with RevOps leaders in mid-market SaaS
- Import and score fresh post engagers for the linked offer every week
- Build a qualified lead list of French CFOs in retail brands

Bad:
- Prospect
- Sell
- Outreach mission

### `description`

Context and framing — makes the mission discoverable and understandable:
- Keywords and terms for search
- Market / segment scope
- Relation to the linked offer
- Why the mission exists

### `target_audience`

The exact ICP slice this mission is allowed to target:
- Roles and seniority
- Geography
- Industry
- Company size and stage
- Exclusion rules

### `instruction`

Execution rules for the agent:
- Channel preference
- Tone constraints
- CTA logic
- Sequence rules
- Prioritization logic
- What to do when context is weak

### `sources`

Concrete places where the mission should operate:
- LinkedIn search URLs
- Sales Navigator search URLs
- Company pages
- Post URLs to monitor
- Canonical landing pages or docs tied to the mission

When multiple links are relevant, store them in a compact multiline format.

## Minimal Useful Payload

```json
{
  "name": "Outbound CEOs SaaS FR",
  "job_to_be_done": "Generate qualified intro calls with French B2B SaaS founders.",
  "target_audience": "CEOs and founders of French B2B SaaS companies with 10 to 100 employees.",
  "instruction": "Keep outreach short, concrete, and peer-to-peer. Optimize for positive replies and intro calls.",
  "sources": "https://www.linkedin.com/search/results/people/?keywords=founder%20saas%20france"
}
```

## Reproducible Payload Template

```json
{
  "name": "Outbound CEOs SaaS FR",
  "status": "running",
  "language": "fr",
  "offer_id": "off_123",
  "job_to_be_done": "Generate qualified intro calls with French B2B SaaS founders.",
  "description": "Mission focused on founder-led B2B SaaS companies in France that are actively structuring their commercial motion.",
  "target_audience": "CEOs and founders of French B2B SaaS companies with 10 to 100 employees. Exclude agencies, freelancers, and service-heavy ESNs.",
  "instruction": "Prioritize leads with growth signals. Use concise LinkedIn outreach with one CTA. Propose a short call only when the fit is explicit.",
  "sources": "https://www.linkedin.com/search/results/people/?keywords=founder%20saas%20france\nhttps://www.linkedin.com/search/results/companies/?keywords=b2b%20saas%20france"
}
```

## Output Shape From `mission_search`

The public mission brief returns:

```json
{
  "brief": {
    "description": "string or null",
    "job_to_be_done": "string or null",
    "target_audience": "string or null",
    "instruction": "string or null",
    "sources": "string or null",
    "offer_id": "string or null",
    "offer_name": "string or null",
    "offer_summary": "string or null",
    "offer_landing_page_url": "string or null"
  }
}
```
