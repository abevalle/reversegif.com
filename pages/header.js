import React from 'react';
import ReactGA from 'react-ga4';

const gaCode = process.env.TRACKING_ID;
ReactGA.initialize("G-MHJ39LXW6P");

export default function Header() {

  const gaEvent = (cat, act) => {
    ReactGA.event({
      category: cat,
      action: act,
      nonInteraction: false
    });
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold">
          <a 
            href="/" 
            onClick={() => gaEvent('header-click', 'header-click')}
            className="text-white hover:text-blue-400"
          >
            reversegif.com
          </a>
        </h1>
        {/* <nav className="flex space-x-4">
          <a 
            href="/" 
            className="text-white hover:text-blue-400"
            onClick={() => gaEvent('nav-home-click', 'nav-home-click')}
          >
            Home
          </a>
          <a 
            href="/about" 
            className="text-white hover:text-blue-400"
            onClick={() => gaEvent('nav-about-click', 'nav-about-click')}
          >
            About
          </a>
          <a 
            href="/contact" 
            className="text-white hover:text-blue-400"
            onClick={() => gaEvent('nav-contact-click', 'nav-contact-click')}
          >
            Contact
          </a>
          <a 
            href="/privacy" 
            className="text-white hover:text-blue-400"
            onClick={() => gaEvent('nav-privacy-click', 'nav-privacy-click')}
          >
            Privacy
          </a>
        </nav> */}
      </div>
    </header>
  );
}
