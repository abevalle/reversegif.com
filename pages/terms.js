// pages/terms.js

import React from 'react';
import Head from 'next/head';
import Header from '../components/header.js';
import Footer from '../components/footer.js';


const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Terms of Service | reversegif.com</title>
        <meta name="description" content="Terms of Service for reversegif.com" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Terms of Service | reversegif.com" />
        <meta property="og:description" content="Terms of Service for reversegif.com" />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/terms" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service | reversegif.com" />
        <meta name="twitter:description" content="Terms of Service for reversegif.com" />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Terms of Service</h1>
        <div className="w-full md:w-2/3 lg:w-1/2 bg-gray dark:bg-gray-800 p-8 rounded-lg shadow-md text-gray-900 dark:text-gray-100 mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Last Updated: December 2024</h2>
          <p className="mb-4">Welcome to reversegif.com. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please review them carefully. If you do not agree to these terms, you should not use this website.</p>
          <h3 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h3>
          <p className="mb-4">By using reversegif.com, you agree to the terms and conditions outlined in this Terms of Service Agreement ("Agreement"). This Agreement constitutes the entire agreement between you and reversegif.com regarding your use of the website.</p>
          <h3 className="text-xl font-semibold mb-2">2. Modifications to Terms of Service</h3>
          <p className="mb-4">We reserve the right to change these terms of service at any time. Any changes will be posted on this page. Your continued use of the website after such changes have been made constitutes acceptance of the new terms of service.</p>
          <h3 className="text-xl font-semibold mb-2">3. Use of the Website</h3>
          <p className="mb-4">You agree to use reversegif.com for lawful purposes only. You are prohibited from posting or transmitting through reversegif.com any material that violates or infringes the rights of others, or that is unlawful, threatening, abusive, defamatory, invasive of privacy, vulgar, obscene, profane, or otherwise objectionable.</p>
          <h3 className="text-xl font-semibold mb-2">4. Intellectual Property</h3>
          <p className="mb-4">All content on reversegif.com, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, and software, is the property of reversegif.com or its content suppliers and is protected by international copyright laws. Unauthorized use of any materials on this site is prohibited.</p>
          <h3 className="text-xl font-semibold mb-2">5. User Content and File Processing</h3>
          <p className="mb-4">By uploading or submitting any content to reversegif.com, you acknowledge and agree to the following:</p>
          <ul className="list-disc list-inside mb-4">
            <li className="mb-2"><strong>Server Processing:</strong> Files you upload (GIFs, videos, images) are temporarily transmitted to our secure servers for processing. These files are automatically deleted immediately after processing is complete.</li>
            <li className="mb-2"><strong>No File Storage:</strong> We do not store, archive, or retain your uploaded files or processed results after the processing is complete.</li>
            <li className="mb-2"><strong>Processing Logs:</strong> We maintain logs for security and service improvement that include:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Timestamp of file upload</li>
                <li>IP address of the uploader</li>
                <li>File metadata (size, format, dimensions)</li>
                <li>Type of processing requested</li>
              </ul>
              These logs do not contain the actual file content.
            </li>
            <li className="mb-2"><strong>Content Ownership:</strong> You retain all rights to the content you upload. We do not claim ownership of any files processed through our service.</li>
            <li className="mb-2"><strong>Prohibited Content:</strong> You may not upload content that is illegal, violates intellectual property rights, contains malware, or is otherwise harmful or inappropriate.</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">6. Privacy</h3>
          <p className="mb-4">Your use of reversegif.com is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices. While files are processed on our servers, they are immediately deleted after processing, and we maintain only minimal logs for security purposes.</p>
          <h3 className="text-xl font-semibold mb-2">7. Disclaimer of Warranties</h3>
          <p className="mb-4">reversegif.com is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation or availability of the site, or the information, content, materials, or products included on the site.</p>
          <h3 className="text-xl font-semibold mb-2">8. Limitation of Liability</h3>
          <p className="mb-4">In no event shall reversegif.com be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of the website or with the delay or inability to use the website, or for any information, products, and services obtained through the website. This includes any loss of data during the upload or processing of files.</p>
          <h3 className="text-xl font-semibold mb-2">9. Indemnification</h3>
          <p className="mb-4">You agree to indemnify, defend, and hold harmless reversegif.com, its officers, directors, employees, agents, licensors, and suppliers from and against all claims, liabilities, damages, losses, costs, and expenses, including attorney's fees, arising out of or related to your use of the website or any violation of this Agreement.</p>
          <h3 className="text-xl font-semibold mb-2">10. Governing Law</h3>
          <p className="mb-4">This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which reversegif.com operates, without regard to its conflict of law principles.</p>
          <h3 className="text-xl font-semibold mb-2">11. Data Retention and Deletion</h3>
          <p className="mb-4">All uploaded files are deleted immediately after processing. Processing logs are retained for a limited period for security and troubleshooting purposes, after which they are permanently deleted. We do not sell or share your data with third parties except as required by law.</p>
          <h3 className="text-xl font-semibold mb-2">12. Contact Information</h3>
          <p>If you have any questions or concerns about these Terms of Service, please contact us at <a href="mailto:hello@reversegif.com" className="text-blue-500">hello@reversegif.com</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
