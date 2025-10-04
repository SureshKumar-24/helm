# Financial Helm

An AI-powered personal finance management platform that helps users manage their budgets with empathy and intelligence.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set your DATABASE_URL

# Set up database
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed  # Optional: adds sample data

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📚 Documentation

- **[PROGRESS.md](./PROGRESS.md)** - Current implementation progress and completed tasks
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Detailed database setup guide
- **[INSTALLATION.md](./INSTALLATION.md)** - Step-by-step installation instructions
- **[.kiro/specs/smart-weekly-budget-coach/](./.kiro/specs/smart-weekly-budget-coach/)** - Feature specifications

## ✨ Features

### Implemented (Beta v0.2)

- ✅ **Database Schema** - PostgreSQL with Prisma ORM
- ✅ **CSV Upload** - Import transactions from bank CSV files (4 formats supported)
- ✅ **Transaction Management** - Full CRUD operations with API
- ✅ **Category Management** - Advanced categorization with 100+ keywords
- ✅ **Auto-Categorization** - Intelligent keyword-based suggestions with scoring
- ✅ **Duplicate Detection** - Prevents duplicate transaction imports
- ✅ **Category Statistics** - Track spending by category with date filtering

### In Development

- 🚧 **Smart Weekly Budget Coach** - AI-powered weekly spending limits
- 🚧 **Category Management** - Advanced categorization with ML
- 🚧 **Budget Calculation Engine** - Real-time budget tracking
- 🚧 **Weekly Motivational Check** - Empathetic progress updates
- 🚧 **Major Expense Forecasts** - Predict upcoming large expenses

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **UI Components**: Custom component library
- **Icons**: Lucide React, React Icons

## 📁 Project Structure

```
financial-helm/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard page
│   │   ├── budgets/      # Budgets page
│   │   ├── goals/        # Goals page
│   │   └── transactions/ # Transactions page
│   ├── components/       # React components
│   │   └── ui/           # UI components
│   ├── services/         # Business logic services
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript type definitions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── .kiro/
│   └── specs/            # Feature specifications
└── public/               # Static assets
```

## 🧪 Testing

### Test CSV Upload

Use the provided `sample-transactions.csv`:

```bash
# Navigate to dashboard
open http://localhost:3000/dashboard

# Click "Upload CSV" button
# Upload sample-transactions.csv
# Review and confirm import
```

### View Database

```bash
# Open Prisma Studio
npx prisma studio
```

## 📊 Database Schema

- **users** - User accounts and preferences
- **categories** - Spending categories
- **transactions** - Financial transactions
- **weekly_budgets** - Weekly budget limits and spending
- **carryovers** - Week-to-week carryover tracking
- **achievements** - User achievements and streaks

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database (WARNING: deletes all data)
```

## 🤝 Contributing

This project is currently in active development. See [PROGRESS.md](./PROGRESS.md) for current status and next tasks.

## 📝 License

Private project - All rights reserved

## 🎯 Roadmap

See [.kiro/specs/smart-weekly-budget-coach/tasks.md](./.kiro/specs/smart-weekly-budget-coach/tasks.md) for detailed implementation plan.

**Current Progress**: 20% complete (3/18 tasks)
- ✅ Task 1: Database schema
- ✅ Task 2: CSV upload
- ✅ Task 3: Category management
- 🚧 Task 4: Budget calculation engine (Next)

---

Built with ❤️ using Next.js and Prisma
