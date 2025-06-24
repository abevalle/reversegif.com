import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import AdBlockNotice from './AdBlockNotice';

const AdSenseWrapper = () => {
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [adsBlocked, setAdsBlocked] = useState(false);
  const [adPushed, setAdPushed] = useState(false);

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

  useEffect(() => {
    // Push the ad after the script loads and the ad unit is in the DOM
    if (adsLoaded && !adsBlocked && !adPushed) {
      // Small delay to ensure the ad unit is rendered in the DOM
      const timer = setTimeout(() => {
        try {
          const adUnits = document.querySelectorAll('.adsbygoogle');
          console.log('Found ad units:', adUnits.length);
          
          if (adUnits.length > 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdPushed(true);
            console.log('AdSense push successful');
          } else {
            console.warn('No ad units found in DOM');
          }
        } catch (e) {
          console.error('AdSense push error:', e);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [adsLoaded, adsBlocked, adPushed]);

  return (
    <>
      {!adsBlocked && (
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7359270153499473"
          crossOrigin="anonymous"
          onLoad={() => {
            console.log('AdSense script loaded successfully');
            setAdsLoaded(true);
          }}
          onError={(e) => {
            console.log('AdSense script failed to load:', e);
            setAdsBlocked(true);
          }}
        />
      )}
      
      {adsBlocked ? (
        <AdBlockNotice />
      ) : (
        <>
          {/* Ad unit under dropzone */}
          <div className="mt-4 px-4 md:px-0 flex justify-center">
            <div style={{ minHeight: '90px', width: '100%', maxWidth: '728px' }}>
              {adsLoaded ? (
                <ins
                  className="adsbygoogle"
                  style={{ display: 'block', width: '100%', height: '90px' }}
                  data-ad-client="ca-pub-7359270153499473"
                  data-ad-slot="8440382746"
                  data-ad-format="horizontal"
                  data-full-width-responsive="false"
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '90px', 
                  backgroundColor: '#f3f4f6', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '14px'
                }}>
                  <span>Advertisement</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdSenseWrapper;