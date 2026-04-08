---
name: linkedin-message-writer
description: Draft one-to-one LinkedIn outreach variants directly in the main routine agent from lead and mission context, then return exactly 3 variants as structured JSON. Use when the user asks to draft, rewrite, personalize, or improve a LinkedIn message for a specific lead.
---

# LinkedIn Message Writer

Draft 3 strong LinkedIn outreach variants yourself in the main routine agent.

Use exploration subagents only to gather context. The writing itself must stay in the main agent.

## Required Workflow

1. Resolve the target lead first:
- Prefer an existing `lead_id`.
- If needed, find the lead with `salestouch run lead.search --input-json ...`.

2. Do not call legacy detail tools before drafting. Use `salestouch run lead.get`, `mission.get`, `offer.get` only when direct retrieval is necessary, and prefer exploration subagents for synthesis.

3. Run one `Task` call to `subagent_type: "lead-explore"` with:
- `max_turns: 1`
- `lead_id` set to the target lead id (or `prospect_id` alias)
- In the prompt, explicitly state what you need for personalization and why you need it.

4. If mission or offer context is relevant, run one `Task` call to `subagent_type: "mission-explore"` with:
- `max_turns: 1`
- `mission_id` and/or `offer_id`
- In the prompt, explicitly state what offer proof, positioning, and CTA context you need and why.

5. Use `TaskOutput` to collect the exploration outputs as plain text.

6. Extract the useful drafting signals from the exploration outputs:
- personalization hooks
- pains, goals, and timing signals
- relevant proof points or offer details
- any explicit writing rule
- whether the lead is already connected or still requires an invitation flow

7. Write the 3 variants directly in the main agent:
- Do not call `Task` or `Agent` for LinkedIn drafting.
- Do not call any LinkedIn writer subagent.
- Keep meaningful variation across the 3 variants.
- Vary angle, opening, and CTA intent without changing the factual grounding.

8. Adapt the format to the workflow:
- If the exploration indicates `invitation_with_note`, each variant must fit a LinkedIn invitation note: max 300 characters and max 3 sentences.
- If the exploration indicates `invitation_then_message`, write a regular LinkedIn message meant to be sent after the connection is accepted.
- Otherwise write a normal one-to-one LinkedIn message.

9. Return the 3 variants as `linkedin_message_variants_v2`.

## Writing Rules

- Return plain text strings only inside the JSON payload.
- Each message must start with a greeting.
- No title, no signature, no markdown.
- Keep one clear CTA per variant.
- Focus on recipient outcomes, not generic claims.
- Keep a spontaneous, human, conversational tone.
- Ground personalization in explicit facts from `lead-explore`.
- Ground offer and mission claims in explicit facts from `mission-explore`.
- If a fact is missing, omit it.
- Never invent or alter names, companies, posts, metrics, dates, or offer claims.
- If an explicit writing rule is surfaced, follow it exactly.
- If that rule imposes a sentence limit, rewrite until compliant.
- Use the user's language only when the prospect and user share the same language; otherwise write in English.
- Keep the variants short enough for LinkedIn DMs unless the context clearly justifies a slightly longer message.

## Structured Output (Required)

Return only JSON with this exact shape (no markdown around it):

```json
{
  "format": "linkedin_message_variants_v2",
  "messages": ["...", "...", "..."]
}
```

- `messages` must contain exactly 3 strings.
- Generate exactly 3 variants total.
- Do not add per-message metadata (`id`, `angle`, `score`, etc.).
- Do not restate the 3 variants outside this JSON.

## Hard Rules

- The main routine agent owns the drafting.
- Never call `Task` or `Agent` with `subagent_type: "linkedin-message-sonnet-creative"`.
- Never delegate the writing to any other subagent.
- Use exploration subagents only for research, never for final copywriting.

## UI Selection (Required)

- Do not call `AskUserQuestion` for `linkedin_message_variants_v2`.
- Return only the structured JSON payload and stop.
- Variant selection and feedback are handled by the UI and follow-up user messages.
- If the user asks for changes, regenerate exactly 3 variants with the same flow.
