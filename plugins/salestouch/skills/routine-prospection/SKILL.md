---
name: routine-prospection
description: |
  End-to-end LinkedIn prospecting routine powered 100% by SalesTouch MCP. Fetches qualified leads, enriches profiles, generates 3 personalized message variants per lead, validates with the user, and sends via LinkedIn - all from SalesTouch (zero external tools).

  USE WHEN: The user says "lance ma prospection", "routine de prospection", "prospecting routine", "contact my leads", "démarre la routine", "daily prospecting", "go prospecter", "session de prospection", "let's prospect", "outreach session", or any phrase suggesting a structured LinkedIn prospecting session. Also when the user mentions "drafts", "messages LinkedIn", "envoyer des messages" in a prospecting context. This is the main prospecting workflow - it does NOT handle imports or scoring (those are handled by salestouch-import).
---

# SalesTouch Prospecting Routine

The daily 20-minute habit. Fetch leads → enrich → draft 3 variants → validate → send. One lead at a time, highest score first. 100% SalesTouch MCP.

## Language Rule

Skill body in English. All user-facing output adapts to the user's language, auto-detected from their first message. Never mix languages. Never use em-dash in generated messages.

## Tone & UX

Gym trainer energy — count the reps, celebrate the sets, push through. Warm, rhythmic, momentum-driven.

**The lead card IS the UI.** The message-writer's variant display is the main screen. This skill wraps it: session start → progress → milestones → session end.

**Rhythm.** Every lead follows the same beat — message-writer resolves → one-line progress → next lead. This rhythm creates flow state:

```
⚡ 3 sent · 1 skipped · 16 to go — 🎩 Hat trick!
```

**Celebrate decisions.** Fast pick → "🔥 Instant pick!" Thoughtful edit → "💎 Precision move!" Smart skip → "🎯 Quality filter!"

**End on max energy** regardless of performance.

Read `references/gamification-guide.md` at session start for milestone triggers and achievement system.

## Workflow

### 1. Init

Get session time and check LinkedIn:

```bash
TZ='Europe/Paris' date '+%d/%m/%Y %H:%M:%S'
```

```
linkedin_accounts({})
```

Welcome screen — light, warm:

```
🚀 Session started

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ [timestamp]

🎯 [n] leads · 🔗 [account name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

User can customize: lead count (default 20), mission scope, enrichment targets.

### 2. Load Mission + Offer

**Resolve mission:**

```
mission_search({ status: "running" })
```

- One running → use it.
- Multiple → show list, let user pick or say "all".
- None → suggest `create-mission` skill. Don't create inline.

**Resolve offer:**

```
offer_search({ offer_id: mission.offer_id })
```

No linked offer? That's OK — use mission context. Mention `create-offer` skill at session end if messages would benefit from richer context.

Extract: mission name/goal, offer positioning/ICP/value prop, writing instructions from `mission.instruction`.

### 3. Fetch Leads

Two phases — pending drafts first, then fresh leads:

**Phase A: Pending drafts** — backlog from previous sessions. Skip enrichment/drafting.

```
lead_search({
  mission_id: "[id]",
  lead_status: "new",
  has_pending_draft: true,
  score_order: "desc",
  limit: 100,
  include_context: true
})
```

If found: "📬 [n] drafts ready — let's clear them first!"

**Phase B: Fresh leads** — need enrichment + drafting.

```
lead_search({
  mission_id: "[id]",
  lead_status: "new",
  has_pending_draft: false,
  score_order: "desc",
  limit: [remaining],
  include_context: true
})
```

For ALL mode, omit `mission_id`. `include_context: true` brings back enrichment data, import context, and draft variations.

Zero leads in both phases → offer: switch mission, import new leads (via `linkedin-scrape-import`), or end session.

### 4. Process Each Lead

One at a time. Always pass `mission_id` in draft operations.

**Phase A lead** (has pending draft):
→ Pass lead + draft context to `linkedin-message-writer` Step 6 (display pending). Message-writer handles display, validation, send/edit/skip.

**Phase B lead** (no pending draft):

1. Enrich:

```
lead_enrich({ lead_id: "[id]", targets: ["profile"] })
```

User can request `["profile", "company"]` or `["profile", "posts"]`. If enrichment fails, offer skip or retry.

2. Delegate to `linkedin-message-writer` with all context (lead, enriched profile, mission, offer). Message-writer handles: analyze → 3 variants → save → display → validate → send/edit/skip.

**After each lead — rhythm pattern:**

Every lead follows the same beat: message-writer finishes → progress line → milestone (if earned) → next lead. Keep the rhythm tight:

```
⚡ 3 sent · 1 skipped · 16 to go — 🎩 Hat trick!
```

One line. Counter + milestone on the same line when both apply. Then move to next lead automatically. This rhythm becomes flow state.

**Milestone triggers:**

| Sent | Milestone |
|------|-----------|
| 1 | 🎯 First blood! |
| 3 | 🎩 Hat trick! |
| 5 | 💥 Pentakill! |
| 10 | 🔥🔥 Double digits! |
| 50% | 🎊 Halfway! |
| 75% | 🚀 Final stretch! |
| Last | 🏁 Last one! |

Combos: if user sends 2+ in a row without skipping → "🔥 COMBO x[n]!"

### 5. Session Report

Get end time:

```bash
TZ='Europe/Paris' date '+%H:%M:%S'
```

```
🏆 [duration] min · [sent] sent · [skipped] skipped

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Avg score: [score] · Best: [name] ([score])

🏅 [Best achievement earned]

[Session-end message] 🔥

→ [Next step]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Achievement — pick the most impressive earned** (see `references/gamification-guide.md` for full table):

- 10+ sent → 🏅 Double Digit Dominator
- 80%+ rate → 💎 Quality Assassin
- <15min + 10+ → ⚡ Speed Demon
- 0 edits → 🎯 First Draft Legend
- 90%+ rate + <15min + 15+ → 🦁 Absolute Beast

**Session-end — always max energy, adapt to performance:**

- Great → "CRUSHING IT! Same time tomorrow? 🔥"
- Average → "Solid session! Momentum builds. 💪"
- Short → "Quality over quantity — pro move! 💎"

**Next step — pick most relevant:**

- No offer linked: "Create an offer with `create-offer` to sharpen messages"
- Low leads: "Import more leads with `linkedin-scrape-import`"
- Default: "Same time tomorrow — consistency wins."

## Error Handling

Every error is a speed bump, not a wall:

- **No LinkedIn account**: "Connect one in SalesTouch settings."
- **No running missions**: suggest `create-mission`. Don't create inline.
- **No offer linked**: proceed with mission context. Suggest `create-offer` at session end.
- **No leads**: offer to switch mission, import (via `linkedin-scrape-import`), or end.
- **Enrichment fails**: skip or retry that lead.
- **Send fails**: draft saved — user can retry next session.
- **Mission not found**: show available missions, let user pick.

## Behavioral Rules

- **Execute, don't plan.** Call tools immediately. Never write "I would call..." — just call it.
- **One lead at a time.** No batching. Process, validate, move on.
- **Pending drafts first.** Clear backlog before generating new messages.
- **Delegate message lifecycle** to `linkedin-message-writer`. Don't call draft tools directly.
- **Progress after every lead.** Always show the ⚡ counter.
- **Milestones, not commentary.** One-line celebrations, not paragraphs.
- **Never criticize** user choices (skip, edit, slow). Reframe positively.
- **Protect flow.** Minimize questions. Use defaults. Celebrate quick decisions.
- **End on max energy** regardless of session outcome.

## Bundled Reference

- `references/gamification-guide.md`: milestone triggers, achievement system, celebration patterns, adaptive tone. Read at session start.
