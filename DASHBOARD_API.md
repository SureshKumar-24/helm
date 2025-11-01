# Dashboard API Documentation

## Get Dashboard Summary

Retrieve comprehensive financial statistics for a specific month and year.

**Endpoint:** `GET /transactions/dashboard/summary`

**Authentication:** Required (JWT Bearer token)

---

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| month | Integer | Yes | Month (1-12) |
| year | Integer | Yes | Year (1900-2100) |

---

## Response Structure

```json
{
  "month": 11,
  "year": 2024,
  "total_income": 5055.00,
  "total_expenses": 1975.40,
  "instant_expenses": 1975.40,
  "recurring_expenses": 0.00,
  "net_balance": 3079.60,
  "spending_by_category": [
    {
      "category_id": "uuid",
      "category_name": "Travel/Transport",
      "category_icon": "✈️",
      "category_color": "#06B6D4",
      "total_amount": 533.50,
      "percentage": 27.0
    },
    {
      "category_id": "uuid",
      "category_name": "Groceries",
      "category_icon": "🛒",
      "category_color": "#10B981",
      "total_amount": 327.49,
      "percentage": 16.58
    },
    {
      "category_id": "uuid",
      "category_name": "Entertainment",
      "category_icon": "🎬",
      "category_color": "#F59E0B",
      "total_amount": 305.00,
      "percentage": 15.44
    }
  ],
  "recent_transactions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "service": "Chevron Gas Station",
      "amount": -55.00,
      "type": "expense",
      "date": "2024-11-30",
      "source": "csv_import",
      "is_recurring": false,
      "frequency": null,
      "category": {
        "id": "uuid",
        "name": "Travel/Transport",
        "icon": "✈️",
        "color": "#06B6D4"
      },
      "created_at": "2024-11-30T10:00:00Z"
    }
  ]
}
```

---

## Response Fields

### Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| month | Integer | Requested month (1-12) |
| year | Integer | Requested year |
| total_income | Decimal | Total income for the month |
| total_expenses | Decimal | Total expenses (instant + recurring) |
| instant_expenses | Decimal | Total one-time expenses |
| recurring_expenses | Decimal | Total subscription/recurring expenses |
| net_balance | Decimal | Income - Expenses |

### Spending by Category

| Field | Type | Description |
|-------|------|-------------|
| category_id | UUID | Category unique identifier |
| category_name | String | Category name |
| category_icon | String | Emoji icon for category |
| category_color | String | Hex color code |
| total_amount | Decimal | Total spent in this category |
| percentage | Float | Percentage of total expenses (0-100) |

**Note:** Categories are sorted by amount (highest to lowest)

### Recent Transactions

Returns the last 4 transactions for the specified month, ordered by date (most recent first).

Each transaction includes:
- Full transaction details
- Associated category information
- Transaction type (income/expense)
- Source (csv_import/manual)
- Recurring status

---

## Example Requests

### JavaScript/Fetch

```javascript
async function getDashboard(month, year) {
  const response = await fetch(
    `http://localhost:8000/api/v1/transactions/dashboard/summary?month=${month}&year=${year}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return await response.json();
}

// Get current month dashboard
const now = new Date();
const dashboard = await getDashboard(now.getMonth() + 1, now.getFullYear());

console.log('Total Income:', dashboard.total_income);
console.log('Total Expenses:', dashboard.total_expenses);
console.log('Net Balance:', dashboard.net_balance);
console.log('Top Category:', dashboard.spending_by_category[0]);
```

### cURL

```bash
# Get dashboard for November 2024
curl -X GET "http://localhost:8000/api/v1/transactions/dashboard/summary?month=11&year=2024" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Use Cases

### 1. Display Monthly Summary Cards

```javascript
const dashboard = await getDashboard(11, 2024);

// Display summary cards
document.getElementById('total-income').textContent = `$${dashboard.total_income}`;
document.getElementById('total-expenses').textContent = `$${dashboard.total_expenses}`;
document.getElementById('recurring-expenses').textContent = `$${dashboard.recurring_expenses}`;
document.getElementById('instant-expenses').textContent = `$${dashboard.instant_expenses}`;
document.getElementById('net-balance').textContent = `$${dashboard.net_balance}`;
```

### 2. Render Category Spending Chart

```javascript
const dashboard = await getDashboard(11, 2024);

// Prepare data for pie/donut chart
const chartData = dashboard.spending_by_category.map(cat => ({
  label: cat.category_name,
  value: parseFloat(cat.total_amount),
  percentage: cat.percentage,
  color: cat.category_color,
  icon: cat.category_icon
}));

// Use with Chart.js, Recharts, or any charting library
renderPieChart(chartData);
```

### 3. Display Recent Transactions

```javascript
const dashboard = await getDashboard(11, 2024);

// Render recent transactions list
dashboard.recent_transactions.forEach(trans => {
  const listItem = `
    <div class="transaction-item">
      <span class="icon">${trans.category.icon}</span>
      <div class="details">
        <h4>${trans.service}</h4>
        <p>${trans.category.name} • ${trans.date}</p>
      </div>
      <span class="amount ${trans.type}">
        ${trans.type === 'income' ? '+' : '-'}$${Math.abs(trans.amount)}
      </span>
    </div>
  `;
  transactionsList.innerHTML += listItem;
});
```

### 4. Month/Year Selector

```javascript
// Handle month/year change
async function handlePeriodChange(month, year) {
  try {
    const dashboard = await getDashboard(month, year);
    updateDashboardUI(dashboard);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Example: Load current month on page load
const now = new Date();
handlePeriodChange(now.getMonth() + 1, now.getFullYear());
```

---

## Complete Integration Example

```javascript
class DashboardService {
  constructor(baseURL, getToken) {
    this.baseURL = baseURL;
    this.getToken = getToken;
  }

  async getDashboard(month, year) {
    const response = await fetch(
      `${this.baseURL}/transactions/dashboard/summary?month=${month}&year=${year}`,
      {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  }

  async getCurrentMonthDashboard() {
    const now = new Date();
    return this.getDashboard(now.getMonth() + 1, now.getFullYear());
  }

  async getPreviousMonthDashboard() {
    const now = new Date();
    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return this.getDashboard(prevMonth, year);
  }
}

// Usage
const dashboardService = new DashboardService(
  'http://localhost:8000/api/v1',
  () => localStorage.getItem('access_token')
);

// Load current month
const currentDashboard = await dashboardService.getCurrentMonthDashboard();

// Display summary
console.log(`
  Period: ${currentDashboard.month}/${currentDashboard.year}
  Income: $${currentDashboard.total_income}
  Expenses: $${currentDashboard.total_expenses}
  Net Balance: $${currentDashboard.net_balance}
  
  Top Spending Categories:
  ${currentDashboard.spending_by_category.slice(0, 3).map(cat => 
    `  ${cat.category_icon} ${cat.category_name}: $${cat.total_amount} (${cat.percentage}%)`
  ).join('\n')}
  
  Recent Transactions: ${currentDashboard.recent_transactions.length}
`);
```

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Invalid month or year parameter |
| 401 | Unauthorized (missing/invalid token) |
| 500 | Internal server error |

**Example Error Response:**
```json
{
  "detail": "An error occurred while retrieving dashboard data"
}
```

---

## Data Calculations

### Total Income
Sum of all transactions where `type = "income"` for the specified month.

### Total Expenses
Sum of all transactions where `type = "expense"` for the specified month.

### Instant Expenses
Sum of all expense transactions where `is_recurring = false`.

### Recurring Expenses
Sum of all expense transactions where `is_recurring = true`.

### Net Balance
```
net_balance = total_income - total_expenses
```

### Category Percentage
```
percentage = (category_amount / total_expenses) * 100
```

### Recent Transactions
Last 4 transactions ordered by date (descending).

---

## Notes

- All amounts are returned as positive numbers (absolute values)
- Percentages are rounded to 2 decimal places
- Categories with $0 spending are not included in `spending_by_category`
- If no transactions exist for the month, all totals will be 0
- Recent transactions list may contain fewer than 4 items if not enough transactions exist
- Categories are sorted by spending amount (highest first)

---

## Testing

```bash
# Test with current month
MONTH=$(date +%-m)
YEAR=$(date +%Y)

curl -X GET "http://localhost:8000/api/v1/transactions/dashboard/summary?month=$MONTH&year=$YEAR" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq '.'

# Test with specific month
curl -X GET "http://localhost:8000/api/v1/transactions/dashboard/summary?month=11&year=2024" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq '.spending_by_category[] | {name: .category_name, amount: .total_amount, percentage: .percentage}'
```
