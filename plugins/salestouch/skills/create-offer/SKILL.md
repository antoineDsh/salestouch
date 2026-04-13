---
name: create-offer
description: |
  Research a company and create or update a complete SalesTouch offer using the SalesTouch MCP. Use this when the user wants to create an offer, enrich an existing offer, structure commercial positioning, turn a website into an offer payload, or capture differentiators, references, problem/solution pairs, resources, and company-size targeting in SalesTouch.

  USE WHEN: The user says "create an offer", "crée une offre", "build an offer from this website", "complete this SalesTouch offer", "update our positioning", "add differentiators", "make this offer exhaustive", or any phrase about creating or enriching a commercial offer in SalesTouch.
---

# Offer Creator

Research-first offer creation for SalesTouch: collect the minimum inputs, gather intelligence from the official website and the web, map everything into the SalesTouch offer structure, then create or update the offer with `offer_save`.

This skill is designed for real execution, not brainstorming. Move quickly, but never invent claims, proofs, or schema fields.

## Language Rule

The skill body is in English. All user-facing output (UI, status lines, result blocks) adapts to the user's language, auto-detected from their first message. Never mix languages in the output.

## Tone & UX

Make the offer creation feel like an intelligence-gathering mission, not a form-fill. Use emojis as visual anchors and progress markers. The user should feel the research progressing step by step.

**During research**, narrate progress with short status lines:

```
🔍 Scanning homepage...
✅ Positioning extracted
🔍 Checking pricing page...
✅ Company size targeting found: 50-500 employees
🔍 Searching case studies...
✅ 3 references found (2 case studies, 1 testimonial)
🧠 Building offer payload...
```

**After save**, celebrate briefly and show the result block.

**On errors**, stay cool and actionable:

```
⚠️ Website returned 403 — switching to web research only.
```

**On thin context**, be honest and move on:

```
🔎 Site is thin on proof — offer created with core positioning, references section needs more source material.
```

## Workflow

Execute these steps in order. Call tools as soon as you have the inputs — never write "I would call offer_save with..." — just call it.

### 1. Collect Minimum Inputs

Ask only for:

- Company name
- Offer name
- Website URL (optional)

Do not ask for a long questionnaire up front. If the website is missing, proceed with web research using the company name and offer name.

### 2. Research — Official Source First

Once you have the basic inputs, gather first-party context before touching SalesTouch.

Prioritize:

- Homepage → positioning, value proposition
- Product / service page → features, problem/solution pairs
- Pricing page → company size hints, tier structure
- About page → company story, differentiators
- Customer stories / case studies → references
- FAQ → objection handling, pain points
- Blog / webinars → resources

Extract only evidence-backed facts. If the site is thin, say so and continue to step 3.

### 3. Research — Expand With Web Search

Fill gaps and cross-check claims. Target queries like:

- `[company] [offer]`, `[company] pricing`, `[company] case study`
- `[company] testimonial`, `[company] webinar`, `[company] guide`
- `[company] review`, `[company] alternative`

Prefer sources in this order:

1. Official site
2. Official LinkedIn / YouTube / product pages
3. Reputable press or partner pages
4. Third-party reviews only when clearly attributable

Do not use low-quality directory fluff to invent differentiators or proof.

### 4. Check If The Offer Already Exists

Before creating, search SalesTouch:

```
offer_search({ offer_name: "[offer name]" })
```

If an offer already exists:

- Treat as update unless user explicitly wants a new variant
- Reuse the existing `offer_id`
- Replace array fields only when you have a better complete set

If the search is ambiguous, show matching offers briefly and resolve before writing.

### 5. Build & Save The Offer

Read `references/offer-save-format.md` for the canonical payload structure, enums, and field rules.

Construct the payload directly in SalesTouch format. Required fields for creation:

- `offer_name` or `name`
- `one_liner`
- `value_proposition`

**Payload construction rules:**

- `one_liner`: concise positioning — what, for whom, why it matters
- `value_proposition`: buyer outcomes in 2-4 sentences, not feature dumping
- `description`: dense commercial brief — ICP, pains, offer scope, use cases, proof snippets
- `problem_solutions`: one buyer pain → one response → one enabling feature per item. All 3 fields required. Avoid vague triples that restate the same idea.
- `differentiators`: seller-usable distinctiveness points. Good: comparison language, unique workflow, unusual constraint, stronger proof. Prefer 3-8 strong ones over filler. Do not turn generic SaaS claims into differentiators.
- `references`: proof only — testimonials, case studies, sector references, stats, press. Every reference needs real evidence. If a claim cannot be attributed, keep it out.
- `resources`: buyer-enablement assets — guides, playbooks, webinars, tutorials, events, articles, videos. Resources are not proof. References are not resources.
- Company size fields: positive integers or omitted. Do not infer from vague terms like "mid-market".
- Omit empty strings and weak fields. Unknown is better than fake.

Create or update:

```
offer_save({
  offer_name: "...",
  one_liner: "...",
  value_proposition: "...",
  ...
})
```

For update, include `offer_id`. Call the tool as soon as the payload is ready.

### 6. Report Result

Show a short result block in the user's language:

```
✅ Offer saved!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Company: [company]

🎁 Offer: [offer name]

🧭 Positioning: [one-liner]

🧩 Differentiators: [count]

🧪 Problem / solution pairs: [count]

🏆 References: [count]

📚 Resources: [count]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Next: [one actionable sentence]
```

**Next step suggestions** (pick the most relevant):

- Link to a mission: "Link this offer to a mission with `mission_save`"
- Start an import: "Import leads for this offer with the import skill"
- Enrich further: "Sections [X, Y] are thin — share more sources to strengthen them"
- Update later: "Run this skill again with the offer name to update"

If important sections are thin, state exactly which ones need more source material.

## Error Handling

**Website unreachable (403, 404, timeout)**: switch to web-research-only mode. Don't block the workflow.

**No evidence found**: create the offer with the best-supported core fields. State what's missing.

**offer_save fails**: show the error, suggest checking field formats or retrying.

**Offer already exists and user intent is ambiguous**: show the existing offer summary and ask: update or create new?

## Behavioral Rules

- **Execute, don't plan.** Call tools immediately. Never produce execution plans or write "I would call offer_save with..." — just call it.
- **Prefer first-party evidence** over polished speculation. Official site > press > third-party > nothing.
- **Do not invent** ICP, pricing, company size, case-study metrics, testimonial authors, or any schema field you can't back up.
- **Thin context is OK.** Still create the offer with the best core fields. Clearly flag what's missing.
- **When sources conflict**, prefer the official source and mention the uncertainty.
- **When the offer exists**, update instead of duplicating unless the user explicitly wants a new variant.
- **Keep it crisp.** Short status lines during research, tight result block at the end. No long explanations between tool calls.

## Bundled Reference

- `references/offer-save-format.md`: canonical SalesTouch offer structure, enums, field rules, and payload examples. Read before building the final payload.
