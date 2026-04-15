<p align="center">
  <img src="https://www.salestouch.io/images/icon.png" alt="SalesTouch" width="80" />
</p>

<h1 align="center">SalesTouch</h1>

<p align="center">
  <strong>Your AI prospecting copilot — right inside Claude.</strong><br/>
  Find leads. Score them. Write killer messages. Close deals.<br/>
  All from a single conversation.
</p>

<p align="center">
  <a href="https://www.salestouch.io"><img src="https://img.shields.io/badge/website-salestouch.io-blue?style=flat-square" alt="Website" /></a>
  <img src="https://img.shields.io/badge/version-0.4.8-green?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/platform-Claude_Desktop_|_Claude_Code-purple?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/protocol-MCP-orange?style=flat-square" alt="MCP" />
</p>

<br/>

<p align="center"><em>"I used to spend 3 hours a day on cold outreach. Now I just talk to Claude."</em></p>

<br/>

---

<br/>

## What is SalesTouch?

**SalesTouch turns Claude into a full B2B prospecting workspace.**

No more tab-switching between LinkedIn, your CRM, and ChatGPT. No more copy-pasting prospect info. No more generic templates.

Just tell Claude what you need:

> *"Find 20 Heads of Sales in B2B SaaS startups in Paris and draft a LinkedIn message for each."*

SalesTouch handles the research, enrichment, scoring, and message drafting. **You review and send.**

<br/>

---

<br/>

## Who is this for?

| | |
|---|---|
| **Founders** | Stop spending hours on cold outreach. Focus on building your product. |
| **Sales teams** | Prospect smarter, not harder. Let AI do the grunt work. |
| **Growth & RevOps** | AI-native prospecting workflows that actually scale. |
| **Freelancers & consultants** | Land your next client without the LinkedIn grind. |

<br/>

---

<br/>

## Features at a glance

<br/>

### Lead search & enrichment

Find prospects by role, industry, company size, and location. Enrich profiles with LinkedIn activity, company data, and engagement signals — on demand.

```
> Find CTOs at Series A fintech startups in London
```

<br/>

### Smart lead scoring

Not all leads are created equal. SalesTouch scores and ranks your prospects with import-aware scoring, offer-specific lexical rules, company size targeting, and recent activity signals.

```
> Show me my top 10 leads this week
> This lead is a great fit because they just raised a Series B and are hiring SDRs
```

<br/>

### LinkedIn message drafting

Generate **3 personalized message variants** per prospect — connection requests, follow-ups, or cold DMs. Each message is crafted from the prospect's profile, posts, and company context. Not generic. Not spammy. *Human.*

```
> Draft a LinkedIn message for Marie Dupont — mention her recent post about hiring
```

<br/>

### Mission workflows

Run structured prospecting sessions with clear goals and progress tracking. Define your ICP, set targets, and let SalesTouch guide you through the workflow.

```
> Create a mission targeting VP Engineering at healthtech companies in France, 50 leads
```

<br/>

### LinkedIn & Sales Navigator imports

Pull prospect lists directly into Claude from multiple sources:

- **LinkedIn search** — classic keyword search
- **Sales Navigator** — URL-based or filtered import
- **Post engagers** — people who liked/commented a specific post
- **Group members** — import from LinkedIn groups
- **Profile viewers** — who's been looking at your profile
- **Company page viewers** — visitors to your company page

```
> Import the top 50 results from this Sales Navigator search: [URL]
```

<br/>

### LinkedIn actions

Go beyond drafting — interact directly with LinkedIn:

- Send messages and connection requests
- Create posts, comments, and reactions
- Browse your LinkedIn feed
- Full draft management: create, review, approve, send

```
> Send a connection request to this prospect with a personalized note
> Comment on their latest post to warm up the relationship
```

<br/>

### Offer management

Create and manage your sales offers. Link them to missions so every outreach is contextual and on-brand.

```
> Create an offer for our Enterprise plan targeting mid-market SaaS companies
```

<br/>

---

<br/>

## Quickstart

### 1. Install the plugin

**Claude Desktop (Cowork)**

1. Open Claude Desktop and switch to **Cowork**
2. Go to **Customize** > **Add a plugin** > **Create a plugin**
3. Click **Add a marketplace** and enter:
   ```
   antoinedsh/salestouch
   ```
4. Open the **Personal** tab and enable **salestouch**

**Claude Code**

```bash
/plugin marketplace add antoinedsh/salestouch
/plugin install salestouch@salestouch
```

### 2. Connect your account

```
/mcp
```

A browser window opens. Log in to your SalesTouch account. Done.

> No API keys. No environment variables. No config files. Just OAuth.

The bundled MCP config now pins the canonical SalesTouch OAuth metadata endpoint and the HTTP `Accept` header needed by Claude clients that are strict on MCP transport negotiation.

If you need to wire the remote MCP server manually, use:

```json
{
  "mcpServers": {
    "salestouch": {
      "type": "http",
      "url": "https://www.salestouch.io/api/mcp",
      "headers": {
        "Accept": "application/json, text/event-stream"
      },
      "oauth": {
        "authServerMetadataUrl": "https://www.salestouch.io/.well-known/oauth-authorization-server/api/auth"
      }
    }
  }
}
```

### 3. Start prospecting

```
> Find 10 marketing directors at e-commerce companies in France and score them
```

That's it. You're live.

<br/>

---

<br/>

## 40+ tools, one conversation

You don't need to memorize commands. Just ask Claude in plain language — it picks the right tool automatically.

Here's what's under the hood:

| Category | Tools | Highlights |
|---|---|---|
| **Leads** | 4 | Search, get, create/update, enrich profiles on demand |
| **LinkedIn** | 7 | Send messages, connection requests, post, comment, react, browse feed |
| **Drafts** | 6 | Create up to 3 message variants, review, edit, approve, send |
| **Imports** | 10 | LinkedIn search, Sales Nav, post engagers, groups, profile & page viewers |
| **Missions** | 4 | Create structured prospecting workflows with goals and tracking |
| **Offers** | 4 | Create and manage your sales offers |
| **Scoring** | 2 | Save import lexical reviews and use offer-aware lead scoring automatically |
| **Context** | 1 | Deep prospect intel: conversation history, relation, outreach timeline |

> **Pro tip:** run `/salestouch:linkedin-message-writer` for a guided LinkedIn message drafting experience.

<br/>

---

<br/>

## How it works under the hood

```
You  -->  Claude  -->  SalesTouch MCP Server  -->  LinkedIn / CRM / Enrichment
         (plugin)      (remote, OAuth-secured)
```

1. **You talk to Claude** naturally — no syntax to learn
2. **Claude calls SalesTouch tools** via the [Model Context Protocol](https://modelcontextprotocol.io)
3. **SalesTouch executes** — searches leads, enriches profiles, drafts messages
4. **You review and approve** — sensitive actions (sends, imports) always require your confirmation
5. **Done.** No context switching. No copy-paste. No busywork.

> **Privacy first:** SalesTouch connects via OAuth. No API keys stored locally. All data flows through your authenticated session. Sensitive LinkedIn actions require explicit approval before execution.

<br/>

---

<br/>

## Available slash commands

| Command | Description |
|---|---|
| `/salestouch:linkedin-message-writer` | Draft a personalized LinkedIn message for a prospect |

<br/>

---

<br/>

## FAQ

<details>
<summary><strong>Do I need a LinkedIn account?</strong></summary>

Yes. SalesTouch connects to your LinkedIn account to search, enrich, and interact with prospects. Your credentials are managed securely through OAuth — SalesTouch never sees your password.

</details>

<details>
<summary><strong>Is this safe for my LinkedIn account?</strong></summary>

SalesTouch is designed with safety in mind. All sensitive actions (sending messages, connection requests, imports) require your explicit approval before execution. You always stay in control.

</details>

<details>
<summary><strong>Does it work with Sales Navigator?</strong></summary>

Yes! You can import leads from Sales Navigator searches (URL-based or with filters) and use Sales Navigator IDs throughout the workflow.

</details>

<details>
<summary><strong>What happens to my data?</strong></summary>

Your data stays in your SalesTouch account. The plugin communicates with the SalesTouch server via an authenticated MCP connection. No data is stored locally on your machine.

</details>

<details>
<summary><strong>Can I use it in Claude Code?</strong></summary>

Absolutely. Works in both Claude Desktop (Cowork) and Claude Code. Same features, same commands.

</details>

<br/>

---

<br/>

<p align="center">
  <strong>Stop prospecting. Start closing.</strong><br/><br/>
  <a href="https://www.salestouch.io">Get started at salestouch.io</a><br/><br/>
  <sub>Built with care for salespeople who'd rather sell than prospect.</sub><br/>
  <sub>Questions? Reach out at <a href="mailto:support@salestouch.ai">support@salestouch.ai</a></sub>
</p>
