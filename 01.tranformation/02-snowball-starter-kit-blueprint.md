# 02 — Kill One Debt in 30 Days: The Snowball Starter Kit
## Fill-in-the-Blank System Blueprint
**Price:** $27 | **Format:** Interactive digital product

---

## Pain Point
Multiple debts, paralyzed by where to start, makes minimum payments forever.

## Promised Outcome
One debt fully eliminated, momentum built, clear sequenced payoff schedule for the rest.

## Why They Pay
AI can explain the snowball method. This includes a pre-built payoff tracker, negotiation scripts for lower rates, and a "quick win" debt selector worksheet.

---

## What the Customer Fills In — 5 Inputs

**Input 1 — List every debt: name, balance, minimum payment, interest rate**
The core data table. Up to 10 debts. Each row: creditor name, current balance, minimum monthly payment, APR. This single table powers the snowball calculator, the quick-win selector, and the full payoff schedule.

**Input 2 — Monthly amount available for debt payoff**
How much can they throw at debt each month beyond minimums? Could be $25 or $500. This is the "extra payment" that drives the snowball. System shows exactly how many months each debt saves per extra dollar applied.

**Input 3 — Which debt feels most crushing right now?**
Free text or selection from their Input 1 list. Used to validate (or override) the quick-win selector — sometimes psychological relief matters more than math. System notes the difference and presents both options.

**Input 4 — Have you ever called a creditor to negotiate?**
Yes / No / Not sure what that means. Routes them to either the advanced rate negotiation script or the beginner script with a word-for-word opening line.

**Input 5 — What is your biggest debt fear?**
Three options:
- "I'll never pay it all off"
- "I'll mess up and miss a payment"
- "I don't know if I'm doing this right"

Routes them to a one-page mindset reset matched to their specific fear.

---

## What the System Gives Back — 5 Personalized Deliverables

1. **Quick-win debt selection** — the single debt to kill first, chosen by lowest balance, with exact payoff date if they start this week
2. **Full snowball payoff schedule** — month-by-month table showing every debt's balance declining to $0, in sequence
3. **Rate negotiation script** — word-for-word phone script personalized to their creditor type (credit card, medical, personal loan) from Input 1
4. **30-day kill plan** — week-by-week action steps for the first debt only, with exact dollar amounts and due dates
5. **Fear-matched mindset page** — one page of reframes and tactics matched to their Input 5 fear, not a generic pep talk

---

## Page / Section Framework

### Section 1 — The Debt Inventory (8 min)
Input 1 data table. Customer lists every debt. No reading — just filling. System scores each by payoff speed and psychological weight. Ends with "Your quick-win target is identified."

### Section 2 — Your Quick-Win Target (3 min)
One debt. One payoff date. One weekly payment amount. This is the only debt they focus on for 30 days. Everything else gets minimums only.

### Section 3 — Your 30-Day Kill Plan (5 min)
4 weekly action steps for debt #1 only:
- Week 1: call creditor + make extra payment
- Weeks 2–4: fixed payment schedule with exact amounts and dates

### Section 4 — Rate Negotiation Script (10 min)
Word-for-word script matched to their top creditor type. Three versions:
- Credit card (most negotiable)
- Medical debt (highest success rate)
- Personal loan

Includes opening line, the ask, objection responses, and closing. Estimated call time: 8 minutes.

### Section 5 — Full Snowball Schedule (reference)
Complete month-by-month payoff table for all debts in sequence. Reference only — no action required now. Shows the finish line so the first win feels worth it.

### Section 6 — Fear Reset + Mindset Page (reference)
One page matched to Input 5:
- "Never pay it off" → total payoff date with math
- "Miss a payment" → auto-pay checklist
- "Doing it wrong" → simple validation that snowball is correct

---

## How They Kill Debt #1 Without Reading More Than 2 Pages

1. Fill in debt table + 4 inputs — no reading
2. Read quick-win target — one debt, one date
3. Follow week 1 action — call + extra payment
4. Repeat weeks 2–4 until debt hits $0

**The "2-page" constraint enforced:**
The 30-day kill plan is one page. The quick-win target is one sentence. Everything else — snowball schedule, negotiation script, mindset page — is reference material accessed only when needed. A customer who only reads sections 2 and 3 still eliminates their first debt. The rest accelerates and de-risks the process.

---

## Build Instructions — Claude-Executable

**Part A — Debt inventory table + snowball calculator**
React artifact. Customer enters up to 10 debts. JS sorts by balance (snowball order). Calculates payoff month for each debt given Input 2 extra payment. Outputs the full schedule as a formatted table.

**Part B — Quick-win selector logic**
Automatically highlights the lowest-balance debt. If Input 3 differs (psychological choice), shows both options side-by-side with math: "Math says Debt A (done in 23 days). You said Debt B (done in 47 days). Choose."

**Part C — 3 negotiation script templates**
Write one script per creditor type. System inserts creditor name from Input 1 and current balance. Includes opening line, ask, objection responses, and closing. Estimated call time: 8 minutes.

**Part D — 3 fear-reset blocks**
One page per Input 5 answer. Show one only:
- "Never pay off" → total debt ÷ monthly payment = finish date
- "Miss a payment" → autopay checklist
- "Doing it wrong" → 3-point snowball validation

---

## Strategic Notes

- **The quick-win selector is the "aha" moment.** The moment the system highlights one debt with a specific payoff date — "Capital One $340 — paid off by May 14th" — the paralysis breaks. That single output justifies the $27.
- **The negotiation scripts are underrated IP.** Everyone knows you "can" call and ask for a lower rate. Nobody has the actual script. The word-for-word opening line, scripted to the exact creditor type, is the most shareable and most valuable page in the product.
- **The snowball schedule is the funnel.** Show the full payoff timeline (e.g., all debts gone in 28 months) at the end of section 5. That visual is the natural upsell entry point into product 09 (Automate Your Finances) or a future $97 full debt payoff coaching product.
- **Delivery format:** Single interactive React artifact or Excel workbook. Debt table + calculator + 30-day plan in one file. Sells as download from Gumroad/Etsy. Zero hosting required.
- **Upsell hook:** End of snowball schedule → "Now that you know your payoff date, automate the payments so you never miss one" → product 09 (Automate Your Finances in One Saturday, $37).

---

*Cash in Blue LLC — Thomas Perdana | thomas.perdana@cashinblue.com*
