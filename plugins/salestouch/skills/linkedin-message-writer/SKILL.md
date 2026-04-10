---
name: linkedin-message-writer
description: |
  Draft, display, save and validate LinkedIn outreach messages for a single lead using SalesTouch MCP. Generates exactly 3 personalized variants, saves them as a draft, displays them for user validation, and handles send/edit/skip.

  USE WHEN: Called inline by the prospecting routine for each lead, or when the user asks to draft, rewrite, personalize, or improve a LinkedIn message for a specific lead. Also use when reviewing a pending draft. Triggers: "draft a message", "write a LinkedIn message", "rewrite this message", "personalize outreach for [lead]", or any phrase about composing LinkedIn outreach.
---

# LinkedIn Message Writer

Single-lead message lifecycle: analyze lead → write 3 variants → save draft → display → user validates → send or edit.

This skill is designed to be called inline from the prospecting routine (one lead at a time), but also works standalone when the user asks to draft a message for a specific lead.

## API Convention

All draft operations are **lead-centric**. There is no `draft_id`. Every call targets the lead (via `lead_id` or any lead alias like `linkedin_url`, `email`, etc.). The backend resolves the active draft for that lead internally.

- `lead_draft_save` creates a new draft or updates the existing one for that lead
- `lead_draft_send` sends the active draft for that lead
- `lead_draft_cancel` cancels the active draft for that lead
- Draft responses do not contain `draft_id`

Never pass or store a `draft_id` — it does not exist in the API.

## Language Rules

- Skill body is in English.
- All user-facing output (UI chrome, labels, prompts) adapts to the user's language.
- Message language follows the prospect's language: if user and prospect share the same language, write in that language. Otherwise write in English.

## Inputs

When called from the prospecting routine, the following context is already available:

- **Lead data**: name, headline, company, score, linkedin_url, lead_id, connection status (`linkedinIsRelationship`)
- **Enriched profile**: about, experience, skills, location (from `lead_enrich`)
- **Import context**: source post/search, comment text, interaction type
- **Mission context**: name, description, target_audience, instruction
- **Offer context** (when linked): positioning, ICP, value_proposition

When called standalone, fetch the missing context with `lead_search({ lead_id, include_context: true })` + `mission_search` + `offer_search`.

---

## Step 1: Analyze

Extract drafting signals from the lead + mission + offer context:

**Personalization hooks** — concrete facts that make the message unique to this person:

- Career trajectory, role transitions, specific achievements
- Content they posted or engaged with (from import context)
- Shared connections, locations, interests
- Company stage, industry, tech stack

**Pain/goal signals** — what this person likely cares about:

- Cross-reference their role with the offer's ICP
- Timing signals (job change, funding, hiring, product launch)

**Connection status** — determines message format:

- `linkedinIsRelationship: true` → normal DM (no length limit, but keep it concise)
- `linkedinIsRelationship: false` or `null` → invitation request (strict: max 300 characters, max 3 sentences)

**Writing instruction** — if `mission.instruction` contains explicit rules, follow them exactly.

## Step 2: Write 3 Variants

### Format rules

**Invitation request** (not connected):

- Hard limit: 300 characters, 3 sentences max
- Must fit in LinkedIn's connection request field
- Rewrite until compliant — count characters before finalizing

**Normal DM** (already connected):

- Keep short enough for LinkedIn DMs (aim for 3-6 sentences)
- Can be slightly longer if context justifies it

### Writing rules

- Start with a greeting (first name only, no "Dear", no "Mr/Mrs")
- No title, no signature, no markdown, no emoji in the message body
- No em-dash. Use regular dash "-" or rephrase.
- One clear CTA per variant
- Spontaneous, human, conversational tone — like texting a peer, not writing an email
- Focus on recipient outcomes, not generic claims about the product
- Ground personalization in explicit facts from the lead data. If a fact is missing, omit it — never invent.
- Never invent or alter names, companies, posts, metrics, dates, or offer claims
- Keep meaningful variation across the 3 variants: vary the angle, the opening hook, and the CTA intent, without changing the factual grounding

### Quality check

Before finalizing each variant:

- Is it grounded in real facts from the lead? (no hallucinated hooks)
- Does it respect the format limit? (300 chars for invites)
- Does the CTA make sense for this lead's context?
- Would a human actually send this? (no corporate speak, no generic pitches)

## Step 3: Save Draft

```
lead_draft_save({
  lead_id: "[lead_id]",
  mission_id: "[mission_id]",
  variations: ["variant 1 text", "variant 2 text", "variant 3 text"]
})
```

Always pass `mission_id` when known. If a draft already exists for this lead, it will be updated. If not, a new one is created.

## Step 4: Display for Validation

Show the lead card + all 3 variants in a single block. Adapt labels to user's language.

```
🎯 LEAD [n]/[total]: [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 [Company] | 🎯 Score: [score]
🔗 [linkedin_url]
💡 Hooks:
  • [hook 1]
  • [hook 2]
  • [hook 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 VARIANT 1:

[message text with proper line breaks]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 VARIANT 2:

[message text with proper line breaks]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 VARIANT 3:

[message text with proper line breaks]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👉 1, 2, 3, "edit X", "skip", or "do not contact"
```

Formatting rules:

- Blank line before and after each message body
- Each paragraph in the message separated by a blank line
- Never compress multiple paragraphs onto one line
- Separator lines between variants

## Step 5: Handle User Response

**User picks "1", "2", or "3"** — send that variant:

```
lead_draft_send({
  lead_id: "[lead_id]",
  selected_variation_index: [1|2|3],
  send_now: true
})
```

Then update lead status:

```
lead_save({
  lead_id: "[lead_id]",
  lead_status: "contacted"
})
```

Show confirmation:

```
✅ SENT - [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 [selected message text]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**"edit X"** — ask user for feedback on variant X, regenerate that single variant keeping the other two, update the draft:

```
lead_draft_save({
  lead_id: "[lead_id]",
  mission_id: "[mission_id]",
  variations: ["variant 1", "revised variant X", "variant 3"]
})
```

Re-display all 3 variants.

**"skip"** — cancel the draft and move on:

```
lead_draft_cancel({ lead_id: "[lead_id]" })
```

**"do not contact"** — cancel the draft AND permanently flag the lead:

```
lead_draft_cancel({ lead_id: "[lead_id]" })
```

```
lead_save({
  lead_id: "[lead_id]",
  lead_status: "do_not_contact"
})
```

Show confirmation:

```
🚫 DO NOT CONTACT - [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lead marked as do_not_contact.
This lead won't appear in future sessions.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 6: Display Pending Draft (Phase A leads)

When a lead already has a pending draft (from a previous session), the draft variations come from the `lead_search` response context (with `include_context: true`). Skip steps 1-3 entirely. Extract the variation texts from the lead data, then go straight to Step 4 (display) and Step 5 (handle response).

If variations are missing from the context (API edge case), fall back to the full flow (steps 1-3).
