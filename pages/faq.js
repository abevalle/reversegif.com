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
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
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
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>

            <div className="mb-4">
              <button
                className="text-xl font-semibold mb-2 w-full text-left focus:outline-none flex items-center"
                onClick={() => toggleQuestion(1)}
              >
                <span className="mr-2">{openQuestion === 1 ? '▼' : '►'}</span>
                1. How do I reverse a GIF?
              </button>
              {openQuestion === 1 && (
                <p className="mb-4">
                  To reverse a GIF using ReverseGIF.com, simply upload the GIF file using our tool, and click the "Reverse" button. The reversed GIF will be generated instantly and available for download. It's a quick and free way to reverse your GIFs.
                </p>
              )}
            </div>

            <div className="mb-4">
              <button
                className="text-xl font-semibold mb-2 w-full text-left focus:outline-none flex items-center"
                onClick={() => toggleQuestion(2)}
              >
                <span className="mr-2">{openQuestion === 2 ? '▼' : '►'}</span>
                2. Is there a file size limit for uploading GIFs?
              </button>
              {openQuestion === 2 && (
                <p className="mb-4">Yes, the maximum file size for uploading a GIF is 50MB. This ensures quick processing and optimal performance when you reverse a GIF.</p>
              )}
            </div>

            <div className="mb-4">
              <button
                className="text-xl font-semibold mb-2 w-full text-left focus:outline-none flex items-center"
                onClick={() => toggleQuestion(3)}
              >
                <span className="mr-2">{openQuestion === 3 ? '▼' : '►'}</span>
                3. Are my GIFs stored on your servers?
              </button>
              {openQuestion === 3 && (
                <p className="mb-4">No, we prioritize your privacy. All GIF processing is done locally in your browser. We do not store or transmit your GIF files to our servers when you use our free reverse GIF tool.</p>
              )}
            </div>

            <div className="mb-4">
              <button
                className="text-xl font-semibold mb-2 w-full text-left focus:outline-none flex items-center"
                onClick={() => toggleQuestion(4)}
              >
                <span className="mr-2">{openQuestion === 4 ? '▼' : '►'}</span>
                4. Can I reverse videos using your tool?
              </button>
              {openQuestion === 4 && (
                <p className="mb-4">Yes, when you upload a video to our tool, it will be automatically converted to a reversed GIF. This makes it easy to create fun and engaging reversed animations from your video files.</p>
              )}
            </div>

            <div className="mb-4">
              <button
                className="text-xl font-semibold mb-2 w-full text-left focus:outline-none flex items-center"
                onClick={() => toggleQuestion(5)}
              >
                <span className="mr-2">{openQuestion === 5 ? '▼' : '►'}</span>
                5. Are there any costs associated with using ReverseGIF.com?
              </button>
              {openQuestion === 5 && (
                <p className="mb-4">No, our reverse GIF tool is completely free to use. We aim to provide a valuable service without any hidden costs or fees.</p>
              )}
            </div>

            <div className="mb-4">
              <button
                className="text-xl font-semibold mb-2 w-full text-left focus:outline-none flex items-center"
                onClick={() => toggleQuestion(6)}
              >
                <span className="mr-2">{openQuestion === 6 ? '▼' : '►'}</span>
                6. Can I use reversed GIFs on social media?
              </button>
              {openQuestion === 6 && (
                <p className="mb-4">Yes, once you have reversed your GIF, you can download it and share it on any social media platform. Our reverse GIF tool ensures that the quality is maintained for optimal sharing.</p>
              )}
            </div>

            <div className="mb-4">
              <button
                className="text-xl font-semibold mb-2 w-full text-left focus:outline-none flex items-center"
                onClick={() => toggleQuestion(7)}
              >
                <span className="mr-2">{openQuestion === 7 ? '▼' : '►'}</span>
                7. What if I encounter an issue while using the tool?
              </button>
              {openQuestion === 7 && (
                <p className="mb-4">If you experience any problems, please contact us at <a href="mailto:hello@reversegif.com" className="text-blue-500 dark:text-blue-400">hello@reversegif.com</a>. Our support team will be happy to assist you.</p>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-block px-6 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Send
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
