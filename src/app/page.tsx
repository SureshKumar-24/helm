'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Wallet, 
  Target, 
  TrendingUp, 
  Smartphone, 
  Shield, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A3D62] via-[#0f5280] to-[#0A3D62]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the home page if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A3D62] via-[#0f5280] to-[#0A3D62] text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#22C55E]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            {/* Animated Helm Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#22C55E] to-[#3B82F6] rounded-full blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <div className="relative w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <span className="text-6xl">⎈</span>
                </div>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Financial Helm
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl mb-4 text-[#22C55E] font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-6 h-6" />
              Guiding Your Personal Finances
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto text-gray-200"
            >
              Take control of your financial journey. Track expenses, manage budgets, 
              and achieve your goals with confidence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white/10 border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with Detailed Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Powerful Features</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A3D62] mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, powerful tools designed to help you make smarter financial decisions and achieve your goals faster
            </p>
          </motion.div>

          {/* Feature 1: Smart Dashboard - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 text-white flex flex-col justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
                  >
                    <BarChart3 className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4">Smart Dashboard</h3>
                  <p className="text-blue-100 text-lg mb-6">
                    Get a complete overview of your finances at a glance with intuitive charts and real-time insights
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Real-time Balance Tracking</p>
                        <p className="text-blue-100 text-sm">See your current balance, income, and expenses updated instantly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Visual Analytics</p>
                        <p className="text-blue-100 text-sm">Interactive charts show spending patterns and trends at a glance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Quick Actions</p>
                        <p className="text-blue-100 text-sm">Add transactions, set budgets, and manage goals in one click</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-8 lg:p-12 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full max-w-md"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="text-blue-600 text-sm mb-1">Balance</div>
                          <div className="text-2xl font-bold text-[#0A3D62]">$12,450</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                          <div className="text-green-600 text-sm mb-1">Income</div>
                          <div className="text-2xl font-bold text-[#0A3D62]">$8,200</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Housing</span>
                          <span className="font-semibold">$1,200</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Transaction Tracking - Full Width Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 text-white flex flex-col justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
                  >
                    <Wallet className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4">Transaction Tracking</h3>
                  <p className="text-green-100 text-lg mb-6">
                    Effortlessly record and categorize every transaction with intelligent automation and powerful organization tools
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Smart Categorization</p>
                        <p className="text-green-100 text-sm">AI-powered system automatically categorizes transactions as you add them</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Quick Entry & Search</p>
                        <p className="text-green-100 text-sm">Add transactions in seconds and find them instantly with powerful filters</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Receipt Management</p>
                        <p className="text-green-100 text-sm">Attach photos and notes to keep detailed records of every expense</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-emerald-400 p-8 lg:p-12 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full max-w-md"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-[#0A3D62]">Recent Transactions</h4>
                        <span className="text-green-600 text-sm font-semibold">+$2,450 this month</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm">💰</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Salary</p>
                              <p className="text-gray-500 text-xs">Income</p>
                            </div>
                          </div>
                          <span className="font-bold text-green-600">+$3,200</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-sm">🏠</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Rent</p>
                              <p className="text-gray-500 text-xs">Housing</p>
                            </div>
                          </div>
                          <span className="font-bold text-red-600">-$1,200</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">🛒</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Groceries</p>
                              <p className="text-gray-500 text-xs">Food</p>
                            </div>
                          </div>
                          <span className="font-bold text-red-600">-$85</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Budget Management - Full Width Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-8 lg:p-12 flex items-center justify-center order-2 lg:order-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full max-w-md"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-[#0A3D62]">Monthly Budgets</h4>
                        <span className="text-purple-600 text-sm font-semibold">3 of 5 on track</span>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Food & Dining</span>
                            <span className="font-semibold">$320 / $400</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{width: '80%'}}></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Entertainment</span>
                            <span className="font-semibold">$180 / $200</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-yellow-500 h-3 rounded-full" style={{width: '90%'}}></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shopping</span>
                            <span className="font-semibold">$450 / $300</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-red-500 h-3 rounded-full" style={{width: '100%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="p-8 lg:p-12 text-white flex flex-col justify-center order-1 lg:order-2">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
                  >
                    <Target className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4">Budget Management</h3>
                  <p className="text-purple-100 text-lg mb-6">
                    Set smart budgets for every category and stay on track with real-time alerts and intelligent insights
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Smart Budget Creation</p>
                        <p className="text-purple-100 text-sm">AI suggests optimal budgets based on your spending history and goals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Real-time Tracking</p>
                        <p className="text-purple-100 text-sm">Visual progress bars and alerts keep you informed as you spend</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Flexible Adjustments</p>
                        <p className="text-purple-100 text-sm">Easily modify budgets and get recommendations for better balance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Financial Goals - Full Width Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 text-white flex flex-col justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
                  >
                    <TrendingUp className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4">Financial Goals</h3>
                  <p className="text-orange-100 text-lg mb-6">
                    Define your savings goals and watch your progress with visual trackers, smart recommendations, and milestone celebrations
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Multiple Goal Tracking</p>
                        <p className="text-orange-100 text-sm">Set and track multiple savings goals with custom deadlines and priorities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Smart Savings Plans</p>
                        <p className="text-orange-100 text-sm">Get personalized monthly savings recommendations to reach your goals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Progress Visualization</p>
                        <p className="text-orange-100 text-sm">Beautiful charts and milestones keep you motivated on your journey</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-red-400 p-8 lg:p-12 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full max-w-md"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-[#0A3D62]">Savings Goals</h4>
                        <span className="text-orange-600 text-sm font-semibold">2 active goals</span>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-[#0A3D62]">🏠 Emergency Fund</span>
                            <span className="text-sm text-gray-600">Dec 2025</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">$7,500 / $10,000</span>
                            <span className="font-semibold text-blue-600">75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-[#0A3D62]">✈️ Vacation</span>
                            <span className="text-sm text-gray-600">Jun 2025</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">$1,200 / $3,000</span>
                            <span className="font-semibold text-green-600">40%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '40%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Friendly - Full Width Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-400 p-8 lg:p-12 flex items-center justify-center order-2 lg:order-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        rotateY: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                      }}
                      className="relative"
                    >
                      <div className="w-48 h-80 bg-white rounded-3xl shadow-2xl p-4 mx-auto">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl h-full p-4 text-white">
                          <div className="text-center mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <span className="text-2xl">⎈</span>
                            </div>
                            <h5 className="font-bold">Financial Helm</h5>
                          </div>
                          <div className="space-y-3">
                            <div className="bg-white/20 rounded-lg p-3">
                              <div className="text-xs mb-1">Balance</div>
                              <div className="font-bold">$12,450</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white/20 rounded-lg p-2">
                                <div className="text-xs">Income</div>
                                <div className="font-semibold text-sm">$8,200</div>
                              </div>
                              <div className="bg-white/20 rounded-lg p-2">
                                <div className="text-xs">Expenses</div>
                                <div className="font-semibold text-sm">$3,750</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Housing</span>
                                <span>80%</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-1">
                                <div className="bg-white h-1 rounded-full" style={{width: '80%'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
                <div className="p-8 lg:p-12 text-white flex flex-col justify-center order-1 lg:order-2">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
                  >
                    <Smartphone className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4">Mobile Friendly</h3>
                  <p className="text-indigo-100 text-lg mb-6">
                    Access your finances anytime, anywhere with our fully responsive design optimized for all devices and screen sizes
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <h4 className="font-bold mb-2">📱 Touch Optimized</h4>
                      <p className="text-indigo-100 text-sm">Intuitive gestures and touch controls for seamless mobile experience</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <h4 className="font-bold mb-2">⚡ Lightning Fast</h4>
                      <p className="text-indigo-100 text-sm">Optimized performance ensures quick loading on any connection</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <h4 className="font-bold mb-2">🔄 Offline Ready</h4>
                      <p className="text-indigo-100 text-sm">Works offline with automatic sync when connection returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 6: Security - Full Width with Special Design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-teal-400 to-green-400 p-8 lg:p-12 flex items-center justify-center order-2 lg:order-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                      }}
                      className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                    >
                      <Shield className="w-16 h-16 text-white" />
                    </motion.div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                        <span className="text-white font-bold text-lg">256-bit Encryption</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                        <span className="text-white font-bold text-lg">SOC 2 Compliant</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                        <span className="text-white font-bold text-lg">GDPR Compliant</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="p-8 lg:p-12 text-white flex flex-col justify-center order-1 lg:order-2">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
                  >
                    <Shield className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4">Secure & Private</h3>
                  <p className="text-teal-100 text-lg mb-6">
                    Your financial data is stored securely with bank-level encryption and remains completely private
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <h4 className="font-bold mb-2">🔒 Bank-Level Security</h4>
                      <p className="text-teal-100 text-sm">Military-grade 256-bit encryption protects all your data</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <h4 className="font-bold mb-2">🛡️ Privacy First</h4>
                      <p className="text-teal-100 text-sm">Your data belongs to you - we never sell or share it</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <h4 className="font-bold mb-2">✅ Secure Backups</h4>
                      <p className="text-teal-100 text-sm">Automatic backups ensure your data is never lost</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Enhanced with Colors */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#0A3D62] mb-3">Why Choose Financial Helm?</h2>
            <p className="text-gray-600 text-lg">Everything you need in one powerful platform</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Simple */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Animated background blob */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-3xl font-bold mb-3">Simple</h3>
                <p className="text-blue-100 text-lg">Easy to use interface designed for everyone</p>
                
                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </div>
            </motion.div>

            {/* Secure */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-8 text-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Animated background blob */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg"
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-3xl font-bold mb-3">Secure</h3>
                <p className="text-emerald-100 text-lg">Bank-level encryption keeps your data protected</p>
                
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </div>
            </motion.div>

            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Animated background blob */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-3xl font-bold mb-3">Free</h3>
                <p className="text-purple-100 text-lg">Start managing your finances today at no cost</p>
                
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>

          {/* Additional Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { number: "10K+", label: "Active Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "$2M+", label: "Tracked" },
              { number: "4.9★", label: "Rating" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-3xl font-bold text-[#0A3D62] mb-1">{item.number}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-[#0A3D62] via-[#0f5280] to-[#0A3D62] text-white overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              x: [0, 100, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to Take Control of Your Finances?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-gray-200"
          >
            Join Financial Helm today and start your journey to financial freedom
          </motion.p>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">⎈</span>
                </div>
                <span className="text-xl font-bold">Financial Helm</span>
              </div>
              <p className="text-gray-400 mb-4">
                Guiding your personal finances with clarity and confidence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                <li><Link href="/transactions" className="hover:text-white transition">Transactions</Link></li>
                <li><Link href="/budgets" className="hover:text-white transition">Budgets</Link></li>
                <li><Link href="/goals" className="hover:text-white transition">Goals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Financial Helm. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
