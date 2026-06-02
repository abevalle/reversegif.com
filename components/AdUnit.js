import React, { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-7359270153499473';

const AdUnit = ({
  className = "",
  style = {},
  slot = "8440382746",
  width = 728,
  height = 90,
}) => {
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
          width: `${width}px`,
          height: `${height}px`,
          ...style
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
      />
    </div>
  );
};

export default AdUnit;
