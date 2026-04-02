# Claude AI Social Media Automation — Zero to Hero Guide
**Cash in Blue LLC | Thomas Perdana**
*Automate daily posting to LinkedIn, X, Facebook, Instagram, and TikTok — without touching your computer*

---

## Table of Contents
1. [Prerequisites & Setup](#1-prerequisites--setup)
2. [Content File Structure](#2-content-file-structure)
3. [The Master Claude Prompt](#3-the-master-claude-prompt)
4. [Scheduling at 7am Daily](#4-scheduling-at-7am-daily)
5. [Platform-Specific Tips](#5-platform-specific-tips)
6. [Error Handling](#6-error-handling)
7. [Hacks & Power Moves](#7-hacks--power-moves)

---

## 1. Prerequisites & Setup

### Install Claude Code
Claude Code (not claude.ai) is your engine. It runs in Terminal and has native computer use capabilities.

```bash
npm install -g @anthropic-ai/claude-code
claude login
```

### Enable macOS Accessibility + Screen Recording
Claude Code needs permission to control your browser and read your screen.

- **System Settings → Privacy & Security → Accessibility** — add Terminal (or iTerm2)
- **System Settings → Privacy & Security → Screen Recording** — add Terminal (or iTerm2)

> **Tip:** Use iTerm2 instead of the built-in Terminal — it handles long-running sessions better and doesn't time out on overnight tasks.

### Install Dependencies

```bash
brew install node python3
pip3 install anthropic schedule
npm install -g playwright
npx playwright install chromium
```

> Playwright is your real workhorse for LinkedIn, X, and Facebook. Claude drives Playwright via computer use.

### Create Your Project Folder

```bash
mkdir ~/social-autopilot && cd ~/social-autopilot
touch posts.md scheduler.py claude_post.sh
```

### Set Up API Key

```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-YOUR-KEY-HERE"' >> ~/.zshrc
source ~/.zshrc
```

> **Warning:** Never hardcode your API key in scripts. Always use environment variables.

### Buffer Account for Instagram + TikTok
Instagram and TikTok actively block browser automation. The only reliable solution is to route them through a scheduling API like Buffer or Later.

1. Sign up at buffer.com
2. Connect Instagram and TikTok
3. Get your Buffer API key

```bash
echo 'export BUFFER_TOKEN="your-buffer-api-token"' >> ~/.zshrc
```

> **Hack:** Buffer's free plan supports 3 channels. Upgrade to Essentials ($6/mo) for all 5 platforms. Way cheaper than fighting Instagram's bot detection.

---

## 2. Content File Structure

### The posts.md Format
Create `~/social-autopilot/posts.md` with this exact format every Sunday night:

```markdown
# Week of 2026-04-06

---
date: 2026-04-07
time: 07:00

[LINKEDIN]
Visibility in AI search is the new SEO. Most NYC real estate brokers are invisible to ChatGPT and Perplexity right now. We fix that. GEO audits available this week — DM me.

[X]
AI search now drives 4.4x more lead conversions than organic Google.

Most NYC brokers don't show up in ChatGPT results at all.

We fix that in 30 days. DM for a free audit.

[FACEBOOK]
Big news for NYC real estate professionals: if you're not showing up in AI search results (ChatGPT, Perplexity, Google AI Overviews), you're losing leads to competitors who are.

Cash in Blue now offers GEO audits specifically for NYC brokers. Link in bio.

[INSTAGRAM]
Caption: AI search is replacing Google. Is your brokerage showing up? 🔍

#NYCrealestate #GEO #AISearch #Brooklynrealestate #realestateleads

[TIKTOK]
Script: "If your brokerage isn't showing up in ChatGPT results, you're invisible to a growing slice of buyers. Here's what GEO optimization does..." [30 sec talking head]

---
```

### Rules for Writing Your Content

- Each platform section is wrapped in `[PLATFORM_NAME]` brackets — Claude parses these exactly
- **LinkedIn:** 150–300 words, no hashtags (they hurt reach on LinkedIn)
- **X:** under 280 chars per tweet, use line breaks for thread format
- **Facebook:** can be long-form, include a call-to-action
- **Instagram:** caption only here, images must be in a separate `/images` folder
- **TikTok:** write the script, upload the video manually or via Buffer mobile
- Use `---` to separate daily posts if scheduling multiple days at once

### Optional: Image Mapping
Add an `[IMAGES]` section to your post block:

```markdown
[IMAGES]
linkedin: ~/social-autopilot/images/2026-04-07-linkedin.png
instagram: ~/social-autopilot/images/2026-04-07-ig.jpg
```

> **Tip:** Name images with the date + platform so Claude can match them automatically to the right post.

---

## 3. The Master Claude Prompt

### Save this as claude_post.sh

```bash
#!/bin/bash
# ~/social-autopilot/claude_post.sh

POSTS_FILE="$HOME/social-autopilot/posts.md"
TODAY=$(date +%Y-%m-%d)

claude --computer-use << 'PROMPT'
You are my social media posting assistant. Your job is to post today's content to my social platforms automatically.

STEP 1: Read the file at ~/social-autopilot/posts.md
STEP 2: Find the section where date: matches today's date ($TODAY)
STEP 3: Post to each platform in this order:

FOR LINKEDIN:
- Open Chrome and go to linkedin.com
- Log in if needed (credentials are saved in Chrome keychain)
- Click "Start a post"
- Paste the [LINKEDIN] section content exactly
- Click Post
- Wait for confirmation
- Screenshot the result

FOR X (TWITTER):
- Open a new tab and go to x.com
- Click the compose button
- Paste the [X] section content
- Click Post
- Wait for confirmation

FOR FACEBOOK:
- Open a new tab and go to facebook.com
- Navigate to your profile or business page
- Create a new post
- Paste the [FACEBOOK] section content
- Click Post

FOR INSTAGRAM and TIKTOK:
- These are routed via Buffer API
- Use the Buffer API to schedule: POST to https://api.bufferapp.com/1/updates/create.json
- Use token from environment variable BUFFER_TOKEN
- Set scheduled_at to today at 07:00 local time

STEP 4: Log each result to ~/social-autopilot/logs/YYYY-MM-DD.log
STEP 5: If any post fails, log the error and retry once.

Be precise. Do not deviate from the post content. Do not add hashtags or modify text unless the platform section is empty.
PROMPT
```

### Make It Executable

```bash
chmod +x ~/social-autopilot/claude_post.sh
```

Test it manually first:

```bash
cd ~/social-autopilot && ./claude_post.sh
```

> **Tip:** Watch Claude work through each platform on your screen the first time. This lets you catch login issues, popup blockers, or layout changes before you hand it over to automation.

### Buffer API Call for Instagram + TikTok
Save as `buffer_post.py`:

```python
import requests, os, re
from datetime import datetime

BUFFER_TOKEN = os.environ["BUFFER_TOKEN"]
POSTS_FILE = os.path.expanduser("~/social-autopilot/posts.md")
TODAY = datetime.now().strftime("%Y-%m-%d")

with open(POSTS_FILE) as f:
    content = f.read()

section = re.search(rf"date: {TODAY}.*?---", content, re.DOTALL)
if not section:
    print(f"No post for {TODAY}")
    exit()

block = section.group()
ig_match = re.search(r"\[INSTAGRAM\]\n(.*?)\n\[", block, re.DOTALL)
ig_text = ig_match.group(1).strip() if ig_match else ""

if ig_text:
    resp = requests.post(
        "https://api.bufferapp.com/1/updates/create.json",
        data={"text": ig_text, "profile_ids[]": "YOUR_IG_PROFILE_ID",
              "access_token": BUFFER_TOKEN, "now": True}
    )
    print("Instagram:", resp.status_code)
```

---

## 4. Scheduling at 7am Daily

### Method A: launchd (Recommended for macOS)
Create `~/Library/LaunchAgents/com.cashinblue.socialposter.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.cashinblue.socialposter</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>/Users/YOUR_USERNAME/social-autopilot/claude_post.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>7</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>/Users/YOUR_USERNAME/social-autopilot/logs/launchd.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/YOUR_USERNAME/social-autopilot/logs/launchd-error.log</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>ANTHROPIC_API_KEY</key>
    <string>YOUR_KEY_HERE</string>
    <key>BUFFER_TOKEN</key>
    <string>YOUR_BUFFER_TOKEN</string>
  </dict>
</dict>
</plist>
```

Load it:

```bash
launchctl load ~/Library/LaunchAgents/com.cashinblue.socialposter.plist
```

> **Tip:** launchd runs even after reboots and wakes your Mac if it's asleep. This is the gold standard for scheduled macOS tasks.

### Method B: cron (Simpler)

```bash
crontab -e
```

Add this line:

```
0 7 * * * /Users/YOUR_USERNAME/social-autopilot/claude_post.sh >> /Users/YOUR_USERNAME/social-autopilot/logs/cron.log 2>&1
```

> **Warning:** Cron does NOT wake a sleeping Mac. Use launchd instead if your Mac sleeps overnight.

### Keep Your Mac Awake at 7am
Go to **System Settings → Battery → Schedule** — set your Mac to wake automatically at 6:55am.

> Set wake to 5 minutes before your post time. This gives the system time to fully boot and connect to Wi-Fi before Claude starts.

---

## 5. Platform-Specific Tips

| Platform | Method | Notes |
|----------|--------|-------|
| LinkedIn | Browser automation via Claude | Best for long-form, no hashtags |
| X (Twitter) | Browser automation via Claude | Under 280 chars, threads supported |
| Facebook | Browser automation via Claude | Long-form OK, include CTA |
| Instagram | Buffer API (required) | Image required for feed posts |
| TikTok | Buffer API (required) | Video required, or use text post |

### LinkedIn
- LinkedIn regularly updates its DOM — if posting breaks, tell Claude: *"find the 'Start a post' button using accessibility tree"*
- Use a personal profile, not just a company page — personal posts get 3–5x more reach
- LinkedIn sometimes shows a "verify it's you" CAPTCHA — build in a 30-second wait and a fallback notification to your phone
- Stay logged in by visiting LinkedIn manually at least once a week

### X (Twitter)
- X enforces rate limits — don't post more than 3x/day or risk temporary restrictions
- For threads: add a `[X_THREAD]` section and separate tweets with `//` in your posts.md
- The compose button is an SVG icon — tell Claude to look for `aria-label="Post"` if it can't find it

### Facebook
- If you have a business Page, specify in your prompt: *"Post to the Cash in Blue LLC Page, not your personal profile"*
- Facebook's "What's on your mind?" field is a contenteditable div — Claude handles this well
- Facebook may ask for a 2FA code — keep your phone nearby the first week until sessions stabilize

### Instagram
- Buffer requires an image for Instagram feed posts — always include an image path in your `[IMAGES]` block
- Stories cannot be scheduled via Buffer — use Canva's Content Planner or post manually
- Reels require video upload — pre-record and store the file path in posts.md
- Keep captions under 2,200 characters; hashtags count toward the limit

### TikTok
- TikTok scheduling via Buffer only works for video posts — you must have a video file ready
- Text-only TikToks (newer feature) can be posted via Buffer with no video
- Best posting time for NYC real estate audience: 7–9am or 7–9pm EST
- TikTok creator account required for API access — switch from personal in settings

---

## 6. Error Handling

### Build a Logging System First

```bash
mkdir -p ~/social-autopilot/logs
mkdir -p ~/social-autopilot/screenshots
```

Add this to your Claude prompt:

```
After each platform post attempt:
- If SUCCESS: log "POSTED: [platform] [timestamp]" to ~/social-autopilot/logs/$(date +%Y-%m-%d).log
- If FAIL: log "FAILED: [platform] [error_reason] [timestamp]" and take a screenshot to ~/social-autopilot/screenshots/
- After all platforms: send a summary to my phone via ntfy
```

### Phone Notification When Posting Is Done
Use ntfy.sh — a free push notification service. Install the ntfy app on your iPhone.

```bash
pip3 install ntfy --break-system-packages

# Send notification from script
curl -d "✅ Social posts complete: LinkedIn ✓ X ✓ Facebook ✓ Instagram ✓" \
  ntfy.sh/cashinblue-posts
```

> Subscribe to your channel in the ntfy app. You'll get a push notification at ~7:10am telling you what posted and what (if anything) failed.

### Common Failures + Fixes

| Failure | Fix |
|---------|-----|
| Login session expired | Add to prompt: "If you see a login page, use saved Chrome credentials to log in first" |
| CAPTCHA appears | Add to prompt: "If a CAPTCHA appears, log CAPTCHA_BLOCKED, skip this platform, and send a push notification" |
| No post found for today | Add to prompt: "If no date matches today, log NO_CONTENT and exit gracefully. Do not post anything." |
| Network down | Wrap script with: wait for `ping google.com` before starting |
| Platform UI changed | Tell Claude: "If you cannot find the expected UI element, describe what you see and halt." |

### Weekly Log Review Command
Run this every Sunday before writing next week's posts:

```bash
cat ~/social-autopilot/logs/*.log | grep "FAILED" | tail -20
```

> If the same platform fails 3+ times in a week, something structural changed on that platform. Check the screenshots folder to see what Claude saw.

---

## 7. Hacks & Power Moves

### Hack 1: Let Claude Write Your Posts for You
Instead of writing posts manually on Sunday, prompt Claude on Friday:

```
Read my GEO audit results from ~/social-autopilot/this-week-notes.md.
Write 5 days of social media posts (Mon–Fri) in posts.md format.
Audience: NYC real estate brokers.
Tone: confident, data-driven, consultative.
Goal: drive DMs and audit signups for Cash in Blue LLC.
Include the travel incentive offer on Wednesday and Friday posts.
```

> Keep a `this-week-notes.md` where you jot 3–4 bullet points about what happened in your business that week. Claude turns those bullets into 5 days of platform-optimized posts.

### Hack 2: Auto-Resize Images Per Platform

```bash
pip3 install Pillow --break-system-packages
```

Tell Claude in your prompt:

```
If [IMAGES] source: path exists, resize it to:
- LinkedIn: 1200x627px → save as source-linkedin.jpg
- Instagram: 1080x1080px → save as source-ig.jpg
- Facebook: 1200x630px → save as source-fb.jpg
Use Pillow (Python). Maintain aspect ratio, fill with white padding if needed.
```

### Hack 3: Repurpose LinkedIn Posts as Email Newsletters
Add this at the end of your Claude prompt:

```
After all posts are live, take the [LINKEDIN] post content and expand it into a
300-word email newsletter. Save to ~/social-autopilot/newsletters/$(date +%Y-%m-%d)-newsletter.md.
Subject line: derive from the first sentence of the LinkedIn post.
Add a CTA: "Book a free GEO audit at cashinblue.com"
```

> One piece of content → 5 social posts + 1 email newsletter, fully automated. That's 6 touchpoints before 8am with zero effort.

### Hack 4: Engagement Monitoring
Schedule a second Claude run at 5pm to check engagement:

```
0 17 * * * claude "Go to linkedin.com and check today's post. Log the likes, comments,
and shares to ~/social-autopilot/logs/engagement-$(date +%Y-%m-%d).log.
If any comments need a response, draft replies and save to
~/social-autopilot/replies-to-review-$(date +%Y-%m-%d).md"
```

### Hack 5: Browser Profile Isolation
Create a dedicated Chrome profile just for social posting — no personal browsing history, no conflicting cookies:

```bash
open -na "Google Chrome" --args --profile-directory="SocialAutopilot"
```

Log into all 3 browser platforms in this profile and never use it for anything else.

> A dedicated profile means Claude always starts in a known state. No popups, no "continue where you left off" dialogs, no surprise notifications breaking the automation.

### Hack 6: The Full Daily Automation Stack

```
6:55am  → Mac wakes from sleep (System Settings schedule)
7:00am  → launchd triggers claude_post.sh
7:00am  → Claude reads posts.md, finds today's content
7:01am  → Claude posts to LinkedIn, X, Facebook (browser automation)
7:03am  → buffer_post.py sends Instagram + TikTok to Buffer API
7:05am  → ntfy push notification arrives on your iPhone
7:06am  → You're still asleep. Cash in Blue is already live.
5:00pm  → Engagement check script runs
5:02pm  → Drafts saved to replies-to-review.md for your 10-minute review
```

> **Total daily time investment:** 10–15 min on Sunday to write posts (or have Claude write them). Zero time every other day of the week.

---

## Quick Start Checklist

- [ ] Install Claude Code: `npm install -g @anthropic-ai/claude-code`
- [ ] Enable Accessibility + Screen Recording in macOS System Settings
- [ ] Install Playwright: `npx playwright install chromium`
- [ ] Create Buffer account and connect Instagram + TikTok
- [ ] Set API keys in `~/.zshrc`
- [ ] Create `~/social-autopilot/` folder structure
- [ ] Write first week of posts in `posts.md` format
- [ ] Save and `chmod +x claude_post.sh`
- [ ] Run manually once to test
- [ ] Set up launchd plist for 7am daily trigger
- [ ] Set Mac wake schedule to 6:55am
- [ ] Install ntfy app on iPhone and subscribe to your channel

---

## Cost Estimate

| Item | Cost |
|------|------|
| Buffer Essentials (Instagram + TikTok) | $6/month |
| Claude API usage (~5 posts/day) | $0.50–2.00/day |
| Everything else | Free |
| **Your time after setup** | **10–15 min/week** |

---

*Cash in Blue LLC — cashinblue.com | thomas.perdana@cashinblue.com*
