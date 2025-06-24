import React, { useEffect, useState } from 'react';
import Script from 'next/script';

const AdSenseWrapper = () => {
  const [adsBlocked, setAdsBlocked] = useState(false);

  useEffect(() => {
    // Check if ads are blocked
    if (typeof window !== 'undefined') {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      window.setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setAdsBlocked(true);
        }
        testAd.remove();
      }, 100);
    }
  }, []);

  return (
    <>
      {!adsBlocked && (
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7359270153499473"
          crossOrigin="anonymous"
          onLoad={() => {
            console.log('AdSense auto ads script loaded successfully');
          }}
          onError={(e) => {
            console.log('AdSense script failed to load:', e);
            setAdsBlocked(true);
          }}
        />
      )}
    </>
  );
};

export default AdSenseWrapper;