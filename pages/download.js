import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import AdUnit from '../components/AdUnit';
import { getDownload } from '../lib/download-cache';

// AdSense ad-unit slot ids for this page.
//
// REQUIRED: create three *responsive* "Display ad" units in your AdSense
// account and paste their slot ids below. A single slot reused for all three
// placements will not reliably fill. Until you replace them, all three point at
// the site's existing display unit as a fallback.
const SIDEBAR_AD_SLOT = '8440382746'; // desktop left/right sidebars
const CENTER_AD_SLOT = '8440382746';  // desktop center, under the download
const SQUARE_AD_SLOT = '8440382746';  // mobile top/bottom

// Mirrors Tailwind's `lg` breakpoint. Returns null until mounted so we never
// render ad units during SSR or before we know the viewport — and crucially so
// we never render them inside a hidden container (which breaks AdSense).
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(null);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isDesktop;
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const Preview = ({ url, mimeType, frameCount }) => {
  if (mimeType && mimeType.startsWith('image/')) {
    return (
      <img
        src={url}
        alt="Your processed file"
        className="max-h-80 w-auto mx-auto rounded-lg shadow"
      />
    );
  }
  if (mimeType && mimeType.startsWith('video/')) {
    return (
      <video
        src={url}
        className="max-h-80 w-auto mx-auto rounded-lg shadow"
        controls
        autoPlay
        loop
        muted
      />
    );
  }
  // ZIP / other binary: show an icon and the frame count when available.
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
      <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
      {frameCount > 0 && (
        <p className="text-sm md:text-base">{frameCount} frames ready to download</p>
      )}
    </div>
  );
};

export default function DownloadPage() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [status, setStatus] = useState('loading'); // loading | ready | missing
  const [record, setRecord] = useState(null);
  const [objectUrl, setObjectUrl] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    let createdUrl = '';
    let cancelled = false;

    const { id } = router.query;

    (async () => {
      try {
        const found = await getDownload(id);
        if (cancelled) return;
        if (!found || !found.blob) {
          setStatus('missing');
          return;
        }
        createdUrl = URL.createObjectURL(found.blob);
        setRecord(found);
        setObjectUrl(createdUrl);
        setStatus('ready');
      } catch (err) {
        console.error('Failed to load cached download:', err);
        if (!cancelled) setStatus('missing');
      }
    })();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Your Download is Ready | ReverseGIF.com</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        {/* Mobile top square ad — only mounted on mobile so it's never hidden */}
        {isDesktop === false && (
          <div className="mb-4 mx-auto max-w-[336px]">
            <AdUnit slot={SQUARE_AD_SLOT} />
          </div>
        )}

        <div className="lg:grid lg:grid-cols-[160px_minmax(0,1fr)_160px] lg:gap-6 lg:items-start">
          {/* Desktop left sidebar ad */}
          {isDesktop === true && (
            <aside className="flex justify-center lg:sticky lg:top-4">
              <AdUnit slot={SIDEBAR_AD_SLOT} style={{ minHeight: '600px' }} />
            </aside>
          )}

          {/* Center content */}
          <div className="max-w-2xl mx-auto w-full">
            {status === 'loading' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Preparing your download...</span>
              </div>
            )}

            {status === 'missing' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 text-center">
                <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Download not found
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  This download has expired or isn&apos;t available in this browser. Processed files are
                  cached locally and are never uploaded, so they can&apos;t be recovered here — just run the
                  tool again to create a new one.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Back to the tools
                </Link>
              </div>
            )}

            {status === 'ready' && record && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Your download is ready!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Processed right in your browser — 100% private.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <Preview url={objectUrl} mimeType={record.mimeType} frameCount={record.frameCount} />
                </div>

                <div className="text-center mb-6">
                  <p className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 truncate">{record.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatSize(record.size)}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href={objectUrl}
                    download={record.name}
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.dataLayer) {
                        window.dataLayer.push({ event: 'download-file', fileName: record.name });
                      }
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Make another
                  </Link>
                </div>
              </div>
            )}

            {/* Desktop center ad */}
            {isDesktop === true && (
              <AdUnit className="mt-6" slot={CENTER_AD_SLOT} />
            )}
          </div>

          {/* Desktop right sidebar ad */}
          {isDesktop === true && (
            <aside className="flex justify-center lg:sticky lg:top-4">
              <AdUnit slot={SIDEBAR_AD_SLOT} style={{ minHeight: '600px' }} />
            </aside>
          )}
        </div>

        {/* Mobile bottom square ad — only mounted on mobile */}
        {isDesktop === false && (
          <div className="mt-4 mx-auto max-w-[336px]">
            <AdUnit slot={SQUARE_AD_SLOT} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
