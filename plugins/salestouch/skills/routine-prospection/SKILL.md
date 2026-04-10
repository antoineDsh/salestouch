---
name: routine-prospection
description: |
  End-to-end LinkedIn prospecting routine powered 100% by SalesTouch MCP. Fetches qualified leads, enriches profiles, generates 3 personalized message variants per lead, validates with the user, and sends via LinkedIn - all from SalesTouch (zero external tools).

  USE WHEN: The user says "lance ma prospection", "routine de prospection", "prospecting routine", "contact my leads", "démarre la routine", "daily prospecting", "go prospecter", "session de prospection", "let's prospect", "outreach session", or any phrase suggesting a structured LinkedIn prospecting session. Also when the user mentions "drafts", "messages LinkedIn", "envoyer des messages" in a prospecting context. This is the main prospecting workflow - it does NOT handle imports or scoring (those are handled by salestouch-import).
---

# SalesTouch Prospecting Routine

End-to-end LinkedIn prospecting: fetch leads → enrich → draft messages → validate → send.
100% SalesTouch MCP, zero external dependency.

## Language Rule

The skill body is in English. All user-facing output (UI, messages, celebrations, error screens) must be in the user's language, auto-detected from their first message. Never mix languages in the output.

## Gamification

ADHD-optimized dopamine-driven coaching throughout the session. Energetic tone, liberal emojis, everything framed as achievements and combos, celebrate every small win. See `references/gamification-guide.md` for the full psychology framework.

## Formatting

Never compress text onto single lines. Proper line breaks between paragraphs, sections, and display boxes. Never use em-dash "-" in generated messages.

## Tools

Everything lives in SalesTouch MCP:

| Function                          | Tool                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Commercial context                | `mission_search` + `offer_search`                                                                                |
| Fetch qualified leads             | `lead_search`                                                                                                    |
| Profile enrichment                | `lead_enrich`                                                                                                    |
| Draft + display + validate + send | `linkedin-message-writer` skill (handles `lead_draft_save`, `lead_draft_send`, `lead_draft_cancel`, `lead_save`) |
| LinkedIn accounts                 | `linkedin_accounts`                                                                                              |

## Workflow Overview

Process leads one by one from SalesTouch, pending drafts first:

1. Init → 2. Load mission + offer → 3A. Fetch leads with pending drafts → validate & send each → 3B. Fetch fresh leads → enrich → draft → validate → send each → 4. Final report

Key principles:

- SalesTouch is the single source of truth
- **Pending drafts first**: clear the backlog before generating new messages. Pending-draft leads skip enrichment and drafting entirely.
- Process leads **one at a time**. No artificial batching.
- Always pass `mission_id` in `lead_draft_save` when available

---

### 1. Initialization

Get session start time:

```bash
TZ='Europe/Paris' date '+%d/%m/%Y %H:%M:%S'
```

Check LinkedIn account:

```
linkedin_accounts({})
```

Verify a connected account exists. Store the `account_id`.

Display welcome screen (adapt to user language):

```
🚀 SESSION ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ [timestamp] (Paris)
🎯 Target: [n] leads
🔗 LinkedIn: [account name] ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

User can customize: lead count (default 20), mission scope, enrichment targets.

### 2. Load Mission + Offer

#### Resolve mission scope

Fetch running missions:

```
mission_search({ status: "running" })
```

Three modes:

**Single mission** (default when only one is running): use it directly.

**User names a specific mission**: verify it exists with `mission_search({ query: "[name]" })`. If not found, show available missions and let user pick.

**"ALL" mode**: user says "TOUT", "toutes les missions", "all missions", "cross-mission". Store all running mission IDs. The lead fetch will omit the mission filter.

If no running missions exist: suggest the `create-mission` skill to set one up. Don't try to create a mission inline.

If multiple missions are running and user didn't specify: show the list and offer "ALL" or a specific pick. Don't ask unnecessary questions - if there's only one mission, just use it.

#### Resolve offer scope

For each selected mission, load its linked offer:

```
offer_search({ offer_id: mission.offer_id })
```

If a mission has no linked offer (`offer_id` is null), that's OK. Use the mission's own context (description, target_audience, instruction) for message generation. Don't block the workflow. Mention the `create-offer` skill at session end if richer commercial context would improve messages.

Extract commercial context:

- Mission name(s) and goal(s)
- Offer positioning, ICP, value proposition (when available)
- Writing instructions from `mission.instruction`

In ALL mode, show a summary of all missions. But when generating messages for a specific lead, always use that lead's own mission/offer context - ALL mode only affects the fetch scope.

### 3. Fetch Leads (Two Phases)

The routine fetches leads in two phases to maximize efficiency:

**Phase A: Pending drafts first** — leads that already have a draft ready for review. No enrichment or drafting needed, just validation and send. This clears the backlog fast.

```
lead_search({
  mission_id: "[mission_id]",      // omit for ALL mode
  lead_status: "new",
  has_pending_draft: true,
  score_order: "desc",
  limit: 100,
  include_context: true
})
```

If pending drafts are found, announce it:

```
📬 [n] PENDING DRAFTS FOUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Drafts ready from previous sessions.
Let's clear the queue first!
```

Process all pending-draft leads (step 4a) before moving to Phase B.

**Phase B: Fresh leads** — leads without pending drafts. These need enrichment + drafting.

```
lead_search({
  mission_id: "[mission_id]",      // omit for ALL mode
  lead_status: "new",
  has_pending_draft: false,
  score_order: "desc",
  limit: [remaining target],
  include_context: true
})
```

For ALL mode, omit `mission_id`. For multi-mission subset, use `mission_ids: [...]`.

`include_context: true` brings back enrichment data, import context, and (for pending-draft leads) the draft variations — allowing the skill to display them directly for validation.

If 0 leads in both phases: show options (switch mission, import new leads, end session).

### 4. Process Each Lead

For each lead, the routine determines the path and delegates to the `linkedin-message-writer` skill for drafting, display, validation, and send.

#### Phase A lead (has pending draft)

The lead already has draft variations in its context (from `lead_search` with `include_context: true`). No enrichment or drafting needed.

→ Pass the lead data + draft context to `linkedin-message-writer` **Step 6** (display pending draft). The message-writer handles display, validation, send/edit/skip.

#### Phase B lead (no pending draft)

1. **Enrich** the lead:

```
lead_enrich({
  lead_id: "[lead_id]",
  targets: ["profile"]
})
```

Default: profile only. User can request `["profile", "company"]`, `["profile", "posts"]`, or all three. If enrichment fails, offer skip or retry.

2. **Delegate to `linkedin-message-writer`** — pass all context (lead data, enriched profile, mission, offer). The message-writer handles: analyze → write 3 variants → save draft → display → user validates → send/edit/skip.

#### After each lead

Inject gamification milestones:

- Lead 1 → "FIRST BLOOD! 🎯"
- Lead 3 → "HAT TRICK! 🎩"
- Lead 5 → "PENTAKILL! 💥"
- Fast streak → "🔥 COMBO x[n]!"

Then move to the next lead automatically.

### 5. Final Report

Get end time:

```bash
TZ='Europe/Paris' date '+%H:%M:%S'
```

Display session summary with: duration, leads contacted, leads skipped, average score, achievements unlocked. End on the highest energy note regardless of performance.

## Error Handling

**No LinkedIn account**: tell user to connect one in SalesTouch.

**No running missions**: suggest the `create-mission` skill to set one up. Don't create a mission inline.

**Mission has no offer and messages feel generic**: suggest the `create-offer` skill at session end to enrich commercial context for future sessions.

**No leads found**: offer to switch mission, import new leads (via `linkedin-scrape-import` skill), or end session.

**Enrichment failure**: offer skip or retry for that lead.

**Send failure**: draft is saved, user can retry later from SalesTouch.

**Mission not found**: show available running missions and let user pick.

## Bundled References

- `references/gamification-guide.md`: Full motivation psychology framework and UI patterns. Read at session start to calibrate tone.
