---
name: create-mission
description: |
  Create a complete, executable SalesTouch mission: define strategy, choose source type, identify concrete source URLs, save the mission, and run the first import — all in one flow. A mission is not complete until it has a strategy, a source, and leads.

  USE WHEN: The user says "create a mission", "crée une mission", "set up a prospecting mission", "build a mission from this offer", "define targeting for this campaign", "nouvelle mission", "lance une mission", or any phrase about creating a SalesTouch mission.
---

# Create Mission

Full mission creation pipeline for SalesTouch: strategy → source → save → import. A mission is only "created" when all four are done.

A mission without a source is a wish. A mission without an import is a plan. This skill produces neither — it produces a running pipeline with leads.

## Language Rule

Skill body in English. All user-facing output adapts to the user's language, auto-detected from their first message. Never mix languages.

## Interaction Principle

**Always ask, never assume.** Every decision goes through the user. Suggest, recommend, coach — but never act without explicit validation. The user is the pilot, the skill is the copilot.

- Suggest the best option and explain why, but let the user choose.
- Show what you're about to do before doing it. Ask "Does this look good?" before calling `mission_save`.
- If you detect something automatically (URL type, existing mission), confirm with the user before proceeding.
- Never auto-browse the feed, auto-fix fields, or auto-run imports without asking first.

## Tone & UX

Briefing an ops team — fast, structured, no fluff. Emojis as visual anchors.

**During execution**, narrate with short status lines:

```
🔍 Loading offer...
✅ Offer: [name] — ICP: [one-liner]
```

**On errors**, stay cool:

```
⚠️ Offer "[name]" not found — proceeding without offer link.
```

## Core Principle: One Source Type Per Mission

Each mission uses **one source type**. Different source types imply different outreach strategies, tones, and CTA logic. Mixing them in one mission produces incoherent instructions.

| Source type | Signal level | Outreach approach |
|---|---|---|
| **Post engagers** | High intent — engaged with relevant topic | Mention the post/topic, warm tone, peer-to-peer |
| **LinkedIn Search** | Structural fit, no intent signal | Lead with pain-point or value prop, cold but precise |
| **Sales Navigator search** | Structural fit, advanced filters | Ultra-targeted, reference specific fit criteria |
| **Group members** | Community belonging | Reference shared group/interests, semi-warm |
| **Profile viewers** | Active curiosity | Direct, acknowledge the visit, opportunistic |
| **Company page** | Company affinity | Reference the company, contextual |

Multiple URLs of the **same type** in one mission is fine (5 posts about the same topic → same mission). Different types → different missions.

## Workflow

Execute in order. Call tools immediately when inputs are ready.

### 1. Load Offer Context

If the user provides an offer name or ID, resolve it:

```
offer_search({ offer_name: "[offer name]" })
```

Extract: positioning, value prop, ICP clues, company-size targeting.

If no offer exists or is provided: proceed without. Suggest creating one but don't block.

### 2. Choose Source Type

Ask the user to pick their approach. **Recommend post engagers** as the highest-performing channel, but let the user decide:

```
🧭 How do you want to find leads for this mission?

1. 🔥 Post engagers — people who liked/commented a relevant post (recommended — highest intent signal)
2. 🔍 LinkedIn Search — people matching a search query
3. 🎯 Sales Navigator — advanced filtered search
4. 👥 Group members — people in a LinkedIn group
5. 👀 Profile viewers — people who visited your profile
6. 🏢 Company page — followers/visitors of a company page

💡 Post engagers tend to perform best — they already care about the topic.
→ One approach per mission. You can create another mission for a different approach.
```

If the user already provided a URL, detect the source type but **ask to confirm** before proceeding:

```
🔍 This looks like a post URL — so we'd go with "post engagers" as source type. That work for you?
```

### 3. Identify Concrete Source

Based on the chosen source type:

**Post engagers:**
- Ask: "Do you have a LinkedIn post URL, or would you like me to browse your feed to find a relevant post?"
- If user wants feed browsing: check LinkedIn account via `linkedin_accounts({})`, then `linkedin_feed({ account_id })`.
- Display posts compactly (author + ~80 chars). Coach inline: "This one about [topic] fits your ICP" / "I'd skip this — too broad."
- After 2 pages with nothing relevant: "Nothing obvious here — do you have a post URL to paste?"
- When user picks a post, confirm: "We'll import engagers from this post. Good to go?"

**LinkedIn Search / Sales Navigator:**
- Ask: "Do you have a search URL ready, or should we build one from your target audience?"
- If building: propose search parameters based on offer ICP, show the resulting URL, and ask for validation before proceeding.

**Group members:**
- Ask: "Which LinkedIn group? Share the name or URL."

**Profile viewers:**
- Ask: "We'd import people who recently viewed your profile. Want to go with that?"

**Company page:**
- Ask: "Which company page? Share the name or URL."
- Then ask for date range: "What time period? (e.g., last 7 days, last month)"

**After source identification**, show and ask for confirmation:

```
📌 Source summary:
  Type: [source type]
  URL: [url]
  Expected audience: [description based on source + offer ICP]

Does this look right?
```

### 4. Check If Mission Already Exists

Search for an existing mission that matches:

```
mission_search({ query: "[mission name or context]" })
```

If a match exists: treat as update (reuse `mission_id`) unless user explicitly wants a new one. If multiple matches: show them briefly, let user pick.

### 5. Build & Save Mission

Read `references/mission-save-format.md` for payload structure.

**Quality gate** — validate before saving:

| Field | Required quality |
|---|---|
| `job_to_be_done` | Action verb + measurable outcome. Reject: "Prospect", "Sell", "Outreach". |
| `target_audience` | Role/seniority + at least 1 scoping criterion (industry, geo, or size). Reject: "Decision makers", "Prospects". |
| `instruction` | Concrete execution rules adapted to the source type. Must include tone + CTA logic. Min 2 sentences. |
| `sources` | At least 1 concrete URL from Step 3. Never empty. |

If a field fails validation, propose an improved version using offer context and source type, and ask: "Here's what I'd suggest for [field] — want to use this or adjust it?"

**Instruction must match the source type.** Use these templates as a baseline, then enrich with offer context:

- **Post engagers**: "Reference the post topic in the opener. Warm, peer-to-peer tone. CTA: propose exchanging on [topic]."
- **LinkedIn Search**: "Lead with a specific pain-point relevant to their role. Concise, value-first. CTA: short call if fit is explicit."
- **Sales Navigator**: "Reference specific fit criteria (company size, growth stage). Precise, no fluff. CTA: direct call proposal."
- **Group members**: "Mention the shared group. Build on common interests. CTA: community-style exchange."
- **Profile viewers**: "Acknowledge the profile visit. Direct, curious tone. CTA: ask what caught their attention."
- **Company page**: "Reference their connection to [company]. Contextual. CTA: relevant to the company context."

**Before saving, show the full brief and ask for confirmation:**

```
🧠 Here's the mission I'm about to create:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Name: [name]
🧭 Job: [job_to_be_done]
👥 Target: [target_audience]
📌 Strategy: [source type]
🔗 Source: [url]
📝 Instruction: [instruction summary]
📦 Offer: [offer name or "none"]
🗣️ Language: [language]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Want me to save this, or would you like to change something?
```

Only call `mission_save` after the user confirms. For update, include `mission_id`.

### 6. Run First Import

After mission is saved, ask:

```
✅ Mission saved! Ready to import leads from [source URL]?
```

Only delegate to `linkedin-scrape-import` after the user confirms. Pass the source URL from Step 3 and the `mission_id` from Step 5.

The import skill handles: `scrape_run`, signal estimation, lexical review. Don't replicate its logic — just delegate.

This step is not optional. A mission without its first import is incomplete — but the user must confirm before it runs.

### 7. Report Result

```
✅ Mission live!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Mission: [name]
🧭 Job: [job_to_be_done]
👥 Target: [target_audience]
📌 Strategy: [source type]
🔗 Source: [url]
📦 Offer: [offer name or "none"]
👥 Leads: [N] imported
🗣️ Language: [language]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Next: [one actionable sentence]
```

**Next step suggestions** (pick the most relevant):

- No offer linked: "Create an offer with `create-offer` to sharpen scoring and messages"
- Leads imported, ready to go: "Start prospecting with `routine-prospection`"
- Want more leads: "Import another source of the same type into this mission"
- Want a different approach: "Create another mission with a different source type"

## Error Handling

**Offer not found**: proceed without `offer_id`. Suggest creating one.

**Mission already exists, intent ambiguous**: show summary, ask: update or create new?

**mission_save fails**: show error, suggest checking content or retrying.

**No LinkedIn account connected** (needed for feed browsing): ask user to paste a URL directly instead of browsing feed.

**Import fails**: mission is still saved. Report the error, suggest retrying the import or trying a different source URL.

**Source URL invalid or inaccessible**: ask for another URL. Don't save the mission with a broken source.

## Behavioral Rules

- **Ask, then execute.** Suggest the best option, explain why, wait for validation. Call tools only after the user confirms. Never silently auto-browse, auto-fix, or auto-import.
- **One source type per mission.** If the user wants multiple approaches, create multiple missions.
- **Source is mandatory.** Never save a mission without at least one concrete source URL.
- **Instruction must match source type.** Generic instructions are rejected — adapt to the approach.
- **Import is part of creation.** A mission is not "created" until the first import runs.
- **Propose, don't impose.** If a field is weak, propose an improved version and ask. Don't silently rewrite.
- **Recommend post engagers.** When the user has no preference, suggest post engagers as the best-performing channel — but let them choose.
- **Reproducibility is the standard.** Another agent must be able to execute this mission without guessing.
- **When updating**, preserve existing fields the user didn't ask to change.

## Bundled Reference

- `references/mission-save-format.md`: canonical mission structure, field intent, enums, payload examples.
