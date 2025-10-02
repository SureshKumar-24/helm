# 🎯 Financial Helm

**Guiding Your Personal Finances**

A modern, intuitive personal finance management application built with Next.js, React, and Tailwind CSS. Financial Helm helps you track expenses, manage budgets, and achieve your financial goals with confidence.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### MVP (Current Version)
- 📊 **Smart Dashboard** - Complete financial overview with intuitive charts
- 💰 **Transaction Tracking** - Easy income and expense management
- 🎯 **Budget Management** - Set and monitor spending limits by category
- 📈 **Financial Goals** - Track progress toward your savings targets
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔒 **Privacy First** - All data stored locally (for MVP)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd helm
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
helm/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── transactions/       # Transaction management
│   │   ├── budgets/            # Budget tracking
│   │   ├── goals/              # Financial goals
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   └── Navigation.tsx      # Main navigation component
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── public/                     # Static assets
├── PROJECT_REQUIREMENTS.md     # Detailed project requirements
├── DESIGN_SYSTEM.md           # Design system documentation
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary (Navy Blue)**: `#0A3D62` - Trust & stability
- **Success (Green)**: `#22C55E` - Income & positive growth
- **Danger (Red)**: `#EF4444` - Expenses & warnings
- **Info (Blue)**: `#3B82F6` - Information
- **Warning (Amber)**: `#F59E0B` - Approaching limits

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive, mobile-first approach
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete design guidelines.

## 📖 Documentation

- **[PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md)** - Complete MVP requirements and roadmap
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design guidelines and component library

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Linting**: ESLint with Next.js config

## 📱 Key Pages

### 🏠 Homepage (`/`)
- Hero section with value proposition
- Feature showcase
- Call-to-action buttons

### 📊 Dashboard (`/dashboard`)
- Financial summary cards (balance, income, expenses, savings rate)
- Spending by category visualization
- Recent transactions
- Quick action buttons

### 💳 Transactions (`/transactions`)
- Transaction list with filtering
- Add/Edit/Delete transactions
- Search functionality
- Category breakdown

### 💰 Budgets (`/budgets`)
- Budget overview and progress
- Category-wise budget tracking
- Visual progress bars with warnings
- Budget tips and suggestions

### 🎯 Goals (`/goals`)
- Savings goal tracking
- Progress visualization
- Target dates and suggestions
- Goal achievement tips

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Consistent component patterns
- Mobile-first responsive design

## 🚧 Future Enhancements

### Phase 2
- [ ] Bank account integration (Plaid API)
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Data export (CSV/PDF)
- [ ] Dark mode

### Phase 3
- [ ] Multi-currency support
- [ ] Family/team sharing
- [ ] AI-powered insights
- [ ] Investment tracking
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

Financial Helm - Guiding Your Personal Finances

## 🙏 Acknowledgments

- Inspired by Mint, YNAB, and Monarch Money
- Built with modern web technologies
- Designed for simplicity and usability

---

**Made with ❤️ for better financial management**

For questions or support, please open an issue or contact the team.
# helm
