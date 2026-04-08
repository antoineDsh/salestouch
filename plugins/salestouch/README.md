# SalesTouch Plugin for Claude

This plugin gives Claude access to the full SalesTouch prospecting toolkit through a remote MCP connection.

## Capabilities

- **Lead search & enrichment** — find prospects by role, industry, company size, and location
- **Lead scoring** — prioritize contacts based on fit and engagement signals
- **LinkedIn message drafting** — generate personalized outreach messages and connection requests
- **Mission workflows** — run structured prospecting sessions with goals and progress tracking
- **Sales Navigator import** — pull in prospect lists and work them directly in Claude

## Available commands

| Command | Description |
|---|---|
| `/salestouch:linkedin-message-writer` | Draft a personalized LinkedIn message for a prospect |

## Installation

### Claude Desktop (Cowork)

1. Open Claude Desktop → switch to **Cowork**
2. Go to **Customize** → **Add a plugin** → **Create a plugin**
3. Click **Add a marketplace** and enter `antoinedsh/salestouch`
4. Open the **Personal** tab and enable **salestouch**
5. Run `/mcp` to connect your SalesTouch account

### Claude Code

```
/plugin marketplace add antoinedsh/salestouch
/plugin install salestouch@salestouch
/mcp
```

## Authentication

The plugin connects to SalesTouch via OAuth. When you run `/mcp`, Claude opens a browser window where you log in to your SalesTouch account. Once authenticated, all tools are available for the session.

## Support

- Website: [salestouch.io](https://www.salestouch.io)
- Email: support@salestouch.ai
