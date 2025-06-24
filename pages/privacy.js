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
        <meta name="description" content="Reversegif.com is privacy focused and has designed the tool so that files are never uploaded to our servers." />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Privacy Policy | reversegif.com" />
        <meta property="og:description" content="Reversegif.com is privacy focused and has designed the tool so that files are never uploaded to our servers." />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/privacy" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | reversegif.com" />
        <meta name="twitter:description" content="Reversegif.com is privacy focused and has designed the tool so that files are never uploaded to our servers." />
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
            <p className="mb-4">At ReverseGif.com, we do not collect or store personal data on our servers, such as GIFs or other files. All processing is carried out locally within your browser. This means:</p>
            <ul className="list-disc list-inside mb-4">
              <li className="mb-2"><strong>Local Processing:</strong> Any data you provide while using our services, such as images or GIFs for reverse processing, is handled directly within your browser. No such data is transmitted to or stored on our servers.</li>
              <li><strong>Data Sharing for Advertising and Analytics:</strong> While we do not store data on our servers, we may share non-personally identifiable information with Google for advertising and analytics purposes. This data helps us understand user interactions with our site and optimize your experience.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">3. Data Sharing and Disclosure</h2>
            <p className="mb-4">Since no personal data is stored on our servers, there is no personal data to share or disclose to third parties except for analytics and advertising purposes with Google.</p>

            <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
            <p className="mb-4">Data security is implemented through local processing. Your data does not leave your device, ensuring it remains under your control and reducing the risk of unauthorized access.</p>

            <h2 className="text-xl font-semibold mb-2">5. User Rights</h2>
            <p className="mb-4">As we do not collect or store personal data on our servers, no direct actions are required to manage your data on our site. However, you always maintain complete control over your information when using our services.</p>

            <h2 className="text-xl font-semibold mb-2">6. Changes to This Privacy Policy</h2>
            <p className="mb-4">We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about our privacy practices.</p>

            <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@reversegif.com" className="text-blue-500 dark:text-blue-400">hello@reversegif.com</a>.</p>

            <p className="mb-4">By using ReverseGif.com, you acknowledge that you have read and understand this Privacy Policy. Thank you for choosing to use our services.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
