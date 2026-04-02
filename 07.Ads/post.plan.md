# Forever Daily LinkedIn Carousel — Direct REST API
**Stack:** Next.js + Vercel Cron → Claude AI (content) → pdf-lib (slides) → LinkedIn REST API
**No Composio. No Rube. No middleware. Just `fetch()`.**

---

## Architecture

```
Vercel Cron (daily 16:00 UTC / 11 AM EST)
  └── POST /api/linkedin/post
        ├── 1. Detect day of week → select theme
        ├── 2. Call Claude API → generate 6-slide carousel content
        ├── 3. Build PDF (pdf-lib) → 1080×1080 slides, Navy/Charcoal
        ├── 4. LinkedIn Documents API → initialize + upload PDF
        └── 5. LinkedIn Posts API → publish with caption
```

---

## Phase 1 — One-Time LinkedIn App Setup

### 1.1 Create the LinkedIn Developer App
1. Go to https://www.linkedin.com/developers/apps/new
2. Fill in:
   - **App name:** Cash in Blue Automation
   - **LinkedIn Page:** your personal profile or company page
   - **Privacy policy URL:** https://cashinblue.com (placeholder OK)
   - **App logo:** upload any image
3. Click **Create app**

### 1.2 Configure OAuth
1. Click the **Auth** tab
2. Under "OAuth 2.0 settings" → Authorized redirect URLs → add: `http://localhost:3000/callback`
3. Copy your **Client ID** and **Client Secret**

### 1.3 Request Products
1. Click the **Products** tab
2. Request: **Share on LinkedIn** (instant approval)
3. Request: **Sign In with LinkedIn using OpenID Connect** (instant approval)

### 1.4 Run the One-Time OAuth Script (see Section 3.1)
This gives you an access token (60-day) + refresh token (365-day).
Store both in Vercel environment variables.

---

## Phase 2 — Project Structure

```
linkedin-poster/           ← standalone Next.js app OR inside your existing app
├── app/
│   └── api/
│       └── linkedin/
│           ├── post/
│           │   └── route.js       ← Vercel Cron target
│           └── refresh/
│               └── route.js       ← Token refresh endpoint
├── lib/
│   ├── linkedin.js                ← LinkedIn API client
│   ├── content-generator.js       ← Claude AI content
│   └── carousel-builder.js        ← PDF slide creation
├── scripts/
│   └── oauth.js                   ← One-time token fetch
├── vercel.json                    ← Cron schedule
└── .env.local                     ← Secrets (never commit)
```

---

## Phase 3 — Complete Code

### 3.1 `scripts/oauth.js` — One-Time Token Fetch

Run this ONCE locally to get your tokens.

```javascript
// scripts/oauth.js
// Usage: node scripts/oauth.js
// Then open the printed URL in browser, authorize, paste the code back

import http from 'http';
import { exec } from 'child_process';

const CLIENT_ID     = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI  = 'http://localhost:3000/callback';
const SCOPES        = 'openid profile w_member_social';

const authUrl =
  `https://www.linkedin.com/oauth/v2/authorization` +
  `?response_type=code` +
  `&client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&state=cash_in_blue_2026`;

console.log('\n✅ Opening browser for LinkedIn authorization...\n');
console.log('If it does not open, go to:\n', authUrl, '\n');
exec(`open "${authUrl}"`);

// Local server to capture the callback
const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) return;

  const code = new URL(req.url, 'http://localhost:3000').searchParams.get('code');
  if (!code) { res.end('No code received'); return; }

  // Exchange code for tokens
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const tokens = await tokenRes.json();

  // Fetch your LinkedIn person ID
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileRes.json();

  console.log('\n🎉 SUCCESS! Add these to Vercel env vars:\n');
  console.log(`LINKEDIN_ACCESS_TOKEN=${tokens.access_token}`);
  console.log(`LINKEDIN_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log(`LINKEDIN_PERSON_ID=${profile.sub}`);
  console.log(`\nAccess token expires in: ${tokens.expires_in / 3600} hours`);
  console.log(`Refresh token expires in: ${tokens.refresh_token_expires_in / 86400} days\n`);

  res.end('<h1>✅ Authorized! Check your terminal for the tokens.</h1>');
  server.close();
});

server.listen(3000, () => console.log('Listening on http://localhost:3000/callback\n'));
```

### 3.2 `lib/linkedin.js` — LinkedIn API Client

```javascript
// lib/linkedin.js
const BASE = 'https://api.linkedin.com';
const VERSION = '202504';

function headers(token) {
  return {
    Authorization:    `Bearer ${token}`,
    'Content-Type':   'application/json',
    'LinkedIn-Version': VERSION,
    'X-Restli-Protocol-Version': '2.0.0',
  };
}

// Step 1: Initialize document upload → returns uploadUrl + documentUrn
export async function initDocumentUpload(token, personId) {
  const res = await fetch(`${BASE}/rest/documents?action=initializeUpload`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: `urn:li:person:${personId}`,
      },
    }),
  });
  if (!res.ok) throw new Error(`initUpload failed: ${await res.text()}`);
  const data = await res.json();
  return {
    uploadUrl:   data.value.uploadUrl,
    documentUrn: data.value.document,  // e.g. urn:li:document:C5622ABCD
  };
}

// Step 2: Upload PDF binary to the signed URL
export async function uploadDocumentBytes(uploadUrl, pdfBytes) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: pdfBytes,
  });
  if (!res.ok) throw new Error(`uploadDocument failed: ${await res.text()}`);
}

// Step 3: Publish the post
export async function createDocumentPost(token, personId, documentUrn, commentary, title) {
  const res = await fetch(`${BASE}/rest/posts`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      author:         `urn:li:person:${personId}`,
      commentary,
      visibility:     'PUBLIC',
      distribution: {
        feedDistribution:             'MAIN_FEED',
        targetEntities:               [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        media: {
          document: documentUrn,
          title,
        },
      },
      lifecycleState:              'PUBLISHED',
      isReshareDisabledByAuthor:   false,
    }),
  });
  if (!res.ok) throw new Error(`createPost failed: ${await res.text()}`);
  const location = res.headers.get('x-restli-id') || res.headers.get('location');
  return location; // Post URN
}

// Refresh access token using refresh token
export async function refreshAccessToken() {
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: process.env.LINKEDIN_REFRESH_TOKEN,
      client_id:     process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
  return res.json(); // { access_token, expires_in, refresh_token, refresh_token_expires_in }
}
```

### 3.3 `lib/content-generator.js` — Claude AI Content Per Day

```javascript
// lib/content-generator.js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 7-day rotation matching profile/plan.md
const DAY_THEMES = {
  0: { // Sunday
    theme:       'Sunday Reflection',
    hook_prompt: 'Write a hook about 7 Biblical principles for financial success in a volatile world.',
    focus:       'Stewardship principles summary for the week. KJV scripture required.',
  },
  1: { // Monday
    theme:       'Market Pulse & Stewardship',
    hook_prompt: 'Write a hook about how market volatility proves why IUL\'s 0% floor is the strongest foundation.',
    focus:       'React to current economic trends (inflation, Fed rates, market). Proverbs 27:12 KJV.',
  },
  2: { // Tuesday
    theme:       'IUL Masterclass',
    hook_prompt: 'Write a hook about borrowing from yourself at 5% while earning 7% on the same dollar.',
    focus:       'Deep dive: IUL arbitrage mechanics, participating loans vs. standard loans.',
  },
  3: { // Wednesday
    theme:       'Tax Policy & Wealth Protection',
    hook_prompt: 'Write a hook about why a 401(k) could be a ticking tax bomb given rising tax brackets.',
    focus:       'Current tax law changes. How IUL creates tax-free retirement vs. qualified plans.',
  },
  4: { // Thursday
    theme:       'Insurance Business Opportunity',
    hook_prompt: 'Write a hook about why high-ticket life insurance is the most recession-proof career of 2026.',
    focus:       'Agency recruitment carousel. Industry trends. Targeting new agents.',
  },
  5: { // Friday
    theme:       'Legacy & Life Events',
    hook_prompt: 'Write a hook about a CEO who thought he was covered through his employer — but he was wrong.',
    focus:       'Anonymized client story. The self-completing nature of a plan. Emotional legacy angle.',
  },
  6: { // Saturday
    theme:       'Myth-Busting',
    hook_prompt: 'Write a hook challenging Dave Ramsey\'s stance on permanent life insurance using real numbers.',
    focus:       'IUL vs. Buy Term & Invest. IUL vs. Whole Life. Address common objections.',
  },
};

export async function generateCarouselContent(dayOfWeek) {
  const { theme, hook_prompt, focus } = DAY_THEMES[dayOfWeek];

  const systemPrompt = `You are a LinkedIn content ghostwriter for Thomas Perdana, an IUL Specialist & Wealth Strategist at Cash in Blue LLC. You write high-converting carousel content for his audience of business owners, high earners, and prospective life insurance agents.

VOICE: Authoritative, faith-driven, data-backed. Blends Biblical stewardship with financial mastery.
SCRIPTURE: KJV only. One verse per carousel on Slide 4.
FORMAT: Return valid JSON only — no markdown fences, no preamble.`;

  const userPrompt = `Today is ${theme} day. Create a 6-slide LinkedIn carousel.

Hook direction: ${hook_prompt}
Content focus: ${focus}

Return this exact JSON:
{
  "theme": "${theme}",
  "caption": "The LinkedIn post caption (200-300 chars, ends with CTA: DM 'LEGACY' or 'COACH')",
  "pdf_title": "Short carousel title (50 chars max)",
  "slides": [
    {
      "slide": 1,
      "label": "THE HOOK",
      "headline": "Bold, current-event-driven headline (max 60 chars)",
      "subtext": "1-2 supporting lines (max 100 chars)"
    },
    {
      "slide": 2,
      "label": "THE THREAT",
      "headline": "Why this is a problem for the reader",
      "subtext": "Specific agitation — make the pain real"
    },
    {
      "slide": 3,
      "label": "THE LOGIC",
      "headline": "The IUL solution — data or SWOT angle",
      "subtext": "Business analysis supporting the strategy"
    },
    {
      "slide": 4,
      "label": "SCRIPTURAL FOUNDATION",
      "headline": "Book Chapter:Verse — KJV",
      "subtext": "Full KJV verse text"
    },
    {
      "slide": 5,
      "label": "THE TRANSFORMATION",
      "headline": "How the reader moves from Zero to Hero",
      "subtext": "The specific outcome they get by applying this"
    },
    {
      "slide": 6,
      "label": "YOUR NEXT STEP",
      "headline": "Thomas Perdana — IUL Specialist",
      "subtext": "DM 'LEGACY' for a free wealth consultation | DM 'COACH' to join the agency"
    }
  ]
}`;

  const message = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  });

  return JSON.parse(message.content[0].text);
}
```

### 3.4 `lib/carousel-builder.js` — PDF Slide Generator

```javascript
// lib/carousel-builder.js
// npm install pdf-lib
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Brand colors
const NAVY    = rgb(0.04, 0.09, 0.20);   // #0A1733
const CHARCOAL= rgb(0.13, 0.15, 0.18);  // #212630
const WHITE   = rgb(1, 1, 1);
const GOLD    = rgb(0.89, 0.73, 0.32);   // #E3BA52
const LIGHT   = rgb(0.75, 0.82, 0.93);  // BFD2ED

const W = 1080;
const H = 1080;

function wrapText(text, font, size, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawSlideBackground(page, slideIndex) {
  // Alternating backgrounds for visual variety
  const bg = slideIndex % 2 === 0 ? NAVY : CHARCOAL;
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: bg });
  // Gold accent bar (left side)
  page.drawRectangle({ x: 0, y: 0, width: 8, height: H, color: GOLD });
  // Subtle top bar
  page.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: GOLD });
}

export async function buildCarouselPDF(slides) {
  const pdfDoc  = await PDFDocument.create();
  const boldFont   = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont= await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const page  = pdfDoc.addPage([W, H]);

    drawSlideBackground(page, i);

    // Slide label (e.g. "THE HOOK")
    page.drawText(`${slide.slide} / ${slides.length}  ·  ${slide.label}`, {
      x: 50, y: H - 60,
      size: 18,
      font: regularFont,
      color: GOLD,
    });

    // Headline
    const headlineLines = wrapText(slide.headline, boldFont, 56, W - 120);
    let yPos = H - 180;
    for (const line of headlineLines) {
      page.drawText(line, { x: 50, y: yPos, size: 56, font: boldFont, color: WHITE });
      yPos -= 72;
    }

    // Divider
    yPos -= 20;
    page.drawRectangle({ x: 50, y: yPos, width: 80, height: 3, color: GOLD });
    yPos -= 40;

    // Subtext
    const subtextLines = wrapText(slide.subtext, regularFont, 30, W - 120);
    for (const line of subtextLines) {
      page.drawText(line, { x: 50, y: yPos, size: 30, font: regularFont, color: LIGHT });
      yPos -= 44;
    }

    // Bottom branding
    page.drawText('Cash in Blue LLC  ·  cashinblue.com', {
      x: 50, y: 40,
      size: 20,
      font: regularFont,
      color: rgb(0.4, 0.45, 0.55),
    });
  }

  return pdfDoc.save(); // Returns Uint8Array
}
```

### 3.5 `app/api/linkedin/post/route.js` — Main Cron Handler

```javascript
// app/api/linkedin/post/route.js
import { NextResponse }       from 'next/server';
import { generateCarouselContent } from '@/lib/content-generator';
import { buildCarouselPDF }        from '@/lib/carousel-builder';
import {
  initDocumentUpload,
  uploadDocumentBytes,
  createDocumentPost,
  refreshAccessToken,
} from '@/lib/linkedin';

export const maxDuration = 60; // Vercel Pro: up to 300s

export async function GET(request) {
  // Verify cron secret (Vercel injects this automatically for cron routes)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token    = process.env.LINKEDIN_ACCESS_TOKEN;
    const personId = process.env.LINKEDIN_PERSON_ID;

    const dayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat

    // 1. Generate content via Claude
    console.log(`[LinkedIn] Generating carousel for day ${dayOfWeek}...`);
    const content = await generateCarouselContent(dayOfWeek);

    // 2. Build PDF
    console.log(`[LinkedIn] Building PDF: "${content.pdf_title}"...`);
    const pdfBytes = await buildCarouselPDF(content.slides);

    // 3. Initialize upload
    console.log('[LinkedIn] Initializing document upload...');
    const { uploadUrl, documentUrn } = await initDocumentUpload(token, personId);

    // 4. Upload PDF
    console.log('[LinkedIn] Uploading PDF...');
    await uploadDocumentBytes(uploadUrl, pdfBytes);

    // 5. Publish post
    console.log('[LinkedIn] Publishing post...');
    const postUrn = await createDocumentPost(
      token,
      personId,
      documentUrn,
      content.caption,
      content.pdf_title,
    );

    console.log(`[LinkedIn] ✅ Posted: ${postUrn}`);
    return NextResponse.json({
      success:    true,
      postUrn,
      theme:      content.theme,
      dayOfWeek,
      timestamp:  new Date().toISOString(),
    });

  } catch (err) {
    console.error('[LinkedIn] ❌ Error:', err.message);

    // If token expired, try refreshing and retry once
    if (err.message.includes('401') || err.message.includes('token')) {
      try {
        console.log('[LinkedIn] Attempting token refresh...');
        const newTokens = await refreshAccessToken();
        // Note: Update LINKEDIN_ACCESS_TOKEN in Vercel dashboard manually
        // or use Vercel API to update env var programmatically
        console.log('[LinkedIn] New token obtained — update LINKEDIN_ACCESS_TOKEN in Vercel env vars');
        return NextResponse.json({
          error:     'Token expired — refresh token obtained, update env var',
          new_token: newTokens.access_token,
        }, { status: 500 });
      } catch (refreshErr) {
        return NextResponse.json({ error: refreshErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

### 3.6 `app/api/linkedin/refresh/route.js` — Token Refresh Endpoint

```javascript
// app/api/linkedin/refresh/route.js
// Manual trigger: GET /api/linkedin/refresh?secret=YOUR_CRON_SECRET
import { NextResponse }      from 'next/server';
import { refreshAccessToken } from '@/lib/linkedin';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tokens = await refreshAccessToken();
  return NextResponse.json({
    message:     'Token refreshed. Update LINKEDIN_ACCESS_TOKEN in Vercel env vars.',
    access_token: tokens.access_token,
    expires_in:  tokens.expires_in,
  });
}
```

### 3.7 `vercel.json` — Cron Schedule

```json
{
  "crons": [
    {
      "path": "/api/linkedin/post",
      "schedule": "0 16 * * *"
    }
  ]
}
```
> Runs daily at 16:00 UTC = **11:00 AM EST**.

---

## Phase 4 — Environment Variables

Add these to **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Value | Notes |
|---|---|---|
| `LINKEDIN_CLIENT_ID` | From LinkedIn App Auth tab | |
| `LINKEDIN_CLIENT_SECRET` | From LinkedIn App Auth tab | |
| `LINKEDIN_ACCESS_TOKEN` | From `oauth.js` output | Refresh every 60 days |
| `LINKEDIN_REFRESH_TOKEN` | From `oauth.js` output | Valid 365 days |
| `LINKEDIN_PERSON_ID` | From `oauth.js` output | Your `sub` from userinfo |
| `ANTHROPIC_API_KEY` | From console.anthropic.com | |
| `CRON_SECRET` | Any random 32-char string | Vercel auto-injects for cron |

---

## Phase 5 — Setup & Deploy

```bash
# 1. Install dependencies
npm install pdf-lib @anthropic-ai/sdk

# 2. Add env vars to .env.local
cp .env.example .env.local
# Fill in LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET first

# 3. Run OAuth once to get tokens
node scripts/oauth.js
# → Copy the 3 printed values into Vercel env vars

# 4. Test locally
vercel dev
curl http://localhost:3000/api/linkedin/post \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# 5. Deploy
vercel --prod
```

---

## Phase 6 — Token Maintenance (Monthly Reminder)

LinkedIn access tokens expire after **60 days**. Refresh tokens last **365 days**.

**Monthly workflow (takes 30 seconds):**
```
# Option A — Hit the refresh endpoint:
https://your-app.vercel.app/api/linkedin/refresh?secret=YOUR_CRON_SECRET

# Then copy the returned access_token into Vercel env vars → redeploy.
```

> **Set a monthly calendar reminder:** "Refresh LinkedIn token" — first of every month.

---

## Phase 7 — 7-Day Content Calendar

| Day | Theme | Hook | Scripture |
|-----|-------|------|-----------|
| Mon | Market Pulse & Stewardship | "The market dropped X%. Here's why the IUL floor is your foundation." | Prov 27:12 |
| Tue | IUL Masterclass | "Borrow from yourself at 5% while earning 7% on the same dollar." | Varies |
| Wed | Tax Policy & Wealth | "New tax brackets are coming. Is your 401(k) a ticking tax bomb?" | Varies |
| Thu | Business Opportunity | "Why high-ticket life insurance is the most recession-proof career of 2026." | Varies |
| Fri | Legacy & Life Events | "A CEO thought he was covered through work. He was wrong." | Varies |
| Sat | Myth-Busting | "Stop listening to Dave Ramsey about permanent life insurance until you see these numbers." | Varies |
| Sun | Principles of the Week | "7 Biblical Principles for Financial Success in a Volatile World." | Prov 13:22 |

All content is AI-generated fresh each day based on current themes — Claude writes to the template, never repeating the same post twice.

---

## Phase 8 — Testing Checklist

- [ ] LinkedIn app created with correct products added
- [ ] OAuth script run, 3 env vars captured
- [ ] `vercel dev` test post fires without errors
- [ ] PDF downloaded and reviewed visually (6 slides, branded)
- [ ] Post appears on Thomas's LinkedIn profile
- [ ] Vercel cron confirmed active in Dashboard → Cron Jobs tab
- [ ] Monthly token refresh reminder set in calendar

---

## Estimated Costs

| Item | Cost |
|------|------|
| Vercel (Hobby/Pro) | $0–$20/mo |
| Claude API (claude-sonnet-4-6) | ~$0.01/post × 30 = ~$0.30/mo |
| LinkedIn API | Free |
| **Total** | **< $1/month in AI costs** |




---                                                                                                                       
  What's in plan2.md
                                                                                                                            
  ┌─────────┬─────────────────────────────────────────────────┐                                                           
  │  Phase  │                 What it covers                  │                                                             
  ├─────────┼─────────────────────────────────────────────────┤
  │ Phase 1 │ LinkedIn Developer App setup (5 steps, 5 min)   │                                                             
  ├─────────┼─────────────────────────────────────────────────┤
  │ Phase 2 │ File/project structure                          │                                                             
  ├─────────┼─────────────────────────────────────────────────┤                                                             
  │ Phase 3 │ 6 complete code files, copy-paste ready         │                                                             
  ├─────────┼─────────────────────────────────────────────────┤                                                             
  │ Phase 4 │ All 6 environment variables + where to add them │
  ├─────────┼─────────────────────────────────────────────────┤                                                             
  │ Phase 5 │ Install, OAuth, test, deploy commands           │
  ├─────────┼─────────────────────────────────────────────────┤                                                             
  │ Phase 6 │ Monthly token refresh (30-sec workflow)         │
  ├─────────┼─────────────────────────────────────────────────┤                                                             
  │ Phase 7 │ Full 7-day content calendar                     │
  ├─────────┼─────────────────────────────────────────────────┤                                                             
  │ Phase 8 │ Testing checklist                               │
  └─────────┴─────────────────────────────────────────────────┘                                                             
                                                            
  How it works                                                                                                              
                                                            
  1. Vercel Cron fires at 11 AM EST daily → hits /api/linkedin/post                                                         
  2. Claude Sonnet generates 6-slide carousel content for that day's theme (Mon–Sun rotation)
  3. pdf-lib builds a branded Navy/Gold PDF (1080×1080 slides)                                                              
  4. LinkedIn Documents API → initialize upload → PUT the PDF                                                               
  5. LinkedIn Posts API → publish as a carousel post                                                                        
                                                                                                                            
  Your first step                                           
                                                                                                                            
  Go to https://www.linkedin.com/developers/apps/new → create Cash in Blue Automation → come back with the Client ID and    
  Client Secret, then run node scripts/oauth.js to get your 3 tokens.

  