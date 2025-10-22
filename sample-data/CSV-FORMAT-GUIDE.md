# CSV Format Guide

Simple guide for importing transactions via CSV.

## Standard Format (Comma-separated)

```csv
Date,Description,Amount
2024-01-15,Monthly Salary,5000.00
2024-01-15,Rent Payment,-1200.00
2024-01-16,Grocery Store,-85.50
```

**Rules:**
- First row = headers
- Comma (`,`) separator
- Dates: `YYYY-MM-DD`, `DD/MM/YYYY`, or `MM/DD/YYYY`
- Negative amounts = expenses
- Positive amounts = income

## Examples

```csv
Date,Description,Amount
2025-04-01,Monthly Salary Deposit,5000.00
2025-04-01,Rent Payment,-1200.00
2025-04-02,Whole Foods Market,-127.45
2025-04-03,Shell Gas Station,-52.30
2025-04-04,Netflix Subscription,-15.99
2025-04-05,Amazon Purchase,-89.99
2025-04-06,Uber Ride,-35.20
2025-04-07,CVS Pharmacy,-42.80
2025-04-08,Electric Bill,-125.00
2025-04-10,Spotify Premium,-10.99
```

That's it! Just upload your CSV file with this format.
