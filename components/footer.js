import React, { useEffect } from 'react';
import Link from 'next/link';
import * as gtm from '../lib/gtm';


export default function Footer() {
  const gaEvent = (cat, act) => {
    gtm.event({
      category: cat,
      action: act
    });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'abeu');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Cookie');
    script.setAttribute('data-text', 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#ffffff');
    script.async = true;
    
    script.onload = () => {
      const container = document.getElementById('bmc-button-container');
      if (container && window.BMC) {
        window.BMC.Widget({ id: 'bmc-button-container', username: 'abeu' });
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center space-x-2">
              <span className="relative">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ReverseGIF
                </span>
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              The easiest way to reverse your GIFs online
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                About Us
              </Link>
              <Link href="/blog" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Blog
              </Link>
              <Link href="/faq" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                FAQ
              </Link>
              <Link href="/privacy" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Related Tools */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Related Tools
            </h3>
            <div className="space-y-3">
              <a
                href="https://thepasswordgenerator.com"
                onClick={() => gaEvent('footer-link', 'password-generator-click')}
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Password Generator
              </a>
              <a
                href="https://zipmyfile.com"
                onClick={() => gaEvent('footer-link', 'zip-file-click')}
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                ZIP File Compression
              </a>
              <a
                href="https://yiddishbabynames.com"
                onClick={() => gaEvent('footer-link', 'yiddish-names-click')}
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Yiddish Baby Names
              </a>
              <a
                href="https://meetingsession.com"
                onClick={() => gaEvent('footer-link', 'meeting-session-click')}
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Meeting Session
              </a>
              <a
                href="https://schedulr.org"
                onClick={() => gaEvent('footer-link', 'schedulr-click')}
                className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Schedulr
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div 
              id="bmc-button-container" 
              onClick={() => gaEvent('footer-link', 'buy-me-coffee-click')}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} ReverseGIF.com by{' '}
            <a
              href="https://abevalle.com"
              onClick={() => gaEvent('footer-link', 'abevalle-click')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              AbeValle
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
