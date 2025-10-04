# Database Setup Guide

## Prerequisites

1. Install PostgreSQL on your system:
   - **macOS**: `brew install postgresql@15`
   - **Ubuntu**: `sudo apt-get install postgresql`
   - **Windows**: Download from https://www.postgresql.org/download/

2. Start PostgreSQL service:
   - **macOS**: `brew services start postgresql@15`
   - **Ubuntu**: `sudo service postgresql start`
   - **Windows**: PostgreSQL service starts automatically

## Setup Steps

### 1. Install Prisma Dependencies

```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE financial_helm;

# Create user (optional)
CREATE USER helm_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE financial_helm TO helm_user;

# Exit psql
\q
```

### 3. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update DATABASE_URL
# Example: DATABASE_URL="postgresql://helm_user:your_password@localhost:5432/financial_helm?schema=public"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Create and Run Migrations

```bash
# Create initial migration
npx prisma migrate dev --name init

# This will:
# - Create the migration files
# - Apply the migration to your database
# - Generate the Prisma Client
```

### 6. Verify Setup

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

## Database Schema Overview

The schema includes 6 main tables:

1. **users** - User accounts and preferences
2. **categories** - Spending categories (Food, Transport, etc.)
3. **transactions** - All financial transactions
4. **weekly_budgets** - Weekly budget limits and spending
5. **carryovers** - Week-to-week carryover tracking
6. **achievements** - User achievements and streaks

## Useful Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## Seed Data (Optional)

To add sample data for development:

```bash
# Create seed script
npm run seed
```

## Troubleshooting

### Connection Issues

If you can't connect to PostgreSQL:

1. Check if PostgreSQL is running:
   ```bash
   # macOS/Linux
   ps aux | grep postgres
   
   # Or check service status
   brew services list  # macOS
   sudo service postgresql status  # Ubuntu
   ```

2. Verify DATABASE_URL in .env file

3. Check PostgreSQL logs:
   ```bash
   # macOS
   tail -f /usr/local/var/log/postgres.log
   
   # Ubuntu
   sudo tail -f /var/log/postgresql/postgresql-15-main.log
   ```

### Migration Issues

If migrations fail:

1. Check database connection
2. Verify schema syntax: `npx prisma validate`
3. Reset and try again: `npx prisma migrate reset`

### Permission Issues

If you get permission errors:

```sql
-- Connect to database
psql financial_helm

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO helm_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO helm_user;
```

## Next Steps

After database setup is complete:

1. Create Prisma client instance in `src/lib/prisma.ts`
2. Build database services (BudgetCalculationService, etc.)
3. Create API routes for data access
4. Test with sample data

## Production Considerations

For production deployment:

1. Use connection pooling (PgBouncer)
2. Enable SSL for database connections
3. Set up automated backups
4. Use environment-specific databases
5. Implement database monitoring
6. Consider read replicas for scaling
