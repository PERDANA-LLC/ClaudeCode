**Personas activated:** Prompt Engineer + Systems Thinker + Drop-Service Business Strategist

**Diagnosis:** The real ask is a *meta-prompt* — a prompt Thomas gives Claude to generate a complete automation guide. The gap: no context about OS, content source, or which Claude product (claude.ai vs Claude Code vs API). Biggest impact: specify Claude Code + computer use + Thomas's exact stack so the guide is actionable, not generic.

---

Here's the optimized prompt to paste into Claude:

---

> **"You are an expert in AI automation and Claude's computer use capabilities. Create a zero-to-hero step-by-step guide for automating daily social media posting across LinkedIn, X (Twitter), Facebook, Instagram, and TikTok using Claude AI's computer use feature on macOS.**
>
> **My context:**
> - OS: macOS (latest)
> - Social platforms: LinkedIn, X, Facebook, Instagram, TikTok
> - Content source: I will pre-write posts in a markdown file or Notion page each Sunday night
> - Goal: Claude autonomously opens each platform, pastes the correct post, and publishes — every morning at 7am, without me touching the computer
> - I want to use Claude Code (terminal) or claude.ai computer use — whichever is more reliable for this workflow
>
> **Deliver:**
> 1. Prerequisites and setup (what I need installed, configured, and permissioned)
> 2. How to structure my content file so Claude reads it correctly
> 3. The exact Claude prompt/script that drives the automation
> 4. How to schedule it to run at 7am daily (cron, launchd, or another method)
> 5. Platform-specific tips, tricks, and workarounds (Instagram/TikTok don't have web posting — address this)
> 6. Error handling: what happens if a post fails
> 7. A 'hacks' section: fastest shortcuts, ways to make this bulletproof, and how to extend it to post images/video
>
> Format as a numbered guide with headers. Be specific — show real commands, real file structures, real prompts."**

---

**Two honest tips before you run this:**

1. **Instagram and TikTok are the hard ones.** They block web automation hard. The real hack is routing those through **Buffer, Later, or Publer via API** — then Claude just writes to the scheduler, not the platform directly. Include that in your guide request if you want the real solution.

2. **Claude computer use is best for browser-based platforms** (LinkedIn, X, Facebook). For a production-grade daily trigger, Claude Code + a cron job is more reliable than expecting claude.ai to be open and running at 7am.

Want me to just build the full guide for you directly right now instead?