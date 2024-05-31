// pages/_app.js
import { ThemeProvider } from 'next-themes';
import '../fontawesome'; // Adjust the path as needed
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
