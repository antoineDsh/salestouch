# Offer Save Format

Use this reference when building the payload for `offer_save`.

## Core Rule

For creation, the backend requires:

- `offer_name` or `name`
- `one_liner`
- `value_proposition`

Everything else is optional, but the skill should populate all evidence-backed sections.

## Top-Level Payload

```json
{
  "offer_id": "optional for update",
  "offer_name": "string",
  "one_liner": "string",
  "value_proposition": "string",
  "status": "UP_TO_DATE",
  "description": "string",
  "landing_page_url": "https://example.com",
  "landing_page_content": "string",
  "sales_brief_url": "https://example.com/brief",
  "sales_brief_content": "string",
  "ideal_company_size": 200,
  "ideal_company_size_min": 50,
  "ideal_company_size_max": 500,
  "acceptable_company_size_min": 20,
  "acceptable_company_size_max": 1000,
  "references": [],
  "problem_solutions": [],
  "differentiators": [],
  "resources": []
}
```

## Field Inventory

### Identity

- `offer_id` — use only for update, resolve via `offer_search`
- `offer_name` — primary commercial label (alias: `name`)

### Core Positioning

- `one_liner` — short positioning sentence
- `value_proposition` — main buyer promise
- `description` — longer commercial brief
- `status` — enum: `UP_TO_DATE`, `NEEDS_UPDATE`, `ARCHIVED`

### Source Documents

- `landing_page_url`
- `landing_page_content` — concise extract of the offer page (no raw HTML)
- `sales_brief_url`
- `sales_brief_content` — internal or public sales brief if available

### Company Size Targeting

All size fields must be positive integers or omitted. Do not infer from vague terms ("mid-market", "enterprise") unless a reliable page gives a concrete range.

- `ideal_company_size` — exact best-fit when a single number is meaningful
- `ideal_company_size_min` / `ideal_company_size_max`
- `acceptable_company_size_min` / `acceptable_company_size_max`

## Nested Arrays

### `problem_solutions[]`

```json
{
  "problem": "string",
  "solution": "string",
  "feature": "string"
}
```

- All 3 fields required
- One buyer pain per item
- Keep `feature` concrete

### `differentiators[]`

```json
{
  "title": "string",
  "description": "string or null"
}
```

- `title` required
- Seller-usable, not generic SaaS claims
- Prefer 3-8 strong ones over filler

### `references[]`

```json
{
  "type": "CASE_STUDY",
  "title": "string or null",
  "content": "string",
  "author": "string or null",
  "jobTitle": "string or null",
  "company": "string or null",
  "companyLocation": "string or null",
  "companySize": "string or null",
  "industry": "string or null",
  "keyResult": "string or null",
  "source": "string or null",
  "publishedAt": "2026-01-15T00:00:00.000Z",
  "url": "https://example.com",
  "tags": ["string"],
  "metadata": { "key": "value" }
}
```

`type` enum: `TESTIMONIAL`, `CASE_STUDY`, `PRESS`, `SECTOR_REFERENCE`, `STATS`, `OTHER`

- `content` required
- Nested keys use `camelCase`
- `tags` short and specific
- `metadata` optional, simple JSON
- Never invent testimonial authors or metrics

### `resources[]`

```json
{
  "type": "PLAYBOOK",
  "title": "string",
  "description": "string or null",
  "url": "https://example.com",
  "publishedAt": "2026-01-15T00:00:00.000Z"
}
```

`type` enum: `TUTORIAL`, `WEBINAR`, `EVENT`, `GUIDE`, `PLAYBOOK`, `ARTICLE`, `VIDEO`, `OTHER`

- `title` required
- Buyer education or enablement assets only
- Do not duplicate proof assets here — those belong in `references`

## Formatting Rules

- Top-level keys: `snake_case`
- Nested reference/resource keys: exact documented casing (`camelCase`)
- Use `differentiators`, never `differenciators`
- Omit empty strings — prefer omitting weak fields to fabricating them
- ISO 8601 strings for dates
- Integers for size targeting
- Max 100 items per array section

## Research-To-Payload Mapping

| Source | Maps to |
|--------|---------|
| Homepage / product page | `one_liner`, `value_proposition`, `description`, `landing_page_url`, `landing_page_content` |
| Case studies / testimonials | `references` |
| Guides / webinars / product education | `resources` |
| Feature pages | `problem_solutions`, `differentiators` |
| Pricing / segment pages | company size fields (only if explicit) |

## Minimal Payload

```json
{
  "offer_name": "SalesTouch Outbound",
  "one_liner": "LinkedIn prospecting workflow for B2B sales teams.",
  "value_proposition": "SalesTouch helps sales teams find, qualify, and contact better prospects with structured commercial context."
}
```

## Exhaustive Payload Template

```json
{
  "offer_name": "SalesTouch Outbound",
  "one_liner": "LinkedIn prospecting workflow for B2B sales teams.",
  "value_proposition": "SalesTouch helps sales teams find, qualify, and contact better prospects with structured commercial context.",
  "status": "UP_TO_DATE",
  "description": "Commercial brief with ICP, pains, offer scope, use cases, and proof snippets.",
  "landing_page_url": "https://example.com",
  "landing_page_content": "Concise extract of the official offer page.",
  "sales_brief_url": "https://example.com/sales-brief",
  "sales_brief_content": "Internal or public sales brief if available.",
  "ideal_company_size_min": 50,
  "ideal_company_size_max": 500,
  "acceptable_company_size_min": 20,
  "acceptable_company_size_max": 1000,
  "problem_solutions": [
    { "problem": "string", "solution": "string", "feature": "string" }
  ],
  "differentiators": [
    { "title": "string", "description": "string" }
  ],
  "references": [
    {
      "type": "CASE_STUDY",
      "title": "string",
      "content": "string",
      "author": "string",
      "jobTitle": "string",
      "company": "string",
      "companyLocation": "string",
      "companySize": "string",
      "industry": "string",
      "keyResult": "string",
      "source": "string",
      "publishedAt": "2026-01-15T00:00:00.000Z",
      "url": "https://example.com",
      "tags": ["string"],
      "metadata": { "key": "value" }
    }
  ],
  "resources": [
    {
      "type": "GUIDE",
      "title": "string",
      "description": "string",
      "url": "https://example.com",
      "publishedAt": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```
