# Development Guide - Financial Helm

## 🎯 Getting Started for Developers

This guide will help you understand the codebase, set up your development environment, and start contributing to Financial Helm.

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Setup & Installation](#setup--installation)
3. [Architecture](#architecture)
4. [Component Guide](#component-guide)
5. [Data Flow](#data-flow)
6. [Styling Guidelines](#styling-guidelines)
7. [Best Practices](#best-practices)
8. [Common Tasks](#common-tasks)

---

## Project Overview

Financial Helm is a personal finance management application built with:
- **Next.js 15** (App Router)
- **React 19** (Server & Client Components)
- **TypeScript 5** (Type safety)
- **Tailwind CSS 4** (Styling)

### MVP Scope
The current MVP includes:
- Dashboard with financial overview
- Transaction management (CRUD)
- Budget tracking by category
- Financial goal setting and tracking
- Responsive, mobile-first design

---

## Setup & Installation

### Prerequisites
```bash
node --version  # Should be 20.x or higher
npm --version   # Should be 10.x or higher
```

### Installation Steps
```bash
# 1. Clone the repository
git clone <repository-url>
cd helm

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### Environment Setup
No environment variables needed for MVP (uses local storage).

---

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/          # Dashboard feature
│   ├── transactions/       # Transactions feature
│   ├── budgets/           # Budgets feature
│   ├── goals/             # Goals feature
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── Navigation.tsx     # App navigation
└── types/
    └── index.ts           # TypeScript types
```

### Key Concepts

#### App Router
- File-based routing in `src/app/`
- `page.tsx` = route component
- `layout.tsx` = shared layout
- Automatic code splitting

#### Client vs Server Components
```tsx
// Server Component (default)
export default function Page() {
  return <div>Server rendered</div>
}

// Client Component (interactive)
'use client';
export default function Interactive() {
  const [state, setState] = useState();
  return <button onClick={...}>Click me</button>
}
```

---

## Component Guide

### UI Components (`src/components/ui/`)

#### Button Component
```tsx
import Button from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- All standard button HTML attributes

#### Card Component
```tsx
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

<Card hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Navigation Component
- Responsive navigation bar
- Mobile menu with hamburger
- Active link highlighting
- Sticky positioning

---

## Data Flow

### Current (MVP) - Local State
```
Component State → Local Storage (Future)
     ↓
   useState
     ↓
   Render UI
```

### Type Definitions (`src/types/index.ts`)

#### Transaction
```tsx
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: 'income' | 'expense';
  notes?: string;
}
```

#### Budget
```tsx
interface Budget {
  id: string;
  category: Category;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}
```

#### FinancialGoal
```tsx
interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}
```

---

## Styling Guidelines

### Tailwind CSS Usage

#### Color Classes
```tsx
// Primary (Navy Blue)
className="bg-[#0A3D62] text-white"

// Success (Green)
className="bg-[#22C55E] text-white"

// Danger (Red)
className="bg-[#EF4444] text-white"

// Gray scales
className="bg-gray-50 text-gray-900"
```

#### Responsive Design
```tsx
// Mobile first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>
```

#### Common Patterns
```tsx
// Card container
className="bg-white rounded-xl shadow-md p-6"

// Button
className="px-6 py-2.5 rounded-lg font-medium transition-all"

// Hover effect
className="hover:bg-[#083048] hover:shadow-lg transition"

// Flexbox centering
className="flex items-center justify-center"

// Grid layout
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
```

---

## Best Practices

### TypeScript
```tsx
// ✅ DO: Define prop types
interface Props {
  title: string;
  count: number;
}

// ✅ DO: Use type imports
import type { Transaction } from '@/types';

// ❌ DON'T: Use 'any'
const data: any = fetchData(); // Bad!
```

### React Components
```tsx
// ✅ DO: Functional components
export default function Component() {
  return <div>...</div>
}

// ✅ DO: Use hooks at top level
function Component() {
  const [state, setState] = useState();
  useEffect(() => {}, []);
  return <div>...</div>
}

// ❌ DON'T: Define components inside components
function Parent() {
  function Child() { return <div>...</div> } // Bad!
}
```

### File Organization
```tsx
// ✅ DO: One component per file
// Button.tsx
export default function Button() { ... }

// ✅ DO: Group related exports
// Card.tsx
export default function Card() { ... }
export function CardHeader() { ... }
export function CardTitle() { ... }
```

---

## Common Tasks

### Adding a New Page

1. Create folder in `src/app/`
```bash
mkdir src/app/new-feature
```

2. Create `page.tsx`
```tsx
// src/app/new-feature/page.tsx
export default function NewFeature() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1>New Feature</h1>
      </div>
    </div>
  );
}
```

3. Add navigation link
```tsx
// src/components/Navigation.tsx
<Link href="/new-feature">New Feature</Link>
```

### Creating a Reusable Component

1. Create component file
```tsx
// src/components/ui/NewComponent.tsx
interface Props {
  title: string;
}

export default function NewComponent({ title }: Props) {
  return <div className="...">{title}</div>
}
```

2. Use the component
```tsx
import NewComponent from '@/components/ui/NewComponent';

<NewComponent title="Hello" />
```

### Adding New Data Type

1. Define type in `src/types/index.ts`
```tsx
export interface NewType {
  id: string;
  name: string;
  // ... other fields
}
```

2. Use in components
```tsx
import type { NewType } from '@/types';

const [data, setData] = useState<NewType[]>([]);
```

### Formatting Currency
```tsx
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Usage
<p>{formatCurrency(1234.56)}</p> // $1,234.56
```

### Formatting Dates
```tsx
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Usage
<p>{formatDate('2025-10-01')}</p> // Oct 1, 2025
```

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS, Android)
- [ ] Test all interactive elements
- [ ] Check responsive breakpoints
- [ ] Verify form validations
- [ ] Test navigation flow

### Future: Automated Testing
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright

---

## Debugging Tips

### React DevTools
Install React DevTools browser extension for:
- Component tree inspection
- Props and state debugging
- Performance profiling

### Common Issues

**Issue: Hydration errors**
```
Error: Hydration failed
```
Solution: Ensure server and client render the same content. Use `'use client'` for interactive components.

**Issue: Module not found**
```
Module not found: Can't resolve '@/components/...'
```
Solution: Check `tsconfig.json` has correct path alias. Restart dev server.

**Issue: Tailwind classes not working**
Solution: 
- Check `tailwind.config.js` content paths
- Restart dev server
- Ensure class names are complete strings

---

## Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={100}
  priority // For above-fold images
/>
```

### Code Splitting
Next.js automatically splits code by route. For additional splitting:
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

### Lazy Loading
```tsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./Component'));

<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deployment Platforms
- **Vercel** (Recommended): Zero-config deployment
- **Netlify**: Alternative with good Next.js support
- **AWS/GCP/Azure**: For custom infrastructure

---

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation
- `refactor/what-changed` - Code refactoring

### Commit Messages
```
feat: Add transaction filtering
fix: Resolve mobile menu issue
docs: Update README
style: Format code with prettier
refactor: Extract currency formatter
```

---

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Learning Resources
- [Next.js Learn](https://nextjs.org/learn)
- [React Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)

---

**Happy Coding! 🚀**

For questions, please open an issue or contact the development team.




