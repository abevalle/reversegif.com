import React, { useEffect, useState } from 'react';
import Script from 'next/script';

const AdSenseWrapper = () => {
  const [adsBlocked, setAdsBlocked] = useState(false);

  useEffect(() => {
    // Initialize AdSense
    if (typeof window !== 'undefined' && !adsBlocked) {
      try {
        // Push AdSense initialization
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.log('AdSense initialization error:', err);
      }
    }
  }, [adsBlocked]);

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