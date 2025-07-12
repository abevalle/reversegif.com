import React, { useEffect, useRef } from 'react';

const AdUnit = ({ className = "", style = {} }) => {
  const adRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeAd = () => {
      if (
        typeof window !== 'undefined' && 
        window.adsbygoogle && 
        adRef.current && 
        !hasInitialized.current
      ) {
        try {
          // Only push if the ad unit hasn't been initialized yet
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          hasInitialized.current = true;
        } catch (err) {
          console.log('AdSense initialization error:', err);
        }
      }
    };

    // Delay initialization to ensure AdSense script is loaded
    const timer = setTimeout(initializeAd, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`flex justify-center ${className}`}>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'inline-block', 
          width: '728px', 
          height: '90px',
          ...style
        }}
        data-ad-client="ca-pub-7359270153499473"
        data-ad-slot="8440382746"
      />
    </div>
  );
};

export default AdUnit;