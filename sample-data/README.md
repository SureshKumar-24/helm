# Sample Transaction Data

This folder contains sample CSV files for testing the Financial Helm application.

## Available Files

### 1. `transactions-full-month.csv`
**Best for**: Testing complete monthly budget calculations

- **Period**: April 2025 (full month)
- **Transactions**: 40 transactions
- **Income**: $5,750 (salary + freelance)
- **Expenses**: ~$3,800
- **Categories**: All 8 categories represented
- **Use case**: Initial setup, testing monthly ceiling calculations

### 2. `transactions-3-months.csv`
**Best for**: Testing historical data and trends

- **Period**: January - April 2025 (4 months)
- **Transactions**: 56 transactions
- **Income**: $22,700 (salary + freelance)
- **Expenses**: ~$9,200
- **Use case**: Testing 3-month average calculations, carryover tracking

### 3. `transactions-chase-format.csv`
**Best for**: Testing Chase bank CSV format

- **Period**: April 2025
- **Transactions**: 40 transactions
- **Format**: Chase bank format with extra columns
- **Use case**: Testing CSV parser with different bank formats

### 4. `transactions-with-duplicates.csv`
**Best for**: Testing duplicate detection

- **Period**: April 2025 (partial)
- **Transactions**: 24 transactions (3 duplicates)
- **Duplicates**: Lines 16-18 are duplicates of earlier transactions
- **Use case**: Testing duplicate detection and handling

### 5. `transactions-current-week.csv`
**Best for**: Testing weekly budget tracking

- **Period**: Current week (April 7-13, 2025)
- **Transactions**: 14 transactions
- **Total spent**: ~$587
- **Use case**: Testing weekly budget updates, threshold alerts

## Transaction Categories

All sample files include transactions across these categories:

| Category | Examples | Typical Monthly |
|----------|----------|----------------|
| 🏠 Housing | Rent, Mortgage | $1,200 |
| 🍽️ Food & Dining | Groceries, Restaurants | $600-800 |
| 🚗 Transportation | Gas, Uber, Lyft | $200-300 |
| 🎬 Entertainment | Netflix, Movies, Games | $100-150 |
| 🛍️ Shopping | Amazon, Target, Clothing | $300-500 |
| ⚕️ Healthcare | Pharmacy, Doctor | $50-100 |
| 💡 Utilities | Electric, Water, Internet | $300-400 |
| 📱 Subscriptions | Spotify, Gym, Streaming | $100-150 |

## How to Use

### Option 1: Upload via Dashboard

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000/dashboard
3. Click "Upload CSV" button
4. Drag and drop or select a CSV file
5. Review transactions and categories
6. Click "Confirm & Import"

### Option 2: Use API Directly

```bash
# Example: Upload transactions
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user-id",
    "transactions": [
      {
        "date": "2025-04-01",
        "description": "Salary Deposit",
        "amount": 5000.00,
        "type": "income",
        "category": "Income"
      }
    ]
  }'
```

## Testing Scenarios

### Scenario 1: New User Setup
1. Upload `transactions-3-months.csv`
2. System calculates monthly ceilings from 3-month average
3. Initialize weekly budgets: `POST /api/budgets/initialize`
4. View budget status: `GET /api/budgets?userId=demo-user-id`

### Scenario 2: Weekly Budget Tracking
1. Upload `transactions-current-week.csv`
2. Check weekly budget status
3. Verify threshold alerts (should trigger at 80%, 90%, 100%)
4. Test carryover calculation

### Scenario 3: Duplicate Detection
1. Upload `transactions-full-month.csv` first
2. Then upload `transactions-with-duplicates.csv`
3. System should detect 3 duplicates
4. Only unique transactions should be imported

### Scenario 4: Multiple Bank Formats
1. Upload `transactions-chase-format.csv`
2. System should auto-detect Chase format
3. Parse correctly despite extra columns
4. Categorize transactions automatically

## Expected Results

### After Uploading Full Month Data

**Budget Summary**:
- Total Monthly Budget: ~$4,100
- Total Spent: ~$3,800
- Overall Status: Good (92% used)

**Category Breakdown**:
- Housing: $1,200 (100% - at limit)
- Food & Dining: $650 (81% - warning)
- Transportation: $300 (75% - good)
- Entertainment: $150 (50% - good)
- Shopping: $500 (100% - at limit)
- Healthcare: $80 (27% - good)
- Utilities: $400 (100% - at limit)
- Subscriptions: $100 (100% - at limit)

### Weekly Budget (Current Week)

**Expected Weekly Limits** (based on monthly ceiling / 4.33):
- Food & Dining: ~$185/week
- Transportation: ~$92/week
- Entertainment: ~$69/week
- Shopping: ~$115/week

**Current Week Spending** (from transactions-current-week.csv):
- Food & Dining: $310 (167% - over budget!)
- Transportation: $119 (129% - over budget!)
- Entertainment: $32 (46% - good)
- Shopping: $67 (58% - good)

## Tips

1. **Start Fresh**: Use `npm run db:reset` to clear database before testing
2. **Seed Data**: Run `npm run db:seed` for initial categories
3. **Initialize Budgets**: Call `/api/budgets/initialize` after uploading
4. **Check Status**: Use `/api/budgets` to see current budget status
5. **Test Thresholds**: Upload transactions incrementally to see threshold alerts

## Customization

To create your own test data:

1. Copy one of the existing CSV files
2. Modify dates, descriptions, and amounts
3. Ensure format matches: `Date,Description,Amount`
4. Use negative amounts for expenses
5. Use positive amounts for income

## Troubleshooting

**CSV not parsing?**
- Check date format (MM/DD/YYYY or YYYY-MM-DD)
- Ensure no extra commas in descriptions
- Verify file has header row

**Categories not matching?**
- Check description keywords
- Use `/api/categories/suggest` to test categorization
- Manually adjust in review screen

**Duplicates not detected?**
- Ensure exact match on date, description, and amount
- Check for extra spaces or formatting differences

---

**Need more data?** Generate additional transactions using the same format and patterns!
