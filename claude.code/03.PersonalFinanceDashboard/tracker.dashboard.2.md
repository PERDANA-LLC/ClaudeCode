# Build Your Own Personal Finance Dashboard in Excel

> A step-by-step guide to building a 6-sheet Excel workbook that combines the best features of Quicken Classic, Monarch Money, PocketSmith, Tiller, and Empower — all in one file you own and control.

---

## What You're Building

| Sheet | Purpose | Inspired By |
|---|---|---|
| **DASHBOARD** | One-page summary — net worth, cash flow, budget health | Empower, Monarch |
| **TRANSACTIONS** | Raw data entry — every income and expense | Tiller |
| **BUDGET** | Budgeted vs. actual by category | Quicken, Monarch |
| **CASH FLOW** | 90-day rolling balance projection | PocketSmith |
| **MORTGAGE** | Full amortization + extra payment scenarios | Quicken, Empower |
| **NET WORTH** | Monthly asset/liability snapshots | Empower |

---

## Section 1 — Workbook Setup

### Step 1: Create the File
1. Open Excel → New Blank Workbook
2. Save as: `Personal Finance Dashboard.xlsx`
3. Rename the default sheet: double-click tab → type `TRANSACTIONS`

### Step 2: Create All Six Sheets
Right-click any tab → **Insert** → **Worksheet**. Repeat until you have six sheets. Rename them (in order):
1. `DASHBOARD`
2. `TRANSACTIONS`
3. `BUDGET`
4. `CASH FLOW`
5. `MORTGAGE`
6. `NET WORTH`

### Step 3: Color-Code the Tabs
Right-click each tab → **Tab Color**:

| Sheet | Color |
|---|---|
| DASHBOARD | Dark Blue |
| TRANSACTIONS | Gray |
| BUDGET | Green |
| CASH FLOW | Light Blue |
| MORTGAGE | Orange |
| NET WORTH | Purple |

---

## Section 2 — Sheet-by-Sheet Build Instructions

---

### Sheet 2: TRANSACTIONS *(Build this first — everything else pulls from it)*

This is your raw data layer. Every dollar in and out lives here.

#### Column Layout (Row 1 = Headers)

| Col | Header | Notes |
|---|---|---|
| A | Date | Format: MM/DD/YYYY |
| B | Description | e.g., "Walmart", "Paycheck" |
| C | Category | Dropdown (see below) |
| D | Amount | Positive number always |
| E | Type | Dropdown: `Income` or `Expense` |
| F | Account | e.g., "Chase Checking", "Amex" |
| G | Month | Formula: `=TEXT(A2,"YYYY-MM")` |

#### Format the Header Row
- Select Row 1 → **Bold** → Background color: Dark Gray → Font color: White
- Freeze Row 1: **View → Freeze Panes → Freeze Top Row**

#### Create Category Dropdown (Data Validation)
1. Click cell C2
2. **Data → Data Validation → List**
3. Source (paste this list):
```
Housing,Utilities,Groceries,Dining Out,Transportation,Gas,Insurance,Medical,Entertainment,Subscriptions,Clothing,Personal Care,Education,Savings,Investments,Mortgage Payment,Other Expense,Salary,Freelance Income,Investment Income,Other Income
```
4. Copy C2 → select C3:C5000 → Paste Special → Validation

#### Create Type Dropdown
1. Click E2 → Data Validation → List → Source: `Income,Expense`
2. Copy down to E3:E5000

#### Format Amount Column
- Select D2:D5000 → Format Cells → Number → `$#,##0.00`

#### Name the Table (Critical for formulas)
1. Click any cell in your data
2. **Insert → Table** → check "My table has headers" → OK
3. In the Name Box (top left), type: `Transactions` → Enter

---

### Sheet 3: BUDGET

#### Section A — Income Budget (Rows 1–15)

**Row 1 Header:**
| A | B | C | D | E |
|---|---|---|---|---|
| Income Category | Budgeted | Actual (This Month) | Variance | % of Budget |

**Row 2 example — Salary:**
- A2: `Salary`
- B2: `5000` *(type your budgeted amount — blue text = input)*
- C2: `=SUMPRODUCT((TRANSACTIONS[Type]="Income")*(TRANSACTIONS[Category]="Salary")*(TRANSACTIONS[Month]=TEXT(TODAY(),"YYYY-MM"))*TRANSACTIONS[Amount])`
- D2: `=C2-B2`
- E2: `=IFERROR(C2/B2,0)` → Format as %

Add rows for each income source. Add a **Total Income** row at the bottom:
- B Total: `=SUM(B2:B10)`
- C Total: `=SUM(C2:C10)`
- D Total: `=SUM(D2:D10)`

#### Section B — Expense Budget (Rows 20–50)

Same structure as income. One row per expense category:
- A: Category name
- B: Budgeted amount *(your input)*
- C: `=SUMPRODUCT((TRANSACTIONS[Type]="Expense")*(TRANSACTIONS[Category]="Housing")*(TRANSACTIONS[Month]=TEXT(TODAY(),"YYYY-MM"))*TRANSACTIONS[Amount])`
  *(Change "Housing" to match each category)*
- D: `=B-C` *(Remaining budget — positive = under budget)*
- E: `=IFERROR(C/B,0)` → Format as %

#### Conditional Formatting on Variance Column (D)
1. Select D20:D50
2. **Home → Conditional Formatting → Color Scales** or use:
   - Rule 1: Cell value > 0 → Green fill (under budget ✓)
   - Rule 2: Cell value < 0 → Red fill (over budget ✗)
   - Rule 3: Cell value = 0 → Yellow fill (exactly on budget)

#### Section C — Budget Summary (top of sheet, rows 55–65)
| Label | Formula |
|---|---|
| Total Income Budgeted | `=SUM(income budget range)` |
| Total Income Actual | `=SUM(income actual range)` |
| Total Expenses Budgeted | `=SUM(expense budget range)` |
| Total Expenses Actual | `=SUM(expense actual range)` |
| Net Cash Flow | `=Total Income Actual - Total Expenses Actual` |
| Savings Rate | `=IFERROR(Net Cash Flow / Total Income Actual, 0)` → format as % |
| Budget Health % | `=IFERROR(1 - (Total Expenses Actual / Total Expenses Budgeted), 0)` |

---

### Sheet 4: CASH FLOW

This is your PocketSmith-style 90-day balance projection.

#### Part A — Scheduled Transactions Table (Rows 1–40)

List every recurring income and expense:

| A | B | C | D | E |
|---|---|---|---|---|
| Description | Amount | Type | Frequency | Day of Month |
| Salary | 5000 | Income | Monthly | 1 |
| Rent | 2000 | Expense | Monthly | 1 |
| Car Insurance | 150 | Expense | Monthly | 15 |
| Netflix | 18 | Expense | Monthly | 22 |
| Utilities | 200 | Expense | Monthly | 10 |

- **Amount**: Enter as positive number for both income and expenses
- **Frequency**: `Monthly`, `Bi-Weekly`, `Weekly`, `Quarterly`

#### Part B — 90-Day Projection Table (Rows 45 onward)

**Setup:**
- Cell H1: `Starting Balance` *(label)*
- Cell I1: `5000` *(enter your current checking account balance — this is your only required input)*

**Column Headers (Row 45):**
| A | B | C | D | E |
|---|---|---|---|---|
| Date | Day | Scheduled Income | Scheduled Expense | Projected Balance |

**Row 46 (Day 1):**
- A46: `=TODAY()`
- B46: `=TEXT(A46,"ddd")` *(shows Mon, Tue, etc.)*
- C46: *(manual or formula — see below)*
- D46: *(manual or formula — see below)*
- E46: `=I1+C46-D46` *(Starting balance + income - expenses)*

**Row 47 onward:**
- A47: `=A46+1`
- E47: `=E46+C47-D47`
- Copy A47:E47 down through row 135 (90 days total)

**Scheduled Income Formula for Column C:**
```excel
=SUMPRODUCT(
  (ScheduledTransactions[Type]="Income") *
  (DAY(A46)=ScheduledTransactions[Day of Month]) *
  ScheduledTransactions[Amount]
)
```

**Scheduled Expense Formula for Column D:**
```excel
=SUMPRODUCT(
  (ScheduledTransactions[Type]="Expense") *
  (DAY(A46)=ScheduledTransactions[Day of Month]) *
  ScheduledTransactions[Amount]
)
```

#### Conditional Formatting on Projected Balance (Column E)
- Value < 0 → Red fill (account goes negative — danger)
- Value < 500 → Yellow fill (low balance warning)
- Value >= 500 → Green fill (healthy)

#### Part C — 12-Month Summary (Row 145 onward)

| A | B | C | D | E |
|---|---|---|---|---|
| Month | Starting Balance | Total Income | Total Expenses | Ending Balance |

Use SUMPRODUCT to pull from your TRANSACTIONS sheet filtered by month.

---

### Sheet 5: MORTGAGE CALCULATOR

#### Part A — Input Section (Rows 1–12)

| Row | Label | Input Cell | Notes |
|---|---|---|---|
| 2 | Home Price | B2 | Enter in blue |
| 3 | Down Payment ($) | B3 | Enter in blue |
| 4 | Down Payment (%) | C3 | `=B3/B2` → format as % |
| 5 | Loan Amount | B5 | `=B2-B3` |
| 6 | Annual Interest Rate | B6 | e.g., `0.0675` for 6.75% |
| 7 | Loan Term (Years) | B7 | e.g., `30` |
| 8 | Monthly Interest Rate | B8 | `=B6/12` |
| 9 | Total Payments | B9 | `=B7*12` |
| 10 | Loan Start Date | B10 | Enter date |
| 11 | **Monthly Payment** | **B11** | **`=PMT(B8,B9,-B5)`** |

**Extra Payment Scenario:**
| Row | Label | Cell |
|---|---|---|
| 13 | Extra Monthly Payment | B13 *(blue input)* |
| 14 | New Monthly Total | `=B11+B13` |

#### Part B — Side-by-Side What-If Comparison (Rows 16–22)

| Label | Standard | With Extra Payment |
|---|---|---|
| Monthly Payment | `=B11` | `=B14` |
| Total Paid | `=B11*B9` | *(calculated below)* |
| Total Interest | `=B11*B9-B5` | *(calculated below)* |
| Payoff Date | `=EDATE(B10,B9)` | *(calculated below)* |
| Interest Saved | — | `=Standard Total Interest - Extra Total Interest` |
| Months Saved | — | `=Standard months - Extra months` |

For the "With Extra Payment" column, use Excel's `NPER` function:
- Months to payoff: `=NPER(B8,-(B11+B13),-B5)` → round up with `=CEILING(NPER(B8,-(B11+B13),-B5),1)`

#### Part C — Amortization Table (Row 28 onward)

**Headers (Row 28):**
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Payment # | Payment Date | Payment | Principal | Interest | Balance |

**Row 29 (Payment 1):**
- A29: `1`
- B29: `=EDATE($B$10,A29)` → format as date
- C29: `=$B$11`
- E29: `=F28*$B$8` *(Interest = Previous Balance × Monthly Rate)*
- D29: `=C29-E29` *(Principal = Payment - Interest)*
- F29: `=F28-D29` *(Balance = Previous Balance - Principal)*

**Row 28 for starting balance:**
- F28: `=$B$5` *(Loan Amount)*

**Row 30 onward:**
- A30: `=A29+1`
- Copy B29:F29 down for 360 rows (30-year mortgage)

**Add running totals at bottom:**
- Total Interest Paid: `=SUM(E29:E388)`
- Total Paid: `=SUM(C29:C388)`

#### Format Column F (Balance) with Conditional Formatting:
- Highlight row where balance first hits zero → use **Icon Sets** or a helper column

---

### Sheet 6: NET WORTH

#### Part A — Assets (Rows 1–20)

| A | B | C |
|---|---|---|
| Asset | Current Value | Notes |
| Checking Account | *(enter)* | |
| Savings Account | *(enter)* | |
| Investment Account | *(enter)* | |
| 401k / Retirement | *(enter)* | |
| Home Value | *(enter)* | Link to MORTGAGE!B2 |
| Other Assets | *(enter)* | |
| **Total Assets** | `=SUM(B2:B15)` | |

#### Part B — Liabilities (Rows 22–35)

| A | B | C |
|---|---|---|
| Liability | Current Balance | Notes |
| Mortgage Balance | *(pull from amortization)* | |
| Car Loan | *(enter)* | |
| Credit Card 1 | *(enter)* | |
| Credit Card 2 | *(enter)* | |
| Other Debt | *(enter)* | |
| **Total Liabilities** | `=SUM(B23:B32)` | |

To link Mortgage Balance automatically:
```excel
=INDEX(MORTGAGE!F29:F388, MATCH(0, MORTGAGE!F29:F388, 1))
```
*(This finds the current remaining balance based on today's payment number)*

Or simpler — just reference the balance row for the current month number.

#### Part C — Net Worth Summary (Row 38)

| Label | Formula |
|---|---|
| Total Assets | `=B17` |
| Total Liabilities | `=B33` |
| **Net Worth** | **`=B17-B33`** |
| Home Equity | `=MORTGAGE!B2 - [Mortgage Balance]` |
| Debt-to-Asset Ratio | `=IFERROR(B33/B17,0)` → format as % |

#### Part D — Monthly Snapshot Tracker (Row 45 onward)

Manually update once per month:

| A | B | C | D |
|---|---|---|---|
| Month | Total Assets | Total Liabilities | Net Worth |
| Jan 2026 | *(copy value)* | *(copy value)* | `=B-C` |
| Feb 2026 | | | |
| *(continue...)* | | | |

**Add a Sparkline:**
1. Click the cell to the right of Net Worth column
2. **Insert → Sparklines → Line**
3. Data Range: select your Net Worth column history
4. Shows your trend at a glance

---

### Sheet 1: DASHBOARD *(Build this last)*

The dashboard pulls from every other sheet. Build it like a control panel.

#### Layout (approximate)

```
┌─────────────────────────────────────────────────────┐
│  PERSONAL FINANCE DASHBOARD          [Month/Year]   │
├──────────┬──────────┬──────────┬────────────────────┤
│ NET WORTH│ CASH FLOW│ SAVINGS  │ BUDGET HEALTH      │
│ $XXX,XXX │ +$X,XXX  │  XX%     │  XX% on track      │
├──────────┴──────────┴──────────┴────────────────────┤
│ BUDGET STATUS — This Month                          │
│  Housing:    ████████░░  $2,000 / $2,200  ✓        │
│  Food:       █████████░  $450 / $500      ✓        │
│  Transport:  ██████████  $620 / $600      ✗ Over   │
├─────────────────────────────────────────────────────┤
│ CASH FLOW — Next 30 Days                           │
│  Current Balance:  $X,XXX                          │
│  Projected (30d):  $X,XXX                          │
│  Projected (60d):  $X,XXX                          │
│  Projected (90d):  $X,XXX                          │
├─────────────────────────────────────────────────────┤
│ MORTGAGE SNAPSHOT                                  │
│  Remaining Balance:  $XXX,XXX                      │
│  Monthly Payment:    $X,XXX                        │
│  Equity:             $XX,XXX                       │
└─────────────────────────────────────────────────────┘
```

#### Key Dashboard Formulas

**Net Worth (from NET WORTH sheet):**
```excel
='NET WORTH'!B38
```

**Monthly Cash Flow (from BUDGET sheet):**
```excel
=BUDGET!B60  *(reference your Net Cash Flow cell)*
```

**Savings Rate:**
```excel
=BUDGET!B62  *(reference your Savings Rate cell)*
```

**30-Day Projected Balance (from CASH FLOW sheet):**
```excel
='CASH FLOW'!E76   *(row 46 + 30 = row 76)*
```

**60-Day Projected Balance:**
```excel
='CASH FLOW'!E106
```

**90-Day Projected Balance:**
```excel
='CASH FLOW'!E135
```

**Mortgage Balance:**
```excel
=MORTGAGE!F388  *(or your current payment row)*
```

#### Dashboard Conditional Formatting

**Savings Rate cell:**
- ≥ 20% → Green
- 10–19% → Yellow
- < 10% → Red

**Budget Health %:**
- ≥ 90% → Green (within budget)
- 75–89% → Yellow (slightly over)
- < 75% → Red (significantly over)

**Cash Flow 90-day:**
- > Starting Balance → Green (saving money)
- Within 10% of Starting → Yellow (breakeven)
- < Starting Balance → Red (spending down)

---

## Section 3 — Connecting the Sheets

### Data Flow Diagram

```
TRANSACTIONS (raw data)
      │
      ├──→ BUDGET (SUMPRODUCT by category + month)
      │
      └──→ CASH FLOW (actual vs. scheduled reconciliation)

MORTGAGE (standalone calculator)
      │
      └──→ NET WORTH (current balance link)
            │
            └──→ DASHBOARD (all summary KPIs)
```

### Named Ranges to Create (makes formulas readable)

Go to **Formulas → Name Manager → New** for each:

| Name | Refers To |
|---|---|
| `CurrentMonth` | `=TEXT(TODAY(),"YYYY-MM")` |
| `StartingBalance` | `='CASH FLOW'!$I$1` |
| `TotalAssets` | `='NET WORTH'!$B$17` |
| `TotalLiabilities` | `='NET WORTH'!$B$33` |
| `NetWorth` | `=TotalAssets-TotalLiabilities` |
| `MortgagePayment` | `=MORTGAGE!$B$11` |

---

## Section 4 — Formatting & Usability Tips

### Freeze Panes (do this on every sheet)
- **TRANSACTIONS**: Freeze Row 1 (headers always visible)
- **BUDGET**: Freeze Row 1 and Column A (see categories while scrolling)
- **CASH FLOW**: Freeze Row 45 (the column headers row)
- **MORTGAGE**: Freeze Row 28 (amortization headers)
- **NET WORTH**: Freeze Row 1

How: Click the cell below/right of what you want frozen → **View → Freeze Panes**

### Number Formatting Cheat Sheet

| Data Type | Format Code |
|---|---|
| Currency (no decimals) | `$#,##0` |
| Currency (with cents) | `$#,##0.00` |
| Percentage | `0.0%` |
| Date | `MM/DD/YYYY` |
| Month label | `MMM YYYY` |
| Large negative as red | `$#,##0;[Red]($#,##0)` |

### Color Coding Convention (financial industry standard)
- **Blue text**: Numbers you type in (inputs you'll change)
- **Black text**: Formulas and calculations (don't type here)
- **Green text**: Values linked from another sheet

### Add a Cover Sheet (optional but professional)
Create a sheet named `COVER` with:
- Your name and dashboard title
- Last updated date: `=TODAY()`
- Navigation buttons (Insert → Text → Text Box, then right-click → Hyperlink → Place in Document)

---

## Section 5 — Monthly Maintenance Workflow

Do this on the **1st of each month** (takes ~15 minutes):

### Week 1: Enter Transactions
1. Open **TRANSACTIONS** sheet
2. Download your bank/card statements (CSV if possible)
3. Enter or paste all transactions from the prior month
4. Assign categories using the dropdown
5. Review BUDGET sheet → check for over-budget categories

### Week 2: Update Balances
1. Open **NET WORTH** sheet
2. Update all asset values with current balances
3. Copy the current Net Worth to the monthly snapshot table (paste as **value only**)
4. Update CASH FLOW starting balance (cell I1) with your real checking balance

### Monthly Review (15 min)
Open **DASHBOARD** and review:
- [ ] Net Worth change from last month (up or down?)
- [ ] Savings rate — are you hitting your target?
- [ ] Any budget categories consistently over? → adjust budget or behavior
- [ ] 90-day cash flow — any months with a dip below safety threshold?
- [ ] Mortgage equity — is it growing as expected?

---

## Section 6 — Optional Upgrades

### Power Query: Import Bank Transactions Automatically
1. **Data → Get Data → From File → From Text/CSV**
2. Select your downloaded bank statement CSV
3. Map columns to match your TRANSACTIONS layout
4. Set up a refresh: **Data → Refresh All**

This turns your manual entry into a one-click import.

### Add Charts to the Dashboard

**Net Worth Over Time:**
1. Select your monthly snapshot table in NET WORTH
2. **Insert → Chart → Line Chart**
3. Move to DASHBOARD

**Budget Breakdown (Pie or Bar):**
1. Select category names + actual amounts from BUDGET
2. Insert → Bar Chart (horizontal bar works best for budgets)

**Cash Flow Waterfall Chart:**
1. Excel 2016+: Insert → Waterfall Chart
2. Use your 12-month cash flow summary data

### Add a Debt Payoff Tracker (Debt Snowball / Avalanche)
Add a sheet called `DEBT PAYOFF`:
- List all debts: name, balance, rate, minimum payment
- Avalanche method: sort by highest interest rate
- Snowball method: sort by lowest balance
- Show projected payoff dates using `NPER` function

### Automate the Monthly Snapshot with a Macro
If you're comfortable with Excel macros (Alt+F11):

```vba
Sub CaptureMonthlySnapshot()
    Dim ws As Worksheet
    Set ws = Sheets("NET WORTH")

    Dim nextRow As Long
    nextRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row + 1

    ws.Cells(nextRow, "A") = Format(Date, "MMM YYYY")
    ws.Cells(nextRow, "B") = ws.Range("B17").Value  ' Total Assets
    ws.Cells(nextRow, "C") = ws.Range("B33").Value  ' Total Liabilities
    ws.Cells(nextRow, "D") = ws.Range("B38").Value  ' Net Worth
End Sub
```

Run this on the 1st of each month to automatically log your snapshot.

---

## Quick-Start Checklist

- [ ] Create workbook with 6 named, color-coded sheets
- [ ] Build TRANSACTIONS with table, dropdowns, frozen headers
- [ ] Build BUDGET with SUMPRODUCT formulas for current month
- [ ] Set your starting balance in CASH FLOW cell I1
- [ ] Enter scheduled recurring transactions in CASH FLOW Part A
- [ ] Enter loan details in MORTGAGE calculator
- [ ] Enter current asset and liability balances in NET WORTH
- [ ] Build DASHBOARD with cross-sheet formula links
- [ ] Add conditional formatting to DASHBOARD KPI cells
- [ ] Test: Enter 3–5 sample transactions → verify BUDGET and DASHBOARD update

---

## Formula Quick Reference

| Need | Formula |
|---|---|
| Sum transactions by category this month | `=SUMPRODUCT((TRANSACTIONS[Category]="Housing")*(TRANSACTIONS[Month]=TEXT(TODAY(),"YYYY-MM"))*TRANSACTIONS[Amount])` |
| Monthly mortgage payment | `=PMT(rate/12, term_years*12, -loan_amount)` |
| Months to pay off with extra payment | `=CEILING(NPER(rate/12, -(payment+extra), -balance), 1)` |
| Interest portion of payment | `=balance * monthly_rate` |
| Total interest paid (amortization) | `=SUM(interest_column)` |
| Home equity | `=home_value - mortgage_balance` |
| Savings rate | `=IFERROR((income - expenses) / income, 0)` |
| Budget health | `=IFERROR(1 - (actual_expenses / budgeted_expenses), 0)` |
| Current month label | `=TEXT(TODAY(),"YYYY-MM")` |
| 30 days from today | `=TODAY()+30` |

---

*Built to combine the best of: Quicken Classic (loan calculators) · Monarch Money (budget tracking) · PocketSmith (90-day cash flow) · Tiller (spreadsheet control) · Empower (net worth + retirement scenarios)*
