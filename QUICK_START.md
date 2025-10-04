# Quick Start Guide - Financial Helm

Get up and running with Financial Helm in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Set Up Database (2 min)

```bash
# Copy environment variables
cp .env.example .env

# Edit .env and set your DATABASE_URL
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/financial_helm"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data (optional but recommended)
npm run db:seed
```

## Step 3: Start Development Server (30 sec)

```bash
npm run dev
```

Visit http://localhost:3000

## Step 4: Upload Sample Data (1 min)

1. Navigate to http://localhost:3000/dashboard
2. Click "📤 Upload CSV" button
3. Choose one of these sample files:
   - `sample-transactions.csv` - Quick test (15 transactions)
   - `sample-data/transactions-full-month.csv` - Full month (40 transactions)
   - `sample-data/transactions-3-months.csv` - Historical data (56 transactions)

4. Review transactions in the table
5. Edit categories if needed
6. Click "Confirm & Import"

## Step 5: Initialize Weekly Budgets (30 sec)

After uploading transactions, initialize your weekly budgets:

```bash
curl -X POST http://localhost:3000/api/budgets/initialize \
  -H "Content-Type: application/json" \
  -d '{"userId": "demo-user-id"}'
```

Or use the Prisma Studio:
```bash
npx prisma studio
```

## Step 6: View Your Budget Status

### Option A: Via API

```bash
curl "http://localhost:3000/api/budgets?userId=demo-user-id"
```

### Option B: Via Prisma Studio

```bash
npx prisma studio
# Navigate to weekly_budgets table
```

## What You Should See

After completing these steps, you should have:

✅ **Database**: 6 tables with sample data
- users (1 demo user)
- categories (8 default categories)
- transactions (15-56 transactions depending on file)
- weekly_budgets (8 budgets, one per category)
- carryovers (tracking week-to-week)
- achievements (empty, for future use)

✅ **Categories**: 8 active categories
- 🏠 Housing
- 🍽️ Food & Dining
- 🚗 Transportation
- 🎬 Entertainment
- 🛍️ Shopping
- ⚕️ Healthcare
- 💡 Utilities
- 📱 Subscriptions

✅ **Weekly Budgets**: Calculated for current week
- Weekly limits based on monthly ceiling / 4.33
- Carryover from previous week (if applicable)
- Current spending tracked
- Status indicators (good, warning, critical, over)

## Example API Response

```json
{
  "budgets": [
    {
      "categoryName": "Food & Dining",
      "categoryEmoji": "🍽️",
      "weeklyLimit": 184.56,
      "spent": 125.50,
      "remaining": 59.06,
      "percentageUsed": 68.0,
      "status": "good",
      "carryover": 0,
      "dailySafeToSpend": 14.77,
      "message": "You're doing well! $59.06 remaining 👍"
    }
  ],
  "summary": {
    "totalLimit": 923.08,
    "totalSpent": 456.75,
    "totalRemaining": 466.33,
    "overallPercentage": 49.5,
    "categoriesCount": 8,
    "categoriesOverBudget": 0,
    "categoriesAtRisk": 1
  }
}
```

## Testing Different Scenarios

### Test Threshold Alerts

Upload transactions incrementally to trigger alerts:

```bash
# 1. Upload base transactions
# 2. Add more transactions to reach 80% (info alert)
# 3. Add more to reach 90% (warning alert)
# 4. Add more to reach 100% (critical alert)

# Check thresholds
curl -X POST http://localhost:3000/api/budgets/check-thresholds \
  -H "Content-Type: application/json" \
  -d '{"userId": "demo-user-id", "categoryId": "category-id-here"}'
```

### Test Carryover

1. Upload `sample-data/transactions-current-week.csv`
2. Check weekly budget status
3. Note the spending vs. limit
4. Wait for next week (or manually create next week's budget)
5. Carryover should be calculated automatically

### Test Duplicate Detection

1. Upload `sample-data/transactions-full-month.csv`
2. Upload `sample-data/transactions-with-duplicates.csv`
3. System should detect 3 duplicates
4. Only unique transactions imported

## Common Commands

```bash
# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npm run db:reset

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Check for errors
npm run lint

# Build for production
npm run build
```

## Troubleshooting

### "Cannot connect to database"

1. Check PostgreSQL is running: `ps aux | grep postgres`
2. Verify DATABASE_URL in .env
3. Test connection: `psql -d financial_helm`

### "Prisma Client not generated"

```bash
npx prisma generate
```

### "CSV upload fails"

1. Check file format (Date, Description, Amount columns)
2. Verify dates are in MM/DD/YYYY or YYYY-MM-DD format
3. Ensure amounts use decimal notation (123.45)

### "No budgets showing"

1. Make sure you uploaded transactions first
2. Run budget initialization: `POST /api/budgets/initialize`
3. Check Prisma Studio for weekly_budgets table

## Next Steps

Now that you're set up, you can:

1. **Explore the API**: See [API Documentation](#) (coming soon)
2. **Build the UI**: Continue with Task 6 (WeeklyBudgetCoach UI)
3. **Add More Features**: Implement Tasks 5-18
4. **Customize**: Modify categories, add your own data

## Need Help?

- Check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed database setup
- See [sample-data/README.md](./sample-data/README.md) for sample data info
- Review [PROGRESS.md](./PROGRESS.md) for implementation status

---

**Ready to build?** Continue with Task 6 to create the WeeklyBudgetCoach UI! 🚀
