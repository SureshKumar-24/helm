# Installation Instructions

## Step 1: Install Dependencies

Run the following command to install all required dependencies including Prisma:

```bash
npm install @prisma/client
npm install -D prisma ts-node @types/node
```

## Step 2: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "postinstall": "prisma generate"
  }
}
```

## Step 3: Set Up Database

Follow the instructions in [DATABASE_SETUP.md](./DATABASE_SETUP.md) to:

1. Install PostgreSQL
2. Create the database
3. Configure environment variables
4. Run migrations
5. Seed sample data

Quick setup:

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Edit .env and set your DATABASE_URL
# DATABASE_URL="postgresql://user:password@localhost:5432/financial_helm"

# 3. Generate Prisma Client
npm run db:generate

# 4. Create and run migrations
npm run db:migrate

# 5. Seed sample data (optional)
npm run db:seed

# 6. Open Prisma Studio to view data
npm run db:studio
```

## Step 4: Verify Installation

1. Check that Prisma Client is generated:
   ```bash
   ls node_modules/.prisma/client
   ```

2. Verify database connection:
   ```bash
   npm run db:studio
   ```
   This should open Prisma Studio in your browser at http://localhost:5555

3. Check that tables are created:
   - Open Prisma Studio
   - You should see: users, categories, transactions, weekly_budgets, carryovers, achievements

## Step 5: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your application.

## Troubleshooting

### "Cannot find module '@prisma/client'"

Run:
```bash
npm run db:generate
```

### "Error: P1001: Can't reach database server"

1. Check if PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Test connection: `psql -d financial_helm`

### Migration errors

Reset and try again:
```bash
npm run db:reset
npm run db:migrate
```

### Seed script errors

Make sure ts-node is installed:
```bash
npm install -D ts-node @types/node
```

## Next Steps

After installation is complete:

1. ✅ Database schema is set up
2. ⏭️ Next: Implement CSV upload functionality (Task 2)
3. ⏭️ Then: Build category management (Task 3)
4. ⏭️ Then: Create budget calculation engine (Task 4)

See [tasks.md](./.kiro/specs/smart-weekly-budget-coach/tasks.md) for the full implementation plan.
