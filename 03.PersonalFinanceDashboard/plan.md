# Personal Finance Dashboard — Google Sheets
**Owner:** Thomas Perdana | Cash in Blue LLC
**Created:** 2026-03-28
**Purpose:** Track business revenue, personal finances, savings goals, debt payoff, and tax estimates — all in one automated Google Sheet.

---

## Dashboard Structure (8 Tabs)

| # | Tab | Purpose |
|---|-----|---------|
| 1 | 📊 Dashboard | Master overview — net worth, cash flow, savings rate, revenue by stream |
| 2 | 💼 Business Revenue | GEO/SEO clients, Life Insurance commissions, Loan referrals, AI Partnerships |
| 3 | 💳 Expenses | Personal vs. Business (LLC-deductible flagged separately) |
| 4 | 📅 Budget | Monthly targets, actual vs. budget, variance %, status |
| 5 | 💰 Savings Goals | Emergency fund, First 100K, investment targets, progress bars |
| 6 | 🏦 Debt Tracker | Balances, rates, payoff dates, total interest cost |
| 7 | 📈 Net Worth | Assets vs. liabilities, monthly snapshot log |
| 8 | 🧾 Tax Estimate | SE tax, QBI deduction, quarterly estimated payments |

---

## Technical Setup

### Stack
- Node.js + Google Sheets API v4
- Service Account authentication (JSON key)
- Script: `create-dashboard.js`

### One-Time Google Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable **Google Sheets API** + **Google Drive API**
3. Create **Service Account** → Download JSON key → save as `credentials.json`
4. OR use your Google Account (OAuth2 flow via `gcloud auth`)

### Install & Run
```bash
cd "Personal Finance Dashboard"
npm install googleapis dotenv
node create-dashboard.js
```

Script outputs the Google Sheets URL — open and it's ready to use.

---

## Files
```
Personal Finance Dashboard/
├── plan.md                ← This file
├── create-dashboard.js    ← Auto-generates the Google Sheet
├── credentials.json       ← Your Google Service Account key (you provide)
├── .env                   ← Stores SPREADSHEET_ID after first run
└── README.md              ← Quick setup guide
```

---

## Key Features Built In
- **Business Revenue tab** has income streams pre-labeled for Cash in Blue LLC
- **Expenses tab** has `LLC Deductible?` column for tax tracking
- **Tax Estimate tab** calculates SE tax (15.3%) + quarterly payment schedule
- **Dashboard** shows savings rate and net worth trend at a glance
- All tabs linked via SUMIF formulas — enter data once, everything updates
