# Personal Finance Dashboard
**Thomas Perdana | Cash in Blue LLC**

Auto-generates a fully structured Google Sheet with 8 tabs covering all dimensions of personal finance — tailored to your income streams.

---

## Quick Start

### Step 1 — Set up Google Cloud (one-time, ~10 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g., "Finance Dashboard")
3. Enable these APIs:
   - **Google Sheets API**
   - **Google Drive API**
4. Go to **IAM & Admin → Service Accounts**
5. Create a Service Account → click **Keys → Add Key → JSON**
6. Download the JSON file → rename it `credentials.json`
7. Place `credentials.json` in this folder

### Step 2 — Install dependencies

```bash
npm install googleapis dotenv
```

### Step 3 — Run the script

```bash
node create-dashboard.js
```

The script will:
- Create a new Google Sheet named "Personal Finance Dashboard — [Year]"
- Build all 8 tabs with headers, formulas, and formatting
- Share it with `thomas.perdana@cashinblue.com`
- Print the Google Sheets URL in the terminal

---

## What Gets Created

| Tab | Purpose |
|-----|---------|
| 📊 Dashboard | Net worth, cash flow, savings rate, revenue by stream |
| 💼 Business Revenue | GEO/SEO, Life Insurance, Loan Referrals, AI Partnerships |
| 💳 Expenses | Personal + Business with LLC deductible flag |
| 📅 Budget | Monthly targets vs actuals, variance tracking |
| 💰 Savings Goals | Emergency fund, First $100K, investment targets |
| 🏦 Debt Tracker | Balances, rates, payoff dates, interest cost |
| 📈 Net Worth | Assets vs liabilities, monthly snapshot log |
| 🧾 Tax Estimate | SE tax, QBI deduction, quarterly payment schedule |

---

## Troubleshooting

**"credentials.json not found"**
→ Follow Step 1 above to download your Service Account key.

**"Permission denied" or "403" error**
→ Make sure Google Sheets API and Google Drive API are both enabled in your project.

**Sheet not shared with you**
→ The script shares with `thomas.perdana@cashinblue.com` by default.
   You can set a different email in `.env`: `GOOGLE_USER_EMAIL=your@email.com`

---

## Re-running
Running `node create-dashboard.js` again creates a **new** sheet each time.
Your `.env` file gets updated with the latest `SPREADSHEET_ID`.
