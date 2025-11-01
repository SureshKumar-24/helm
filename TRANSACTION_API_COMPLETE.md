# Complete Transaction API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All endpoints require JWT Bearer token authentication.

**Header Format:**
```
Authorization: Bearer <access_token>
```

---

## Complete CRUD Operations

### 1. CREATE - Import Transactions from CSV

Upload a CSV file to bulk import transactions.

**Endpoint:** `POST /transactions/import`

**Content-Type:** `multipart/form-data`

**Rate Limit:** 10 requests per hour

**Request:**
- `file`: CSV file (max 10MB)
- `type`: `instant` or `recurring`

**Response (200 OK):**
```json
{
  "success": true,
  "imported_count": 10,
  "failed_count": 0,
  "transactions": [...],
  "errors": []
}
```

---

### 2. CREATE - Add Single Transaction Manually

Create one transaction manually.

**Endpoint:** `POST /transactions`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| service_name | String | Yes | Service description |
| amount | Float | Yes | Amount (negative=expense, positive=income) |
| date | Date | Yes | Transaction date (YYYY-MM-DD) |
| category_id | UUID | No | Category ID (auto-assigned if omitted) |
| is_recurring | Boolean | No | Recurring transaction (default: false) |
| frequency | String | No | daily/weekly/monthly/yearly |
| start_date | Date | No | Start date for recurring |
| notes | String | No | Additional notes |

**Example - Instant Expense:**
```javascript
const formData = new FormData();
formData.append('service_name', 'Grocery Shopping');
formData.append('amount', '-125.50');
formData.append('date', '2024-11-15');

const response = await fetch('http://localhost:8000/api/v1/transactions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

**Example - Recurring Subscription:**
```javascript
const formData = new FormData();
formData.append('service_name', 'Netflix Subscription');
formData.append('amount', '-15.99');
formData.append('date', '2024-11-01');
formData.append('is_recurring', 'true');
formData.append('frequency', 'monthly');
formData.append('start_date', '2024-11-01');

const response = await fetch('http://localhost:8000/api/v1/transactions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "service": "Netflix Subscription",
  "amount": -15.99,
  "type": "expense",
  "date": "2024-11-01",
  "source": "manual",
  "is_recurring": true,
  "frequency": "monthly",
  "start_date": "2024-11-01",
  "category": {
    "id": "uuid",
    "name": "Video Streaming",
    "icon": "📺",
    "color": "#EF4444"
  },
  "created_at": "2024-11-15T10:00:00Z"
}
```

---

### 3. READ - Get All Transactions

Retrieve user's transactions with filters.

**Endpoint:** `GET /transactions`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| start_date | Date | Filter by start date |
| end_date | Date | Filter by end date |
| category_id | UUID | Filter by category |
| type | String | Filter by income/expense |
| is_recurring | Boolean | Filter by recurring status |
| limit | Integer | Max results (default: 100, max: 1000) |
| offset | Integer | Skip results (default: 0) |

**Example:**
```javascript
const params = new URLSearchParams({
  start_date: '2024-11-01',
  end_date: '2024-11-30',
  type: 'expense',
  limit: 50
});

const response = await fetch(`http://localhost:8000/api/v1/transactions?${params}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const transactions = await response.json();
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "service": "Netflix",
    "amount": -15.99,
    "type": "expense",
    "date": "2024-11-01",
    "is_recurring": true,
    "frequency": "monthly",
    "category": {
      "name": "Video Streaming",
      "icon": "📺"
    }
  }
]
```

---

### 4. READ - Get Single Transaction

Get one transaction by ID.

**Endpoint:** `GET /transactions/{transaction_id}`

**Example:**
```javascript
const id = '123e4567-e89b-12d3-a456-426614174000';

const response = await fetch(`http://localhost:8000/api/v1/transactions/${id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const transaction = await response.json();
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "service": "Netflix",
  "amount": -15.99,
  "type": "expense",
  "date": "2024-11-01",
  "category": {...}
}
```

---

### 5. UPDATE - Edit Transaction

Update an existing transaction.

**Endpoint:** `PUT /transactions/{transaction_id}`

**Content-Type:** `multipart/form-data`

**Request Parameters (all optional):**

| Parameter | Type | Description |
|-----------|------|-------------|
| service_name | String | New service description |
| amount | Float | New amount |
| date | Date | New date |
| category_id | UUID | New category |
| is_recurring | Boolean | New recurring status |
| frequency | String | New frequency |
| start_date | Date | New start date |
| notes | String | New notes |

**Example - Update Amount:**
```javascript
const id = '123e4567-e89b-12d3-a456-426614174000';
const formData = new FormData();
formData.append('amount', '-19.99');  // Update Netflix price

const response = await fetch(`http://localhost:8000/api/v1/transactions/${id}`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const updated = await response.json();
```

**Example - Update Multiple Fields:**
```javascript
const formData = new FormData();
formData.append('service_name', 'Netflix Premium');
formData.append('amount', '-19.99');
formData.append('category_id', 'new-category-uuid');
formData.append('notes', 'Upgraded to premium plan');

const response = await fetch(`http://localhost:8000/api/v1/transactions/${id}`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "service": "Netflix Premium",
  "amount": -19.99,
  "type": "expense",
  "date": "2024-11-01",
  "notes": "Upgraded to premium plan",
  "category": {...}
}
```

---

### 6. DELETE - Remove Transaction

Delete a transaction.

**Endpoint:** `DELETE /transactions/{transaction_id}`

**Example:**
```javascript
const id = '123e4567-e89b-12d3-a456-426614174000';

const response = await fetch(`http://localhost:8000/api/v1/transactions/${id}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});

if (response.status === 204) {
  console.log('Transaction deleted successfully');
}
```

**Response (204 No Content):**
```
No content returned
```

---

### 7. READ - Get All Categories

Get list of all available categories.

**Endpoint:** `GET /transactions/categories/all`

**Example:**
```javascript
const response = await fetch('http://localhost:8000/api/v1/transactions/categories/all', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const categories = await response.json();
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Entertainment",
    "description": "Movies, cinema, theater, concerts, games",
    "icon": "🎬",
    "color": "#F59E0B"
  },
  {
    "id": "uuid",
    "name": "Video Streaming",
    "description": "Video streaming platforms",
    "icon": "📺",
    "color": "#EF4444"
  }
]
```

---

## Complete Integration Example

```javascript
class TransactionService {
  constructor(baseURL, getToken) {
    this.baseURL = baseURL;
    this.getToken = getToken;
  }

  // CREATE - Manual entry
  async createTransaction(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(`${this.baseURL}/transactions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  }

  // CREATE - CSV Import
  async importCSV(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${this.baseURL}/transactions/import`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  }

  // READ - List all
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    const response = await fetch(`${this.baseURL}/transactions?${params}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  }

  // READ - Get one
  async getTransaction(id) {
    const response = await fetch(`${this.baseURL}/transactions/${id}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  }

  // UPDATE
  async updateTransaction(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(`${this.baseURL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  }

  // DELETE
  async deleteTransaction(id) {
    const response = await fetch(`${this.baseURL}/transactions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });

    if (!response.ok) throw new Error(await response.text());
    return response.status === 204;
  }

  // Get categories
  async getCategories() {
    const response = await fetch(`${this.baseURL}/transactions/categories/all`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  }
}

// Usage Example
const service = new TransactionService('http://localhost:8000/api/v1', () => accessToken);

// Create instant expense
await service.createTransaction({
  service_name: 'Grocery Shopping',
  amount: -125.50,
  date: '2024-11-15'
});

// Create recurring subscription
await service.createTransaction({
  service_name: 'Netflix',
  amount: -15.99,
  date: '2024-11-01',
  is_recurring: true,
  frequency: 'monthly',
  start_date: '2024-11-01'
});

// Get all expenses for November
const expenses = await service.getTransactions({
  start_date: '2024-11-01',
  end_date: '2024-11-30',
  type: 'expense'
});

// Update transaction
await service.updateTransaction(transactionId, {
  amount: -19.99,
  notes: 'Price increased'
});

// Delete transaction
await service.deleteTransaction(transactionId);

// Import CSV
await service.importCSV(fileInput.files[0], 'instant');
```

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 207 | Multi-Status (partial CSV import success) |
| 400 | Bad Request (invalid data) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

---

## Data Validation Rules

### Amount
- Range: -10,000.00 to +10,000.00
- Negative = expense
- Positive = income

### Date
- Format: YYYY-MM-DD
- Range: 1900-01-01 to 2100-12-31

### Frequency
- Values: daily, weekly, monthly, yearly
- Case-insensitive
- Required only for recurring transactions

### Service Name
- Min length: 1 character
- Max length: 255 characters

---

## Available Categories

1. **Entertainment** 🎬 - Movies, cinema, theater, concerts, games
2. **Music** 🎵 - Music streaming services
3. **Video Streaming** 📺 - Netflix, Disney+, Hulu, etc.
4. **Software/Cloud** 💻 - Adobe, Microsoft, Dropbox, GitHub
5. **Communications** 📱 - Phone, mobile, internet services
6. **Utilities** ⚡ - Electric, water, gas bills
7. **Travel/Transport** ✈️ - Uber, Lyft, flights, hotels
8. **Groceries** 🛒 - Supermarkets, grocery shopping
9. **Health/Wellness** 💪 - Gym, fitness, medical expenses
10. **Miscellaneous** 📦 - Other expenses

---

## Testing with cURL

```bash
# Create transaction
curl -X POST "http://localhost:8000/api/v1/transactions" \
  -H "Authorization: Bearer TOKEN" \
  -F "service_name=Netflix" \
  -F "amount=-15.99" \
  -F "date=2024-11-01" \
  -F "is_recurring=true" \
  -F "frequency=monthly"

# Get all transactions
curl -X GET "http://localhost:8000/api/v1/transactions?type=expense&limit=50" \
  -H "Authorization: Bearer TOKEN"

# Update transaction
curl -X PUT "http://localhost:8000/api/v1/transactions/TRANSACTION_ID" \
  -H "Authorization: Bearer TOKEN" \
  -F "amount=-19.99"

# Delete transaction
curl -X DELETE "http://localhost:8000/api/v1/transactions/TRANSACTION_ID" \
  -H "Authorization: Bearer TOKEN"

# Import CSV
curl -X POST "http://localhost:8000/api/v1/transactions/import" \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@transactions.csv" \
  -F "type=instant"
```
