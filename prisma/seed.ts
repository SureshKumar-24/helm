import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@financialhelm.com' },
    update: {},
    create: {
      email: 'demo@financialhelm.com',
      name: 'Demo User',
      weekStartDay: 'monday',
      currency: 'USD',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create default categories
  const categories = [
    { name: 'Housing', emoji: '🏠', monthlyCeiling: 1500 },
    { name: 'Food & Dining', emoji: '🍽️', monthlyCeiling: 800 },
    { name: 'Transportation', emoji: '🚗', monthlyCeiling: 400 },
    { name: 'Entertainment', emoji: '🎬', monthlyCeiling: 300 },
    { name: 'Shopping', emoji: '🛍️', monthlyCeiling: 500 },
    { name: 'Healthcare', emoji: '⚕️', monthlyCeiling: 300 },
    { name: 'Utilities', emoji: '💡', monthlyCeiling: 200 },
    { name: 'Subscriptions', emoji: '📱', monthlyCeiling: 100 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: cat.name,
        },
      },
      update: {},
      create: {
        userId: user.id,
        name: cat.name,
        emoji: cat.emoji,
        monthlyCeiling: cat.monthlyCeiling,
        isActive: true,
        isCustom: false,
      },
    });
  }

  console.log('✅ Created default categories');

  // Create sample transactions for the past month
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const housingCategory = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Housing' },
  });

  const foodCategory = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Food & Dining' },
  });

  const transportCategory = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Transportation' },
  });

  const sampleTransactions = [
    // Income
    {
      userId: user.id,
      categoryId: null,
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      description: 'Salary Deposit',
      amount: 5000,
      type: 'income',
      notes: 'Monthly salary',
    },
    // Housing
    {
      userId: user.id,
      categoryId: housingCategory?.id,
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      description: 'Rent Payment',
      amount: 1200,
      type: 'expense',
    },
    // Food & Dining
    {
      userId: user.id,
      categoryId: foodCategory?.id,
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      description: 'Grocery Store',
      amount: 85.50,
      type: 'expense',
    },
    {
      userId: user.id,
      categoryId: foodCategory?.id,
      date: new Date(now.getFullYear(), now.getMonth(), 8),
      description: 'Restaurant Dinner',
      amount: 65.00,
      type: 'expense',
    },
    {
      userId: user.id,
      categoryId: foodCategory?.id,
      date: new Date(now.getFullYear(), now.getMonth(), 12),
      description: 'Coffee Shop',
      amount: 12.50,
      type: 'expense',
    },
    // Transportation
    {
      userId: user.id,
      categoryId: transportCategory?.id,
      date: new Date(now.getFullYear(), now.getMonth(), 3),
      description: 'Gas Station',
      amount: 45.00,
      type: 'expense',
    },
    {
      userId: user.id,
      categoryId: transportCategory?.id,
      date: new Date(now.getFullYear(), now.getMonth(), 10),
      description: 'Uber Ride',
      amount: 18.50,
      type: 'expense',
    },
  ];

  for (const transaction of sampleTransactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  console.log('✅ Created sample transactions');

  // Create initial weekly budget for current week
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);

  const allCategories = await prisma.category.findMany({
    where: { userId: user.id, isActive: true },
  });

  for (const category of allCategories) {
    const weeklyLimit = Number(category.monthlyCeiling) / 4.33; // Average weeks per month

    await prisma.weeklyBudget.create({
      data: {
        userId: user.id,
        categoryId: category.id,
        weekStart: startOfWeek,
        weekEnd: endOfWeek,
        weeklyLimit: weeklyLimit,
        spent: 0,
        carryover: 0,
        status: 'active',
      },
    });
  }

  console.log('✅ Created initial weekly budgets');
  console.log('🎉 Seed completed successfully!');
}

// Helper functions
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
