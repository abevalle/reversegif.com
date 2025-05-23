import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

const AdSense = ({ onDetected }) => {
  const adRef = useRef(null);
  
  // Effect for AdSense ads
  useEffect(() => {
    // Script loaded callback - initialize ads
    const handleScriptLoad = () => {
      try {
        if (adRef.current && window.adsbygoogle) {
          // Initialize ads when script is loaded
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    };

    // Add event listener for adsense script load
    if (window.adsbygoogle) {
      handleScriptLoad();
    } else {
      window.addEventListener('adsenseScriptLoaded', handleScriptLoad);
    }
    
    // Detect ad blockers
    const detectAdBlocker = async () => {
      try {
        // Try to create a test ad element
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        document.body.appendChild(testAd);
        
        // Wait a short time for ad blockers to hide the element
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if the ad element is hidden, which would indicate an ad blocker
        const isBlocked = testAd.offsetHeight === 0;
        document.body.removeChild(testAd);
        
        // Call the callback with detection result
        if (onDetected) {
          onDetected(isBlocked);
        }
      } catch (e) {
        // In case of error, assume ad blocker might be present
        if (onDetected) {
          onDetected(true);
        }
      }
    };
    
    detectAdBlocker();
    
    // Cleanup
    return () => {
      window.removeEventListener('adsenseScriptLoaded', handleScriptLoad);
    };
  }, [onDetected]);

  return (
    <div className="flex justify-center w-full overflow-hidden">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7359270153499473"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event('adsenseScriptLoaded'));
        }}
      />
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block", 
          width: "100%", 
          height: "90px",
          maxWidth: "728px"
        }}
        data-ad-client="ca-pub-7359270153499473"
        data-ad-slot="8440382746"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense; 