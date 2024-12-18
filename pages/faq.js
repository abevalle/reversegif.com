import React, { useState } from 'react';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Head from 'next/head';

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const toggleQuestion = (question) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  const handleSendEmail = () => {
    const mailtoLink = `mailto:hello@reversegif.com?subject=Contact%20Us&body=Name:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0AMessage:%20${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      <Head>
        <title>FAQ | reversegif.com</title>
        <meta name="title" content="FAQ | reversegif.com" />
        <meta name="description" content="Find answers to common questions about using ReverseGIF.com, the best tool for reversing GIFs for free." />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="FAQ | reversegif.com" />
        <meta property="og:description" content="Find answers to common questions about using ReverseGIF.com, the best tool for reversing GIFs for free." />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/faq" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ | reversegif.com" />
        <meta name="twitter:description" content="Find answers to common questions about using ReverseGIF.com, the best tool for reversing GIFs for free." />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Find answers to common questions about using ReverseGIF.com
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {[1, 2, 3, 4, 5, 6, 7].map((qNum) => (
              <div key={qNum} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => toggleQuestion(qNum)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {qNum === 1 && "How do I reverse a GIF?"}
                      {qNum === 2 && "Is there a file size limit for uploading GIFs?"}
                      {qNum === 3 && "Are my GIFs stored on your servers?"}
                      {qNum === 4 && "Can I reverse videos using your tool?"}
                      {qNum === 5 && "Are there any costs associated with using ReverseGIF.com?"}
                      {qNum === 6 && "Can I use reversed GIFs on social media?"}
                      {qNum === 7 && "What if I encounter an issue while using the tool?"}
                    </span>
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-200 ${
                        openQuestion === qNum ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out ${
                    openQuestion === qNum ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    {qNum === 1 && (
                      <p className="mb-4">
                        To reverse a GIF using ReverseGIF.com, simply upload the GIF file using our tool, and click the "Reverse" button. The reversed GIF will be generated instantly and available for download. It's a quick and free way to reverse your GIFs.
                      </p>
                    )}
                    {qNum === 2 && (
                      <p className="mb-4">Yes, the maximum file size for uploading a GIF is 50MB. This ensures quick processing and optimal performance when you reverse a GIF.</p>
                    )}
                    {qNum === 3 && (
                      <p className="mb-4">No, we prioritize your privacy. All GIF processing is done locally in your browser. We do not store or transmit your GIF files to our servers when you use our free reverse GIF tool.</p>
                    )}
                    {qNum === 4 && (
                      <p className="mb-4">Yes, when you upload a video to our tool, it will be automatically converted to a reversed GIF. This makes it easy to create fun and engaging reversed animations from your video files.</p>
                    )}
                    {qNum === 5 && (
                      <p className="mb-4">No, our reverse GIF tool is completely free to use. We aim to provide a valuable service without any hidden costs or fees.</p>
                    )}
                    {qNum === 6 && (
                      <p className="mb-4">Yes, once you have reversed your GIF, you can download it and share it on any social media platform. Our reverse GIF tool ensures that the quality is maintained for optimal sharing.</p>
                    )}
                    {qNum === 7 && (
                      <p className="mb-4">If you experience any problems, please contact us at <a href="mailto:hello@reversegif.com" className="text-blue-500 dark:text-blue-400">hello@reversegif.com</a>. Our support team will be happy to assist you.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Still Have Questions?
            </h2>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
