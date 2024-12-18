import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const isActivePath = (path) => router.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="relative">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ReverseGIF
              </span>
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks isActivePath={isActivePath} />
          </div>
        </div>

        {/* Mobile navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
          <div className="flex flex-col space-y-3">
            <NavLinks isActivePath={isActivePath} mobile />
          </div>
        </div>
      </nav>
    </header>
  );
}

const NavLinks = ({ isActivePath, mobile = false }) => {
  const linkClass = (path) =>
    `${mobile ? 'block py-2' : ''} transition-colors ${
      isActivePath(path)
        ? 'text-blue-600 dark:text-blue-400 font-semibold'
        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
    }`;

  return (
    <>
      <Link href="/" className={linkClass('/')}>
        Home
      </Link>
      <Link href="/about" className={linkClass('/about')}>
        About
      </Link>
      <Link href="/faq" className={linkClass('/faq')}>
        FAQ
      </Link>
      <a
        href="mailto:hello@reversegif.com"
        className={`${mobile ? 'block py-2' : ''} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
      >
        Contact
      </a>
    </>
  );
};
