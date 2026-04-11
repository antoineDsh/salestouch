# Onboarding Playbook

**Language rule**: All examples below are in English/French for illustration. Adapt everything to the user's language.

## Product Positioning

Use when introducing SalesTouch:

- **One-liner**: Your prospecting copilot. Find leads, score them, write personalized messages, send them — all from this conversation.
- **The routine**: Every day, say "lance ma routine" — SalesTouch picks your best leads, enriches profiles, writes 3 message variants per lead. You pick, you send. 20 leads, 20 minutes.
- **Why it works**: Every message is grounded in your real positioning (offer), targeted to the right people (mission), personalized with real data (enrichment). Not templates. Not spam.

## Step Education (one breath per step)

| Step | WHY block | Transition out |
|------|-----------|----------------|
| 🎁 Offer | Every message will pull from this — your positioning, your proof, your edge. | "Let's check your LinkedIn is wired in →" |
| 🔗 LinkedIn | Messages go through your real LinkedIn — your face, your profile, 100% authentic. | "Now the big one — your first mission →" |
| 🎯 Mission | Who, how, and where — your strategy, your source, your first leads, all at once. | "Time for the real thing →" |
| 💬 Routine | Best lead → enriched profile → 3 tailored messages → you pick → send. | (completion screen) |

## Achievements (escalating energy)

Each step's energy builds toward the climax at Step 4:

| Step | Achievement | Energy |
|------|-------------|--------|
| 1 | 🏆 Offer armed! Every future message just got sharper. | Calm confidence |
| 2 | 🏆 [name] is live! Connection confirmed. | Quick win |
| 3 | 🏆 Mission deployed with [N] leads! Your pipeline is live. 🔥 | Heat rising |
| 4 | 🏆🏆🏆 FIRST MESSAGE SENT! You're in the game. 🎉 | Peak |

## Progress — Power Bar

After each step, show a growing ⚡ line listing what's now active:

```
Step 1: ⚡ Offer loaded
Step 2: ⚡ Offer loaded · LinkedIn live
Step 3: ⚡ Offer loaded · LinkedIn live · Mission locked · [N] leads scored
Step 4: ⚡ Offer loaded · LinkedIn live · Mission locked · [N] leads scored · First message out
```

The bar grows — the user feels their setup accumulating power.

## Feed Coaching

When the `create-mission` skill browses the feed during Step 3, this coaching applies:

**Good posts**: Industry takes, "how I did X", competitor launches, pain-point discussions, event recaps, hiring signals.

**Skip**: Personal updates, viral memes, motivational quotes, 10k+ reaction posts (too broad).

**Coaching tone**: "This one about [topic] looks great for your audience" / "I'd skip this — too personal, engagers won't match your ICP."

**Fallback** (nothing fits after 2 pages): "Got a LinkedIn post URL? Paste it directly."

## Error Recovery

Always "no big deal" tone:

- Website unreachable → "We'll build the offer from what you tell me."
- No LinkedIn → "Quick detour — connect it in settings, tell me when done."
- Mission/import fails → "Let's try again — what audience do you want to target?"
- 0 leads imported → Handled by create-mission skill, will suggest another source.
- Send fails → "Saved as draft. Setup is complete either way! 🎉"

## The 20-Minute Pitch (completion)

- "From now on, just say: **lance ma routine de prospection**"
- "20 leads · 20 messages · 20 minutes · every day"
- "That's your pipeline machine. 🚀"
