import React, { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-7359270153499473';

// A single AdSense display unit.
//
// Defaults to a *responsive* unit (data-ad-format="auto"), which fills based on
// the width of its container — this is the most reliable setup and works with
// "Display ads → responsive" units created in AdSense.
//
// IMPORTANT: never render this inside a `display:none` container (e.g. Tailwind
// `hidden`/`lg:hidden`). AdSense measures the slot width at push time; a hidden
// ancestor reports width 0, which makes AdSense error with "availableWidth=0"
// and permanently kills the slot. Conditionally MOUNT the unit for the active
// breakpoint instead of CSS-hiding it.
const AdUnit = ({
  className = "",
  style = {},
  slot = "8440382746",
  format = "auto",
  responsive = true,
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
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          hasInitialized.current = true;
        } catch (err) {
          console.log('AdSense initialization error:', err);
        }
      }
    };

    // Delay slightly so the AdSense script and layout are ready.
    const timer = setTimeout(initializeAd, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex justify-center w-full ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', ...style }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdUnit;
