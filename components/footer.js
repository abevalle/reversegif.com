import React from 'react';
import ReactGA from 'react-ga4';

const gaCode = process.env.TRACKING_ID;
ReactGA.initialize("G-MHJ39LXW6P");

export default function Footer() {

  const gaEvent = (cat, act) => {
    ReactGA.event({
      category: cat,
      action: act,
      nonInteraction: false
    });
  };

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>
          reversegif.com by{' '}
          <a
            className="text-blue-400 hover:underline"
            onClick={() => gaEvent('abevalle-click', 'abevalle-click')}
            href="https://abevalle.com"
          >
            AbeValle
          </a>{' '}
          |{' '}
          <a className="text-blue-400 hover:underline" href="/privacy">
            Privacy
          </a>{' '}|{' '}
          <a className="text-blue-400 hover:underline" href="/terms">
            Terms
          </a>
        </p>
      </div>
    </footer>
  );
}
