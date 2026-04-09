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
  <img src="https://img.shields.io/badge/version-0.1.16-green?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/platform-Claude_Desktop_|_Claude_Code-purple?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/protocol-MCP-orange?style=flat-square" alt="MCP" />
</p>

<br/>

---

<br/>

## What is SalesTouch?

**SalesTouch turns Claude into a full B2B prospecting workspace.**

No more tab-switching between LinkedIn, your CRM, and ChatGPT. Just tell Claude what you need:

> *"Find 20 Heads of Sales in B2B SaaS startups in Paris and draft a LinkedIn message for each."*

SalesTouch handles the research, enrichment, scoring, and message drafting. **You review and send.**

<br/>

## What you can do

| | Capability | Description |
|---|---|---|
| **Search** | Lead search & enrichment | Find prospects by role, industry, company size, location. Enrich with LinkedIn data. |
| **Score** | Smart lead scoring | Prioritize leads with AI scoring. Train it with natural language feedback. |
| **Draft** | LinkedIn message drafting | 3 personalized message variants per prospect. Not generic. Not spammy. |
| **Import** | LinkedIn & Sales Nav imports | Pull leads from searches, post engagers, groups, profile viewers. |
| **Act** | LinkedIn actions | Send messages, connection requests, post, comment, react — all from Claude. |
| **Plan** | Mission workflows | Structured prospecting sessions with goals and progress tracking. |
| **Sell** | Offer management | Create and manage sales offers linked to missions. |

<br/>

## Get started in 60 seconds

### Claude Desktop (Cowork)

1. Open Claude Desktop > switch to **Cowork**
2. Go to **Customize** > **Add a plugin** > **Create a plugin**
3. Click **Add a marketplace** and enter `antoinedsh/salestouch`
4. Open the **Personal** tab and enable **salestouch**
5. Run `/mcp` — log in with your SalesTouch account

### Claude Code

```bash
/plugin marketplace add antoinedsh/salestouch
/plugin install salestouch@salestouch
/mcp
```

**That's it.** Start a conversation and ask Claude to find leads.

Manual config, if Claude needs an explicit OAuth metadata URL:

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

<br/>

## How it works

```
You  -->  Claude  -->  SalesTouch MCP Server  -->  LinkedIn / CRM / Enrichment
         (plugin)      (remote, OAuth-secured)
```

No API keys. No config files. No local setup. Just OAuth and you're live.

> Sensitive actions (sends, imports) always require your explicit approval.

<br/>

## Learn more

- **Website:** [salestouch.io](https://www.salestouch.io)
- **Full docs:** see the [plugin README](plugins/salestouch/README.md) for the complete command reference
- **Support:** [support@salestouch.ai](mailto:support@salestouch.ai)

<br/>

---

<p align="center">
  <strong>Stop prospecting. Start closing.</strong><br/><br/>
  <sub>Built with care for salespeople who'd rather sell than prospect.</sub>
</p>
