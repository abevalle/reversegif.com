import React, { useState } from 'react';
import DropZone from './DropZone.js';
import * as gtm from '../lib/gtm';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Head from 'next/head';
import ExampleGifs from './exmaplegifs.js';


const VideoToPngDropZone = () => {
  // This wrapper ensures that the DropZone component is used specifically for video to PNG conversion
  return <DropZone videoToPngMode={true} videoOnly={true} />;
};

export default function VideoToPng() {
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  
  const gaEvent = (cat, act) => {
    gtm.event({
      category: cat,
      action: act
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
              "name": "ReverseGIF.com - Video to PNG Converter",
              "applicationCategory": "ImageEditing",
              "applicationSubCategory": "Video to PNG Converter",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "description": "A free online tool to extract PNG frames from videos. Process videos directly in your browser with no file size limits and complete privacy.",
              "featureList": [
                "Browser-based video processing",
                "No file upload required",
                "Privacy focused - files never leave your browser",
                "High-quality output",
                "Lightning-fast processing",
                "Video to PNG conversion"
              ],
              "browserRequirements": "Requires a modern web browser with JavaScript enabled",
              "softwareVersion": "1.0",
              "url": "https://reversegif.com/video-to-png"
            })
          }}
        />
        <title>Convert Video to PNG Online - Free & Private | ReverseGIF.com</title>
        <meta name="description" content="Extract high-quality PNG frames from your videos with our free online converter. No upload needed - processing happens in your browser for complete privacy." />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:p-4">
        {/* Mobile-only heading section */}
        <div className="block md:hidden text-center mb-6">
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Convert Videos to PNG
            </h1>
          </div>
          <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4">
            Extract all PNG frames from videos as ZIP - 100% Free & Private
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          {/* Desktop left column */}
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <div className="hidden md:block text-center md:text-left px-2 md:px-0">
              <div className="relative">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Convert Videos to PNG
                </h1>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
                Extract all PNG frames from videos as ZIP - 100% Free & Private
              </h2>
            </div>

            {/* Tool explanation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Extract PNG Frames from Videos</h3>
              <div className="prose prose-sm md:prose-base dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Extract every frame from your videos as high-quality PNG images, perfect for creating thumbnails, analyzing motion, or building image sequences. PNG format preserves full image quality with lossless compression and transparency support.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Ideal for animators, video editors, researchers, or anyone needing to capture specific moments from videos. Each frame is extracted at full resolution and automatically organized with sequential numbering for easy identification.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  All extracted frames are packaged into a convenient ZIP file for easy download and organization. Preview each frame before downloading to ensure you get exactly what you need.
                </p>
              </div>
            </div>

            {/* Mobile-optimized monetization section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
              <button 
                onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg md:text-xl font-semibold">More Media Tools</h3>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${isToolsExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isToolsExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-2 md:space-y-3">
                <a href="/" 
                   className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target-size">
                  <span className="text-2xl md:text-xl mr-3">🔄</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg">Reverse GIFs</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Create reverse playback of any GIF</p>
                  </div>
                </a>
                <a href="/video-2-gif" 
                   className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target-size">
                  <span className="text-2xl md:text-xl mr-3">🎬</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg">Video to GIF</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Convert videos to GIF animations</p>
                  </div>
                </a>
                <a href="/gif-to-mp4" 
                   className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target-size">
                  <span className="text-2xl md:text-xl mr-3">🎥</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg">GIF to MP4</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Convert GIFs to MP4 videos</p>
                  </div>
                </a>
                <a href="/video-to-jpg" 
                   className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target-size">
                  <span className="text-2xl md:text-xl mr-3">📷</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg">Video to JPG</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Extract all JPG frames</p>
                  </div>
                </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-optimized dropzone */}
          <div id="dropzone" className="order-1 md:order-2 md:sticky md:top-4 -mx-4 md:mx-0 rounded-none md:rounded-xl overflow-hidden shadow-lg">
            <VideoToPngDropZone />
            
            
            <div className="mt-4 md:mt-6 px-4 md:px-0">
              <ExampleGifs hideExamples={true} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Add this to your global CSS or Tailwind config
const styles = {
  '.touch-target-size': {
    minHeight: '44px', // Minimum touch target size
  }
};