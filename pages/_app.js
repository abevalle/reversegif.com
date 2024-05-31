// pages/_app.js
import '../fontawesome'; // Adjust the path as needed
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
