---
name: rebuild-global-lexical-scoring
description: |
  Rebuild SalesTouch lexical scoring globally from the existing lead base, then rescore all leads.
  Use this when the user wants a one-shot rebuild of scoring on old leads or old imports, wants
  headline/job-title extracts across all leads, wants to save lexical patterns globally, or says
  things like "rescore everything", "rebuild scoring from existing leads", "extract headlines on all leads",
  "rescorer tous les leads", "refaire le scoring global", "rebuild lexical scoring", or "refresh legacy scoring".

  USE WHEN: The intent is a global, one-shot scoring rebuild. Do not use this for normal imports;
  use `linkedin-scrape-import` for import-driven lexical review.
---

# Global Lexical Scoring Rebuild

One-shot operator workflow:

1. Extract lexical samples from all leads
2. Review and build global lexical patterns
3. Save them globally
4. Rescore all leads

This skill is intentionally narrow. No mission scoping, no offer scoping, no import scoping.

## Language Rule

Skill body in English. All user-facing output adapts to the user's language.

## Core Rule

This workflow is **global** and **high impact**.

- Always use `lead_lexical_extract({})`
- Always save with `scrape_review_save({ apply_globally: true, ... })`
- Always rescore with `lead_rescore({ all: true })`
- Never switch to `import_id` or `offer_id` in this skill

## Workflow

Execute in order. Call tools immediately when ready.

### 1. Extract samples

Run:

```text
lead_lexical_extract({})
```

This returns:

- `lead_count`
- `sample_count`
- `lexical_samples`

If `sample_count` is `0`, stop and say there is no usable lexical material in the lead base.

### 2. Build the review

Read the returned `lexical_samples` and derive **discriminating** patterns from job titles and headlines.

Be exhaustive, but not noisy:

- Prefer phrases over isolated words
- Prefer recurring expressions over one-off curiosities
- Deduplicate overlapping variants
- Keep the strongest, most reusable patterns
- If you would exceed 200 patterns, keep the best distinct set

Allowed weights only:

- `3` strong positive
- `1.5` positive
- `-2` negative
- `-4` strong negative

Good patterns:

- `head of growth`
- `sales development representative`
- `demand generation`
- `recruiter`
- `student`

Weak patterns to avoid unless clearly contextualized:

- `manager`
- `consultant`
- `expert`

If the samples are too weak or too generic, stop instead of saving junk rules.

### 3. Ask for one confirmation

Before mutating anything, show a short summary:

- total leads covered
- total samples reviewed
- number of proposed positive patterns
- number of proposed negative patterns
- 8 to 12 representative patterns

Then ask one direct question in the user's language:

`Save these patterns globally and rescore all leads?`

Do not ask extra questions.

### 4. Save globally

If the user confirms, run:

```text
scrape_review_save({
  apply_globally: true,
  patterns: [...]
})
```

Only send:

- `apply_globally`
- `patterns`

Do not send `offer_id`, `import_id`, `category`, `field_scope`, or `is_active`.

### 5. Rescore everything

Immediately after a successful global save, run:

```text
lead_rescore({
  all: true
})
```

This skill is not complete until the global rescore has been triggered.

### 6. Report result

Keep the close-out short:

- patterns saved count
- whether rescore was queued or processed
- if relevant, remind that this was a global one-shot rebuild

Example:

```text
✅ Global lexical rules saved

- Patterns: 34
- Rescore: queued for all leads
- Scope: organization-wide one-shot rebuild
```

## Behavioral Rules

- Execute, do not brainstorm.
- Stay on the global path. No side branches.
- Do not dilute the ruleset with generic words.
- Do not save an empty or low-signal review.
- Do not stop after the save; trigger the rescore.
- If the user refuses confirmation, stop cleanly without mutating.

