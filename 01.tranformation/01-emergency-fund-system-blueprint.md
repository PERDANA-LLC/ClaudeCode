# 01 — The $0 to $1,000 Emergency Fund in 90 Days Blueprint
## Fill-in-the-Blank System Blueprint
**Price:** $37 | **Format:** Interactive digital product

---

## Pain Point
Lives paycheck to paycheck, no safety net, any unexpected expense goes on credit card.

## Promised Outcome
Has $1,000 fully funded emergency fund with an automated system that keeps refilling it.

## Why They Pay
Google gives generic tips. This gives a week-by-week savings calendar, a gap-finding worksheet, and 12 specific money sources specific to starting from zero.

---

## What the Customer Fills In — 5 Inputs

**Input 1 — Current monthly take-home income**
Single dollar amount. Drives every weekly savings target calculation and determines which of the 12 money sources are realistically available to them.

**Input 2 — Current monthly essential expenses**
Rent + utilities + food + transportation only. The system calculates their true leftover — the "gap" between what they earn and what must go out.

**Input 3 — How much is already saved toward $1,000?**
Could be $0. Sets the starting line and adjusts the 90-day calendar so week 1 target is always achievable, not demoralizing.

**Input 4 — Which income sources are available to you?**
Checklist of 12 options: sell items, gig apps, overtime, odd jobs, cash gifts, tax refund, side hustle, reduce subscriptions, etc. Generates a custom top-3 action list.

**Input 5 — What is your biggest obstacle to saving? (single choice)**
Four options:
- "I spend it before I save it"
- "I don't have anything left over"
- "Unexpected expenses keep wiping me out"
- "I don't know where my money goes"

Each routes to a different primary strategy in the output — no one-size-fits-all advice.

---

## What the System Gives Back — 5 Personalized Deliverables

1. **90-day weekly savings calendar** — 13 weeks, each with a specific dollar target based on their gap, adjusted from their Input 3 starting balance
2. **Gap-finding worksheet** — income minus essentials equals their weekly savings capacity, with a breakdown of where the remaining dollars go
3. **Custom top-3 money source action list** — from their Input 4 selections, ranked by fastest cash to slowest
4. **Obstacle-specific strategy** — one page of tactics matched to their Input 5 answer, not generic tips
5. **Auto-refill setup checklist** — 5-step guide to automate the savings transfer so the fund refills itself after any withdrawal

---

## Page / Section Framework

### Section 1 — The 5-Question Setup (5 min)
Fill in the 5 inputs. Zero reading. The system uses answers to route everything below. Ends with "Your 90-day plan is ready."

### Section 2 — Your Gap Number (5 min)
One number: income minus essentials. This is their weekly savings capacity. Shows the math simply. No theory — just their actual number.

### Section 3 — Your 90-Day Weekly Calendar (10 min)
13 rows — one per week. Each row shows the target deposit, running total, and a checkbox. Starts from Input 3 balance, ends at $1,000.

### Section 4 — Your Top-3 Money Sources (10 min)
Pulled from Input 4 selections. Ranked fastest → slowest. Each source gets one action sentence: exactly what to do this week to activate it.

### Section 5 — Your Obstacle Strategy (5 min)
One page matched to Input 5:
- "Spend before save" → automation script
- "Nothing left over" → 3 specific cuts
- "Unexpected expenses" → buffer rule
- "Don't know where it goes" → 10-minute tracking method

### Section 6 — Auto-Refill Setup (reference)
5-step checklist to set up a recurring transfer that refills the fund after any withdrawal. Bank-agnostic. Estimated time: 8 minutes.

---

## How They Reach $1,000 Without Reading More Than 2 Pages

1. Answer 5 inputs — no reading, just answering
2. Read their gap number — one sentence
3. Open calendar — follow week 1 target only
4. Execute top-3 money source actions this week

**The "2-page" constraint enforced:**
The customer's obstacle strategy is one page. Their money source list is one page. Everything else is a calendar they reference weekly — not content to read. The gap worksheet is a single number with one line of math. No one reads 12 money sources if they only checked 3 boxes. The system only shows what applies to them.

---

## Build Instructions — Claude-Executable

**Part A — Input form + routing logic**
React artifact with 5 inputs. On submit: calculates gap, generates weekly targets, filters money source list to their 3 checked items, selects obstacle strategy block. All logic in JS — no backend.

**Part B — 90-day calendar generator**
13-row table. Starting balance = Input 3. Weekly target = (1000 − Input 3) ÷ 13, rounded up. Each row: week number, deposit target, running total, checkbox. Printable.

**Part C — 12 money sources library**
Write all 12 once. Each has: name, estimated $ range, time to first dollar, one-sentence action. System filters to Input 4 selections and sorts by time-to-cash column.

**Part D — 4 obstacle strategy blocks**
Four pre-written strategy pages — one per Input 5 answer. System shows exactly one. Write each as 3–5 specific tactics, not advice. Condition: if Input 5 = X, show block X.

---

## Strategic Notes

- **The gap number is the hook.** Most people have never calculated income minus essentials as a single weekly number. That moment — seeing $47/week and realizing $1,000 is reachable — is the product's core value. Make it big, bold, front and center.
- **The 12 money sources are the IP.** Generic advice says "sell stuff on Facebook Marketplace." Your list should include specific platforms, realistic dollar estimates, and time-to-first-dollar rankings. That specificity is why they paid $37 instead of Googling it.
- **The obstacle routing is the differentiator.** Every competitor gives the same tip sheet. You give one page based on their specific obstacle. Four blocks, show one — that's what makes it feel like it was built for them.
- **Delivery format:** Single interactive React artifact — form, routing, calendar, money sources, and obstacle block all in one file. Sells as a download link from Gumroad/Etsy. Zero hosting required.
- **Upsell hook:** End of the auto-refill section → natural place for a $37 upsell into product 09 (Automate Your Finances in One Saturday) — "Now that your emergency fund is funded and auto-refilling, here's how to automate everything else."

---

*Cash in Blue LLC — Thomas Perdana | thomas.perdana@cashinblue.com*
