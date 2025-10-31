/**
 * Footer Component
 * Modern footer with legal links and copyright
 */

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-600">
            © {currentYear} Financial Helm - All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy-policy"
              className="text-gray-600 hover:text-[#0A3D62] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookie-policy"
              className="text-gray-600 hover:text-[#0A3D62] transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-[#0A3D62] transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
