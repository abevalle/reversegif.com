import React from 'react';
import ReactGA from 'react-ga4';
import Header from '../../components/header.js';
import Footer from '../../components/footer.js';
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
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4">About Us</h1>
            <h2 className="text-xl font-semibold mb-2">Our Story</h2>
            <p className="mb-4">
              Founded with the idea that creativity should have no bounds, ReverseGIF.com was created to offer an easy-to-use platform for GIF enthusiasts and creators. Our journey began when we came across the ReverseGIF.com domain on auction and couldn't pass up the deal. Recognizing the potential to build a unique and fun service, we seized the opportunity and set out to create a platform that anyone could use to transform their GIFs.
            </p>

            <h2 className="text-xl font-semibold mb-2">What We Offer</h2>
            <ul className="list-disc list-inside mb-4">
              <li className="mb-2"><strong>GIF Reversal Tool:</strong> Our primary feature is the GIF reversal tool, designed to instantly reverse any GIF you upload. This simple yet powerful function lets you see your animations in a whole new way.</li>
              <li className="mb-2"><strong>User-Friendly Interface:</strong> We believe that everyone should have the ability to create fun and engaging content without needing technical expertise. Our intuitive interface ensures that reversing your GIFs is a seamless and enjoyable experience.</li>
              <li><strong>Fast and Reliable:</strong> We understand that time is valuable, which is why our tool processes your GIFs quickly and reliably, ensuring high-quality results every time.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">Why Choose ReverseGIF.com?</h2>
            <ul className="list-disc list-inside mb-4">
              <li className="mb-2"><strong>Ease of Use:</strong> No need for complex software or technical skills. Just upload your GIF, hit reverse, and watch the magic happen.</li>
              <li className="mb-2"><strong>Instant Results:</strong> Get your reversed GIFs in seconds, ready to share on social media, with friends, or on your website.</li>
              <li><strong>Privacy and Security:</strong> We prioritize your privacy and ensure that your uploaded files are securely processed and never shared without your consent.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">Join Our Community</h2>
            <p className="mb-4">
              We love seeing how our users utilize reversed GIFs in their projects. Follow us on social media, share your creations, and join a community of like-minded GIF enthusiasts. Let's keep the creativity flowing and have some fun along the way!
            </p>

            <p className="mb-4">Thank you for visiting ReverseGIF.com. We're excited to see what you create!</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
