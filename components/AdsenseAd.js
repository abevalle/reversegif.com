import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const AdsenseAd = ({ 
  adSlot, 
  adFormat = 'auto',
  style = { display: 'block' },
  fullWidthResponsive = true,
  className = ''
}) => {
  const router = useRouter();
  const adRef = useRef(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    const loadAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current && !isAdLoaded.current) {
          // Clear the ad container
          if (adRef.current) {
            adRef.current.innerHTML = '';
          }
          
          // Create new ins element
          const ins = document.createElement('ins');
          ins.className = 'adsbygoogle';
          ins.style.cssText = Object.entries(style).map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
          }).join('; ');
          
          ins.setAttribute('data-ad-client', 'ca-pub-7359270153499473');
          ins.setAttribute('data-ad-slot', adSlot);
          
          if (adFormat) {
            ins.setAttribute('data-ad-format', adFormat);
          }
          
          if (fullWidthResponsive) {
            ins.setAttribute('data-full-width-responsive', 'true');
          }
          
          // Append to container and push
          if (adRef.current) {
            adRef.current.appendChild(ins);
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isAdLoaded.current = true;
          }
        }
      } catch (error) {
        console.error('AdSense loading error:', error);
      }
    };

    // Load ad initially
    loadAd();

    // Reset flag on route change
    const handleRouteChange = () => {
      isAdLoaded.current = false;
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      isAdLoaded.current = false;
    };
  }, [router.asPath, adSlot, adFormat, style, fullWidthResponsive]);

  return <div ref={adRef} className={className} />;
};

export default AdsenseAd;