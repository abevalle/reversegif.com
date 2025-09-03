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
          <title>Reverse GIF - Free Online GIF Reverser Tool | ReverseGIF.com</title>
          <meta name="title" content="Reverse GIF - Free Online GIF Reverser Tool | ReverseGIF.com" />
          <meta name="description" content="Reverse animated GIF files instantly online for free. No upload needed - secure browser-based GIF reverser. Reverse GIFs, create backwards animations, convert videos to reversed GIFs. Works with any GIF size!" />
          <meta name="keywords" content="reverse gif, reverse animated gif, gif reverser, reverse gif online, backwards gif, reverse gif maker, reverse gif tool, gif reverse animation, flip gif backwards, reverse gif free" />
          <meta name="robots" content="index, follow" />
          <meta name="language" content="English" />
          <link rel="icon" href="/favicon.ico" />
          {/* Open Graph Meta Tags */}
          <meta property="og:title" content="Reverse GIF Online - Free GIF Reverser Tool" />
          <meta property="og:description" content="Reverse animated GIFs instantly! Free online tool to create backwards GIF animations. No upload required - 100% secure browser-based processing. Works with any GIF size!" />
          <meta property="og:image" content="/metaimg.webp" />
          <meta property="og:url" content="https://reversegif.com" />
          <meta property="og:type" content="website" />
          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Reverse GIF Online - Free GIF Reverser Tool" />
          <meta name="twitter:description" content="Reverse animated GIFs instantly! Free online tool to create backwards GIF animations. No upload required - 100% secure browser-based processing." />
          <meta name="twitter:image" content="/metaimg.webp" />
          {/* Additional SEO Meta Tags */}
          <link rel="canonical" href="https://reversegif.com" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="author" content="ReverseGIF.com" />
        </Head>
        <AdSenseWrapper />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
