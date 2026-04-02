# 09 — Automate Your Finances in One Saturday
## Fill-in-the-Blank System Blueprint
**Price:** $37 | **Format:** Interactive digital product

---

## Pain Point
Bills paid manually, savings inconsistent, money sits in checking earning nothing.

## Promised Outcome
All bills auto-paid, savings auto-transferred, and investment contributions automated by end of day.

## Why They Pay
Bank sites are confusing. This is a step-by-step automation sequence with account architecture diagrams and bank-specific walkthrough guides for the top 10 banks.

---

## What the Customer Fills In — 5 Inputs

**Input 1 — Which bank(s) do you use?**
Selects from dropdown: Chase, Bank of America, Wells Fargo, Citi, Capital One, TD, Ally, Marcus, USAA, or "Other." Drives the bank-specific walkthrough they receive.

**Input 2 — Monthly take-home income**
Single number. Powers the automation math — savings transfer amounts, bill budget ceiling, and investment contribution suggestion.

**Input 3 — Which bills do you currently pay manually?**
Checklist: rent/mortgage, utilities, credit cards, subscriptions, insurance, loans. Generates a customized autopay sequence for only their bills.

**Input 4 — Do you have a separate savings account?**
Yes / No / "I want to open one." Routes them to either: (a) auto-transfer setup, (b) open + link guide, or (c) high-yield savings account recommendation before proceeding.

**Input 5 — When do you get paid? (pay frequency + date)**
Weekly / Bi-weekly / Semi-monthly / Monthly + the actual date(s). Outputs a timing diagram showing when each automation fires relative to their payday — so nothing overdrafts.

---

## What the System Gives Back — 4 Personalized Deliverables

1. **Automation calendar** — a month-view showing exactly which payment fires on which date, mapped to their pay schedule
2. **Account architecture diagram** — a simple flow showing checking → savings → investment → bills, with their actual amounts filled in
3. **Bank-specific walkthrough** — step-by-step screenshots guide for their bank only (not a 40-page generic guide)
4. **30-day check-in checklist** — 5 things to verify after the first automated payment cycle runs

---

## Page / Section Framework

### Section 1 — The 5-Question Setup (10 min)
The fill-in form. Customer answers the 5 inputs. Zero reading. Just answering. Ends with "Your custom plan is ready below."

### Section 2 — Your Account Architecture (15 min)
Shows their filled-in diagram. One checking, one HYSA, one investment. Explains the logic in 3 bullet points. No theory — just "here's yours."

### Section 3 — Autopay Your Bills (30 min)
Their bank's walkthrough only. Numbered steps with screenshot callouts. Only shows the bills they checked in Input 3.

### Section 4 — Automate Savings + Investments (20 min)
Set up recurring transfer to HYSA. Link to brokerage (or Roth IRA) and set auto-contribution. Uses their income from Input 2 to suggest a dollar amount.

### Section 5 — Your Automation Calendar (5 min)
Outputs the month-view calendar. Customer sees their entire money system on one page. This is the "done" moment.

### Section 6 — 30-Day Check-In + Troubleshooting (reference)
What to verify after the first cycle. Common issues (duplicate payments, failed ACH). One-page reference — not a manual.

---

## How They Reach the Result Without Reading More Than 2 Pages

1. Fill in 5 inputs on page 1 — no reading required
2. System routes them to their bank's section only
3. Follow numbered steps — screenshot guided
4. Review their automation calendar — done

**The "2-page" design constraint enforced:**
The customer never sees content that doesn't apply to them. If they bank at Chase, they never see the Wells Fargo section. If they already have a savings account, they skip the "open one" section. The system reads like 2 pages because it *is* 2 pages for that specific person — everything else is hidden by their inputs.

---

## Build Instructions — Claude-Executable

**Part A — Input form**
Build as an interactive Claude artifact (React). 5 inputs → outputs a personalized text block below the form. No backend needed. All logic lives in the artifact.

**Part B — Bank walkthroughs**
10 separate PDF or HTML pages, one per bank. Linked conditionally based on Input 1 selection. Write each walkthrough as a numbered screenshot-annotated guide.

Top 10 banks: Chase, Bank of America, Wells Fargo, Citi, Capital One, TD Bank, Ally, Marcus by Goldman Sachs, USAA, Discover.

**Part C — Architecture diagram**
SVG or simple graphic with editable text fields. Customer's income + transfer amounts fill in automatically from Input 2 via the artifact JS.

**Part D — Automation calendar**
Month-view HTML calendar. Populates event names + dates from Inputs 3 and 5. Printable. Can be generated as a Claude artifact with one prompt.

---

## Strategic Notes

- **Delivery format:** Single interactive HTML artifact — form, conditional routing, calendar output, and architecture diagram all in one file. Sells as a download link from Gumroad/Etsy. Zero hosting required.
- **Real IP:** The bank-specific walkthroughs are the moat. Written once, shown conditionally. This is what justifies $37.
- **Upsell hook:** End of automation calendar section → natural place for a $97 upsell: "Now that your money moves automatically, here's how to make it grow faster."

---

*Cash in Blue LLC — Thomas Perdana | thomas.perdana@cashinblue.com*
