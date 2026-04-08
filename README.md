<p align="center">
  <strong>🚀 SalesTouch</strong><br/>
  <em>Your AI prospecting copilot — right inside Claude.</em>
</p>

---

SalesTouch turns Claude into a full prospecting workspace.
Find leads, score them, craft personalized LinkedIn messages, and run outreach workflows — all from a single conversation.

## Who is it for?

- **Founders** tired of spending hours on cold outreach
- **Sales teams** who want to prospect smarter, not harder
- **Growth & RevOps** looking for AI-native prospecting workflows

## What you can do

| Capability | Description |
|---|---|
| **Lead search** | Find and enrich prospects by role, industry, company size, location |
| **Smart scoring** | Prioritize leads based on fit and engagement signals |
| **LinkedIn drafts** | Generate personalized connection requests and messages |
| **Mission workflows** | Run structured prospecting sessions with goals and tracking |
| **Sales Navigator import** | Import prospect lists and work them inside Claude |

## Get started

### Claude Desktop (Cowork)

1. Open Claude Desktop → switch to **Cowork**
2. Go to **Customize** → **Add a plugin** → **Create a plugin**
3. Click **Add a marketplace** and enter:
   ```
   antoinedsh/salestouch
   ```
4. Open the **Personal** tab and enable **salestouch**
5. Run `/mcp` — Claude opens a browser login to connect your SalesTouch account

That's it. Start a conversation and ask Claude to find leads.

### Claude Code

```
/plugin marketplace add antoinedsh/salestouch
/plugin install salestouch@salestouch
/mcp
```

## Try it

Once connected, just type something like:

> *Find 20 Heads of Sales in B2B SaaS startups in Paris and draft a first LinkedIn message for each.*

SalesTouch handles the research, scoring, and message drafting. You review and send.

## How it works

SalesTouch connects to Claude through a **remote MCP server** — no local setup, no API keys to manage.
After a one-time OAuth login, all SalesTouch tools are available in your Claude workspace.

## Learn more

- Website: [salestouch.io](https://www.salestouch.io)
- Support: support@salestouch.ai

---

<p align="center">
  <sub>Built with care for salespeople who'd rather sell than prospect.</sub>
</p>
