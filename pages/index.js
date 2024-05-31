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
      <Head>
        <title>Reversegif.com | Reverse a Gif for FREE!</title>
        <meta name="title" content="Reverse a gif for free | reversegif.com" />
        <meta name="description" content="reversegif.com: Easily reverse GIFs in 3 steps. Drag, drop, and click to reverse. Local secure video encoding. Try it now!" />
        <meta name="keywords" content="reversegif, reverse a gif, gif, backwards gif, rewind a gif, gif reverse, gifs reversed, reversing a gif" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7359270153499473" crossorigin="anonymous" />
        <Script type="text/javascript" src="/static/arial.ttf.js" />
      </Head>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&family=Roboto&display=swap" rel="stylesheet" />

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
