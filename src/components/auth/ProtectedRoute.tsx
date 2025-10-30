'use client';

/**
 * Protected Route Component
 * Enforces authentication for protected pages
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  redirectTo = '/login',
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Store the current path to redirect back after login
      const returnUrl = pathname !== redirectTo ? pathname : '/dashboard';
      sessionStorage.setItem('returnUrl', returnUrl);
      
      // Redirect to login
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo, pathname]);

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
