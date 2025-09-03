import React from 'react';
import DropZone from './DropZone.js';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Head from 'next/head';
import ExampleGifs from './exmaplegifs.js';


export default function Home() {

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Reverse GIF Online Free - Instant GIF Reverser Tool</title>
        <meta name="description" content="Reverse animated GIF files instantly with our free online GIF reverser. No upload needed - 100% secure browser-based tool. Create backwards GIFs from any animated GIF or video file." />
        <link rel="canonical" href="https://reversegif.com/" />
        {/* WebSite Schema for better search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ReverseGIF.com",
              "alternateName": "Reverse GIF Online",
              "url": "https://reversegif.com",
              "description": "Free online tool to reverse animated GIF files instantly. Create backwards GIF animations without uploading - 100% secure browser-based processing.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://reversegif.com?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Reverse GIF Tool",
              "applicationCategory": "MultimediaApplication",
              "applicationSubCategory": "GIF Editor",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Reverse animated GIF files online. Free GIF reverser tool that works in your browser. No file uploads, no size limits, instant processing.",
              "featureList": [
                "Reverse animated GIF files",
                "Create backwards GIF animations",
                "No file upload required",
                "100% browser-based processing",
                "Works with any GIF size",
                "Convert videos to reversed GIFs",
                "Privacy-focused - files never leave your device"
              ],
              "screenshot": "https://reversegif.com/metaimg.webp",
              "softwareVersion": "2.0",
              "url": "https://reversegif.com",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />
        {/* HowTo Schema for featured snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to Reverse a GIF",
              "description": "Learn how to reverse animated GIF files online in 3 simple steps using our free tool.",
              "image": "https://reversegif.com/metaimg.webp",
              "totalTime": "PT1M",
              "supply": {
                "@type": "HowToSupply",
                "name": "GIF file to reverse"
              },
              "tool": {
                "@type": "HowToTool",
                "name": "Web browser"
              },
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Upload GIF",
                  "text": "Drag and drop your GIF file or click to browse"
                },
                {
                  "@type": "HowToStep",
                  "name": "Process",
                  "text": "Click the 'Reverse GIF' button to process"
                },
                {
                  "@type": "HowToStep",
                  "name": "Download",
                  "text": "Download your reversed GIF file"
                }
              ]
            })
          }}
        />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:p-4">
        {/* Mobile-only heading section */}
        <div className="block md:hidden text-center mb-6">
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Reverse Your GIFs
            </h1>
          </div>
          <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4">
            Create engaging content in seconds - 100% Free & Private
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          {/* Desktop left column */}
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <div className="hidden md:block text-center md:text-left px-2 md:px-0">
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
              <h3 className="text-lg md:text-xl font-semibold mb-3">Other Tools</h3>
              <div className="space-y-2 md:space-y-3">
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

