# 04 — Negotiate Your Bills Down $200/Month in One Weekend
## Fill-in-the-Blank System Blueprint
**Price:** $37 | **Format:** Interactive digital product

---

## Pain Point
Overpaying on subscriptions, insurance, and services but doesn't know how to negotiate.

## Promised Outcome
$150–300/month back in pocket with word-for-word scripts and a reusable audit checklist.

## Why They Pay
Scripts matter. This includes proven call scripts for 14 common bills, a cancel/retention leverage guide, and a tracking sheet to log every win.

---

## What the Customer Fills In — 5 Inputs

**Input 1 — Current monthly bills: name, provider, amount, how long you've been a customer**
The master audit table. Up to 14 bills: internet, phone, cable/streaming, insurance (auto/home/health), gym, subscriptions, utilities, credit card annual fees, home security, lawn/pest, etc. Each row feeds the savings estimator and routes the customer to the right script.

**Input 2 — Which bills feel non-negotiable to you?**
Checklist. Customer marks any bills they consider untouchable (e.g., mortgage, utilities they can't switch). System excludes those from the savings estimate — makes the output feel realistic, not pushy.

**Input 3 — Are you willing to threaten cancellation?**
Yes / Maybe / No. The single biggest lever in bill negotiation. Routes to either the full retention script (most savings) or the polite rate review script (easier, less savings). No shame either way — system adapts.

**Input 4 — Have you negotiated any of these before?**
Yes / No / Some of them. Beginner gets the script with every word spelled out including pauses. Experienced gets the condensed version with advanced tactics like competitor price-matching and loyalty escalation.

**Input 5 — Target monthly savings goal**
Slider or input: $50 / $100 / $150 / $200 / $300+. Sets the ambition level. System ranks bills by negotiation potential and shows which calls to make first to hit the target with the fewest calls.

---

## What the System Gives Back — 5 Personalized Deliverables

1. **Prioritized call list** — top 5 bills ranked by savings potential, showing estimated savings per call and time required
2. **14 word-for-word call scripts** — one per bill category, with their actual provider name and current amount inserted, routed by Input 3 (cancellation leverage vs. polite ask)
3. **Cancel/retention leverage guide** — when to use the cancellation threat, exact phrasing, how to handle retention offers, and when to actually cancel
4. **Win tracker + savings log** — running total of savings won, space to log new rate, date, rep name, and next renegotiation date (most bills re-negotiable every 12 months)
5. **Annual re-audit checklist** — 5-step reminder system to repeat this every 12 months so they never overpay again

---

## Page / Section Framework

### Section 1 — The Bill Audit (10 min)
Input 1 table + Inputs 2–5. No reading — just filling. System scores every bill by negotiation potential. Ends with "Your top 5 calls are ready."

### Section 2 — Your Prioritized Call List (5 min)
Top 5 bills ranked by savings potential × ease of negotiation. Shows estimated savings per call and total if all 5 succeed. This is the "weekend plan" on one page.

### Section 3 — 14 Call Scripts (reference)
One script per bill type. Customer's provider name and current amount auto-filled in. Routed by Input 3: cancellation leverage version or polite rate review version. Used during the actual call, not read beforehand.

### Section 4 — Cancel/Retention Leverage Guide (reference)
When to say "cancel." Exact words. How to evaluate a retention offer on the spot. When to follow through. Includes a decision tree: "They offered X — should I take it?"

### Section 5 — Win Tracker + Savings Log (ongoing)
Running total of monthly savings won. Each row: bill, old rate, new rate, savings/mo, call date, rep name, next renegotiation date. Auto-totals monthly and annual savings.

### Section 6 — Annual Re-Audit Checklist (reference)
5-step checklist to repeat this process every 12 months. Includes a calendar reminder template. Most savings decay — rates creep back up. This system prevents that.

---

## How They Save $200/Month Without Reading More Than 2 Pages

1. Fill in bill audit table + 4 inputs
2. Read prioritized call list — 5 calls, one page
3. Open script for call #1 — make the call
4. Log win in tracker, repeat for calls 2–5

**The "2-page" constraint enforced:**
The prioritized call list is one page. Each script is one page — used during the call, not read beforehand. The customer reads section 2 to know what to call, then opens the script mid-call as a reference. Total reading before first dollar saved: under 5 minutes. The other 12 scripts and the leverage guide are there when needed — invisible until relevant.

---

## Build Instructions — Claude-Executable

**Part A — Bill audit table + savings estimator**
14-row input table. Each bill type has a hardcoded "typical savings range" (e.g., internet: $15–40/mo, insurance: $30–80/mo). System multiplies by negotiation probability based on Inputs 3 and 4 to show realistic expected savings per call.

**Part B — 14 script templates**
Write two versions per bill type: cancellation-leverage version and polite-ask version. Each script has 6 stages: opener, situation, ask, objection 1, objection 2, close. System shows correct version based on Input 3. Provider name and amount auto-insert from Input 1.

**Part C — Prioritization algorithm**
Rank bills by: (estimated savings ÷ call time) × negotiation probability. Internet and cable rank highest — most savings, most competition. Insurance ranks second. Gym and streaming rank third (easiest calls). Output: ordered top-5 list with savings estimates.

**Part D — Win tracker with auto-totals**
Running log table. Monthly savings column auto-sums. Annual savings = monthly × 12. "Next renegotiation date" column = call date + 365 days. Reusable every year — that's the re-audit trigger. This tracker is what turns a one-time product into a permanent system.

---

## The 14 Bill Categories

| # | Bill Type | Typical Savings | Negotiation Difficulty | Best Leverage |
|---|-----------|----------------|----------------------|---------------|
| 1 | Internet/Cable | $15–$40/mo | Easy | Competitor pricing |
| 2 | Cell phone | $10–$30/mo | Easy | Loyalty + competitor |
| 3 | Car insurance | $30–$80/mo | Medium | Annual quote shopping |
| 4 | Home insurance | $20–$60/mo | Medium | Bundle discount |
| 5 | Streaming (Netflix/Hulu etc.) | $5–$15/mo | Easy | Cancellation |
| 6 | Gym membership | $10–$25/mo | Easy | Cancellation threat |
| 7 | Credit card annual fee | $95–$550 | Easy | Fee waiver request |
| 8 | Home security | $10–$20/mo | Medium | Competitor pricing |
| 9 | Lawn/pest service | $15–$40/mo | Easy | Loyalty discount |
| 10 | Medical bills | $50–$300 one-time | Easy | Lump sum offer |
| 11 | Health insurance | $20–$100/mo | Hard | Employer/marketplace |
| 12 | Utility (electric/gas) | $10–$30/mo | Medium | Budget billing |
| 13 | Software subscriptions | $5–$20/mo | Easy | Downgrade or cancel |
| 14 | Magazine/news subscriptions | $5–$15/mo | Easy | Cancel + win-back offer |

---

## Strategic Notes

- **The prioritized call list is the entire product in one page.** If someone makes the top 2 calls and saves $180/month, they'll tell everyone. The ranking algorithm (savings ÷ call time × probability) is what separates this from a generic script bundle.
- **Two script versions per bill type doubles the audience.** The "willing to cancel" customer and the "just want to ask nicely" customer are both real. Routing by Input 3 means neither feels like the product wasn't built for them.
- **The win tracker is the retention hook.** Reusable every 12 months. Someone who logs $2,400 in year-one savings has a reason to return in year two. The "next renegotiation date" column turns this into a permanent tool, not a one-time purchase.
- **Delivery format:** Excel workbook or interactive React artifact. Sells as download from Gumroad/Etsy. Zero hosting required.
- **Upsell hook:** End of win tracker → "You just freed up $X/month — now automate where it goes" → product 09 (Automate Your Finances in One Saturday, $37) or product 01 (Emergency Fund Blueprint, $37).

---

*Cash in Blue LLC — Thomas Perdana | thomas.perdana@cashinblue.com*
