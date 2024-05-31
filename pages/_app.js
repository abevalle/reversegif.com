// pages/_app.js
import { ThemeProvider } from 'next-themes';
import '../fontawesome'; // Adjust the path as needed
import '../styles/globals.css'
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <title>Reversegif.com | Reverse a Gif for FREE!</title>
        <meta name="title" content="Reverse a gif for free | reversegif.com" />
        <meta name="description" content="reversegif.com: Easily reverse GIFs in 3 steps. Drag, drop, and click to reverse. Local secure video encoding. Try it now!" />
        <meta name="keywords" content="reversegif, reverse a gif, gif, backwards gif, rewind a gif, gif reverse, gifs reversed, reversing a gif" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&family=Roboto&display=swap" rel="stylesheet" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Reversegif.com | Reverse a Gif for FREE!" />
        <meta property="og:description" content="Easily reverse GIFs in 3 steps. Drag, drop, and click to reverse. Local secure video encoding. Try it now!" />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reversegif.com | Reverse a Gif for FREE!" />
        <meta name="twitter:description" content="Easily reverse GIFs in 3 steps. Drag, drop, and click to reverse. Local secure video encoding. Try it now!" />
        <meta name="twitter:image" content="/metaimg.webp" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
