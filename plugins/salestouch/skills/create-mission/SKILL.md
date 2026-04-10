---
name: create-mission
description: |
  Create or update a reproducible SalesTouch mission using the SalesTouch MCP. Use this when the user wants to create a mission, structure a prospecting workflow, link an offer to a mission, define targeting, or capture a mission brief that another agent can execute repeatedly without guessing.

  USE WHEN: The user says "create a mission", "crée une mission", "set up a prospecting mission", "build a mission from this offer", "define targeting for this campaign", "make this mission reproducible", or any phrase about creating or refining a SalesTouch mission.
---

# Create Mission

Mission creation for SalesTouch: collect the minimum context, load the linked offer when available, build a mission brief that is reproducible by another agent, then create or update the mission with `mission_save`.

A good mission is executable without hidden context. If another agent would still have to guess the outcome, the audience, the execution rules, or the sources — the mission is not ready.

## Language Rule

The skill body is in English. All user-facing output (UI, status lines, result blocks) adapts to the user's language, auto-detected from their first message. Never mix languages in the output.

## Tone & UX

Make mission creation feel like briefing an ops team — fast, structured, no fluff. Use emojis as visual anchors and progress markers.

**During execution**, narrate progress with short status lines:

```
🔍 Searching for offer...
✅ Offer loaded: [offer name]
📦 ICP: [one-liner from offer]
🧠 Building mission brief...
```

**After save**, show the result block.

**On errors**, stay cool and actionable:

```
⚠️ Offer "[name]" not found — creating mission without offer link.
```

**On thin context**, be honest:

```
🔎 Mission created with core fields — instruction and sources still need detail.
```

## Workflow

Execute these steps in order. Call tools as soon as you have the inputs — never write "I would call mission_save with..." — just call it.

### 1. Collect Minimum Inputs

Ask for:

- Mission name
- Offer name or `offer_id` (if the mission should be linked to an offer)
- Job to be done (the operational outcome)
- Target audience

If the user names an offer but doesn't provide an ID, resolve it with `offer_search`.

Ask for extra fields only if they're still missing after that:

- Language
- Description
- Execution instruction
- Sources / links

Do not start with a long questionnaire.

### 2. Load Offer Context

If the mission should be linked to an offer, resolve the offer before building the brief:

```
offer_search({ offer_name: "[offer name]" })
```

Extract:

- Offer name and positioning
- Value proposition and differentiators
- ICP clues and company-size targeting

Use the offer to sharpen the mission, not to blindly copy-paste it. If the offer doesn't exist, that's OK — create the mission without the link and say so.

### 3. Check If The Mission Already Exists

Before creating, search SalesTouch:

```
mission_search({ query: "[mission name]" })
```

If a matching mission already exists:

- Treat as update unless user explicitly wants a new mission
- Resolve the exact `mission_id`
- Reuse it in `mission_save`

If multiple missions match, show them briefly and resolve before writing.

### 4. Build & Save The Mission

Read `references/mission-save-format.md` for the canonical payload structure and field intent.

Construct the payload with reproducibility in mind. The backend strictly requires `name`, but a mission is only operationally useful with these fields:

- `name` — human-readable, unique enough to avoid ambiguity
- `offer_id` — when the mission is tied to an offer
- `job_to_be_done` — concrete operational outcome, not vague ("Generate qualified intro calls with B2B SaaS founders", not "Prospect")
- `description` — search-oriented context: keywords, segment scope, why the mission exists
- `target_audience` — explicit ICP slice: role, seniority, industry, geography, company size, exclusions
- `instruction` — execution rules: channel, tone, CTA logic, sequencing, prioritization, what to do when data is weak
- `sources` — concrete places to operate: LinkedIn search URLs, Sales Navigator searches, company pages, post URLs
- `language` — defaults to `fr` if omitted
- `status` — `running` for active missions

Create or update:

```
mission_save({
  name: "...",
  offer_id: "...",
  job_to_be_done: "...",
  description: "...",
  target_audience: "...",
  instruction: "...",
  sources: "...",
  language: "fr",
  status: "running"
})
```

For update, include `mission_id`. Call the tool as soon as the payload is ready.

### 5. Report Result

Show a short result block in the user's language:

```
✅ Mission saved!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Mission: [name]
🧭 Job to be done: [job_to_be_done]
👥 Target: [target_audience]
📦 Offer: [offer name or "none"]
🗣️ Language: [language]
🚦 Status: [status]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Next: [one actionable sentence]
```

**Next step suggestions** (pick the most relevant):

- No offer linked: "Create an offer first with the offer-creator skill, then link it"
- Offer linked, no leads: "Import leads for this mission with the import skill"
- Ready to go: "Start a prospecting session with the routine skill"
- Missing fields: "Sections [X, Y] need more detail to make this mission fully reproducible"

If the mission is still weak, state exactly which section needs more detail.

## Error Handling

**Offer not found**: create the mission without `offer_id`. Suggest creating the offer first.

**Mission already exists and user intent is ambiguous**: show the existing mission summary and ask: update or create new?

**mission_save fails**: show the error, suggest checking field content or retrying.

**Insufficient context to build a useful brief**: create with what you have, clearly flag which fields need more detail. Don't block the workflow.

## Behavioral Rules

- **Execute, don't plan.** Call tools immediately. Never produce execution plans or write "I would call mission_save with..." — just call it.
- **Reproducibility is the standard.** Every field should make the mission executable by another agent without guessing. If it wouldn't, flag it.
- **Prefer a short, crisp mission** over a fluffy one. Brief is better than verbose when the content is actionable.
- **Do not invent** offer linkage, targeting rules, or execution logic the user didn't provide.
- **Missing offer is OK.** The mission can still be created — say so clearly and suggest creating one.
- **If important details are missing**, ask only for the smallest missing piece. Don't block on optional fields.
- **When the mission exists**, update instead of duplicating unless the user explicitly wants a new variant.

## Bundled Reference

- `references/mission-save-format.md`: canonical mission structure, field intent, enums, and payload examples. Read before building the final payload.
