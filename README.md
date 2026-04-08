<div align="center">

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/%F0%9F%9A%80_SalesTouch-white?style=for-the-badge&labelColor=white&color=white">
  <img alt="SalesTouch" src="https://img.shields.io/badge/%F0%9F%9A%80_SalesTouch-black?style=for-the-badge&labelColor=black&color=black">
</picture>

<br/>

<h1>You describe. Claude prospects.</h1>

<p>
<strong>Lead search, scoring, LinkedIn outreach, campaign orchestration.</strong><br/>
One conversation. Zero tab-switching.
</p>

<br/>

<a href="#-install-in-10-seconds"><img src="https://img.shields.io/badge/%E2%86%93_Install_in_10s-F97316?style=for-the-badge" alt="Install in 10s"/></a>&nbsp;
<a href="https://www.salestouch.io"><img src="https://img.shields.io/badge/salestouch.io-111?style=for-the-badge" alt="salestouch.io"/></a>&nbsp;
<a href="https://www.salestouch.io/docs"><img src="https://img.shields.io/badge/Docs-0F172A?style=for-the-badge" alt="Docs"/></a>&nbsp;
<a href="#-what-you-get"><img src="https://img.shields.io/badge/Claude_Code_Plugin-6C5CE7?style=for-the-badge" alt="Claude Code Plugin"/></a>

<br/><br/>

<table><tr><td>
<br/>
&nbsp; <em>"Find 20 Heads of Sales in B2B SaaS in Paris, launch the sequence, and book meetings."</em> &nbsp;
<br/><br/>
&nbsp; <strong>That's it. You type a sentence. Claude does the rest.</strong> &nbsp;
<br/><br/>
</td></tr></table>

</div>

<br/>

## ⚡ Install in 10 seconds

Open Claude Code. Paste these two commands.

```
/plugin marketplace add antoineDsh/salestouch
```
```
/plugin install salestouch@salestouch
```

Then open Claude and run:

```
/mcp
```

Claude opens the browser login, connects to SalesTouch over the remote MCP server, and the tools are ready.

Need the full reference? Browse the docs: [https://www.salestouch.io/docs](https://www.salestouch.io/docs)

<br/>

---

## ✨ What you get

| | | |
|:---:|:---|:---|
| 🔍 | **Lead Search** | Find and enrich prospects from any criteria |
| 📊 | **Smart Scoring** | Prioritize leads with AI-powered scoring |
| 💬 | **LinkedIn Execution** | Plan, send, follow up, and drive conversations to booked meetings |
| 🎯 | **Missions** | Run full prospecting campaigns end-to-end |
| 🏷️ | **Offer Matching** | Auto-match leads to the right product or offer |
| 📥 | **Imports** | Bring in external lists (Sales Navigator, CSV, etc.) |

<br/>

## 🛡️ Why this matters for real LinkedIn prospecting

LinkedIn prospecting is not just about writing prompts. It is an **operations problem**.

Without the right layer underneath, you end up juggling brittle scripts, manual retries, blocked sessions, and fragile automations.

**SalesTouch is the sane way to prospect on LinkedIn seriously.**

It gives Claude the operational infrastructure prospecting actually needs:

| Capability | Why it matters |
|:---|:---|
| **Queue management** | Smooth execution instead of chaotic bursts |
| **Rate-limit control** | Safer pacing across actions and workflows |
| **Residential proxy routing** | Cleaner execution conditions for LinkedIn-facing tasks |
| **Secured scraping** | More reliable collection and less fragile glue code |
| **Batching** | Process large prospect sets without turning prompts into manual busywork |
| **Cron jobs** | Run prospecting routines on schedule, not by hand |
| **Enrichment workflows** | Turn raw leads into usable outreach context automatically |

If you want to prospect on LinkedIn **serenely**, SalesTouch is not a nice-to-have plugin. It is the operational layer that makes the whole system viable.

<br/>

<div align="center">

```
You    "Prospect fintech CEOs at seed stage in France,
        launch the outreach, manage follow-ups, and book meetings."

Claude  🔍  Searches leads
        📊  Scores & ranks
        💬  Plans and sends outreach
        🔁  Handles follow-ups
        📅  Pushes toward booked meetings
```

</div>

<br/>

### Try it

| Prompt | What Claude does |
|:---|:---|
| *"Find 15 AI agency founders hiring SDRs"* | Search → filter → enrich |
| *"Import this Sales Nav list and prioritize ecommerce CMOs"* | Import → score → rank |
| *"Analyze this VP Marketing profile and launch the right LinkedIn sequence"* | Profile analysis → messaging → execution |
| *"Run a mission: HR Directors in Lyon, 200-1000 employees"* | Full campaign orchestration → follow-ups → meeting push |

---

<details>
<summary><strong>🔧 Advanced — remote MCP details</strong></summary>

<br/>

**Canonical MCP config**

```json
{
  "mcpServers": {
    "salestouch": {
      "type": "http",
      "url": "https://www.salestouch.io/api/mcp"
    }
  }
}
```

<br/>

**Support fallback**

If OAuth discovery is blocked in your environment, SalesTouch also supports:

- an explicit `oauth.authServerMetadataUrl`
- a direct `X-API-Key` header for support use cases

</details>

---

<div align="center">

<sub>Auto-generated from a private source — plugin files are overwritten on each release.</sub>

<br/>

**[SalesTouch](https://www.salestouch.io)** — prospecting, reimagined.

</div>
