import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import AdBlockNotice from './AdBlockNotice';

const AdSenseWrapper = () => {
  const [adsLoaded, setAdsLoaded] = useState(false);
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
          onLoad={() => setAdsLoaded(true)}
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
          
          {adsLoaded && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                  } catch (e) {
                    console.error('AdSense push error:', e);
                  }
                `,
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default AdSenseWrapper;