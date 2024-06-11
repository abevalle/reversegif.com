// components/Header.js
import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import ThemeToggle from '../pages/ThemeToggle';

const gaCode = process.env.TRACKING_ID;
ReactGA.initialize("G-MHJ39LXW6P");

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  const gaEvent = (cat, act) => {
    ReactGA.event({
      category: cat,
      action: act,
      nonInteraction: false
    });
  };

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col items-center p-4 md:flex-row md:justify-between">
        <h1 className="text-3xl font-bold mb-2 md:mb-0">
          <a 
            href="/" 
            onClick={() => gaEvent('header-click', 'header-click')}
            className="text-white hover:text-blue-400"
          >
            reversegif.com
          </a>
        </h1>
        <div className="md:hidden">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {navOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <nav
          className={`${
            navOpen ? 'block' : 'hidden'
          } md:flex md:space-x-4 md:items-center w-full md:w-auto`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 items-center">
            <a 
              href="/" 
              className="block md:inline-block text-white hover:text-blue-400 p-2"
              onClick={() => gaEvent('nav-home-click', 'nav-home-click')}
            >
              Home
            </a>
            <a 
              href="/about" 
              className="block md:inline-block text-white hover:text-blue-400 p-2"
              onClick={() => gaEvent('nav-about-click', 'nav-about-click')}
            >
              About
            </a>
            <a 
              href="/blog" 
              className="block md:inline-block text-white hover:text-blue-400 p-2"
              onClick={() => gaEvent('nav-blog-click', 'nav-blog-click')}
            >
              Blog
            </a>
            <a 
              href="/faq" 
              className="block md:inline-block text-white hover:text-blue-400 p-2"
              onClick={() => gaEvent('nav-faq-click', 'nav-faq-click')}
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center justify-center p-2 md:justify-end">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
