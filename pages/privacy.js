import React from 'react';
import * as gtm from '../lib/gtm';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

import Head from 'next/head';


export default function Home() {

  const gaEvent = (cat, act) => {
    gtm.event({
      category: cat,
      action: act
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Privacy Policy | reversegif.com</title>
        <meta name="title" content="Privacy Policy | reversegif.com" />
        <meta name="description" content="Reversegif.com privacy policy - Learn how we handle your data and protect your privacy." />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Privacy Policy | reversegif.com" />
        <meta property="og:description" content="Reversegif.com privacy policy - Learn how we handle your data and protect your privacy." />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/privacy" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | reversegif.com" />
        <meta name="twitter:description" content="Reversegif.com privacy policy - Learn how we handle your data and protect your privacy." />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="mb-4">Welcome to ReverseGif.com. We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy outlines our practices concerning handling your information collected during your visit and interaction with our website.</p>

            <h2 className="text-xl font-semibold mb-2">2. Information Collection and Use</h2>
            <p className="mb-4">At ReverseGif.com, we prioritize your privacy while providing our services. Here's how we handle your data:</p>
            <ul className="list-disc list-inside mb-4">
              <li className="mb-2"><strong>File Processing:</strong> When you use our services, your files (GIFs, videos, images) are temporarily uploaded to our secure servers for processing. These files are automatically deleted immediately after processing is complete. We do not store, archive, or retain your processed files.</li>
              <li className="mb-2"><strong>Processing Logs:</strong> For security and service improvement purposes, we maintain logs that include:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Timestamp of file upload</li>
                  <li>IP address of the user</li>
                  <li>File metadata (size, format, dimensions)</li>
                  <li>Processing type requested</li>
                </ul>
                These logs do not contain the actual file content and are used solely for troubleshooting, security monitoring, and service optimization.
              </li>
              <li className="mb-2"><strong>Analytics and Advertising:</strong> We use Google Analytics and Google AdSense on our site. These services may collect non-personally identifiable information about your visit, including pages viewed, time spent on site, and general location data. This helps us improve our service and support the site through advertising revenue.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">3. Data Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell, rent, or share your uploaded files or personal data with third parties. The only data sharing that occurs is:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Non-personally identifiable analytics data with Google Analytics</li>
              <li>Advertising-related data with Google AdSense</li>
              <li>Legal requirements: We may disclose information if required by law or to protect our rights and safety</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
            <p className="mb-4">We implement multiple security measures to protect your data:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Files are transmitted over secure HTTPS connections</li>
              <li>Files are immediately deleted after processing</li>
              <li>Our servers are secured and regularly updated</li>
              <li>Access logs are retained for a limited time and then permanently deleted</li>
              <li>We do not store any payment information on our servers</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">5. User Rights</h2>
            <p className="mb-4">You have the following rights regarding your data:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Since files are deleted immediately after processing, there is no stored content to request or delete</li>
              <li>You can request information about the logs we maintain by contacting us</li>
              <li>You can opt-out of Google Analytics tracking using browser extensions or settings</li>
              <li>You can use ad blockers to prevent advertising-related tracking</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">6. Changes to This Privacy Policy</h2>
            <p className="mb-4">We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about our privacy practices.</p>

            <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@reversegif.com" className="text-blue-500 dark:text-blue-400">hello@reversegif.com</a>.</p>

            <p className="mb-4"><strong>Last Updated:</strong> December 2024</p>
            <p className="mb-4">By using ReverseGif.com, you acknowledge that you have read and understand this Privacy Policy. Thank you for choosing to use our services.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
