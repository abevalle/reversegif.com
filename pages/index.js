import React from 'react';
import DropZone from './DropZone.js';
import ReactGA from 'react-ga4';
import Header from './header.js';
import Footer from './footer.js';
import Head from 'next/head';
import Script from 'next/script';
import ExampleGifs from './exmaplegifs.js';

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
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 flex flex-col items-center">
            <div className="mb-4">
              <img src='./landing.webp' className="w-1/2 h-auto mx-auto landingImage" alt="Landing" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reverse Your Gifs</h1>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">100% Automatic & FREE</h3>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <DropZone />
            <ExampleGifs />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
