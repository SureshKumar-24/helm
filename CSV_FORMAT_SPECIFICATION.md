# CSV Import Format Specification

## Overview
This document defines the CSV format for importing financial transactions into the Financial Helm application. The system supports two types of expenses: Instant (one-time) and Recurring (subscription-based).

---

## Categories

The system uses 10 predefined categories for automatic classification:

1. **Entertainment** - Movies, cinema, theater, concerts, games
2. **Music** - Spotify, Apple Music, music streaming services
3. **Video Streaming** - Netflix, Disney+, Hulu, HBO, Prime Video
4. **Software/Cloud** - Adobe, Microsoft, Dropbox, GitHub, cloud services
5. **Communications** - Phone, mobile, internet, Verizon, AT&T, T-Mobile
6. **Utilities** - Electric, water, gas, utility bills
7. **Travel/Transport** - Uber, Lyft, gas stations, flights, hotels, Airbnb
8. **Groceries** - Supermarkets, Whole Foods, Trader Joe's, Safeway
9. **Health/Wellness** - Gym, fitness, pharmacy, doctor, hospital
10. **Miscellaneous** - Any other expenses not fitting above categories

---

## CSV Format Types

### 1. Instant Expenses (One-Time Transactions)

**Format:**
```csv
service;amount;payment_date
```

**Fields:**
- `service` (string, required): Description of the service/transaction
- `amount` (decimal, required): Transaction amount (positive for income, negative for expense)
- `payment_date` (date, required): Date of the transaction

**Example File: `instant_expenses.csv`**
```csv
service;amount;payment_date
Netflix;15.99;2024-01-15
Grocery Shopping;-85.50;2024-01-16
Uber Ride;-25.00;2024-01-17
Salary;3000.00;2024-01-20
Movie Tickets;-45.00;2024-01-22
Gas Station;-60.00;2024-01-23
Pharmacy;-35.50;2024-01-25
Restaurant;-75.00;2024-01-28
Gym Day Pass;-15.00;2024-01-30
```

---

### 2. Recurring Expenses (Subscriptions)

**Format:**
```csv
service;amount;frequency;start_date
```

**Fields:**
- `service` (string, required): Name of the subscription service
- `amount` (decimal, required): Recurring amount per period
- `frequency` (enum, required): Billing frequency - `daily`, `weekly`, `monthly`, `yearly`
- `start_date` (date, required): Date when the subscription started

**Example File: `recurring_expenses.csv`**
```csv
service;amount;frequency;start_date
Spotify;9.99;monthly;2024-01-01
Netflix;15.99;monthly;2024-01-01
Adobe Creative Cloud;52.99;monthly;2024-01-01
Microsoft 365;6.99;monthly;2024-01-01
Dropbox;11.99;monthly;2024-01-01
AT&T Mobile;75.00;monthly;2024-01-01
Electric Bill;120.00;monthly;2024-01-01
Internet Service;59.99;monthly;2024-01-01
Gym Membership;49.99;monthly;2024-01-01
Amazon Prime;14.99;monthly;2024-01-01
```

---

## Data Validation Rules

### General Rules
1. **File Encoding**: UTF-8
2. **Separator**: Semicolon (`;`)
3. **Header Row**: First row must contain field names
4. **Line Ending**: LF (`\n`) or CRLF (`\r\n`)
5. **Maximum File Size**: 10MB
6. **Maximum Rows**: 10,000 transactions per file

### Field Validation

#### Service/Description
- **Type**: String
- **Min Length**: 1 character
- **Max Length**: 255 characters
- **Special Characters**: Allowed and handled automatically
- **Required**: Yes

#### Amount
- **Type**: Decimal (2 decimal places)
- **Format**: Use dot (`.`) as decimal separator
- **Range**: -10,000.00 to +10,000.00
- **Negative**: Represents expenses
- **Positive**: Represents income
- **Required**: Yes

#### Date Fields (payment_date, start_date)
- **Type**: Date
- **Supported Formats**:
  - `YYYY-MM-DD` (e.g., 2024-01-15)
  - `DD/MM/YYYY` (e.g., 15/01/2024)
- **Range**: 1900-01-01 to 2100-12-31
- **Required**: Yes

#### Frequency
- **Type**: Enum
- **Valid Values**: 
  - `daily` - Charged every day
  - `weekly` - Charged every week
  - `monthly` - Charged every month
  - `yearly` - Charged every year
- **Case**: Case-insensitive
- **Required**: Yes (only for recurring expenses)

---

## Backend API Specification

### Endpoint: Import Transactions

**POST** `/api/v1/transactions/import`

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer {access_token}
```

**Request Body:**
```
file: CSV file (multipart/form-data)
type: "instant" | "recurring"
user_id: string (UUID)
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "imported_count": 10,
  "failed_count": 0,
  "transactions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "service": "Netflix",
      "amount": 15.99,
      "type": "expense",
      "category": "Video Streaming",
      "date": "2024-01-15T00:00:00Z",
      "source": "csv_import",
      "created_at": "2024-01-30T10:00:00Z"
    }
  ],
  "errors": []
}
```

**Response (Partial Success - 207 Multi-Status):**
```json
{
  "success": true,
  "imported_count": 8,
  "failed_count": 2,
  "transactions": [...],
  "errors": [
    {
      "row": 3,
      "field": "amount",
      "message": "Amount exceeds maximum limit of 10,000"
    },
    {
      "row": 5,
      "field": "date",
      "message": "Invalid date format"
    }
  ]
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid file format",
  "details": "File must be a CSV with semicolon separator"
}
```

---

## Database Schema

### Table: `transactions`

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    service VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'csv_import',
    is_recurring BOOLEAN DEFAULT FALSE,
    frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_date (user_id, date),
    INDEX idx_category (category_id),
    INDEX idx_type (type),
    INDEX idx_recurring (is_recurring)
);
```

### Table: `categories`

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
);
```

### Default Categories Insert

```sql
INSERT INTO categories (name, description, icon, color) VALUES
('Entertainment', 'Movies, cinema, theater, concerts, games', '🎬', '#F59E0B'),
('Music', 'Music streaming services', '🎵', '#8B5CF6'),
('Video Streaming', 'Video streaming platforms', '📺', '#EF4444'),
('Software/Cloud', 'Software subscriptions and cloud services', '💻', '#3B82F6'),
('Communications', 'Phone, mobile, internet services', '📱', '#22C55E'),
('Utilities', 'Electric, water, gas bills', '⚡', '#0A3D62'),
('Travel/Transport', 'Transportation and travel expenses', '✈️', '#06B6D4'),
('Groceries', 'Supermarket and grocery shopping', '🛒', '#10B981'),
('Health/Wellness', 'Gym, fitness, medical expenses', '💪', '#EC4899'),
('Miscellaneous', 'Other expenses', '📦', '#6B7280');
```

---

## Backend Processing Flow

### 1. File Upload & Validation
```
1. Receive CSV file from frontend
2. Validate file size (max 10MB)
3. Validate file type (must be .csv)
4. Parse CSV with semicolon separator
5. Validate header row matches expected format
6. Check row count (max 10,000)
```

### 2. Data Parsing & Validation
```
For each row:
1. Parse fields based on type (instant vs recurring)
2. Validate required fields are present
3. Validate data types and formats
4. Validate amount range (-10,000 to +10,000)
5. Parse and validate date formats
6. Validate frequency enum (if recurring)
7. Collect validation errors
```

### 3. Category Assignment
```
For each transaction:
1. Extract service/description text
2. Convert to lowercase for matching
3. Check against category keywords:
   - Entertainment: movie, cinema, theater, concert, game
   - Music: spotify, apple music, music
   - Video Streaming: netflix, disney, hulu, hbo, prime video
   - Software/Cloud: adobe, microsoft, dropbox, github, cloud
   - Communications: phone, mobile, verizon, at&t, t-mobile, internet
   - Utilities: electric, water, gas, utility
   - Travel/Transport: uber, lyft, gas station, flight, hotel, airbnb
   - Groceries: grocery, supermarket, whole foods, trader joe, safeway
   - Health/Wellness: gym, fitness, pharmacy, doctor, hospital
4. Assign category_id or default to 'Miscellaneous'
```

### 4. Database Operations
```
1. Begin transaction
2. For each valid row:
   a. Check if category exists, create if needed
   b. Insert transaction record
   c. Set is_recurring flag based on type
   d. Set frequency and start_date for recurring
   e. Set source as 'csv_import'
3. Commit transaction
4. Return success/error response
```

### 5. Error Handling
```
- File validation errors: Return 400 Bad Request
- Partial import: Return 207 Multi-Status with details
- Database errors: Rollback and return 500 Internal Server Error
- Authentication errors: Return 401 Unauthorized
```

---

## Sample CSV Files

### instant_expenses_sample.csv
```csv
service;amount;payment_date
Netflix Subscription;-15.99;2024-01-15
Spotify Premium;-9.99;2024-01-15
Grocery Shopping at Whole Foods;-125.50;2024-01-16
Uber Ride to Airport;-45.00;2024-01-17
Monthly Salary;3500.00;2024-01-20
Movie Tickets - Avatar 2;-35.00;2024-01-22
Shell Gas Station;-65.00;2024-01-23
CVS Pharmacy - Prescription;-25.50;2024-01-25
Dinner at Italian Restaurant;-85.00;2024-01-28
LA Fitness Day Pass;-20.00;2024-01-30
```

### recurring_expenses_sample.csv
```csv
service;amount;frequency;start_date
Spotify Premium;9.99;monthly;2024-01-01
Netflix Standard;15.99;monthly;2024-01-01
Adobe Creative Cloud;52.99;monthly;2024-01-01
Microsoft 365 Family;9.99;monthly;2024-01-01
Dropbox Plus;11.99;monthly;2024-01-01
AT&T Wireless;75.00;monthly;2024-01-01
Southern California Edison;120.00;monthly;2024-01-01
Spectrum Internet;59.99;monthly;2024-01-01
24 Hour Fitness;49.99;monthly;2024-01-01
Amazon Prime;14.99;monthly;2024-01-01
```

---

## Testing Checklist

### File Validation
- [ ] Valid CSV with semicolon separator
- [ ] Invalid separator (comma, tab)
- [ ] Missing header row
- [ ] Empty file
- [ ] File size exceeds 10MB
- [ ] Non-CSV file type

### Data Validation
- [ ] Valid instant expense format
- [ ] Valid recurring expense format
- [ ] Missing required fields
- [ ] Invalid amount format
- [ ] Amount exceeds limits
- [ ] Invalid date format
- [ ] Invalid frequency value
- [ ] Special characters in service name

### Category Assignment
- [ ] Each category keyword correctly assigned
- [ ] Default to Miscellaneous for unknown
- [ ] Case-insensitive matching

### Database Operations
- [ ] Successful import of all rows
- [ ] Partial import with errors
- [ ] Duplicate detection
- [ ] Transaction rollback on error
- [ ] User isolation (only user's data)

### API Response
- [ ] Success response format
- [ ] Partial success with errors
- [ ] Error response format
- [ ] Proper HTTP status codes

---

## Security Considerations

1. **Authentication**: All requests must include valid JWT token
2. **Authorization**: Users can only import to their own account
3. **File Size Limit**: Prevent DoS attacks with 10MB limit
4. **Row Limit**: Prevent database overload with 10,000 row limit
5. **Input Sanitization**: Sanitize all text fields to prevent SQL injection
6. **Rate Limiting**: Limit imports to 10 per hour per user
7. **Virus Scanning**: Scan uploaded files for malware (optional)

---

## Performance Optimization

1. **Batch Insert**: Use batch insert for multiple transactions
2. **Indexing**: Proper indexes on user_id, date, category_id
3. **Async Processing**: Process large files asynchronously
4. **Caching**: Cache category mappings
5. **Connection Pooling**: Use database connection pooling

---

## Future Enhancements

1. Support for multiple currencies
2. Automatic duplicate detection
3. Smart category learning based on user corrections
4. Support for attachments (receipts)
5. Bulk edit capabilities
6. Export functionality
7. Scheduled recurring transaction generation
8. Email notifications for import completion

---

## Contact & Support

For questions or issues with CSV import:
- Backend API Documentation: `/api/docs`
- Support Email: support@financialhelm.com
- GitHub Issues: https://github.com/financialhelm/issues
