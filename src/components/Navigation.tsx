'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Target, 
  Menu, 
  X,
  LogIn,
  UserPlus,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transactions', icon: Receipt },
    { href: '/budgets', label: 'Budgets', icon: Wallet },
    { href: '/goals', label: 'Goals', icon: Target },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 bg-gradient-to-br from-[#0A3D62] to-[#0f5280] rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-white text-xl font-bold">⎈</span>
            </motion.div>
            <span className="text-xl font-bold text-[#0A3D62] group-hover:text-[#083048] transition">
              Financial Helm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#0A3D62] transition-colors rounded-lg"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0A3D62] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 text-[#0A3D62] hover:bg-[#0A3D62]/5 rounded-lg font-medium transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-[#0A3D62] p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#0A3D62] hover:bg-gray-50 rounded-lg transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
              
              <div className="pt-4 space-y-2 border-t border-gray-100 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        router.push('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 border border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-[#0A3D62] border border-[#0A3D62] rounded-lg font-semibold hover:bg-[#0A3D62]/5 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus className="w-5 h-5" />
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
