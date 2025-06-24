import React from 'react';
import DropZone from './DropZone.js';
import ReactGA from 'react-ga4';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Head from 'next/head';
import Script from 'next/script';
import ExampleGifs from './exmaplegifs.js';
import { useEffect, useState } from 'react';
import AdSenseUnderDropzone from '../components/AdSenseUnderDropzone';

const gaCode = process.env.TRACKING_ID;
ReactGA.initialize("G-MHJ39LXW6P");

export default function Home() {
  const gaEvent = (cat, act) => {
    ReactGA.event({
      category: cat,
      action: act,
      nonInteraction: false
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100">
      <Head>
        {/* Add SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ReverseGIF.com",
              "applicationCategory": "ImageEditing",
              "applicationSubCategory": "GIF Editor",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "description": "A free online tool to reverse GIF animations. Process GIFs directly in your browser with no file size limits and complete privacy.",
              "featureList": [
                "Browser-based GIF processing",
                "No file upload required",
                "Privacy focused - files never leave your browser",
                "High-quality output",
                "Lightning-fast processing",
                "Video to reversed GIF conversion"
              ],
              "browserRequirements": "Requires a modern web browser with JavaScript enabled",
              "softwareVersion": "1.0",
              "url": "https://reversegif.com"
            })
          }}
        />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          {/* Mobile-optimized left column */}
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <div className="text-center md:text-left px-2 md:px-0">
              <div className="relative">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Reverse Your GIFs
                </h1>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
                Create engaging content in seconds - 100% Free & Private
              </h2>
            </div>

            {/* Feature list for mobile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Why Choose Us?</h3>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-center">
                  <span className="bg-green-100 dark:bg-green-900 p-1 rounded-full mr-3">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Lightning-fast processing
                </li>
                <li className="flex items-center">
                  <span className="bg-green-100 dark:bg-green-900 p-1 rounded-full mr-3">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  100% Private - Files never leave your browser
                </li>
                <li className="flex items-center">
                  <span className="bg-green-100 dark:bg-green-900 p-1 rounded-full mr-3">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  High-quality output
                </li>
              </ul>
            </div>

            {/* Mobile-optimized monetization section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3">Tools You'll Love</h3>
              <div className="space-y-2 md:space-y-3">
                <a href="/video-2-gif" 
                   className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target-size">
                  <span className="text-2xl md:text-xl mr-3">🎬</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg">Video to GIF Converter</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Convert your videos to GIFs</p>
                  </div>
                </a>
                <a href="https://thepasswordgenerator.com" 
                   className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target-size">
                  <span className="text-2xl md:text-xl mr-3">🔐</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg">Password Generator</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Create strong, secure passwords instantly</p>
                  </div>
                </a>
                <a href="https://zipmyfile.com" 
                   className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target-size">
                  <span className="text-2xl md:text-xl mr-3">📦</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg">ZIP File Compression</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Compress and share files easily</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile-optimized dropzone */}
          <div id="dropzone" className="order-1 md:order-2 md:sticky md:top-4 -mx-4 md:mx-0 rounded-none md:rounded-xl overflow-hidden">
            <DropZone />
            
            {/* Ad unit under dropzone */}
            <div className="mt-4 px-4 md:px-0 flex justify-center">
              <AdSenseUnderDropzone />
            </div>
            
            <div className="mt-4 md:mt-6 px-4 md:px-0">
              <ExampleGifs />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

