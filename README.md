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
&nbsp; <em>"Find 20 Heads of Sales in B2B SaaS in Paris and draft a first LinkedIn message."</em> &nbsp;
<br/><br/>
&nbsp; <strong>That's it. You type a sentence. Claude does the rest.</strong> &nbsp;
<br/><br/>
</td></tr></table>

</div>

<br/>

## ⚡ Install in 10 seconds

Open Claude Code. Paste these two commands. Done.

```
/plugin marketplace add antoineDsh/salestouch
```
```
/plugin install salestouch@salestouch
```

> Verify with `/plugin marketplace list` — then start prospecting.

Need the full reference? Browse the docs: [https://www.salestouch.io/docs](https://www.salestouch.io/docs)

<br/>

> **Same foundations, same skills.** The plugin ships the exact same skills, tools, and MCP server as the SalesTouch CLI. If you already ran `salestouch setup`, your auth and config carry over — zero extra work.

<br/>

---

## ✨ What you get

| | | |
|:---:|:---|:---|
| 🔍 | **Lead Search** | Find and enrich prospects from any criteria |
| 📊 | **Smart Scoring** | Prioritize leads with AI-powered scoring |
| 💬 | **LinkedIn Outreach** | Draft personalized connection requests and messages |
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
        score them, and generate 3 personalized openers."

Claude  🔍  Searches leads
        📊  Scores & ranks
        💬  Writes tailored messages
        ✅  Done — ready to send
```

</div>

<br/>

### Try it

| Prompt | What Claude does |
|:---|:---|
| *"Find 15 AI agency founders hiring SDRs"* | Search → filter → enrich |
| *"Import this Sales Nav list and prioritize ecommerce CMOs"* | Import → score → rank |
| *"Analyze this VP Marketing profile and write a connection invite"* | Profile analysis → LinkedIn draft |
| *"Run a mission: HR Directors in Lyon, 200-1000 employees"* | Full campaign orchestration |

---

<details>
<summary><strong>🔧 Advanced — repo structure & auth</strong></summary>

<br/>

**Prefer the CLI?**

If you want more control over authentication, per-project config, or cross-agent setup, you can install SalesTouch via the CLI instead of the Claude plugin flow:

```bash
npm install -g @salestouch/cli
salestouch setup
```

Use the plugin when you want the fastest native Claude install. Use the CLI when you want a more configurable runtime.

<br/>

**Auth resolution** — the plugin finds your credentials automatically:

1. Environment variables (`SALESTOUCH_API_KEY` / `SALESTOUCH_ACCESS_TOKEN`)
2. Project config `.salestouch/salestouch.json`
3. Legacy project config `.salestouch/cli.json`
4. Global SalesTouch config

Already ran `salestouch setup`? Everything works out of the box.

<br/>

**Repo layout**

This repo is both the **marketplace source** and the **plugin bundle** — everything Claude Code needs to discover and run SalesTouch.

| Path | What |
|:---|:---|
| `.claude-plugin/marketplace.json` | Claude marketplace manifest |
| `plugins/salestouch/` | Plugin bundle (skills, MCP server, slash commands) |

</details>

---

<div align="center">

<sub>Auto-generated from a private source — plugin files are overwritten on each release.</sub>

<br/>

**[SalesTouch](https://www.salestouch.io)** — prospecting, reimagined.

</div>
