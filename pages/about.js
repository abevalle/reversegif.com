import React from 'react';
import ReactGA from 'react-ga4';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Head from 'next/head';
import Script from 'next/script';

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
        <title>About Us | reversegif.com</title>
        <meta name="title" content="About Us | reversegif.com" />
        <meta name="description" content="Learn about Reversegif.com, our mission, and our story. Discover how we provide an easy-to-use tool for reversing GIFs." />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="About Us | reversegif.com" />
        <meta property="og:description" content="Learn about Reversegif.com, our mission, and our story. Discover how we provide an easy-to-use tool for reversing GIFs." />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/about" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | reversegif.com" />
        <meta name="twitter:description" content="Learn about Reversegif.com, our mission, and our story. Discover how we provide an easy-to-use tool for reversing GIFs." />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">About ReverseGIF.com</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Transform your GIFs with just one click</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="text-blue-500 mr-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                </span>
                Our Story
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Founded with the idea that creativity should have no bounds, ReverseGIF.com was created to offer an easy-to-use platform for GIF enthusiasts and creators. Our journey began when we discovered the ReverseGIF.com domain and saw an opportunity to create something special.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="text-blue-500 mr-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </span>
                What We Offer
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Instant GIF reversal with our powerful processing engine</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">User-friendly interface for seamless experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Fast, reliable, and secure processing</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose ReverseGIF.com?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-400">Get your reversed GIFs in seconds</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Secure</h3>
                <p className="text-gray-600 dark:text-gray-400">Your privacy is our priority</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Easy to Use</h3>
                <p className="text-gray-600 dark:text-gray-400">No technical skills needed</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We love seeing how our users utilize reversed GIFs in their projects. Follow us on social media, share your creations, and join a community of like-minded GIF enthusiasts!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
