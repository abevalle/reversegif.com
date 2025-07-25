import { ThemeProvider } from 'next-themes';
import '../styles/globals.css'
import Head from 'next/head';
import { Analytics } from "@vercel/analytics/react";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo-client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtm from '../lib/gtm';
import * as ga from '../lib/google-analytics';
import AdSenseWrapper from '../components/AdSenseWrapper';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtm.pageview(url);
      ga.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider attribute="class">
        <Analytics/>
        <Head>
          <title>Reversegif.com | Reverse a Gif for FREE!</title>
          <meta name="title" content="Reverse a gif for free | reversegif.com" />
          <meta name="description" content="Free online GIF reverser - Create backwards GIFs instantly! Now with optional watermark! No upload needed, 100% secure browser-based processing. Convert videos to reversed GIFs. No size limits. Try now!" />
          <meta name="keywords" content="reversegif, reverse a gif, gif, backwards gif, rewind a gif, gif reverse, gifs reversed, reversing a gif" />
          <meta name="robots" content="index, follow" />
          <meta name="language" content="English" />
          <link rel="icon" href="/favicon.ico" />
          {/* Open Graph Meta Tags */}
          <meta property="og:title" content="Reversegif.com | Reverse a Gif for FREE!" />
          <meta property="og:description" content="Easily reverse GIFs in 3 steps. Now with optional watermark! Drag, drop, and click to reverse. Local secure video encoding. Try it now!" />
          <meta property="og:image" content="/metaimg.webp" />
          <meta property="og:url" content="https://reversegif.com" />
          <meta property="og:type" content="website" />
          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Reversegif.com | Reverse a Gif for FREE!" />
          <meta name="twitter:description" content="Easily reverse GIFs in 3 steps. Now with optional watermark! Drag, drop, and click to reverse. Local secure video encoding. Try it now!" />
          <meta name="twitter:image" content="/metaimg.webp" />
        </Head>
        <AdSenseWrapper />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
