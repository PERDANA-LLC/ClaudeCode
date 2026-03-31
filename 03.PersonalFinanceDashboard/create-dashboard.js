/**
 * Personal Finance Dashboard — Google Sheets Generator
 * Owner: Thomas Perdana | Cash in Blue LLC
 * Run: node create-dashboard.js
 */

const { google } = require('googleapis');
const { execSync, spawnSync } = require('child_process');
require('dotenv').config();

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

// ─── AUTH — uses gcloud Application Default Credentials ──────────────────────
async function getAuth() {
  // Check if already logged in
  const check = spawnSync('gcloud', ['auth', 'application-default', 'print-access-token'], {
    encoding: 'utf8', stdio: 'pipe',
  });

  const needsLogin = check.status !== 0;

  if (!needsLogin) {
    // Verify the existing token has the right scopes
    const scopeCheck = spawnSync('gcloud', [
      'auth', 'application-default', 'print-access-token',
    ], { encoding: 'utf8', stdio: 'pipe' });

    const token = (scopeCheck.stdout || '').trim();
    let hasScopes = false;
    if (token) {
      try {
        const res = execSync(
          `curl -s "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}"`,
          { encoding: 'utf8' }
        );
        const info = JSON.parse(res);
        hasScopes = SCOPES.every(s => (info.scope || '').includes(s.split('/').pop()));
      } catch (_) { /* re-login to be safe */ }
    }

    if (hasScopes) {
      console.log('✅  Already logged in with correct scopes\n');
    } else {
      console.log('🔄  Re-logging in to grant Sheets & Drive access…\n');
      doLogin();
    }
  } else {
    console.log('\n🔐  Opening your browser to log in with your Google account…\n');
    doLogin();
  }

  function doLogin() {
    const result = spawnSync(
      'gcloud',
      ['auth', 'application-default', 'login',
       `--scopes=https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/cloud-platform`],
      { stdio: 'inherit' }
    );
    if (result.status !== 0) {
      console.error('\n❌  Login failed or was cancelled.');
      process.exit(1);
    }
    console.log('');
  }

  const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
  return auth;
}

// ─── COLOR HELPERS ───────────────────────────────────────────────────────────
const rgb = (r, g, b) => ({ red: r / 255, green: g / 255, blue: b / 255 });
const COLORS = {
  navy:       rgb(13, 27, 62),
  blue:       rgb(30, 86, 160),
  lightBlue:  rgb(189, 215, 238),
  green:      rgb(0, 128, 0),
  lightGreen: rgb(198, 239, 206),
  red:        rgb(192, 0, 0),
  lightRed:   rgb(255, 199, 206),
  yellow:     rgb(255, 235, 156),
  gray:       rgb(242, 242, 242),
  white:      rgb(255, 255, 255),
  darkText:   rgb(30, 30, 30),
  gold:       rgb(212, 175, 55),
};

const headerFmt = (bgColor) => ({
  backgroundColor: bgColor,
  textFormat: { bold: true, foregroundColor: COLORS.white, fontSize: 11 },
  horizontalAlignment: 'CENTER',
  verticalAlignment: 'MIDDLE',
});

// ─── SHEET DEFINITIONS ───────────────────────────────────────────────────────
const SHEETS = [
  { name: '📊 Dashboard',        color: rgb(13, 27, 62) },
  { name: '💼 Business Revenue', color: rgb(0, 112, 192) },
  { name: '💳 Expenses',         color: rgb(192, 0, 0) },
  { name: '📅 Budget',           color: rgb(0, 176, 80) },
  { name: '💰 Savings Goals',    color: rgb(255, 192, 0) },
  { name: '🏦 Debt Tracker',     color: rgb(112, 48, 160) },
  { name: '📈 Net Worth',        color: rgb(0, 128, 128) },
  { name: '🧾 Tax Estimate',     color: rgb(150, 50, 50) },
];

// ─── CREATE SPREADSHEET ──────────────────────────────────────────────────────
async function createSpreadsheet(sheets, auth) {
  const service = google.sheets({ version: 'v4', auth });
  const year = new Date().getFullYear();

  const res = await service.spreadsheets.create({
    requestBody: {
      properties: { title: `Personal Finance Dashboard — ${year}` },
      sheets: sheets.map((s, i) => ({
        properties: {
          sheetId: i,
          title: s.name,
          index: i,
          tabColor: s.color,
          gridProperties: { rowCount: 1000, columnCount: 20 },
        },
      })),
    },
  });

  return { service, spreadsheetId: res.data.spreadsheetId, url: res.data.spreadsheetUrl };
}

// ─── BATCH UPDATE HELPER ─────────────────────────────────────────────────────
async function batchUpdate(service, spreadsheetId, requests) {
  if (!requests.length) return;
  await service.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests },
  });
}

// ─── VALUES HELPER ───────────────────────────────────────────────────────────
async function setValues(service, spreadsheetId, sheetName, range, values) {
  await service.spreadsheets.values.update({
    spreadsheetId,
    range: `'${sheetName}'!${range}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

// ─── TAB 1: DASHBOARD ────────────────────────────────────────────────────────
async function setupDashboard(service, spreadsheetId, sheetId) {
  const name = '📊 Dashboard';

  await setValues(service, spreadsheetId, name, 'A1', [
    ['PERSONAL FINANCE DASHBOARD', '', '', '', '', ''],
    ['Thomas Perdana | Cash in Blue LLC', '', '', '', '', ''],
    [''],
    ['📌 KEY METRICS', '', '', '', '', ''],
    ['Net Worth', "='📈 Net Worth'!B2", '', 'Monthly Cash Flow', "='📊 Dashboard'!F6", ''],
    ['Total Assets', "='📈 Net Worth'!B3", '', 'Total Income (MTD)', "=SUMIF('💼 Business Revenue'!B:B,TEXT(TODAY(),\"MMM YYYY\"),'💼 Business Revenue'!D:D)", ''],
    ['Total Debt', "='📈 Net Worth'!B4", '', 'Total Expenses (MTD)', "=SUMIF('💳 Expenses'!G:G,TEXT(TODAY(),\"MMM YYYY\"),'💳 Expenses'!D:D)", ''],
    ['Savings Rate', "=IF(F6=0,\"N/A\",TEXT((F6-F7)/F6,\"0%\"))", '', 'Business Revenue (MTD)', "=SUMIF('💼 Business Revenue'!B:B,TEXT(TODAY(),\"MMM YYYY\"),'💼 Business Revenue'!D:D)", ''],
    [''],
    ['💼 REVENUE BY STREAM (This Month)', '', '', '', '', ''],
    ['GEO/SEO Services', "=SUMIFS('💼 Business Revenue'!D:D,'💼 Business Revenue'!C:C,\"GEO/SEO\",'💼 Business Revenue'!B:B,TEXT(TODAY(),\"MMM YYYY\"))", '', '', '', ''],
    ['Life Insurance Commissions', "=SUMIFS('💼 Business Revenue'!D:D,'💼 Business Revenue'!C:C,\"Life Insurance\",'💼 Business Revenue'!B:B,TEXT(TODAY(),\"MMM YYYY\"))", '', '', '', ''],
    ['Loan Referrals', "=SUMIFS('💼 Business Revenue'!D:D,'💼 Business Revenue'!C:C,\"Loan Referral\",'💼 Business Revenue'!B:B,TEXT(TODAY(),\"MMM YYYY\"))", '', '', '', ''],
    ['AI Partnerships', "=SUMIFS('💼 Business Revenue'!D:D,'💼 Business Revenue'!C:C,\"AI Partnership\",'💼 Business Revenue'!B:B,TEXT(TODAY(),\"MMM YYYY\"))", '', '', '', ''],
    ['Other Income', "=SUMIFS('💼 Business Revenue'!D:D,'💼 Business Revenue'!C:C,\"Other\",'💼 Business Revenue'!B:B,TEXT(TODAY(),\"MMM YYYY\"))", '', '', '', ''],
    [''],
    ['🎯 SAVINGS GOALS PROGRESS', '', '', '', '', ''],
    ['Goal', 'Target', 'Current', 'Progress', '% Done', 'Status'],
    ["='💰 Savings Goals'!A2", "='💰 Savings Goals'!B2", "='💰 Savings Goals'!C2", '', "=IF(B19=0,0,C19/B19)", "=IF(E19>=1,\"✅ Done\",IF(E19>=0.75,\"🟡 Almost\",\"🔴 In Progress\"))"],
    ["='💰 Savings Goals'!A3", "='💰 Savings Goals'!B3", "='💰 Savings Goals'!C3", '', "=IF(B20=0,0,C20/B20)", "=IF(E20>=1,\"✅ Done\",IF(E20>=0.75,\"🟡 Almost\",\"🔴 In Progress\"))"],
    ["='💰 Savings Goals'!A4", "='💰 Savings Goals'!B4", "='💰 Savings Goals'!C4", '', "=IF(B21=0,0,C21/B21)", "=IF(E21>=1,\"✅ Done\",IF(E21>=0.75,\"🟡 Almost\",\"🔴 In Progress\"))"],
  ]);

  await batchUpdate(service, spreadsheetId, [
    // Title merge + format
    { mergeCells: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 6 }, mergeType: 'MERGE_ALL' } },
    { mergeCells: { range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 6 }, mergeType: 'MERGE_ALL' } },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 6 },
        cell: { userEnteredFormat: { backgroundColor: COLORS.navy, textFormat: { bold: true, fontSize: 18, foregroundColor: COLORS.gold }, horizontalAlignment: 'CENTER' } },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 6 },
        cell: { userEnteredFormat: { backgroundColor: COLORS.navy, textFormat: { italic: true, fontSize: 11, foregroundColor: COLORS.lightBlue }, horizontalAlignment: 'CENTER' } },
        fields: 'userEnteredFormat',
      },
    },
    // Section headers
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 6 },
        cell: { userEnteredFormat: headerFmt(COLORS.blue) },
        fields: 'userEnteredFormat',
      },
    },
    // Column widths
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 220 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 140 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 220 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, properties: { pixelSize: 140 }, fields: 'pixelSize' } },
    // Freeze top 2 rows
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 2 } }, fields: 'gridProperties.frozenRowCount' } },
  ]);
}

// ─── TAB 2: BUSINESS REVENUE ─────────────────────────────────────────────────
async function setupBusinessRevenue(service, spreadsheetId, sheetId) {
  const name = '💼 Business Revenue';
  const headers = ['#', 'Month', 'Stream', 'Amount', 'Client / Source', 'Invoice #', 'Payment Method', 'Status', 'Notes'];
  const sampleData = [
    ['=ROW()-1', 'Mar 2026', 'GEO/SEO', 1500, 'Sample Client NYC', 'INV-001', 'ACH', 'Paid', 'Monthly retainer'],
    ['=ROW()-1', 'Mar 2026', 'Life Insurance', 800, 'Policy #12345', '', 'Commission', 'Paid', ''],
    ['=ROW()-1', 'Mar 2026', 'Loan Referral', 500, 'Referral Partner', '', 'Check', 'Pending', ''],
    ['=ROW()-1', 'Mar 2026', 'AI Partnership', 2000, 'RE Agent - Brooklyn', 'INV-002', 'Wire', 'Paid', 'B2B AI deal'],
  ];

  await setValues(service, spreadsheetId, name, 'A1', [headers, ...sampleData]);

  await batchUpdate(service, spreadsheetId, [
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length },
        cell: { userEnteredFormat: headerFmt(COLORS.blue) },
        fields: 'userEnteredFormat',
      },
    },
    // Format Amount column as currency
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 3, endColumnIndex: 4 },
        cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' } } },
        fields: 'userEnteredFormat',
      },
    },
    // Data validation for Stream
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 2, endColumnIndex: 3 },
        rule: {
          condition: { type: 'ONE_OF_LIST', values: ['GEO/SEO', 'Life Insurance', 'Loan Referral', 'AI Partnership', 'Other'].map(v => ({ userEnteredValue: v })) },
          showCustomUi: true,
        },
      },
    },
    // Data validation for Status
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 7, endColumnIndex: 8 },
        rule: {
          condition: { type: 'ONE_OF_LIST', values: ['Paid', 'Pending', 'Overdue', 'Cancelled'].map(v => ({ userEnteredValue: v })) },
          showCustomUi: true,
        },
      },
    },
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 40 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 90 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 150 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 110 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 8, endIndex: 9 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
  ]);
}

// ─── TAB 3: EXPENSES ─────────────────────────────────────────────────────────
async function setupExpenses(service, spreadsheetId, sheetId) {
  const name = '💳 Expenses';
  const headers = ['#', 'Date', 'Category', 'Amount', 'Description', 'LLC Deductible?', 'Month', 'Payment Method', 'Recurring?', 'Notes'];
  const categories = ['Housing', 'Food & Dining', 'Transport', 'Insurance', 'Utilities', 'Business / Tools', 'Marketing', 'Entertainment', 'Medical', 'Education', 'Savings Transfer', 'Other'];
  const sampleData = [
    ['=ROW()-1', '3/1/2026', 'Housing', 2000, 'Rent', 'No', '=TEXT(B2,"MMM YYYY")', 'ACH', 'Yes', ''],
    ['=ROW()-1', '3/5/2026', 'Business / Tools', 150, 'Claude AI + tools', 'Yes', '=TEXT(B3,"MMM YYYY")', 'Card', 'Yes', 'Tax deductible'],
    ['=ROW()-1', '3/10/2026', 'Food & Dining', 400, 'Groceries + dining', 'No', '=TEXT(B4,"MMM YYYY")', 'Card', 'No', ''],
  ];

  await setValues(service, spreadsheetId, name, 'A1', [headers, ...sampleData]);

  await batchUpdate(service, spreadsheetId, [
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length },
        cell: { userEnteredFormat: headerFmt(COLORS.red) },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 3, endColumnIndex: 4 },
        cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' } } },
        fields: 'userEnteredFormat',
      },
    },
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 2, endColumnIndex: 3 },
        rule: {
          condition: { type: 'ONE_OF_LIST', values: categories.map(v => ({ userEnteredValue: v })) },
          showCustomUi: true,
        },
      },
    },
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 5, endColumnIndex: 6 },
        rule: {
          condition: { type: 'ONE_OF_LIST', values: ['Yes', 'No'].map(v => ({ userEnteredValue: v })) },
          showCustomUi: true,
        },
      },
    },
    // Highlight LLC Deductible = Yes in green
    {
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 5, endColumnIndex: 6 }],
          booleanRule: {
            condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Yes' }] },
            format: { backgroundColor: COLORS.lightGreen },
          },
        },
        index: 0,
      },
    },
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
  ]);
}

// ─── TAB 4: BUDGET ───────────────────────────────────────────────────────────
async function setupBudget(service, spreadsheetId, sheetId) {
  const name = '📅 Budget';
  const headers = ['Category', 'Monthly Budget', 'Actual (MTD)', 'Variance $', 'Variance %', 'Status'];
  const categories = [
    ['Housing', 2000],
    ['Food & Dining', 600],
    ['Transport', 300],
    ['Insurance', 400],
    ['Utilities', 200],
    ['Business / Tools', 300],
    ['Marketing', 500],
    ['Entertainment', 150],
    ['Medical', 100],
    ['Education', 200],
    ['Savings Transfer', 1000],
    ['Other', 200],
  ];

  const dataRows = categories.map(([cat, budget], i) => {
    const row = i + 2;
    return [
      cat,
      budget,
      `=SUMIFS('💳 Expenses'!D:D,'💳 Expenses'!C:C,A${row},'💳 Expenses'!G:G,TEXT(TODAY(),"MMM YYYY"))`,
      `=B${row}-C${row}`,
      `=IF(B${row}=0,"N/A",TEXT((B${row}-C${row})/B${row},"0%"))`,
      `=IF(C${row}<=B${row},"✅ On Track","⚠️ Over Budget")`,
    ];
  });

  const totalRow = [
    'TOTAL',
    '=SUM(B2:B13)',
    '=SUM(C2:C13)',
    '=SUM(D2:D13)',
    '=IF(B14=0,"N/A",TEXT((B14-C14)/B14,"0%"))',
    '',
  ];

  await setValues(service, spreadsheetId, name, 'A1', [headers, ...dataRows, totalRow]);

  await batchUpdate(service, spreadsheetId, [
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 6 },
        cell: { userEnteredFormat: headerFmt(COLORS.green) },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 14, startColumnIndex: 1, endColumnIndex: 4 },
        cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' } } },
        fields: 'userEnteredFormat',
      },
    },
    // Total row bold
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 13, endRowIndex: 14, startColumnIndex: 0, endColumnIndex: 6 },
        cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: COLORS.gray } },
        fields: 'userEnteredFormat',
      },
    },
    // Over budget conditional format
    {
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 13, startColumnIndex: 5, endColumnIndex: 6 }],
          booleanRule: {
            condition: { type: 'TEXT_CONTAINS', values: [{ userEnteredValue: '⚠️' }] },
            format: { backgroundColor: COLORS.lightRed, textFormat: { foregroundColor: COLORS.red, bold: true } },
          },
        },
        index: 0,
      },
    },
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 180 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 6 }, properties: { pixelSize: 130 }, fields: 'pixelSize' } },
  ]);
}

// ─── TAB 5: SAVINGS GOALS ────────────────────────────────────────────────────
async function setupSavingsGoals(service, spreadsheetId, sheetId) {
  const name = '💰 Savings Goals';
  const headers = ['Goal', 'Target $', 'Current $', 'Remaining $', '% Complete', 'Target Date', 'Monthly Contribution', 'Status'];
  const goals = [
    ['Emergency Fund (3 months)', 15000, 0, '', '', '12/31/2026', 500],
    ['First $100K Net Worth', 100000, 0, '', '', '12/31/2028', 1000],
    ['Investment Account', 25000, 0, '', '', '12/31/2027', 500],
    ['Business Reserve Fund', 10000, 0, '', '', '06/30/2026', 800],
    ['Vacation / Travel', 3000, 0, '', '', '11/30/2026', 250],
  ];

  const dataRows = goals.map(([goal, target, current, , , date, contrib], i) => {
    const row = i + 2;
    return [
      goal,
      target,
      current,
      `=B${row}-C${row}`,
      `=IF(B${row}=0,0,C${row}/B${row})`,
      date,
      contrib,
      `=IF(E${row}>=1,"✅ Complete",IF(E${row}>=0.75,"🟡 Almost There",IF(E${row}>=0.5,"🔵 Halfway","🔴 Just Started")))`,
    ];
  });

  await setValues(service, spreadsheetId, name, 'A1', [headers, ...dataRows]);

  await batchUpdate(service, spreadsheetId, [
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
        cell: { userEnteredFormat: headerFmt(rgb(180, 130, 0)) },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 1, endColumnIndex: 4 },
        cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' } } },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 4, endColumnIndex: 5 },
        cell: { userEnteredFormat: { numberFormat: { type: 'PERCENT', pattern: '0%' } } },
        fields: 'userEnteredFormat',
      },
    },
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 230 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 8 }, properties: { pixelSize: 150 }, fields: 'pixelSize' } },
  ]);
}

// ─── TAB 6: DEBT TRACKER ─────────────────────────────────────────────────────
async function setupDebtTracker(service, spreadsheetId, sheetId) {
  const name = '🏦 Debt Tracker';
  const headers = ['Creditor', 'Type', 'Balance', 'Interest Rate', 'Min Payment', 'Extra Payment', 'Total Payment', 'Payoff Months', 'Payoff Date', 'Total Interest'];
  const sample = [
    ['Example Credit Card', 'Credit Card', 5000, 0.22, 100, 200, '=E2+F2', '=IF(G2=0,"Paid",ROUNDUP(-NPER(D2/12,G2,-C2),0))', '=IF(H2="Paid","Paid",EDATE(TODAY(),H2))', '=IF(H2="Paid",0,(G2*H2)-C2)'],
    ['Example Student Loan', 'Student Loan', 15000, 0.065, 200, 0, '=E3+F3', '=IF(G3=0,"Paid",ROUNDUP(-NPER(D3/12,G3,-C3),0))', '=IF(H3="Paid","Paid",EDATE(TODAY(),H3))', '=IF(H3="Paid",0,(G3*H3)-C3)'],
  ];

  await setValues(service, spreadsheetId, name, 'A1', [headers, ...sample]);

  await batchUpdate(service, spreadsheetId, [
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length },
        cell: { userEnteredFormat: headerFmt(rgb(112, 48, 160)) },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 2, endColumnIndex: 3 },
        cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' } } },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 3, endColumnIndex: 4 },
        cell: { userEnteredFormat: { numberFormat: { type: 'PERCENT', pattern: '0.00%' } } },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 999, startColumnIndex: 8, endColumnIndex: 9 },
        cell: { userEnteredFormat: { numberFormat: { type: 'DATE', pattern: 'MM/DD/YYYY' } } },
        fields: 'userEnteredFormat',
      },
    },
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 2 }, properties: { pixelSize: 180 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 10 }, properties: { pixelSize: 130 }, fields: 'pixelSize' } },
  ]);
}

// ─── TAB 7: NET WORTH ────────────────────────────────────────────────────────
async function setupNetWorth(service, spreadsheetId, sheetId) {
  const name = '📈 Net Worth';

  await setValues(service, spreadsheetId, name, 'A1', [
    ['NET WORTH TRACKER', '', ''],
    [''],
    ['ASSETS', 'Amount', 'Notes'],
    ['Cash & Checking', 0, ''],
    ['Savings Accounts', 0, ''],
    ['Investments (Stocks/ETF)', 0, ''],
    ['Retirement (IRA/401k)', 0, ''],
    ['Cash in Blue LLC Equity', 0, 'Business book value'],
    ['Other Assets', 0, ''],
    ['TOTAL ASSETS', '=SUM(B4:B9)', ''],
    [''],
    ['LIABILITIES', 'Amount', 'Notes'],
    ['Total Debt', "=SUM('🏦 Debt Tracker'!C:C)", 'From Debt Tracker'],
    ['Other Liabilities', 0, ''],
    ['TOTAL LIABILITIES', '=SUM(B13:B14)', ''],
    [''],
    ['NET WORTH', '=B10-B15', ''],
    [''],
    ['MONTHLY SNAPSHOT LOG', '', ''],
    ['Month', 'Net Worth', 'Change'],
    ['Mar 2026', "='📈 Net Worth'!B17", '=B21-0'],
  ]);

  await batchUpdate(service, spreadsheetId, [
    { mergeCells: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 3 }, mergeType: 'MERGE_ALL' } },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 3 },
        cell: { userEnteredFormat: { backgroundColor: COLORS.navy, textFormat: { bold: true, fontSize: 14, foregroundColor: COLORS.gold }, horizontalAlignment: 'CENTER' } },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 3 },
        cell: { userEnteredFormat: headerFmt(COLORS.green) },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 11, endRowIndex: 12, startColumnIndex: 0, endColumnIndex: 3 },
        cell: { userEnteredFormat: headerFmt(COLORS.red) },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 16, endRowIndex: 17, startColumnIndex: 0, endColumnIndex: 3 },
        cell: { userEnteredFormat: { backgroundColor: COLORS.navy, textFormat: { bold: true, fontSize: 13, foregroundColor: COLORS.gold } } },
        fields: 'userEnteredFormat',
      },
    },
    // Currency format for values
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, endRowIndex: 17, startColumnIndex: 1, endColumnIndex: 2 },
        cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' } } },
        fields: 'userEnteredFormat',
      },
    },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 230 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 150 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
  ]);
}

// ─── TAB 8: TAX ESTIMATE ─────────────────────────────────────────────────────
async function setupTaxEstimate(service, spreadsheetId, sheetId) {
  const name = '🧾 Tax Estimate';

  await setValues(service, spreadsheetId, name, 'A1', [
    ['TAX ESTIMATE — Self-Employed (Cash in Blue LLC)', '', ''],
    [''],
    ['INPUT', 'Amount', 'Notes'],
    ['Gross Business Revenue (YTD)', 0, 'From Business Revenue tab ideally'],
    ['Business Deductions (YTD)', 0, 'LLC Deductible expenses from Expenses tab'],
    ['Net Business Income', '=B4-B5', 'Taxable SE income'],
    [''],
    ['SELF-EMPLOYMENT TAX', '', ''],
    ['SE Tax Rate', 0.153, '15.3% (Social Security + Medicare)'],
    ['Net Earnings (92.35%)', '=B6*0.9235', 'IRS adjustment'],
    ['SE Tax Owed', '=B10*B9', ''],
    ['SE Deduction (50%)', '=B11*0.5', 'Deductible from income tax'],
    [''],
    ['INCOME TAX ESTIMATE', '', ''],
    ['Adjusted Gross Income', '=B6-B12', ''],
    ['QBI Deduction (20%)', '=B15*0.2', 'Qualified Business Income deduction'],
    ['Estimated Taxable Income', '=B15-B16', ''],
    ['Federal Tax Rate (estimate)', 0.22, 'Adjust to your bracket'],
    ['Federal Income Tax', '=B17*B18', ''],
    [''],
    ['TOTAL & QUARTERLY', '', ''],
    ['Total Estimated Tax', '=B11+B19', 'SE Tax + Income Tax'],
    ['Quarterly Payment (÷4)', '=B22/4', 'Pay by: Apr 15, Jun 15, Sep 15, Jan 15'],
    [''],
    ['QUARTERLY DUE DATES', 'Due Date', 'Amount Due'],
    ['Q1 (Jan–Mar)', '4/15/2026', '=B23'],
    ['Q2 (Apr–May)', '6/15/2026', '=B23'],
    ['Q3 (Jun–Aug)', '9/15/2026', '=B23'],
    ['Q4 (Sep–Dec)', '1/15/2027', '=B23'],
  ]);

  await batchUpdate(service, spreadsheetId, [
    { mergeCells: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 3 }, mergeType: 'MERGE_ALL' } },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 3 },
        cell: { userEnteredFormat: { backgroundColor: rgb(150, 50, 50), textFormat: { bold: true, fontSize: 14, foregroundColor: COLORS.white }, horizontalAlignment: 'CENTER' } },
        fields: 'userEnteredFormat',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 3 },
        cell: { userEnteredFormat: headerFmt(COLORS.blue) },
        fields: 'userEnteredFormat',
      },
    },
    // Currency format for money cells
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, endRowIndex: 30, startColumnIndex: 1, endColumnIndex: 2 },
        cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '$#,##0.00' } } },
        fields: 'userEnteredFormat',
      },
    },
    // Highlight total tax row
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 21, endRowIndex: 23, startColumnIndex: 0, endColumnIndex: 3 },
        cell: { userEnteredFormat: { backgroundColor: COLORS.lightRed, textFormat: { bold: true } } },
        fields: 'userEnteredFormat',
      },
    },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 260 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 150 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 230 }, fields: 'pixelSize' } },
  ]);
}

// ─── SHARE WITH USER ─────────────────────────────────────────────────────────
async function shareWithUser(auth, spreadsheetId, email) {
  if (!email) return;
  const drive = google.drive({ version: 'v3', auth });
  await drive.permissions.create({
    fileId: spreadsheetId,
    requestBody: { type: 'user', role: 'writer', emailAddress: email },
  });
  console.log(`✅  Shared with ${email}`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀  Creating Personal Finance Dashboard...\n');

  const auth = await getAuth();
  const { service, spreadsheetId, url } = await createSpreadsheet(SHEETS, auth);
  console.log(`📄  Spreadsheet created: ${spreadsheetId}`);

  console.log('⚙️   Setting up tabs...');

  await setupDashboard(service, spreadsheetId, 0);
  console.log('   ✅  Tab 1: Dashboard');

  await setupBusinessRevenue(service, spreadsheetId, 1);
  console.log('   ✅  Tab 2: Business Revenue');

  await setupExpenses(service, spreadsheetId, 2);
  console.log('   ✅  Tab 3: Expenses');

  await setupBudget(service, spreadsheetId, 3);
  console.log('   ✅  Tab 4: Budget');

  await setupSavingsGoals(service, spreadsheetId, 4);
  console.log('   ✅  Tab 5: Savings Goals');

  await setupDebtTracker(service, spreadsheetId, 5);
  console.log('   ✅  Tab 6: Debt Tracker');

  await setupNetWorth(service, spreadsheetId, 6);
  console.log('   ✅  Tab 7: Net Worth');

  await setupTaxEstimate(service, spreadsheetId, 7);
  console.log('   ✅  Tab 8: Tax Estimate');

  // Share with Thomas
  const userEmail = process.env.GOOGLE_USER_EMAIL || 'thomas.perdana@cashinblue.com';
  await shareWithUser(auth, spreadsheetId, userEmail);

  // Save ID to .env for future use
  fs.writeFileSync(path.join(__dirname, '.env'), `SPREADSHEET_ID=${spreadsheetId}\nGOOGLE_USER_EMAIL=${userEmail}\n`);

  console.log('\n🎉  DONE!\n');
  console.log(`📊  Open your dashboard:`);
  console.log(`    ${url}`);
  console.log(`\n💡  Next steps:`);
  console.log(`    1. Open the link above`);
  console.log(`    2. Start entering data in Business Revenue + Expenses tabs`);
  console.log(`    3. Dashboard updates automatically\n`);
}

main().catch(err => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
